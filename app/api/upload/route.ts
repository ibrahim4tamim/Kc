import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import { isRateLimited, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB لكل صورة
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function randomKey(ext: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${Date.now()}-${rand}.${ext}`;
}

export async function POST(req: Request) {
  try {
    if (isRateLimited(clientIp(req))) {
      return NextResponse.json(
        { ok: false, error: "عدد المحاولات كبير، الرجاء المحاولة بعد قليل." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "لم يتم إرفاق ملف." }, { status: 400 });
    }
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
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

    // Netlify Blobs — يعمل تلقائياً على Netlify بدون أي مفاتيح.
    // محلياً (خارج Netlify) يفشل getStore فنعيد رسالة ودية والفورم يكمل بدون صور.
    let store;
    try {
      store = getStore({ name: "product-images", consistency: "strong" });
    } catch {
      return NextResponse.json(
        { ok: false, error: "رفع الصور غير مفعّل في بيئة التطوير. يمكنك إرسال الطلب بدون صور." },
        { status: 503 }
      );
    }

    const key = randomKey(ext);
    await store.set(key, await file.arrayBuffer(), {
      metadata: { contentType: file.type, originalName: file.name },
    });

    // الرابط العام يمر عبر مسار العرض /api/images/<key>
    const origin =
      process.env.URL ||
      `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host")}`;

    return NextResponse.json({ ok: true, url: `${origin}/api/images/${key}` });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      { ok: false, error: "تعذر رفع الصورة. يمكنك المتابعة بدونها." },
      { status: 500 }
    );
  }
}
