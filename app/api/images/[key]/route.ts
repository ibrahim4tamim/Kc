import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

export const runtime = "nodejs";

// يعرض صور المنتجات المخزنة في Netlify Blobs — للقراءة فقط.
// المفاتيح عشوائية وغير قابلة للتخمين، ولا يوجد مسار لاستعراض القائمة.
export async function GET(
  _req: Request,
  { params }: { params: { key: string } }
) {
  const key = params.key;
  // نمنع أي محاولة تلاعب بالمسار
  if (!/^[\w.-]{10,80}$/.test(key)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const store = getStore({ name: "product-images", consistency: "strong" });
    const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
    if (!result) {
      return NextResponse.json({ ok: false }, { status: 404 });
    }
    const contentType =
      (result.metadata?.contentType as string) || "application/octet-stream";
    return new NextResponse(result.data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Image fetch failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
