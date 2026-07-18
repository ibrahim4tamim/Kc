import { NextResponse } from "next/server";
import { trackRequestSchema } from "@/lib/validation";
import { findVerifiedRequest, getApprovedQuotes } from "@/lib/notion";
import { toCustomerRequestDTO } from "@/lib/dto";
import { isRateLimited, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (isRateLimited(clientIp(req))) {
      return NextResponse.json(
        { ok: false, error: "عدد المحاولات كبير، الرجاء المحاولة بعد قليل." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "بيانات غير صحيحة." }, { status: 400 });
    }

    const parsed = trackRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "الرجاء إدخال رقم طلب صحيح بصيغة KC-RFQ-2026-00000." },
        { status: 400 }
      );
    }

    const { requestId, mobile, email } = parsed.data;
    if (!mobile && !email) {
      return NextResponse.json(
        { ok: false, error: "الرجاء إدخال رقم الجوال أو البريد الإلكتروني للتحقق." },
        { status: 400 }
      );
    }

    const page = await findVerifiedRequest(requestId, mobile || undefined, email || undefined);
    if (!page) {
      // رسالة واحدة سواء كان الرقم خاطئاً أو التحقق فاشلاً — لا نكشف أيهما
      return NextResponse.json(
        {
          ok: false,
          error: "لم نجد طلباً مطابقاً. تأكد من رقم الطلب وبيانات التحقق.",
        },
        { status: 404 }
      );
    }

    const quotes = await getApprovedQuotes(page.id);
    return NextResponse.json({ ok: true, request: toCustomerRequestDTO(page, quotes) });
  } catch (err) {
    console.error("Track request failed:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء جلب حالة الطلب. حاول مرة أخرى." },
      { status: 500 }
    );
  }
}
