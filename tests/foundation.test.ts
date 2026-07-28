import { describe, expect, it } from "vitest";
import { GET as health } from "../app/api/health/route";
import { isAppRole, isInternalRole, APP_ROLES } from "../lib/auth/roles";
import { safeRedirectPath } from "../lib/auth/redirects";
import { clientIp } from "../lib/rate-limit";
import { getSupabasePublicConfig } from "../lib/supabase/env";

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
});
