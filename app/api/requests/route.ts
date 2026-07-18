import { NextResponse } from "next/server";
import { sourcingRequestSchema } from "@/lib/validation";
import { createSourcingRequest } from "@/lib/notion";
import { isRateLimited, isDuplicateSubmission, clientIp } from "@/lib/rate-limit";

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
      return NextResponse.json(
        { ok: false, error: "بيانات الطلب غير صحيحة." },
        { status: 400 }
      );
    }

    const parsed = sourcingRequestSchema.safeParse(body);
    if (!parsed.success) {
      const firstError =
        parsed.error.errors[0]?.message || "الرجاء التأكد من تعبئة الحقول المطلوبة.";
      return NextResponse.json({ ok: false, error: firstError }, { status: 400 });
    }

    if (isDuplicateSubmission(parsed.data.submissionToken)) {
      return NextResponse.json(
        { ok: false, error: "تم استلام هذا الطلب مسبقاً — لا حاجة لإعادة الإرسال." },
        { status: 409 }
      );
    }

    const { requestId } = await createSourcingRequest(parsed.data);
    return NextResponse.json({ ok: true, requestId });
  } catch (err) {
    // نسجل التفاصيل التقنية في السيرفر فقط ولا نُظهرها للعميل
    console.error("Create request failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "حدث خطأ أثناء حفظ طلبك. الرجاء المحاولة مرة أخرى أو التواصل معنا عبر واتساب.",
      },
      { status: 500 }
    );
  }
}
