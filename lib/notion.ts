import { Client } from "@notionhq/client";
import type { SourcingRequestInput } from "./validation";
import { normalizePhone } from "./validation";
import { NEW_REQUEST_STATUS, SUPPLIER_SELECTED_STATUS } from "./statuses";

// جميع عمليات Notion تتم هنا حصراً (server-side فقط).
// لا يجوز استيراد هذا الملف من أي مكوّن عميل.

let _notion: Client | null = null;

export function notion(): Client {
  if (!_notion) {
    const key = process.env.NOTION_API_KEY;
    if (!key) throw new Error("NOTION_API_KEY is not configured");
    _notion = new Client({ auth: key });
  }
  return _notion;
}

export function requestsDbId(): string {
  const id = process.env.NOTION_REQUESTS_DATABASE_ID;
  if (!id) throw new Error("NOTION_REQUESTS_DATABASE_ID is not configured");
  return id;
}

function quotesDbId(): string {
  const id = process.env.NOTION_QUOTES_DATABASE_ID;
  if (!id) throw new Error("NOTION_QUOTES_DATABASE_ID is not configured");
  return id;
}

function communicationsDbId(): string {
  const id = process.env.NOTION_COMMUNICATIONS_DATABASE_ID;
  if (!id) throw new Error("NOTION_COMMUNICATIONS_DATABASE_ID is not configured");
  return id;
}

// ---------- أدوات مساعدة لبناء خصائص Notion ----------

const rt = (v?: string) =>
  v ? { rich_text: [{ text: { content: v.slice(0, 1900) } }] } : { rich_text: [] };
const sel = (v?: string) => (v ? { select: { name: v } } : { select: null });
const num = (v?: number) => ({ number: typeof v === "number" && !isNaN(v) ? v : null });
const dateProp = (v?: string) => (v ? { date: { start: v } } : { date: null });

// ---------- قراءة خصائص صفحات Notion بأمان ----------

type AnyPage = { id: string; properties: Record<string, any> };

export function readTitle(page: AnyPage, prop: string): string {
  return page.properties?.[prop]?.title?.map((t: any) => t.plain_text).join("") ?? "";
}
export function readText(page: AnyPage, prop: string): string {
  return page.properties?.[prop]?.rich_text?.map((t: any) => t.plain_text).join("") ?? "";
}
export function readSelect(page: AnyPage, prop: string): string {
  return page.properties?.[prop]?.select?.name ?? "";
}
export function readNumber(page: AnyPage, prop: string): number | null {
  const v = page.properties?.[prop]?.number;
  return typeof v === "number" ? v : null;
}
export function readDate(page: AnyPage, prop: string): string | null {
  return page.properties?.[prop]?.date?.start ?? null;
}
export function readPhone(page: AnyPage, prop: string): string {
  return page.properties?.[prop]?.phone_number ?? "";
}
export function readEmail(page: AnyPage, prop: string): string {
  return page.properties?.[prop]?.email ?? "";
}
export function readCheckbox(page: AnyPage, prop: string): boolean {
  return page.properties?.[prop]?.checkbox === true;
}

// ---------- توليد رقم طلب فريد ----------
//
// الاستراتيجية: KC-RFQ-<السنة>-<5 أرقام عشوائية> ثم التحقق من عدم وجوده
// في Notion قبل الإنشاء (مع إعادة المحاولة حتى 5 مرات).
// لا نعتمد على عدّ الصفوف إطلاقاً — العد يسبب أرقاماً مكررة عند التزامن.

export async function generateRequestId(): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 5; attempt++) {
    const n = Math.floor(10000 + Math.random() * 90000); // 10000-99999
    const candidate = `KC-RFQ-${year}-${n}`;
    const existing = await notion().databases.query({
      database_id: requestsDbId(),
      filter: { property: "Request ID", title: { equals: candidate } },
      page_size: 1,
    });
    if (existing.results.length === 0) return candidate;
  }
  throw new Error("Failed to generate a unique Request ID");
}

// ---------- إنشاء طلب توريد جديد ----------

export async function createSourcingRequest(
  input: SourcingRequestInput
): Promise<{ requestId: string; pageId: string }> {
  const requestId = await generateRequestId();
  const nowIso = new Date().toISOString();

  const properties: Record<string, any> = {
    "Request ID": { title: [{ text: { content: requestId } }] },
    "Customer Name": rt(input.fullName),
    Mobile: { phone_number: input.mobile },
    WhatsApp: input.whatsapp ? { phone_number: input.whatsapp } : { phone_number: null },
    Email: input.email ? { email: input.email } : { email: null },
    Company: rt(input.company || undefined),
    "Preferred Contact Method": sel(input.preferredContact),

    "Product Name": rt(input.productName),
    "Product Category": sel(input.productCategory),
    "Product Description": rt(input.productDescription),
    "Product Reference URL": input.productReferenceUrl
      ? { url: input.productReferenceUrl }
      : { url: null },

    Quantity: num(input.quantity),
    Unit: sel(input.unit),
    "Target Budget": num(input.targetBudget),
    "Target Price Per Unit": num(input.targetPricePerUnit),
    Currency: sel(input.currency),

    "Customization Required": sel(input.customizationRequired),
    "Private Label Required": sel(input.privateLabelRequired),
    "Packaging Customization": sel(input.packagingCustomization),
    "Customization Details": rt(input.customizationDetails || undefined),

    "Destination Country": rt(input.destinationCountry),
    "Destination City": rt(input.destinationCity || undefined),
    "Shipping Preference": sel(input.shippingPreference),
    "Required Delivery Date": dateProp(input.requiredDeliveryDate || undefined),

    "Additional Notes": rt(input.additionalNotes || undefined),

    Status: sel(NEW_REQUEST_STATUS),
    Source: sel("Website"),
    "Created Date": dateProp(nowIso),
    "Last Updated": dateProp(nowIso),
  };

  if (input.productImages && input.productImages.length > 0) {
    properties["Product Images"] = {
      files: input.productImages.map((url, i) => ({
        name: `image-${i + 1}`,
        external: { url },
      })),
    };
  }

  const page = await notion().pages.create({
    parent: { database_id: requestsDbId() },
    properties,
  });

  // تسجيل استلام الطلب في قاعدة Communications (غير حرج — لا نفشل الطلب إن تعذر)
  try {
    await logCommunication({
      requestPageId: page.id,
      requestId,
      customer: input.fullName,
      type: "Website",
      direction: "Inbound",
      subject: "طلب توريد جديد من الموقع",
      summary: `تم استلام طلب توريد جديد: ${input.productName} — الكمية: ${input.quantity} ${input.unit}`,
    });
  } catch (e) {
    console.error("Failed to log communication for new request:", e);
  }

  return { requestId, pageId: page.id };
}

// ---------- البحث عن طلب والتحقق من هوية العميل ----------

export async function findVerifiedRequest(
  requestId: string,
  mobile?: string,
  email?: string
): Promise<AnyPage | null> {
  const res = await notion().databases.query({
    database_id: requestsDbId(),
    filter: { property: "Request ID", title: { equals: requestId.toUpperCase() } },
    page_size: 1,
  });
  const page = res.results[0] as AnyPage | undefined;
  if (!page) return null;

  // التحقق: رقم الطلب وحده لا يكفي — يجب تطابق الجوال أو البريد
  const storedMobile = normalizePhone(readPhone(page, "Mobile"));
  const storedWhatsapp = normalizePhone(readPhone(page, "WhatsApp"));
  const storedEmail = readEmail(page, "Email").toLowerCase().trim();

  const mobileOk =
    !!mobile &&
    normalizePhone(mobile).length >= 8 &&
    (normalizePhone(mobile) === storedMobile || normalizePhone(mobile) === storedWhatsapp);
  const emailOk = !!email && !!storedEmail && email.toLowerCase().trim() === storedEmail;

  if (!mobileOk && !emailOk) return null;
  return page;
}

// ---------- العروض المعتمدة للعميل ----------
//
// العميل يرى فقط العروض التي فعّل الفريق فيها checkbox
// "Approved For Customer" في قاعدة Quotations.

export async function getApprovedQuotes(requestPageId: string): Promise<AnyPage[]> {
  const res = await notion().databases.query({
    database_id: quotesDbId(),
    filter: {
      and: [
        { property: "Request", relation: { contains: requestPageId } },
        { property: "Approved For Customer", checkbox: { equals: true } },
      ],
    },
    page_size: 25,
  });
  return res.results as AnyPage[];
}

// ---------- تسجيل تفاعل العميل مع عرض سعر ----------

const ACTION_TO_DECISION: Record<string, string> = {
  interested: "مهتم",
  needs_change: "يحتاج تفاوض",
  negotiate: "يحتاج تفاوض",
  select: "مقبول",
};

const ACTION_LABEL: Record<string, string> = {
  interested: "العميل مهتم بهذا العرض",
  needs_change: "العميل يحتاج تعديلاً على العرض",
  negotiate: "العميل يرغب بالتفاوض على العرض",
  select: "العميل اختار هذا العرض",
};

export async function applyQuoteFeedback(params: {
  requestPage: AnyPage;
  requestId: string;
  quoteId: string;
  action: "interested" | "needs_change" | "negotiate" | "select";
}): Promise<boolean> {
  const { requestPage, requestId, quoteId, action } = params;

  // نتأكد أن العرض معتمد وتابع فعلاً لهذا الطلب — لا نحدّث أي صفحة عشوائية
  const approved = await getApprovedQuotes(requestPage.id);
  const quote = approved.find((q) => q.id === quoteId);
  if (!quote) return false;

  const nowIso = new Date().toISOString();

  const quoteProps: Record<string, any> = {
    "Customer Decision": sel(ACTION_TO_DECISION[action]),
    "Last Updated": dateProp(nowIso),
  };
  if (action === "select") {
    quoteProps["Is Selected Quote"] = { checkbox: true };
  }
  await notion().pages.update({ page_id: quoteId, properties: quoteProps });

  if (action === "select") {
    await notion().pages.update({
      page_id: requestPage.id,
      properties: {
        Status: sel(SUPPLIER_SELECTED_STATUS),
        "Last Updated": dateProp(nowIso),
      },
    });
  } else {
    await notion().pages.update({
      page_id: requestPage.id,
      properties: { "Last Updated": dateProp(nowIso) },
    });
  }

  try {
    await logCommunication({
      requestPageId: requestPage.id,
      requestId,
      customer: readText(requestPage, "Customer Name"),
      type: "Website",
      direction: "Inbound",
      subject: `تفاعل العميل مع عرض سعر — ${requestId}`,
      summary: `${ACTION_LABEL[action]} (عرض: ${readTitle(quote, "Quotation ID") || quoteId})`,
    });
  } catch (e) {
    console.error("Failed to log quote feedback communication:", e);
  }

  return true;
}

// ---------- تسجيل تواصل في قاعدة Communications ----------

export async function logCommunication(params: {
  requestPageId: string;
  requestId: string;
  customer: string;
  type: "WhatsApp" | "Phone" | "Email" | "Website" | "Meeting" | "Other";
  direction: "Inbound" | "Outbound";
  subject: string;
  summary: string;
}): Promise<void> {
  const nowIso = new Date().toISOString();
  await notion().pages.create({
    parent: { database_id: communicationsDbId() },
    properties: {
      "Communication ID": {
        title: [{ text: { content: `COM-${params.requestId}-${Date.now()}` } }],
      },
      Request: { relation: [{ id: params.requestPageId }] },
      Customer: rt(params.customer),
      "Communication Type": sel(params.type),
      Direction: sel(params.direction),
      "Communication Date": dateProp(nowIso),
      Subject: rt(params.subject),
      Summary: rt(params.summary),
      "Created Date": dateProp(nowIso),
    },
  });
}
