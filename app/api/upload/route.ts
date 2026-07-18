import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isRateLimited, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB لكل صورة
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: Request) {
  try {
    if (isRateLimited(clientIp(req))) {
      return NextResponse.json(
        { ok: false, error: "عدد المحاولات كبير، الرجاء المحاولة بعد قليل." },
        { status: 429 }
      );
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // رفع الصور اختياري في الـ MVP — الفورم يعمل بدونها
      return NextResponse.json(
        { ok: false, error: "رفع الصور غير مفعّل حالياً. يمكنك إرسال الطلب بدون صور." },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "لم يتم إرفاق ملف." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: "نقبل صوراً فقط (JPG, PNG, WEBP, GIF)." },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { ok: false, error: "حجم الصورة يتجاوز 5MB." },
        { status: 400 }
      );
    }

    const blob = await put(`sourcing-requests/${Date.now()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      { ok: false, error: "تعذر رفع الصورة. يمكنك المتابعة بدونها." },
      { status: 500 }
    );
  }
}
