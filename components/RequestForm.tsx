"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { whatsappLink } from "@/lib/whatsapp-client";

const CATEGORIES = [
  "الأثاث",
  "المنزل الذكي",
  "الإلكترونيات",
  "مواد البناء",
  "الملابس والمنسوجات",
  "التغليف",
  "المعدات",
  "منتجات مخصصة",
  "أخرى",
];
const UNITS = ["قطعة", "كرتون", "طن", "متر", "حاوية", "أخرى"];
const CURRENCIES = ["SAR", "USD", "CNY"];
const YES_NO_UNSURE = ["نعم", "لا", "غير متأكد"];
const CONTACT_METHODS = ["واتساب", "اتصال", "بريد إلكتروني"];
const SHIPPING = ["بحري", "جوي", "بري", "غير متأكد"];

const STEP_TITLES = [
  "معلومات التواصل",
  "تفاصيل المنتج",
  "الكمية والميزانية",
  "التخصيص والتصنيع",
  "الشحن",
  "معلومات إضافية",
];

interface FormState {
  fullName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  company: string;
  preferredContact: string;
  productName: string;
  productCategory: string;
  productDescription: string;
  productReferenceUrl: string;
  quantity: string;
  unit: string;
  targetBudget: string;
  targetPricePerUnit: string;
  currency: string;
  customizationRequired: string;
  privateLabelRequired: string;
  packagingCustomization: string;
  customizationDetails: string;
  destinationCountry: string;
  destinationCity: string;
  shippingPreference: string;
  requiredDeliveryDate: string;
  additionalNotes: string;
}

const INITIAL: FormState = {
  fullName: "",
  mobile: "",
  whatsapp: "",
  email: "",
  company: "",
  preferredContact: "واتساب",
  productName: "",
  productCategory: "أخرى",
  productDescription: "",
  productReferenceUrl: "",
  quantity: "",
  unit: "قطعة",
  targetBudget: "",
  targetPricePerUnit: "",
  currency: "SAR",
  customizationRequired: "غير متأكد",
  privateLabelRequired: "غير متأكد",
  packagingCustomization: "غير متأكد",
  customizationDetails: "",
  destinationCountry: "المملكة العربية السعودية",
  destinationCity: "",
  shippingPreference: "غير متأكد",
  requiredDeliveryDate: "",
  additionalNotes: "",
};

function makeToken() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export default function RequestForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState("");
  const submissionToken = useMemo(makeToken, []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  function validateStep(s: number): string {
    if (s === 0) {
      if (form.fullName.trim().length < 2) return "الرجاء إدخال الاسم الكامل.";
      if (!/^\+?[0-9\s\-()]{8,17}$/.test(form.mobile.trim()))
        return "الرجاء إدخال رقم جوال صحيح.";
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim()))
        return "البريد الإلكتروني غير صحيح.";
    }
    if (s === 1) {
      if (form.productName.trim().length < 2) return "الرجاء إدخال اسم المنتج.";
      if (form.productDescription.trim().length < 10)
        return "الرجاء وصف المنتج بشكل كافٍ (10 أحرف على الأقل).";
      if (form.productReferenceUrl && !/^https?:\/\/\S+$/.test(form.productReferenceUrl.trim()))
        return "رابط المنتج المشابه غير صحيح — يجب أن يبدأ بـ http.";
    }
    if (s === 2) {
      const q = Number(form.quantity);
      if (!q || q <= 0) return "الرجاء إدخال الكمية المطلوبة.";
    }
    return "";
  }

  function next() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadError("");
    setUploading(true);
    for (const file of files.slice(0, 6 - images.length)) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.ok) {
          setImages((prev) => [...prev, { url: data.url, name: file.name }]);
        } else {
          setUploadError(data.error || "تعذر رفع الصورة.");
        }
      } catch {
        setUploadError("تعذر رفع الصورة. يمكنك المتابعة بدونها.");
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function submit() {
    for (let s = 0; s < STEP_TITLES.length; s++) {
      const err = validateStep(s);
      if (err) {
        setError(err);
        setStep(s);
        return;
      }
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: form.quantity,
          productImages: images.map((i) => i.url),
          submissionToken,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setRequestId(data.requestId);
        window.scrollTo({ top: 0 });
      } else {
        setError(data.error || "حدث خطأ. حاول مرة أخرى.");
      }
    } catch {
      setError("تعذر الاتصال بالخادم. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- شاشة النجاح ----------
  if (requestId) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div className="card border-t-4 border-t-china-red py-12">
          <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✓
          </span>
          <h1 className="text-2xl font-black">تم استلام طلبك بنجاح</h1>
          <p className="mt-6 text-sm font-semibold text-charcoal/60">رقم طلبك</p>
          <p className="mt-2 select-all rounded-lg bg-ivory px-4 py-3 font-mono text-2xl font-black tracking-wider text-china-red">
            {requestId}
          </p>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-charcoal/80">
            سيقوم فريق كواليس الصين بمراجعة طلبك والتواصل معك بعد دراسة التفاصيل.
          </p>
          <p className="mt-2 text-xs text-charcoal/50">
            احتفظ برقم الطلب — ستحتاجه لتتبع حالة طلبك.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={`/track?rid=${requestId}`} className="btn-primary">
              تتبع حالة الطلب
            </Link>
            <a
              href={whatsappLink(`مرحباً فريق كواليس الصين، أود الاستفسار عن طلبي رقم ${requestId}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              تواصل معنا عبر واتساب
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ---------- الفورم ----------
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-center text-3xl font-black">طلب توريد جديد</h1>
      <p className="mt-2 text-center text-charcoal/70">
        عبّئ التفاصيل التالية وسيتواصل معك فريقنا بعد دراسة الطلب.
      </p>

      {/* مؤشر التقدم */}
      <div className="mt-8">
        <div className="flex items-center justify-between text-xs font-bold">
          {STEP_TITLES.map((t, i) => (
            <div
              key={t}
              className={`flex flex-1 flex-col items-center gap-1 ${
                i === step ? "text-china-red" : i < step ? "text-gold" : "text-charcoal/40"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs ${
                  i === step
                    ? "border-china-red bg-china-red text-white"
                    : i < step
                      ? "border-gold bg-gold text-white"
                      : "border-charcoal/30 bg-white"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span className="hidden text-center sm:block">{t}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-charcoal/10">
          <div
            className="h-full rounded-full bg-china-red transition-all"
            style={{ width: `${((step + 1) / STEP_TITLES.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-center text-sm font-bold text-charcoal/70 sm:hidden">
          {STEP_TITLES[step]}
        </p>
      </div>

      <div className="card mt-6 space-y-5">
        {/* الخطوة 1 — معلومات التواصل */}
        {step === 0 && (
          <>
            <div>
              <label className="field-label">
                الاسم الكامل <span className="text-china-red">*</span>
              </label>
              <input className="field-input" value={form.fullName} onChange={set("fullName")} placeholder="مثال: إبراهيم التميمي" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">
                  رقم الجوال <span className="text-china-red">*</span>
                </label>
                <input className="field-input" dir="ltr" value={form.mobile} onChange={set("mobile")} placeholder="05XXXXXXXX" inputMode="tel" />
              </div>
              <div>
                <label className="field-label">رقم الواتساب</label>
                <input className="field-input" dir="ltr" value={form.whatsapp} onChange={set("whatsapp")} placeholder="اتركه فارغاً إن كان نفس الجوال" inputMode="tel" />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">البريد الإلكتروني</label>
                <input className="field-input" dir="ltr" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
              </div>
              <div>
                <label className="field-label">اسم الشركة</label>
                <input className="field-input" value={form.company} onChange={set("company")} placeholder="اختياري" />
              </div>
            </div>
            <div>
              <label className="field-label">طريقة التواصل المفضلة</label>
              <div className="flex flex-wrap gap-3">
                {CONTACT_METHODS.map((m) => (
                  <label key={m} className={`cursor-pointer rounded-lg border px-5 py-2.5 text-sm font-semibold transition ${form.preferredContact === m ? "border-china-red bg-china-red text-white" : "border-charcoal/20 bg-white hover:border-gold"}`}>
                    <input type="radio" name="preferredContact" value={m} checked={form.preferredContact === m} onChange={set("preferredContact")} className="sr-only" />
                    {m}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* الخطوة 2 — تفاصيل المنتج */}
        {step === 1 && (
          <>
            <div>
              <label className="field-label">
                اسم المنتج <span className="text-china-red">*</span>
              </label>
              <input className="field-input" value={form.productName} onChange={set("productName")} placeholder="مثال: كرسي مكتب طبي" />
            </div>
            <div>
              <label className="field-label">فئة المنتج</label>
              <select className="field-input" value={form.productCategory} onChange={set("productCategory")}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">
                اشرح لنا المنتج الذي تبحث عنه <span className="text-china-red">*</span>
              </label>
              <textarea className="field-input min-h-32" value={form.productDescription} onChange={set("productDescription")} placeholder="المواصفات، الأبعاد، الخامات، الألوان، الاستخدام..." />
            </div>
            <div>
              <label className="field-label">أرفق صور المنتج</label>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFiles} disabled={uploading || images.length >= 6} className="field-input cursor-pointer file:ml-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-gold file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-white" />
              <p className="field-hint">حتى 6 صور، بحد أقصى 5MB للصورة. الصور اختيارية.</p>
              {uploading && <p className="mt-2 text-sm font-semibold text-gold">جاري رفع الصور...</p>}
              {uploadError && <p className="mt-2 text-sm font-semibold text-china-red">{uploadError}</p>}
              {images.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {images.map((img, i) => (
                    <li key={img.url} className="flex items-center justify-between rounded-md bg-ivory px-3 py-2 text-sm">
                      <span className="truncate">📷 {img.name}</span>
                      <button type="button" onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))} className="mr-2 font-bold text-china-red hover:underline">
                        إزالة
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="field-label">رابط لمنتج مشابه</label>
              <input className="field-input" dir="ltr" value={form.productReferenceUrl} onChange={set("productReferenceUrl")} placeholder="https:// من Alibaba أو 1688 أو Amazon أو Taobao..." />
              <p className="field-hint">يمكنك لصق رابط من Alibaba أو 1688 أو Amazon أو Taobao أو JD أو أي موقع آخر.</p>
            </div>
          </>
        )}

        {/* الخطوة 3 — الكمية والميزانية */}
        {step === 2 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">
                  الكمية المطلوبة <span className="text-china-red">*</span>
                </label>
                <input className="field-input" dir="ltr" type="number" min="1" value={form.quantity} onChange={set("quantity")} placeholder="1000" />
              </div>
              <div>
                <label className="field-label">الوحدة</label>
                <select className="field-input" value={form.unit} onChange={set("unit")}>
                  {UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="field-label">الميزانية التقريبية</label>
                <input className="field-input" dir="ltr" type="number" min="0" value={form.targetBudget} onChange={set("targetBudget")} placeholder="اختياري" />
              </div>
              <div>
                <label className="field-label">السعر المستهدف للوحدة</label>
                <input className="field-input" dir="ltr" type="number" min="0" step="0.01" value={form.targetPricePerUnit} onChange={set("targetPricePerUnit")} placeholder="اختياري" />
              </div>
              <div>
                <label className="field-label">العملة</label>
                <select className="field-input" value={form.currency} onChange={set("currency")}>
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {/* الخطوة 4 — التخصيص والتصنيع */}
        {step === 3 && (
          <>
            {(
              [
                ["customizationRequired", "هل تحتاج تخصيص المنتج؟"],
                ["privateLabelRequired", "هل تريد وضع علامتك التجارية؟"],
                ["packagingCustomization", "هل تحتاج تغليف مخصص؟"],
              ] as [keyof FormState, string][]
            ).map(([key, label]) => (
              <div key={key}>
                <label className="field-label">{label}</label>
                <div className="flex flex-wrap gap-3">
                  {YES_NO_UNSURE.map((v) => (
                    <label key={v} className={`cursor-pointer rounded-lg border px-5 py-2.5 text-sm font-semibold transition ${form[key] === v ? "border-china-red bg-china-red text-white" : "border-charcoal/20 bg-white hover:border-gold"}`}>
                      <input type="radio" name={key} value={v} checked={form[key] === v} onChange={set(key)} className="sr-only" />
                      {v}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <label className="field-label">تفاصيل التخصيص</label>
              <textarea className="field-input min-h-24" value={form.customizationDetails} onChange={set("customizationDetails")} placeholder="الشعار، الألوان، التغليف المطلوب... (اختياري)" />
            </div>
          </>
        )}

        {/* الخطوة 5 — الشحن */}
        {step === 4 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">دولة الوصول</label>
                <input className="field-input" value={form.destinationCountry} onChange={set("destinationCountry")} />
              </div>
              <div>
                <label className="field-label">مدينة الوصول</label>
                <input className="field-input" value={form.destinationCity} onChange={set("destinationCity")} placeholder="مثال: الرياض" />
              </div>
            </div>
            <div>
              <label className="field-label">طريقة الشحن المفضلة</label>
              <div className="flex flex-wrap gap-3">
                {SHIPPING.map((s) => (
                  <label key={s} className={`cursor-pointer rounded-lg border px-5 py-2.5 text-sm font-semibold transition ${form.shippingPreference === s ? "border-china-red bg-china-red text-white" : "border-charcoal/20 bg-white hover:border-gold"}`}>
                    <input type="radio" name="shippingPreference" value={s} checked={form.shippingPreference === s} onChange={set("shippingPreference")} className="sr-only" />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="field-label">موعد الاستلام المطلوب</label>
              <input className="field-input" dir="ltr" type="date" value={form.requiredDeliveryDate} onChange={set("requiredDeliveryDate")} />
              <p className="field-hint">اختياري — يساعدنا في ترتيب أولوية طلبك.</p>
            </div>
          </>
        )}

        {/* الخطوة 6 — معلومات إضافية */}
        {step === 5 && (
          <>
            <div>
              <label className="field-label">أي معلومات إضافية تساعدنا في فهم طلبك</label>
              <textarea className="field-input min-h-32" value={form.additionalNotes} onChange={set("additionalNotes")} placeholder="اختياري" />
            </div>
            <div className="rounded-lg bg-ivory p-4 text-sm leading-relaxed">
              <p className="font-bold">ملخص سريع:</p>
              <p className="mt-1 text-charcoal/80">
                {form.productName || "—"} • الكمية: {form.quantity || "—"} {form.unit} • الوجهة:{" "}
                {form.destinationCity ? `${form.destinationCity}، ` : ""}
                {form.destinationCountry}
              </p>
            </div>
          </>
        )}

        {error && (
          <p className="rounded-lg bg-china-red/10 px-4 py-3 text-sm font-bold text-china-red">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between border-t border-charcoal/10 pt-5">
          <button type="button" onClick={back} disabled={step === 0 || submitting} className="btn-outline-sm">
            السابق
          </button>
          {step < STEP_TITLES.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary !px-10 !py-3 !text-base">
              التالي
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={submitting} className="btn-primary !px-10 !py-3 !text-base">
              {submitting ? "جاري إرسال الطلب..." : "إرسال الطلب"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
