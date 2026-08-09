import "server-only";
import { AuthorizationError, getAuthenticatedUserId, requireOrganizationRole } from "@/lib/auth/server";
import { attachmentInputSchema } from "@/lib/rfqs/validation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, Database, PaymentScheduleType } from "@/lib/supabase/types";
import { paymentRecordSchema, paymentScheduleSchema, type PaymentRecordInput, type PaymentScheduleInput } from "./validation";

const managers: readonly AppRole[] = ["owner", "admin", "finance"];
const readers: readonly AppRole[] = [...managers, "operations", "purchasing", "inspection"];
const fail = (error: unknown) => { if (error) throw new AuthorizationError("ROLE_REQUIRED"); };
type Schedule = Database["public"]["Tables"]["payment_schedules"]["Row"];
type PaymentRecordRow = Database["public"]["Tables"]["payment_records"]["Row"];

export type PaymentScheduleDTO = { id: string; purchaseOrderId: string; sequenceNumber: number; paymentType: PaymentScheduleType; expectedAmount: number; currency: string; dueDate: string | null; archivedAt: string | null; paidAmount: number; remainingAmount: number; state: "pending" | "partially_paid" | "paid" | "overdue"; overdue: boolean };
export type PaymentRecordDTO = { id: string; purchaseOrderId: string; paymentScheduleId: string | null; supplierId: string; amount: number; currency: string; paidAt: string; paymentMethod: string; externalReference: string | null; archivedAt: string | null };
export type PurchaseOrderPaymentSummaryDTO = { purchaseOrderId: string; currency: string; poTotal: number; scheduledTotal: number; paidTotal: number; outstandingScheduled: number; remainingPoBalance: number; completionPercentage: number };

const scheduleDto = (row: Schedule, paidAmount = 0): PaymentScheduleDTO => {
  const expectedAmount = Number(row.expected_amount);
  const remainingAmount = Math.max(0, expectedAmount - paidAmount);
  const overdue = Boolean(row.due_date) && new Date(`${row.due_date}T23:59:59.999Z`) < new Date() && remainingAmount > 0;
  return { id: row.id, purchaseOrderId: row.purchase_order_id, sequenceNumber: row.sequence_number, paymentType: row.payment_type, expectedAmount, currency: row.currency, dueDate: row.due_date, archivedAt: row.archived_at, paidAmount, remainingAmount, state: overdue ? "overdue" : paidAmount === 0 ? "pending" : remainingAmount === 0 ? "paid" : "partially_paid", overdue };
};
const recordDto = (row: PaymentRecordRow): PaymentRecordDTO => ({ id: row.id, purchaseOrderId: row.purchase_order_id, paymentScheduleId: row.payment_schedule_id, supplierId: row.supplier_id, amount: Number(row.amount), currency: row.currency, paidAt: row.paid_at, paymentMethod: row.payment_method, externalReference: row.external_reference, archivedAt: row.archived_at });

async function appendPaymentActivity(org: string, purchaseOrderId: string, eventType: "payment_schedule_created" | "payment_recorded" | "payment_partially_completed" | "payment_completed", title: string, metadata: Record<string, unknown>) {
  const { data, error } = await createClient().from("purchase_orders").select("rfq_id,rfq_item_id").eq("organization_id", org).eq("id", purchaseOrderId).single();
  fail(error); if (!data) throw new AuthorizationError("ROLE_REQUIRED");
  const userId = await getAuthenticatedUserId();
  const { error: activityError } = await createClient().from("rfq_activity_events").insert({ organization_id: org, rfq_id: data.rfq_id, rfq_item_id: data.rfq_item_id, event_type: eventType, title, description: null, visibility: "internal", actor_user_id: userId, metadata });
  fail(activityError);
}

export async function createPaymentSchedule(org: string, input: PaymentScheduleInput) {
  await requireOrganizationRole(org, managers);
  const value = paymentScheduleSchema.parse(input);
  const { data, error } = await createClient().from("payment_schedules").insert({ organization_id: org, purchase_order_id: value.purchaseOrderId, sequence_number: value.sequenceNumber, payment_type: value.paymentType, expected_amount: value.expectedAmount, currency: value.currency, percentage: value.percentage ?? null, due_date: value.dueDate ?? null, description: value.description ?? null, notes_internal: value.notesInternal ?? null }).select().single();
  fail(error); if (!data) throw new AuthorizationError("ROLE_REQUIRED");
  await appendPaymentActivity(org, data.purchase_order_id, "payment_schedule_created", "Payment schedule created", { payment_schedule_id: data.id, sequence_number: data.sequence_number });
  return scheduleDto(data);
}
export async function recordPayment(org: string, input: PaymentRecordInput) {
  await requireOrganizationRole(org, managers);
  const recordedBy = await getAuthenticatedUserId(); if (!recordedBy) throw new AuthorizationError("UNAUTHENTICATED");
  const value = paymentRecordSchema.parse(input);
  const { data, error } = await createClient().from("payment_records").insert({ organization_id: org, purchase_order_id: value.purchaseOrderId, payment_schedule_id: value.paymentScheduleId ?? null, supplier_id: value.supplierId, amount: value.amount, currency: value.currency, paid_at: value.paidAt, payment_method: value.paymentMethod, external_reference: value.externalReference ?? null, notes_internal: value.notesInternal ?? null, recorded_by: recordedBy }).select().single();
  fail(error); if (!data) throw new AuthorizationError("ROLE_REQUIRED");
  const summary = await getPurchaseOrderPaymentSummary(org, data.purchase_order_id);
  const eventType = summary.remainingPoBalance === 0 ? "payment_completed" : summary.paidTotal > 0 ? "payment_partially_completed" : "payment_recorded";
  await appendPaymentActivity(org, data.purchase_order_id, eventType, eventType.replaceAll("_", " "), { payment_record_id: data.id, amount: Number(data.amount), currency: data.currency });
  return recordDto(data);
}
export async function listPaymentSchedulesForPO(org: string, purchaseOrderId: string): Promise<PaymentScheduleDTO[]> {
  await requireOrganizationRole(org, readers);
  const client = createClient();
  const [{ data: schedules, error: schedulesError }, { data: records, error: recordsError }] = await Promise.all([client.from("payment_schedules").select().eq("organization_id", org).eq("purchase_order_id", purchaseOrderId).is("archived_at", null).order("sequence_number"), client.from("payment_records").select("payment_schedule_id,amount").eq("organization_id", org).eq("purchase_order_id", purchaseOrderId).is("archived_at", null)]);
  fail(schedulesError); fail(recordsError);
  const paidBySchedule = new Map<string, number>();
  for (const record of records ?? []) if (record.payment_schedule_id) paidBySchedule.set(record.payment_schedule_id, (paidBySchedule.get(record.payment_schedule_id) ?? 0) + Number(record.amount));
  return (schedules ?? []).map(schedule => scheduleDto(schedule, paidBySchedule.get(schedule.id) ?? 0));
}
export async function listPaymentsForPO(org: string, purchaseOrderId: string) { await requireOrganizationRole(org, readers); const { data, error } = await createClient().from("payment_records").select().eq("organization_id", org).eq("purchase_order_id", purchaseOrderId).is("archived_at", null).order("paid_at", { ascending: false }); fail(error); return (data ?? []).map(recordDto); }
export async function archivePaymentSchedule(org: string, id: string) { await requireOrganizationRole(org, managers); const { data, error } = await createClient().from("payment_schedules").update({ archived_at: new Date().toISOString() }).eq("organization_id", org).eq("id", id).is("archived_at", null).select().single(); fail(error); if (!data) throw new AuthorizationError("ROLE_REQUIRED"); return scheduleDto(data); }
export async function archivePaymentRecord(org: string, id: string) { await requireOrganizationRole(org, managers); const { data, error } = await createClient().from("payment_records").update({ archived_at: new Date().toISOString() }).eq("organization_id", org).eq("id", id).is("archived_at", null).select().single(); fail(error); if (!data) throw new AuthorizationError("ROLE_REQUIRED"); return recordDto(data); }
export async function getPurchaseOrderPaymentSummary(org: string, purchaseOrderId: string): Promise<PurchaseOrderPaymentSummaryDTO> {
  await requireOrganizationRole(org, readers); const client = createClient();
  const [{ data: order, error: orderError }, { data: items, error: itemsError }, { data: schedules, error: schedulesError }, { data: records, error: recordsError }] = await Promise.all([client.from("purchase_orders").select("currency").eq("organization_id", org).eq("id", purchaseOrderId).single(), client.from("purchase_order_items").select("line_total").eq("organization_id", org).eq("purchase_order_id", purchaseOrderId).is("archived_at", null), client.from("payment_schedules").select("expected_amount").eq("organization_id", org).eq("purchase_order_id", purchaseOrderId).is("archived_at", null), client.from("payment_records").select("amount").eq("organization_id", org).eq("purchase_order_id", purchaseOrderId).is("archived_at", null)]);
  fail(orderError); fail(itemsError); fail(schedulesError); fail(recordsError); if (!order) throw new AuthorizationError("ROLE_REQUIRED");
  const total = (rows: Array<Record<string, unknown>> | null, key: string) => (rows ?? []).reduce((sum, row) => sum + Number(row[key]), 0);
  const poTotal = total(items, "line_total"), scheduledTotal = total(schedules, "expected_amount"), paidTotal = total(records, "amount");
  return { purchaseOrderId, currency: order.currency, poTotal, scheduledTotal, paidTotal, outstandingScheduled: Math.max(0, scheduledTotal - paidTotal), remainingPoBalance: Math.max(0, poTotal - paidTotal), completionPercentage: poTotal ? Math.min(100, paidTotal / poTotal * 100) : 0 };
}
export type PaymentAttachmentDTO = { id: string; paymentRecordId: string; originalFilename: string; contentType: string; fileSize: number; createdAt: string };
export async function addPaymentAttachmentMetadata(org: string, input: unknown): Promise<PaymentAttachmentDTO> {
  await requireOrganizationRole(org, managers); const uploadedBy = await getAuthenticatedUserId(); if (!uploadedBy) throw new AuthorizationError("UNAUTHENTICATED");
  const value = attachmentInputSchema.parse(input); if (value.ownerType !== "payment_record" || value.visibility !== "internal") throw new AuthorizationError("ROLE_REQUIRED");
  const { data, error } = await createClient().from("rfq_attachments").insert({ organization_id: org, owner_type: "payment_record", owner_id: value.ownerId, storage_bucket: value.storageBucket, storage_path: value.storagePath, original_filename: value.originalFilename, content_type: value.contentType, file_size: value.fileSize, visibility: "internal", uploaded_by: uploadedBy }).select().single();
  fail(error); if (!data) throw new AuthorizationError("ROLE_REQUIRED"); return { id: data.id, paymentRecordId: data.owner_id, originalFilename: data.original_filename, contentType: data.content_type, fileSize: Number(data.file_size), createdAt: data.created_at };
}
export async function archivePaymentAttachmentMetadata(org: string, id: string): Promise<PaymentAttachmentDTO> {
  await requireOrganizationRole(org, managers); const { data, error } = await createClient().from("rfq_attachments").update({ archived_at: new Date().toISOString() }).eq("organization_id", org).eq("id", id).eq("owner_type", "payment_record").is("archived_at", null).select().single();
  fail(error); if (!data) throw new AuthorizationError("ROLE_REQUIRED"); return { id: data.id, paymentRecordId: data.owner_id, originalFilename: data.original_filename, contentType: data.content_type, fileSize: Number(data.file_size), createdAt: data.created_at };
}
