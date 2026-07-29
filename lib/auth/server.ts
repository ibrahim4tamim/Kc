import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "./roles";
import type { Database } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";

type Membership = Database["public"]["Tables"]["organization_memberships"]["Row"];
type Organization = Database["public"]["Tables"]["organizations"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export class AuthorizationError extends Error {
  constructor(
    public readonly code: "UNAUTHENTICATED" | "MEMBERSHIP_REQUIRED" | "ROLE_REQUIRED" | "ORGANIZATION_SELECTION_REQUIRED"
  ) {
    super(code);
  }
}

export async function getAuthenticatedUserId(): Promise<string | null> {
  const user = await getAuthenticatedUser();
  return user?.id ?? null;
}

export async function getAuthenticatedUser(): Promise<User | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new AuthorizationError("MEMBERSHIP_REQUIRED");
  return data;
}

export async function getActiveMemberships(): Promise<Membership[]> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("organization_memberships")
    .select("id, organization_id, user_id, role, status, created_at, updated_at")
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) throw new AuthorizationError("MEMBERSHIP_REQUIRED");
  return data ?? [];
}

export async function getSingleActiveMembership(): Promise<Membership | null> {
  const memberships = await getActiveMemberships();
  return memberships.length === 1 ? memberships[0] : null;
}

export async function getCurrentOrganization(): Promise<Organization | null> {
  const membership = await getSingleActiveMembership();
  if (!membership) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("id, name, slug, status, created_at, updated_at")
    .eq("id", membership.organization_id)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw new AuthorizationError("MEMBERSHIP_REQUIRED");
  return data;
}

export async function getCurrentAuthContext(): Promise<{
  userId: string | null;
  role: AppRole | null;
}> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { userId: null, role: null };
  const membership = await getSingleActiveMembership();
  return { userId, role: membership?.role ?? null };
}

export async function requireOrganizationMembership(organizationId: string): Promise<Membership> {
  const userId = await getAuthenticatedUserId();
  if (!userId) throw new AuthorizationError("UNAUTHENTICATED");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("organization_memberships")
    .select("id, organization_id, user_id, role, status, created_at, updated_at")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) throw new AuthorizationError("MEMBERSHIP_REQUIRED");
  return data;
}

export async function requireOrganizationRole(
  organizationId: string,
  allowedRoles: readonly AppRole[]
): Promise<Membership> {
  const membership = await requireOrganizationMembership(organizationId);
  if (!allowedRoles.includes(membership.role)) throw new AuthorizationError("ROLE_REQUIRED");
  return membership;
}
