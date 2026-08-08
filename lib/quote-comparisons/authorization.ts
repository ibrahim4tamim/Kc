import type { AppRole, QuotationStatus, SupplierSelectionStatus } from "@/lib/supabase/types";

export const canReadQuoteComparison = (role: AppRole | null) => ["owner", "admin", "operations", "purchasing", "inspection", "finance"].includes(role ?? "");
export const canManageSupplierSelection = (role: AppRole | null) => ["owner", "admin", "operations", "purchasing"].includes(role ?? "");
export const canDeleteSupplierSelection = (_: AppRole | null) => false;

export type QuoteComparisonEntryDTO = {
  quotationId: string; supplierId: string; supplierName: string; supplierCandidateId: string;
  quotationReference: string; quotationVersion: number; quotationStatus: QuotationStatus;
  currency: string; quantity: number | null; unit: string | null; unitPrice: number | null;
  totalCommercialAmount: number | null; moq: number | null; leadTimeDays: number | null;
  incoterm: string | null; paymentTerms: string | null; quotationDate: string; validUntil: string | null;
  isLowestUnitPriceInCurrency: boolean; hasLowestMoq: boolean; hasHighestMoq: boolean;
  hasShortestLeadTime: boolean;
};
export type QuoteComparisonDTO = { rfqItemId: string; quotationCount: number; comparisonReady: boolean; currencyMismatch: boolean; entries: QuoteComparisonEntryDTO[] };
export type ComparisonReadinessDTO = Pick<QuoteComparisonDTO, "rfqItemId" | "quotationCount" | "comparisonReady" | "currencyMismatch">;
export type SupplierSelectionDTO = { id: string; rfqId: string; rfqItemId: string; supplierCandidateId: string; supplierId: string; quotationId: string; selectedByProfileId: string; selectedAt: string; selectionReason: string; fewerThanThreeJustification: string | null; status: SupplierSelectionStatus; createdAt: string; updatedAt: string };
export type SupplierSelectionHistoryDTO = SupplierSelectionDTO & { supersededAt: string | null; cancelledAt: string | null; archivedAt: string | null };
