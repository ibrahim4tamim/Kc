// دورة حياة طلب التوريد — 24 حالة، القيمة هنا يجب أن تطابق حرفياً
// خيارات خاصية Status (Select) في قاعدة Sourcing Requests في Notion.
export const REQUEST_STATUSES = [
  "01 — طلب جديد",
  "02 — قيد المراجعة",
  "03 — بانتظار معلومات من العميل",
  "04 — جاري البحث عن مورد",
  "05 — تم العثور على موردين",
  "06 — جاري طلب عروض الأسعار",
  "07 — تم استلام عروض الأسعار",
  "08 — جاري مراجعة العروض",
  "09 — تم إرسال العروض للعميل",
  "10 — بانتظار قرار العميل",
  "11 — جاري التفاوض",
  "12 — تم اختيار المورد",
  "13 — بانتظار الدفعة",
  "14 — تم تأكيد الطلب",
  "15 — جاري أخذ العينة",
  "16 — تم اعتماد العينة",
  "17 — قيد التصنيع",
  "18 — فحص الجودة",
  "19 — جاهز للشحن",
  "20 — تم الشحن",
  "21 — تم التسليم",
  "22 — مكتمل",
  "23 — متوقف مؤقتاً",
  "24 — ملغي",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const NEW_REQUEST_STATUS: RequestStatus = "01 — طلب جديد";
export const SUPPLIER_SELECTED_STATUS: RequestStatus = "12 — تم اختيار المورد";

/** رقم الحالة (1..24) من قيمتها النصية، أو null إن لم تُعرف */
export function statusNumber(status: string): number | null {
  const m = status.match(/^(\d{2})\s/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return n >= 1 && n <= 24 ? n : null;
}
