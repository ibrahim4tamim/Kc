import {
  readTitle,
  readText,
  readSelect,
  readNumber,
  readDate,
  readCheckbox,
} from "./notion";
import { buildTimeline, nextExpectedStep, type TimelineStep } from "./timeline";
import { statusNumber } from "./statuses";

// DTOs — القاعدة الأمنية الأساسية:
// لا يُعاد للعميل أي حقل غير مذكور هنا صراحةً (whitelist).
// ممنوع تماماً تمرير صفحات Notion الخام إلى الواجهة.

type AnyPage = { id: string; properties: Record<string, any> };

export interface CustomerQuoteDTO {
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
  negotiationStatus: string;
  customerDecision: string;
  isSelected: boolean;
}

export interface CustomerRequestDTO {
  requestId: string;
  productName: string;
  status: string;
  statusLabel: string;
  createdDate: string | null;
  lastUpdated: string | null;
  customerVisibleUpdate: string;
  nextExpectedStep: string | null;
  timeline: TimelineStep[];
  isPausedOrCancelled: boolean;
  quotes: CustomerQuoteDTO[];
}

/** الحقول المسموح للعميل رؤيتها من الطلب — لا شيء غيرها */
export function toCustomerRequestDTO(
  page: AnyPage,
  quotePages: AnyPage[]
): CustomerRequestDTO {
  const status = readSelect(page, "Status") || "01 — طلب جديد";
  const n = statusNumber(status);
  const pausedOrCancelled = n === 23 || n === 24;

  return {
    requestId: readTitle(page, "Request ID"),
    productName: readText(page, "Product Name"),
    status,
    statusLabel: status.replace(/^\d{2}\s—\s/, ""),
    createdDate: readDate(page, "Created Date"),
    lastUpdated: readDate(page, "Last Updated"),
    customerVisibleUpdate: readText(page, "Customer Visible Update"),
    nextExpectedStep: pausedOrCancelled ? null : nextExpectedStep(status),
    timeline: pausedOrCancelled ? [] : buildTimeline(status),
    isPausedOrCancelled: pausedOrCancelled,
    quotes: quotePages.map(toCustomerQuoteDTO),
  };
}

/** الحقول المسموح بها من عرض السعر — بدون أي بيانات موردين أو ملاحظات داخلية */
export function toCustomerQuoteDTO(page: AnyPage, index?: number): CustomerQuoteDTO {
  return {
    quoteId: page.id,
    offerNumber: readTitle(page, "Quotation ID") || `عرض ${(index ?? 0) + 1}`,
    product: readText(page, "Product"),
    unitPrice: readNumber(page, "Unit Price"),
    currency: readSelect(page, "Currency") || "USD",
    moq: readNumber(page, "MOQ"),
    quantity: readNumber(page, "Requested Quantity"),
    estimatedTotal: readNumber(page, "Estimated Total Cost"),
    productionLeadTime: readText(page, "Production Lead Time"),
    incoterm: readSelect(page, "Incoterm"),
    customerNotes: readText(page, "Customer Visible Notes"),
    negotiationStatus: readSelect(page, "Negotiation Status"),
    customerDecision: readSelect(page, "Customer Decision"),
    isSelected: readCheckbox(page, "Is Selected Quote"),
  };
}
