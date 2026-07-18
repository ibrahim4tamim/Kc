import { statusNumber } from "./statuses";

export type TimelineState = "done" | "current" | "upcoming";

export interface TimelineStep {
  label: string;
  state: TimelineState;
}

// مراحل الخط الزمني المعروضة للعميل، وكل مرحلة تُعتبر "منجزة"
// عندما يبلغ رقم حالة الطلب العتبة المحددة لها أو يتجاوزها.
const BASE_STAGES: { label: string; threshold: number }[] = [
  { label: "تم استلام الطلب", threshold: 1 },
  { label: "تمت مراجعة الطلب", threshold: 2 },
  { label: "بدأ البحث عن الموردين", threshold: 4 },
  { label: "تم العثور على موردين", threshold: 5 },
  { label: "جاري جمع عروض الأسعار", threshold: 6 },
  { label: "مراجعة العروض", threshold: 8 },
  { label: "إرسال العروض إليك", threshold: 9 },
  { label: "اختيار المورد", threshold: 12 },
  { label: "تأكيد الطلب", threshold: 14 },
];

// مراحل التصنيع والشحن — تظهر فقط عندما يتقدم الطلب إليها فعلياً.
const ORDER_STAGES: { label: string; threshold: number }[] = [
  { label: "العينة", threshold: 15 },
  { label: "التصنيع", threshold: 17 },
  { label: "فحص الجودة", threshold: 18 },
  { label: "الشحن", threshold: 20 },
  { label: "التسليم", threshold: 21 },
];

/** يبني الخط الزمني للعميل من حالة الطلب الحالية */
export function buildTimeline(status: string): TimelineStep[] {
  const n = statusNumber(status) ?? 1;
  const stages =
    n >= 14 ? [...BASE_STAGES, ...ORDER_STAGES] : BASE_STAGES;

  const steps: TimelineStep[] = [];
  let currentMarked = false;
  for (const stage of stages) {
    if (n > stage.threshold || n >= 22) {
      steps.push({ label: stage.label, state: "done" });
    } else if (n === stage.threshold || (!currentMarked && n < stage.threshold)) {
      steps.push({
        label: stage.label,
        state: currentMarked ? "upcoming" : "current",
      });
      currentMarked = true;
    } else {
      steps.push({ label: stage.label, state: "upcoming" });
    }
  }
  return steps;
}

/** الخطوة القادمة المتوقعة (أول مرحلة غير منجزة بعد المرحلة الحالية) */
export function nextExpectedStep(status: string): string | null {
  const steps = buildTimeline(status);
  const idx = steps.findIndex((s) => s.state === "current");
  if (idx === -1) return null;
  return steps[idx + 1]?.label ?? null;
}
