import type { AppRole } from "@/lib/supabase/types";

export function canReadRfq(role: AppRole | null) { return role === "owner" || role === "admin" || role === "operations" || role === "purchasing" || role === "inspection" || role === "finance"; }
export function canManageRfq(role: AppRole | null) { return role === "owner" || role === "admin" || role === "operations"; }
export function canAppendRfqActivity(role: AppRole | null) { return canManageRfq(role); }
export function canCustomerReadRfq(linkedCustomerId: string | null, rfqCustomerId: string) { return linkedCustomerId !== null && linkedCustomerId === rfqCustomerId; }

export type CustomerSafeRfq = { id: string; publicReference: string; title: string; description: string | null; status: string; priority: string; preferredCurrency: string | null; destinationCountryCode: string | null; destinationCity: string | null; targetDate: string | null; submittedAt: string | null; closedAt: string | null; createdAt: string; };
export type CustomerSafeRfqItem = { id: string; itemNumber: number; productName: string; description: string | null; specifications: string | null; requestedQuantity: number; unit: string; targetUnitPrice: number | null; targetCurrency: string | null; targetMoq: number | null; targetLeadTimeDays: number | null; customizationRequired: boolean; brandingRequired: boolean; packagingRequired: boolean; sampleRequired: boolean; status: string; priority: string; customerNotes: string | null; createdAt: string; };
export type CustomerSafeAttachment = { id: string; ownerType: string; ownerId: string; originalFilename: string; contentType: string; fileSize: number; createdAt: string; };
export type CustomerSafeActivity = { id: string; rfqItemId: string | null; eventType: string; title: string; description: string | null; occurredAt: string; };
