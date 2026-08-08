import "server-only";

import { AuthorizationError, getAuthenticatedUserId, requireOrganizationRole } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, Database } from "@/lib/supabase/types";
import type { ComparisonReadinessDTO, QuoteComparisonDTO, QuoteComparisonEntryDTO, SupplierSelectionDTO, SupplierSelectionHistoryDTO } from "./authorization";
import { comparisonReviewSchema, selectionCancellationSchema, supplierSelectionInputSchema, type SupplierSelectionInput } from "./validation";

const managers: readonly AppRole[] = ["owner", "admin", "operations", "purchasing"];
const readers: readonly AppRole[] = [...managers, "inspection", "finance"];
type Quote = Database["public"]["Tables"]["quotations"]["Row"];
type QuoteItem = Database["public"]["Tables"]["quotation_items"]["Row"];
type Selection = Database["public"]["Tables"]["supplier_selections"]["Row"];
const eligibleStatuses = new Set(["received", "under_review", "accepted"]);
const fail = (error: unknown) => { if (error) throw new AuthorizationError("ROLE_REQUIRED"); };
const number = (value: number) => Number(value);

const selectionDto = (row: Selection): SupplierSelectionHistoryDTO => ({ id: row.id, rfqId: row.rfq_id, rfqItemId: row.rfq_item_id, supplierCandidateId: row.supplier_candidate_id, supplierId: row.supplier_id, quotationId: row.quotation_id, selectedByProfileId: row.selected_by_profile_id, selectedAt: row.selected_at, selectionReason: row.selection_reason, fewerThanThreeJustification: row.fewer_than_three_justification, status: row.status, supersededAt: row.superseded_at, cancelledAt: row.cancelled_at, archivedAt: row.archived_at, createdAt: row.created_at, updatedAt: row.updated_at });
const activeSelectionDto = (row: Selection): SupplierSelectionDTO => { const { supersededAt: _supersededAt, cancelledAt: _cancelledAt, archivedAt: _archivedAt, ...dto } = selectionDto(row); return dto; };

async function comparisonRows(organizationId: string, rfqItemId: string): Promise<QuoteComparisonEntryDTO[]> {
  const supabase = createClient();
  const { data: quotes, error: quoteError } = await supabase.from("quotations").select().eq("organization_id", organizationId).eq("rfq_item_id", rfqItemId).is("archived_at", null);
  fail(quoteError);
  const current = (quotes ?? []).filter((quote: Quote) => eligibleStatuses.has(quote.status) && !(quotes ?? []).some((later: Quote) => later.supplier_candidate_id === quote.supplier_candidate_id && later.version_number > quote.version_number && later.archived_at === null));
  const quoteIds = current.map(quote => quote.id);
  if (quoteIds.length === 0) return [];
  const [{ data: items, error: itemError }, { data: suppliers, error: supplierError }] = await Promise.all([
    supabase.from("quotation_items").select().eq("organization_id", organizationId).eq("rfq_item_id", rfqItemId).in("quotation_id", quoteIds),
    supabase.from("suppliers").select("id,display_name").eq("organization_id", organizationId).in("id", current.map(quote => quote.supplier_id)),
  ]);
  fail(itemError); fail(supplierError);
  const itemsByQuote = new Map<string, QuoteItem[]>();
  for (const item of items ?? []) itemsByQuote.set(item.quotation_id, [...(itemsByQuote.get(item.quotation_id) ?? []), item]);
  const supplierNames = new Map((suppliers ?? []).map(supplier => [supplier.id, supplier.display_name]));
  const base = current.map(quote => {
    const lines = itemsByQuote.get(quote.id) ?? [];
    const first = lines[0];
    const total = lines.length ? lines.reduce((sum, line) => sum + number(line.total_price), 0) : null;
    return { quote, first, total };
  });
  const minPrice = new Map<string, number>();
  for (const item of base) if (item.first) minPrice.set(item.quote.currency, Math.min(minPrice.get(item.quote.currency) ?? Infinity, number(item.first.unit_price)));
  const moqs = base.map(item => item.first?.moq ?? item.quote.moq).filter((value): value is number => value !== null && value !== undefined).map(number);
  const leads = base.map(item => item.first?.lead_time_days ?? item.quote.lead_time_days).filter((value): value is number => value !== null && value !== undefined);
  return base.map(({ quote, first, total }) => { const moq = first?.moq ?? quote.moq; const lead = first?.lead_time_days ?? quote.lead_time_days; return { quotationId: quote.id, supplierId: quote.supplier_id, supplierName: supplierNames.get(quote.supplier_id) ?? "", supplierCandidateId: quote.supplier_candidate_id, quotationReference: quote.quotation_reference, quotationVersion: quote.version_number, quotationStatus: quote.status, currency: quote.currency, quantity: first ? number(first.quantity) : null, unit: first?.unit ?? null, unitPrice: first ? number(first.unit_price) : null, totalCommercialAmount: total, moq: moq === null ? null : number(moq), leadTimeDays: lead ?? null, incoterm: quote.incoterm, paymentTerms: quote.payment_terms, quotationDate: quote.quotation_date, validUntil: quote.valid_until, isLowestUnitPriceInCurrency: !!first && number(first.unit_price) === minPrice.get(quote.currency), hasLowestMoq: moq !== null && moq !== undefined && number(moq) === Math.min(...moqs), hasHighestMoq: moq !== null && moq !== undefined && number(moq) === Math.max(...moqs), hasShortestLeadTime: lead !== null && lead !== undefined && lead === Math.min(...leads) }; });
}

export async function getQuoteComparisonForRFQItem(organizationId: string, rfqItemId: string): Promise<QuoteComparisonDTO> { await requireOrganizationRole(organizationId, readers); const entries = await comparisonRows(organizationId, rfqItemId); const currencies = new Set(entries.map(entry => entry.currency)); return { rfqItemId, quotationCount: entries.length, comparisonReady: entries.length >= 3, currencyMismatch: currencies.size > 1, entries }; }
export async function getComparisonReadiness(organizationId: string, rfqItemId: string): Promise<ComparisonReadinessDTO> { const comparison = await getQuoteComparisonForRFQItem(organizationId, rfqItemId); const { entries: _entries, ...readiness } = comparison; return readiness; }

async function recordSelection(organizationId: string, input: SupplierSelectionInput, allowReplacement: boolean): Promise<SupplierSelectionDTO> { await requireOrganizationRole(organizationId, managers); const value = supplierSelectionInputSchema.parse(input); const { data, error } = await createClient().rpc("record_supplier_selection", { target_organization_id: organizationId, target_rfq_id: value.rfqId, target_rfq_item_id: value.rfqItemId, target_supplier_candidate_id: value.supplierCandidateId, target_supplier_id: value.supplierId, target_quotation_id: value.quotationId, target_selection_reason: value.selectionReason, target_fewer_than_three_justification: value.fewerThanThreeJustification ?? null, allow_replacement: allowReplacement }); fail(error); const row = data?.[0]; if (!row) throw new AuthorizationError("ROLE_REQUIRED"); return activeSelectionDto(row); }
export const createSupplierSelection = (organizationId: string, input: SupplierSelectionInput) => recordSelection(organizationId, input, false);
export const replaceSupplierSelection = (organizationId: string, input: SupplierSelectionInput) => recordSelection(organizationId, input, true);
export async function cancelSupplierSelection(organizationId: string, input: unknown): Promise<SupplierSelectionHistoryDTO> { await requireOrganizationRole(organizationId, managers); const value = selectionCancellationSchema.parse(input); const { data, error } = await createClient().rpc("cancel_supplier_selection", { target_organization_id: organizationId, target_selection_id: value.selectionId, target_reason: value.reason }); fail(error); const row = data?.[0]; if (!row) throw new AuthorizationError("ROLE_REQUIRED"); return selectionDto(row); }
export async function getCurrentSupplierSelection(organizationId: string, rfqItemId: string): Promise<SupplierSelectionDTO | null> { await requireOrganizationRole(organizationId, readers); const { data, error } = await createClient().from("supplier_selections").select().eq("organization_id", organizationId).eq("rfq_item_id", rfqItemId).eq("status", "active").maybeSingle(); fail(error); return data ? activeSelectionDto(data) : null; }
export async function listSupplierSelectionHistory(organizationId: string, rfqItemId: string): Promise<SupplierSelectionHistoryDTO[]> { await requireOrganizationRole(organizationId, readers); const { data, error } = await createClient().from("supplier_selections").select().eq("organization_id", organizationId).eq("rfq_item_id", rfqItemId).order("selected_at", { ascending: false }); fail(error); return (data ?? []).map(selectionDto); }
export async function markQuoteComparisonReviewed(organizationId: string, input: unknown): Promise<{ rfqItemId: string; reviewedAt: string }> { await requireOrganizationRole(organizationId, managers); const userId = await getAuthenticatedUserId(); if (!userId) throw new AuthorizationError("UNAUTHENTICATED"); const value = comparisonReviewSchema.parse(input); const reviewedAt = new Date().toISOString(); const { error } = await createClient().from("rfq_activity_events").insert({ organization_id: organizationId, rfq_id: value.rfqId, rfq_item_id: value.rfqItemId, event_type: "quote_comparison_reviewed", title: "Quote comparison reviewed", description: value.notes ?? null, visibility: "internal", actor_user_id: userId, metadata: null }); fail(error); return { rfqItemId: value.rfqItemId, reviewedAt }; }
