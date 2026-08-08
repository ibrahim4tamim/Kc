import { z } from "zod";

export const QUOTATION_STATUSES = ["draft", "received", "under_review", "accepted", "rejected", "superseded", "archived"] as const;
const id = z.string().uuid();
const optionalText = (max: number) => z.string().trim().max(max).transform(value => value || undefined).optional();

export const quotationInputSchema = z.object({
  rfqId: id,
  rfqItemId: id,
  supplierId: id,
  supplierCandidateId: id,
  supplierRequestId: id.optional(),
  supplierResponseId: id.optional(),
  quotationReference: z.string().trim().toUpperCase().regex(/^[A-Z0-9-]{3,80}$/),
  status: z.enum(QUOTATION_STATUSES).default("received"),
  currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/),
  quotationDate: z.string().date(),
  validUntil: z.string().date().optional(),
  paymentTerms: optionalText(1000),
  incoterm: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/).optional(),
  leadTimeDays: z.number().int().nonnegative().optional(),
  moq: z.number().finite().positive().optional(),
  supplierNotes: optionalText(4000),
  internalNotes: optionalText(4000),
}).superRefine((value, context) => {
  if (value.status === "archived" || value.status === "superseded") context.addIssue({ code: z.ZodIssueCode.custom, message: "A new quotation cannot start archived or superseded" });
  if (value.validUntil && value.validUntil < value.quotationDate) context.addIssue({ code: z.ZodIssueCode.custom, message: "validUntil must not precede quotationDate" });
});

export const quotationUpdateSchema = z.object({
  status: z.enum(QUOTATION_STATUSES).optional(),
  currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/).optional(),
  quotationDate: z.string().date().optional(),
  validUntil: z.string().date().optional(),
  paymentTerms: optionalText(1000),
  incoterm: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/).optional(),
  leadTimeDays: z.number().int().nonnegative().optional(),
  moq: z.number().finite().positive().optional(),
  supplierNotes: optionalText(4000),
  internalNotes: optionalText(4000),
}).superRefine((value, context) => {
  if (value.validUntil && value.quotationDate && value.validUntil < value.quotationDate) context.addIssue({ code: z.ZodIssueCode.custom, message: "validUntil must not precede quotationDate" });
  if (value.status === "superseded") context.addIssue({ code: z.ZodIssueCode.custom, message: "Superseded quotations are produced only by revisioning" });
});
export const quotationStatusSchema = z.enum(QUOTATION_STATUSES).refine(status => status !== "superseded", "Superseded quotations are produced only by revisioning");
export const quotationItemInputSchema = z.object({
  rfqItemId: id,
  quantity: z.number().finite().positive(),
  unit: z.string().trim().min(1).max(40),
  unitPrice: z.number().finite().nonnegative(),
  moq: z.number().finite().positive().optional(),
  packagingInfo: optionalText(1000),
  leadTimeDays: z.number().int().nonnegative().optional(),
  notes: optionalText(4000),
});

export type QuotationInput = z.infer<typeof quotationInputSchema>;
export type QuotationUpdate = z.infer<typeof quotationUpdateSchema>;
export type QuotationItemInput = z.infer<typeof quotationItemInputSchema>;
