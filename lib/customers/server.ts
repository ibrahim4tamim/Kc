import "server-only";
import { createClient } from "@/lib/supabase/server";
import { AuthorizationError, getAuthenticatedUserId, requireOrganizationRole } from "@/lib/auth/server";
import type { AppRole, Database } from "@/lib/supabase/types";
import { customerContactInputSchema, customerInputSchema, type CustomerContactInput, type CustomerInput } from "./validation";

const CUSTOMER_MANAGERS: readonly AppRole[] = ["owner", "admin", "operations"];
const CUSTOMER_READERS: readonly AppRole[] = ["owner", "admin", "operations", "purchasing", "inspection", "finance"];
type Customer = Database["public"]["Tables"]["customers"]["Row"];
type Contact = Database["public"]["Tables"]["customer_contacts"]["Row"];

async function requireManager(organizationId: string) { return requireOrganizationRole(organizationId, CUSTOMER_MANAGERS); }

export async function createCustomer(organizationId: string, input: CustomerInput): Promise<Customer> {
  await requireManager(organizationId);
  const userId = await getAuthenticatedUserId();
  if (!userId) throw new AuthorizationError("UNAUTHENTICATED");
  const value = customerInputSchema.parse(input);
  const supabase = createClient();
  const { data, error } = await supabase.from("customers").insert({ organization_id: organizationId, customer_type: value.customerType, display_name: value.displayName, legal_name: value.legalName ?? null, status: value.status, preferred_language: value.preferredLanguage ?? null, preferred_currency: value.preferredCurrency ?? null, country_code: value.countryCode ?? null, city: value.city ?? null, website: value.website ?? null, tax_number: value.taxNumber ?? null, commercial_registration_number: value.commercialRegistrationNumber ?? null, notes: value.notes ?? null, created_by: userId }).select().single();
  if (error || !data) throw new AuthorizationError("ROLE_REQUIRED");
  return data;
}

export async function updateCustomer(organizationId: string, customerId: string, input: CustomerInput): Promise<Customer> {
  await requireManager(organizationId);
  const value = customerInputSchema.parse(input);
  const archivedAt = value.status === "archived" ? new Date().toISOString() : null;
  const supabase = createClient();
  const { data, error } = await supabase.from("customers").update({ customer_type: value.customerType, display_name: value.displayName, legal_name: value.legalName ?? null, status: value.status, preferred_language: value.preferredLanguage ?? null, preferred_currency: value.preferredCurrency ?? null, country_code: value.countryCode ?? null, city: value.city ?? null, website: value.website ?? null, tax_number: value.taxNumber ?? null, commercial_registration_number: value.commercialRegistrationNumber ?? null, notes: value.notes ?? null, archived_at: archivedAt }).eq("id", customerId).eq("organization_id", organizationId).select().single();
  if (error || !data) throw new AuthorizationError("ROLE_REQUIRED");
  return data;
}

export async function archiveCustomer(organizationId: string, customerId: string): Promise<Customer> {
  await requireManager(organizationId);
  const { data, error } = await createClient().from("customers").update({ status: "archived", archived_at: new Date().toISOString() }).eq("id", customerId).eq("organization_id", organizationId).select().single();
  if (error || !data) throw new AuthorizationError("ROLE_REQUIRED");
  return data;
}

export async function createCustomerContact(organizationId: string, customerId: string, input: CustomerContactInput): Promise<Contact> {
  await requireManager(organizationId);
  const userId = await getAuthenticatedUserId();
  if (!userId) throw new AuthorizationError("UNAUTHENTICATED");
  const value = customerContactInputSchema.parse(input);
  const supabase = createClient();
  const { data, error } = await supabase.from("customer_contacts").insert({ organization_id: organizationId, customer_id: customerId, full_name: value.fullName, job_title: value.jobTitle ?? null, email: value.email ?? null, phone: value.phone ?? null, whatsapp: value.whatsapp ?? null, is_primary: false, status: value.status, preferred_language: value.preferredLanguage ?? null, notes: value.notes ?? null, created_by: userId }).select().single();
  if (error || !data) throw new AuthorizationError("ROLE_REQUIRED");
  if (value.isPrimary) await setPrimaryCustomerContact(organizationId, customerId, data.id);
  return data;
}

export async function setPrimaryCustomerContact(organizationId: string, customerId: string, contactId: string): Promise<void> {
  await requireManager(organizationId);
  const { error } = await createClient().rpc("set_primary_customer_contact", { target_customer_id: customerId, target_contact_id: contactId });
  if (error) throw new AuthorizationError("ROLE_REQUIRED");
}

export async function updateCustomerContact(organizationId: string, customerId: string, contactId: string, input: CustomerContactInput): Promise<Contact> {
  await requireManager(organizationId);
  const value = customerContactInputSchema.parse(input);
  const archivedAt = value.status === "archived" ? new Date().toISOString() : null;
  const { data, error } = await createClient().from("customer_contacts").update({ full_name: value.fullName, job_title: value.jobTitle ?? null, email: value.email ?? null, phone: value.phone ?? null, whatsapp: value.whatsapp ?? null, status: value.status, preferred_language: value.preferredLanguage ?? null, notes: value.notes ?? null, archived_at: archivedAt }).eq("id", contactId).eq("customer_id", customerId).eq("organization_id", organizationId).select().single();
  if (error || !data) throw new AuthorizationError("ROLE_REQUIRED");
  if (value.isPrimary && value.status === "active") await setPrimaryCustomerContact(organizationId, customerId, contactId);
  return data;
}

export async function listOrganizationCustomers(organizationId: string): Promise<Customer[]> {
  await requireOrganizationRole(organizationId, CUSTOMER_READERS);
  const { data, error } = await createClient().from("customers").select().eq("organization_id", organizationId).is("archived_at", null);
  if (error) throw new AuthorizationError("ROLE_REQUIRED");
  return data ?? [];
}

export async function linkCustomerProfile(organizationId: string, customerId: string, profileId: string): Promise<void> {
  await requireManager(organizationId);
  const { error } = await createClient().rpc("link_customer_profile", { target_customer_id: customerId, target_profile_id: profileId });
  if (error) throw new AuthorizationError("ROLE_REQUIRED");
}

export async function getLinkedCustomerForCurrentUser() {
  const { data, error } = await createClient().rpc("get_my_customer");
  if (error) throw new AuthorizationError("MEMBERSHIP_REQUIRED");
  return data[0] ?? null;
}
