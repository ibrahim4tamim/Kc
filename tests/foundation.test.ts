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
});
