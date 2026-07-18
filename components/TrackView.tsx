"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { whatsappLink } from "@/lib/whatsapp-client";

interface TimelineStep {
  label: string;
  state: "done" | "current" | "upcoming";
}

interface Quote {
  quoteId: string;
  offerNumber: string;
  product: string;
  unitPrice: number | null;
  currency: string;
  moq: number | null;
  quantity: number | null;
  estimatedTotal: number | null;
  productionLeadTime: string;
  incoterm: string;
  customerNotes: string;
  customerDecision: string;
  isSelected: boolean;
}

interface RequestData {
  requestId: string;
  productName: string;
  statusLabel: string;
  createdDate: string | null;
  lastUpdated: string | null;
  customerVisibleUpdate: string;
  nextExpectedStep: string | null;
  timeline: TimelineStep[];
  isPausedOrCancelled: boolean;
  quotes: Quote[];
}

const QUOTE_ACTIONS: { action: string; label: string; primary?: boolean }[] = [
  { action: "interested", label: "مهتم بهذا العرض" },
  { action: "needs_change", label: "أحتاج تعديل" },
  { action: "negotiate", label: "أرغب بالتفاوض" },
  { action: "select", label: "اختيار هذا العرض", primary: true },
];

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

function fmtMoney(v: number | null, currency: string): string {
  if (v === null) return "—";
  return `${v.toLocaleString("ar-SA")} ${currency}`;
}

export default function TrackView() {
  const params = useSearchParams();
  const [requestId, setRequestId] = useState(params.get("rid") ?? "");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<RequestData | null>(null);
  const [actionBusy, setActionBusy] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    setActionMsg("");
    if (!requestId.trim()) {
      setError("الرجاء إدخال رقم الطلب.");
      return;
    }
    if (!mobile.trim() && !email.trim()) {
      setError("الرجاء إدخال رقم الجوال أو البريد الإلكتروني للتحقق.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: requestId.trim(), mobile, email }),
      });
      const json = await res.json();
      if (json.ok) setData(json.request);
      else setError(json.error || "حدث خطأ.");
    } catch {
      setError("تعذر الاتصال بالخادم. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  async function sendFeedback(quoteId: string, action: string) {
    if (action === "select" && !window.confirm("هل أنت متأكد من اختيار هذا العرض؟")) return;
    setActionBusy(`${quoteId}:${action}`);
    setActionMsg("");
    try {
      const res = await fetch("/api/quotes/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: requestId.trim(), mobile, email, quoteId, action }),
      });
      const json = await res.json();
      if (json.ok) {
        setData(json.request);
        setActionMsg("تم تسجيل ردك بنجاح، وسيتابع معك فريقنا.");
      } else {
        setActionMsg(json.error || "حدث خطأ أثناء تسجيل ردك.");
      }
    } catch {
      setActionMsg("تعذر الاتصال بالخادم. حاول مرة أخرى.");
    } finally {
      setActionBusy("");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-center text-3xl font-black">تتبع حالة الطلب</h1>
      <p className="mt-2 text-center text-charcoal/70">
        أدخل رقم طلبك مع رقم الجوال أو البريد الإلكتروني المسجل في الطلب.
      </p>

      <form onSubmit={lookup} className="card mt-8 space-y-5">
        <div>
          <label className="field-label">
            رقم الطلب <span className="text-china-red">*</span>
          </label>
          <input
            className="field-input font-mono"
            dir="ltr"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
            placeholder="KC-RFQ-2026-00001"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label">رقم الجوال</label>
            <input className="field-input" dir="ltr" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="05XXXXXXXX" inputMode="tel" />
          </div>
          <div>
            <label className="field-label">أو البريد الإلكتروني</label>
            <input className="field-input" dir="ltr" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
        </div>
        {error && (
          <p className="rounded-lg bg-china-red/10 px-4 py-3 text-sm font-bold text-china-red">{error}</p>
        )}
        <button type="submit" disabled={loading} className="btn-primary w-full !py-3 !text-base">
          {loading ? "جاري البحث..." : "عرض حالة الطلب"}
        </button>
      </form>

      {data && (
        <div className="mt-10 space-y-6">
          {/* بطاقة الحالة */}
          <div className="card border-t-4 border-t-china-red">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-sm font-bold text-gold">{data.requestId}</p>
                <h2 className="mt-1 text-xl font-black">{data.productName || "طلب توريد"}</h2>
              </div>
              <span className="rounded-full bg-china-red px-4 py-1.5 text-sm font-bold text-white">
                {data.statusLabel}
              </span>
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <p><span className="font-bold">تاريخ الطلب:</span> {fmtDate(data.createdDate)}</p>
              <p><span className="font-bold">آخر تحديث:</span> {fmtDate(data.lastUpdated)}</p>
            </div>
            {data.customerVisibleUpdate && (
              <div className="mt-4 rounded-lg bg-ivory p-4 text-sm leading-relaxed">
                <p className="font-bold text-gold">آخر تحديث من الفريق:</p>
                <p className="mt-1">{data.customerVisibleUpdate}</p>
              </div>
            )}
            {data.nextExpectedStep && (
              <p className="mt-4 text-sm">
                <span className="font-bold">الخطوة القادمة المتوقعة:</span> {data.nextExpectedStep}
              </p>
            )}
          </div>

          {/* الخط الزمني */}
          {data.timeline.length > 0 && (
            <div className="card">
              <h3 className="mb-5 text-lg font-black">مراحل طلبك</h3>
              <ol className="relative space-y-4">
                {data.timeline.map((s) => (
                  <li key={s.label} className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        s.state === "done"
                          ? "bg-green-600 text-white"
                          : s.state === "current"
                            ? "bg-china-red text-white ring-4 ring-china-red/20"
                            : "border-2 border-charcoal/30 bg-white text-charcoal/40"
                      }`}
                    >
                      {s.state === "done" ? "✓" : s.state === "current" ? "●" : "○"}
                    </span>
                    <span
                      className={
                        s.state === "done"
                          ? "font-semibold text-charcoal/70"
                          : s.state === "current"
                            ? "font-black text-china-red"
                            : "text-charcoal/50"
                      }
                    >
                      {s.label}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {data.isPausedOrCancelled && (
            <div className="card border-t-4 border-t-gold text-sm leading-relaxed">
              هذا الطلب {data.statusLabel === "ملغي" ? "ملغي" : "متوقف مؤقتاً"}. للاستفسار
              تواصل معنا عبر واتساب وسنوافيك بالتفاصيل.
            </div>
          )}

          {/* العروض المعتمدة */}
          {data.quotes.length > 0 && (
            <div>
              <h3 className="mb-4 text-xl font-black">
                عروض الأسعار <span className="text-gold">({data.quotes.length})</span>
              </h3>
              {actionMsg && (
                <p className="mb-4 rounded-lg bg-gold/10 px-4 py-3 text-sm font-bold text-gold">
                  {actionMsg}
                </p>
              )}
              <div className="space-y-5">
                {data.quotes.map((q, i) => (
                  <div
                    key={q.quoteId}
                    className={`card ${q.isSelected ? "border-2 border-green-600" : ""}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-black">
                        {q.offerNumber || `عرض ${i + 1}`}
                        {q.isSelected && (
                          <span className="mr-2 rounded-full bg-green-600 px-3 py-0.5 text-xs font-bold text-white">
                            العرض المختار ✓
                          </span>
                        )}
                      </p>
                      {q.customerDecision && (
                        <span className="rounded-full bg-ivory px-3 py-1 text-xs font-bold text-charcoal/70">
                          حالتك: {q.customerDecision}
                        </span>
                      )}
                    </div>
                    {q.product && <p className="mt-2 text-sm text-charcoal/80">{q.product}</p>}
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="font-bold text-charcoal/60">سعر الوحدة</dt>
                        <dd className="font-black text-china-red">{fmtMoney(q.unitPrice, q.currency)}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-charcoal/60">الحد الأدنى للكمية</dt>
                        <dd>{q.moq?.toLocaleString("ar-SA") ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-charcoal/60">الكمية</dt>
                        <dd>{q.quantity?.toLocaleString("ar-SA") ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-charcoal/60">الإجمالي التقديري</dt>
                        <dd className="font-black">{fmtMoney(q.estimatedTotal, q.currency)}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-charcoal/60">مدة الإنتاج</dt>
                        <dd>{q.productionLeadTime || "—"}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-charcoal/60">شروط الشحن</dt>
                        <dd>{q.incoterm || "—"}</dd>
                      </div>
                    </dl>
                    {q.customerNotes && (
                      <p className="mt-4 rounded-lg bg-ivory p-3 text-sm leading-relaxed">
                        {q.customerNotes}
                      </p>
                    )}
                    {!q.isSelected && (
                      <div className="mt-5 flex flex-wrap gap-2 border-t border-charcoal/10 pt-4">
                        {QUOTE_ACTIONS.map((a) => (
                          <button
                            key={a.action}
                            type="button"
                            disabled={!!actionBusy}
                            onClick={() => sendFeedback(q.quoteId, a.action)}
                            className={
                              a.primary
                                ? "btn-primary !px-5 !py-2 !text-sm"
                                : "btn-outline-sm"
                            }
                          >
                            {actionBusy === `${q.quoteId}:${a.action}` ? "..." : a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <a
              href={whatsappLink(`مرحباً فريق كواليس الصين، أود الاستفسار عن طلبي رقم ${data.requestId}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              تواصل معنا عبر واتساب
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
