import { z } from "zod";

export const SUPPLIER_SELECTION_STATUSES = ["active", "superseded", "cancelled", "archived"] as const;
const uuid = z.string().uuid();
const reason = z.string().trim().min(1).max(4000);
export const supplierSelectionInputSchema = z.object({ rfqId: uuid, rfqItemId: uuid, supplierCandidateId: uuid, supplierId: uuid, quotationId: uuid, selectionReason: reason, fewerThanThreeJustification: reason.optional() });
export const selectionCancellationSchema = z.object({ selectionId: uuid, reason });
export const comparisonReviewSchema = z.object({ rfqId: uuid, rfqItemId: uuid, notes: z.string().trim().max(4000).transform(value => value || undefined).optional() });
export const requiresFewerThanThreeJustification = (quotationCount: number) => quotationCount < 3;
export type SupplierSelectionInput = z.infer<typeof supplierSelectionInputSchema>;
