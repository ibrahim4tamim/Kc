// حماية بسيطة داخل الذاكرة تكفي للـ MVP على Vercel (لكل نسخة serverless).
// للتوسع لاحقاً: Upstash Redis أو Vercel KV.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const seenTokens = new Map<string, number>();

const WINDOW_MS = 10 * 60 * 1000; // 10 دقائق
const MAX_PER_WINDOW = 5;

function sweep() {
  const now = Date.now();
  buckets.forEach((b, k) => {
    if (b.resetAt < now) buckets.delete(k);
  });
  seenTokens.forEach((exp, k) => {
    if (exp < now) seenTokens.delete(k);
  });
}

/** يرجع true إذا تجاوز العنوان الحد المسموح */
export function isRateLimited(ip: string): boolean {
  sweep();
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > MAX_PER_WINDOW;
}

/** يرجع true إذا سبق استخدام توكن الإرسال (طلب مكرر) */
export function isDuplicateSubmission(token: string): boolean {
  sweep();
  if (seenTokens.has(token)) return true;
  seenTokens.set(token, Date.now() + WINDOW_MS);
  return false;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}
