import type { AppRole } from "../supabase/types";

export function canReadCustomerData(role: AppRole | null): boolean {
  return role === "owner" || role === "admin" || role === "operations" || role === "purchasing" || role === "inspection" || role === "finance";
}

export function canManageCustomerData(role: AppRole | null): boolean {
  return role === "owner" || role === "admin" || role === "operations";
}

export function canSelfLinkCustomer(role: AppRole | null): boolean {
  return false;
}

export function hasSinglePrimaryContact(primaryCount: number): boolean {
  return primaryCount <= 1;
}

export function customerSafeDto<T extends { id: string; display_name: string; notes: string | null; tax_number: string | null; commercial_registration_number: string | null }>(customer: T) {
  return { id: customer.id, displayName: customer.display_name };
}
