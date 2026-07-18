import { NextResponse } from "next/server";
import { quoteFeedbackSchema } from "@/lib/validation";
import { findVerifiedRequest, applyQuoteFeedback, getApprovedQuotes } from "@/lib/notion";
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

    const parsed = quoteFeedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "بيانات غير صحيحة." }, { status: 400 });
    }

    const { requestId, mobile, email, quoteId, action } = parsed.data;

    // نفس تحقق صفحة التتبع: رقم الطلب + جوال أو بريد
    const page = await findVerifiedRequest(requestId, mobile || undefined, email || undefined);
    if (!page) {
      return NextResponse.json(
        { ok: false, error: "لم نتمكن من التحقق من الطلب." },
        { status: 404 }
      );
    }

    const updated = await applyQuoteFeedback({
      requestPage: page,
      requestId: requestId.toUpperCase(),
      quoteId,
      action,
    });
    if (!updated) {
      return NextResponse.json(
        { ok: false, error: "العرض غير متاح." },
        { status: 404 }
      );
    }

    // نعيد الحالة المحدثة مباشرة لتحديث الواجهة
    const quotes = await getApprovedQuotes(page.id);
    const refreshed = await findVerifiedRequest(requestId, mobile || undefined, email || undefined);
    return NextResponse.json({
      ok: true,
      request: toCustomerRequestDTO(refreshed ?? page, quotes),
    });
  } catch (err) {
    console.error("Quote feedback failed:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء تسجيل ردك. حاول مرة أخرى." },
      { status: 500 }
    );
  }
}
