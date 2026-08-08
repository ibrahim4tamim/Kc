import "server-only";

import { AuthorizationError, getAuthenticatedUserId, requireOrganizationRole } from "@/lib/auth/server";
import { attachmentInputSchema } from "@/lib/rfqs/validation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, Database, QuotationStatus } from "@/lib/supabase/types";
import type { QuotationAttachmentDTO, QuotationDetailsDTO, QuotationItemDTO, QuotationListDTO } from "./authorization";
import { quotationInputSchema, quotationItemInputSchema, quotationStatusSchema, quotationUpdateSchema, type QuotationInput, type QuotationItemInput, type QuotationUpdate } from "./validation";

const managers: readonly AppRole[] = ["owner", "admin", "operations", "purchasing"];
const readers: readonly AppRole[] = [...managers, "inspection", "finance"];
type Quote = Database["public"]["Tables"]["quotations"]["Row"];
type QuoteItem = Database["public"]["Tables"]["quotation_items"]["Row"];
type Attachment = Database["public"]["Tables"]["rfq_attachments"]["Row"];
const fail = (error: unknown) => { if (error) throw new AuthorizationError("ROLE_REQUIRED"); };
const asNumber = (value: number) => Number(value);

const listDto = (row: Quote): QuotationListDTO => ({ id: row.id, rfqItemId: row.rfq_item_id, supplierCandidateId: row.supplier_candidate_id, quotationReference: row.quotation_reference, versionNumber: row.version_number, status: row.status, currency: row.currency, validUntil: row.valid_until, createdAt: row.created_at });
const detailsDto = (row: Quote): QuotationDetailsDTO => ({ ...listDto(row), rfqId: row.rfq_id, supplierId: row.supplier_id, supplierRequestId: row.supplier_request_id, supplierResponseId: row.supplier_response_id, quotationDate: row.quotation_date, paymentTerms: row.payment_terms, incoterm: row.incoterm, leadTimeDays: row.lead_time_days, moq: row.moq, supplierNotes: row.supplier_notes, internalNotes: row.internal_notes, updatedAt: row.updated_at, archivedAt: row.archived_at });
const itemDto = (row: QuoteItem): QuotationItemDTO => ({ id: row.id, quotationId: row.quotation_id, rfqItemId: row.rfq_item_id, quantity: asNumber(row.quantity), unit: row.unit, unitPrice: asNumber(row.unit_price), totalPrice: asNumber(row.total_price), moq: row.moq === null ? null : asNumber(row.moq), packagingInfo: row.packaging_info, leadTimeDays: row.lead_time_days, notes: row.notes, createdAt: row.created_at, updatedAt: row.updated_at });
const attachmentDto = (row: Attachment): QuotationAttachmentDTO => ({ id: row.id, quotationId: row.owner_id, originalFilename: row.original_filename, contentType: row.content_type, fileSize: Number(row.file_size), storageBucket: row.storage_bucket, storagePath: row.storage_path, createdAt: row.created_at });

export async function createQuotation(organizationId: string, input: QuotationInput): Promise<QuotationDetailsDTO> {
  await requireOrganizationRole(organizationId, managers);
  const value = quotationInputSchema.parse(input);
  const { data, error } = await createClient().rpc("create_quotation_revision", { target_organization_id: organizationId, target_rfq_id: value.rfqId, target_rfq_item_id: value.rfqItemId, target_supplier_id: value.supplierId, target_supplier_candidate_id: value.supplierCandidateId, target_quotation_reference: value.quotationReference, target_status: value.status, target_currency: value.currency, target_quotation_date: value.quotationDate, target_valid_until: value.validUntil ?? null, target_payment_terms: value.paymentTerms ?? null, target_incoterm: value.incoterm ?? null, target_lead_time_days: value.leadTimeDays ?? null, target_moq: value.moq ?? null, target_supplier_notes: value.supplierNotes ?? null, target_internal_notes: value.internalNotes ?? null, target_supplier_request_id: value.supplierRequestId ?? null, target_supplier_response_id: value.supplierResponseId ?? null });
  fail(error); const row = data?.[0]; if (!row) throw new AuthorizationError("ROLE_REQUIRED"); return detailsDto(row);
}

export const createQuotationRevision = createQuotation;

export async function updateQuotation(organizationId: string, quotationId: string, input: QuotationUpdate): Promise<QuotationDetailsDTO> {
  await requireOrganizationRole(organizationId, managers); const value = quotationUpdateSchema.parse(input);
  if (Object.keys(value).length === 0) throw new AuthorizationError("ROLE_REQUIRED");
  const patch = { status: value.status, currency: value.currency, quotation_date: value.quotationDate, valid_until: value.validUntil, payment_terms: value.paymentTerms, incoterm: value.incoterm, lead_time_days: value.leadTimeDays, moq: value.moq, supplier_notes: value.supplierNotes, internal_notes: value.internalNotes };
  const { data, error } = await createClient().from("quotations").update(patch).eq("organization_id", organizationId).eq("id", quotationId).is("archived_at", null).select().single();
  fail(error); if (!data) throw new AuthorizationError("ROLE_REQUIRED"); return detailsDto(data);
}

export async function changeQuotationStatus(organizationId: string, quotationId: string, status: QuotationStatus): Promise<QuotationDetailsDTO> {
  await requireOrganizationRole(organizationId, managers); const next = quotationStatusSchema.parse(status);
  const patch = next === "archived" ? { status: next, archived_at: new Date().toISOString() } : { status: next, archived_at: null };
  const { data, error } = await createClient().from("quotations").update(patch).eq("organization_id", organizationId).eq("id", quotationId).select().single();
  fail(error); if (!data) throw new AuthorizationError("ROLE_REQUIRED"); return detailsDto(data);
}

export const archiveQuotation = (organizationId: string, quotationId: string) => changeQuotationStatus(organizationId, quotationId, "archived");

export async function listQuotationsForRFQItem(organizationId: string, rfqItemId: string): Promise<QuotationListDTO[]> { await requireOrganizationRole(organizationId, readers); const { data, error } = await createClient().from("quotations").select().eq("organization_id", organizationId).eq("rfq_item_id", rfqItemId).is("archived_at", null); fail(error); return (data ?? []).map(listDto); }
export async function listQuotationsForCandidate(organizationId: string, candidateId: string): Promise<QuotationListDTO[]> { await requireOrganizationRole(organizationId, readers); const { data, error } = await createClient().from("quotations").select().eq("organization_id", organizationId).eq("supplier_candidate_id", candidateId).is("archived_at", null); fail(error); return (data ?? []).map(listDto); }
export async function getQuotation(organizationId: string, quotationId: string): Promise<QuotationDetailsDTO> { await requireOrganizationRole(organizationId, readers); const { data, error } = await createClient().from("quotations").select().eq("organization_id", organizationId).eq("id", quotationId).single(); fail(error); if (!data) throw new AuthorizationError("ROLE_REQUIRED"); return detailsDto(data); }

export async function addQuotationItem(organizationId: string, quotationId: string, input: QuotationItemInput): Promise<QuotationItemDTO> { await requireOrganizationRole(organizationId, managers); const value = quotationItemInputSchema.parse(input); const { data, error } = await createClient().from("quotation_items").insert({ organization_id: organizationId, quotation_id: quotationId, rfq_item_id: value.rfqItemId, quantity: value.quantity, unit: value.unit, unit_price: value.unitPrice, moq: value.moq ?? null, packaging_info: value.packagingInfo ?? null, lead_time_days: value.leadTimeDays ?? null, notes: value.notes ?? null }).select().single(); fail(error); if (!data) throw new AuthorizationError("ROLE_REQUIRED"); return itemDto(data); }
export async function updateQuotationItem(organizationId: string, quotationItemId: string, input: QuotationItemInput): Promise<QuotationItemDTO> { await requireOrganizationRole(organizationId, managers); const value = quotationItemInputSchema.parse(input); const { data, error } = await createClient().from("quotation_items").update({ quantity: value.quantity, unit: value.unit, unit_price: value.unitPrice, moq: value.moq ?? null, packaging_info: value.packagingInfo ?? null, lead_time_days: value.leadTimeDays ?? null, notes: value.notes ?? null }).eq("organization_id", organizationId).eq("id", quotationItemId).select().single(); fail(error); if (!data) throw new AuthorizationError("ROLE_REQUIRED"); return itemDto(data); }
export async function archiveQuotationItem(organizationId: string, quotationItemId: string): Promise<QuotationItemDTO> { await requireOrganizationRole(organizationId, managers); const { data, error } = await createClient().from("quotation_items").select().eq("organization_id", organizationId).eq("id", quotationItemId).single(); fail(error); if (!data) throw new AuthorizationError("ROLE_REQUIRED"); return itemDto(data); }

export async function addQuotationAttachmentMetadata(organizationId: string, input: unknown): Promise<QuotationAttachmentDTO> { await requireOrganizationRole(organizationId, managers); const userId = await getAuthenticatedUserId(); if (!userId) throw new AuthorizationError("UNAUTHENTICATED"); const value = attachmentInputSchema.parse(input); if (value.ownerType !== "quotation" || value.visibility !== "internal") throw new AuthorizationError("ROLE_REQUIRED"); const { data, error } = await createClient().from("rfq_attachments").insert({ organization_id: organizationId, owner_type: "quotation", owner_id: value.ownerId, storage_bucket: value.storageBucket, storage_path: value.storagePath, original_filename: value.originalFilename, content_type: value.contentType, file_size: value.fileSize, visibility: "internal", uploaded_by: userId }).select().single(); fail(error); if (!data) throw new AuthorizationError("ROLE_REQUIRED"); return attachmentDto(data); }
export async function archiveQuotationAttachmentMetadata(organizationId: string, attachmentId: string): Promise<QuotationAttachmentDTO> { await requireOrganizationRole(organizationId, managers); const { data, error } = await createClient().from("rfq_attachments").update({ archived_at: new Date().toISOString() }).eq("organization_id", organizationId).eq("id", attachmentId).eq("owner_type", "quotation").select().single(); fail(error); if (!data) throw new AuthorizationError("ROLE_REQUIRED"); return attachmentDto(data); }
