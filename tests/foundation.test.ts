import { describe, expect, it } from "vitest";
import { GET as health } from "../app/api/health/route";
import { isAppRole, isInternalRole, APP_ROLES } from "../lib/auth/roles";
import { safeRedirectPath } from "../lib/auth/redirects";
import { clientIp } from "../lib/rate-limit";
import { getSupabasePublicConfig } from "../lib/supabase/env";
import {
  canAssignMembershipRole,
  canPerformOwnerOperation,
  canReadOrganizationMemberships,
  isActiveMembership,
  isMembershipStatus,
  isSelfElevationAttempt,
} from "../lib/auth/membership";
import { authCallbackUrl, customerMembershipDefaults, isCustomerRole, isVerifiedCustomer, passwordRecoveryUrl, SIGN_OUT_REDIRECT_PATH } from "../lib/auth/customer";
import { canManageCustomerData, canReadCustomerData, canSelfLinkCustomer, customerSafeDto, hasSinglePrimaryContact } from "../lib/customers/authorization";
import { customerContactInputSchema, customerInputSchema } from "../lib/customers/validation";

describe("Supabase foundation safety", () => {
  it("uses exactly the approved roles and keeps customer non-internal", () => {
    expect(APP_ROLES).toEqual([
      "owner",
      "admin",
      "operations",
      "purchasing",
      "inspection",
      "finance",
      "customer",
    ]);
    expect(isAppRole("admin")).toBe(true);
    expect(isAppRole("superadmin")).toBe(false);
    expect(isInternalRole("customer")).toBe(false);
    expect(isInternalRole("finance")).toBe(true);
  });

  it("accepts only local redirect paths", () => {
    expect(safeRedirectPath("/dashboard")).toBe("/dashboard");
    expect(safeRedirectPath("https://example.com")).toBe("/dashboard");
    expect(safeRedirectPath("//example.com")).toBe("/dashboard");
  });

  it("does not trust a generic forwarded-for header for rate limiting", () => {
    expect(clientIp(new Request("https://example.test", {
      headers: { "x-forwarded-for": "203.0.113.5" },
    }))).toBe("unknown");
    expect(clientIp(new Request("https://example.test", {
      headers: { "x-nf-client-connection-ip": "203.0.113.5" },
    }))).toBe("203.0.113.5");
  });

  it("fails clearly when Supabase public configuration is missing", () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    expect(() => getSupabasePublicConfig()).toThrow("Supabase is not configured");

    if (url) process.env.NEXT_PUBLIC_SUPABASE_URL = url;
    if (key) process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = key;
  });

  it("returns a non-sensitive health response", async () => {
    const response = await health();
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("keeps membership status and organization access active-only", () => {
    expect(isMembershipStatus("active")).toBe(true);
    expect(isMembershipStatus("suspended")).toBe(true);
    expect(isMembershipStatus("deleted")).toBe(false);
    expect(isActiveMembership("active")).toBe(true);
    expect(isActiveMembership("invited")).toBe(false);
    expect(isActiveMembership("suspended")).toBe(false);
  });

  it("does not allow client-side identity administration to create owners", () => {
    expect(canAssignMembershipRole("owner", "admin")).toBe(true);
    expect(canAssignMembershipRole("admin", "operations")).toBe(true);
    expect(canAssignMembershipRole("admin", "owner")).toBe(false);
    expect(canAssignMembershipRole("customer", "finance")).toBe(false);
    expect(canPerformOwnerOperation("owner")).toBe(true);
    expect(canPerformOwnerOperation("admin")).toBe(false);
  });

  it("separates customer membership visibility and rejects self-elevation", () => {
    expect(canReadOrganizationMemberships("owner")).toBe(true);
    expect(canReadOrganizationMemberships("admin")).toBe(true);
    expect(canReadOrganizationMemberships("customer")).toBe(false);
    expect(isSelfElevationAttempt("user-a", "user-a", "admin")).toBe(true);
    expect(isSelfElevationAttempt("user-a", "user-b", "admin")).toBe(false);
  });

  it("uses local Supabase callback and recovery URLs for customer registration and reset", () => {
    expect(authCallbackUrl("https://kc.example")).toBe("https://kc.example/auth/callback?next=%2Faccount");
    expect(passwordRecoveryUrl("https://kc.example")).toBe("https://kc.example/auth/update-password");
  });

  it("activates only verified customer accounts and never treats internal roles as customer", () => {
    expect(isVerifiedCustomer("2026-07-29T00:00:00Z", "customer")).toBe(true);
    expect(isVerifiedCustomer(null, "customer")).toBe(false);
    expect(isVerifiedCustomer("2026-07-29T00:00:00Z", "admin")).toBe(false);
    expect(isCustomerRole("customer")).toBe(true);
    expect(isCustomerRole("operations")).toBe(false);
    expect(customerMembershipDefaults()).toEqual({ role: "customer", status: "active" });
    expect(SIGN_OUT_REDIRECT_PATH).toBe("/auth/sign-in");
  });

  it("validates the approved customer model and normalizes international identity fields", () => {
    expect(customerInputSchema.parse({ customerType: "company", displayName: "  Example Co  ", preferredCurrency: "usd", countryCode: "sa", status: "lead" })).toMatchObject({ customerType: "company", displayName: "Example Co", preferredCurrency: "USD", countryCode: "SA" });
    expect(customerInputSchema.safeParse({ customerType: "person", displayName: "X" }).success).toBe(false);
    expect(customerInputSchema.safeParse({ customerType: "individual", displayName: "X", status: "deleted" }).success).toBe(false);
  });

  it("supports multiple contacts while enforcing usable contact methods and one primary contact", () => {
    expect(customerContactInputSchema.parse({ fullName: "Ada", email: "ADA@EXAMPLE.COM" })).toMatchObject({ email: "ada@example.com", status: "active" });
    expect(customerContactInputSchema.safeParse({ fullName: "Ada" }).success).toBe(false);
    expect(hasSinglePrimaryContact(0)).toBe(true);
    expect(hasSinglePrimaryContact(1)).toBe(true);
    expect(hasSinglePrimaryContact(2)).toBe(false);
  });

  it("limits customer data by role and strips customer-internal fields from safe DTOs", () => {
    expect(canManageCustomerData("operations")).toBe(true);
    expect(canManageCustomerData("purchasing")).toBe(false);
    expect(canReadCustomerData("finance")).toBe(true);
    expect(canReadCustomerData("customer")).toBe(false);
    expect(canSelfLinkCustomer("customer")).toBe(false);
    expect(customerSafeDto({ id: "customer-1", display_name: "Example", notes: "internal", tax_number: "tax", commercial_registration_number: "cr" })).toEqual({ id: "customer-1", displayName: "Example" });
  });
});
