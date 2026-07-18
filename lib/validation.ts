import { z } from "zod";

// أرقام الجوال: نقبل الصيغ المحلية والدولية الشائعة في السعودية والخليج
const phoneRegex = /^\+?[0-9\s\-()]{8,17}$/;

export const yesNoUnsure = z.enum(["نعم", "لا", "غير متأكد"]);

export const sourcingRequestSchema = z.object({
  // 1 — معلومات التواصل
  fullName: z.string().trim().min(2, "الاسم الكامل مطلوب").max(120),
  mobile: z.string().trim().regex(phoneRegex, "رقم الجوال غير صحيح"),
  whatsapp: z.string().trim().regex(phoneRegex, "رقم الواتساب غير صحيح").optional().or(z.literal("")),
  email: z.string().trim().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  preferredContact: z.enum(["واتساب", "اتصال", "بريد إلكتروني"]),

  // 2 — تفاصيل المنتج
  productName: z.string().trim().min(2, "اسم المنتج مطلوب").max(200),
  productCategory: z.enum([
    "الأثاث",
    "المنزل الذكي",
    "الإلكترونيات",
    "مواد البناء",
    "الملابس والمنسوجات",
    "التغليف",
    "المعدات",
    "منتجات مخصصة",
    "أخرى",
  ]),
  productDescription: z.string().trim().min(10, "الرجاء وصف المنتج بشكل كافٍ").max(4000),
  productImages: z.array(z.string().url()).max(6).optional().default([]),
  productReferenceUrl: z.string().trim().url("الرابط غير صحيح").optional().or(z.literal("")),

  // 3 — الكمية والميزانية
  quantity: z.coerce.number().positive("الكمية المطلوبة مطلوبة"),
  unit: z.enum(["قطعة", "كرتون", "طن", "متر", "حاوية", "أخرى"]),
  targetBudget: z.coerce.number().positive().optional().or(z.literal("").transform(() => undefined)),
  targetPricePerUnit: z.coerce.number().positive().optional().or(z.literal("").transform(() => undefined)),
  currency: z.enum(["SAR", "USD", "CNY"]).default("SAR"),

  // 4 — التخصيص والتصنيع
  customizationRequired: yesNoUnsure.default("غير متأكد"),
  privateLabelRequired: yesNoUnsure.default("غير متأكد"),
  packagingCustomization: yesNoUnsure.default("غير متأكد"),
  customizationDetails: z.string().trim().max(2000).optional().or(z.literal("")),

  // 5 — الشحن
  destinationCountry: z.string().trim().max(80).default("المملكة العربية السعودية"),
  destinationCity: z.string().trim().max(80).optional().or(z.literal("")),
  shippingPreference: z.enum(["بحري", "جوي", "بري", "غير متأكد"]).default("غير متأكد"),
  requiredDeliveryDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),

  // 6 — معلومات إضافية
  additionalNotes: z.string().trim().max(4000).optional().or(z.literal("")),

  // منع الإرسال المكرر: معرف يولده المتصفح مرة واحدة لكل تعبئة فورم
  submissionToken: z.string().trim().min(8).max(64),
});

export type SourcingRequestInput = z.infer<typeof sourcingRequestSchema>;

export const trackRequestSchema = z.object({
  requestId: z
    .string()
    .trim()
    .regex(/^KC-RFQ-\d{4}-\d{5}$/i, "رقم الطلب غير صحيح"),
  // أحد الاثنين مطلوب للتحقق من الهوية
  mobile: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().optional().or(z.literal("")),
});

export const quoteFeedbackSchema = z.object({
  requestId: z.string().trim().regex(/^KC-RFQ-\d{4}-\d{5}$/i),
  mobile: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().optional().or(z.literal("")),
  quoteId: z.string().trim().min(10).max(64),
  action: z.enum(["interested", "needs_change", "negotiate", "select"]),
});

/** توحيد رقم الجوال للمقارنة: أرقام فقط، وإسقاط الصفر/مفتاح الدولة في البداية */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // نقارن بآخر 9 أرقام — تكفي لتمييز الأرقام السعودية والخليجية
  return digits.slice(-9);
}
