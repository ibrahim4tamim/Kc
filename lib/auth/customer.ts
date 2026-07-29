import type { AppRole } from "../supabase/types";

export const CUSTOMER_ACCOUNT_PATH = "/account";
export const SIGN_OUT_REDIRECT_PATH = "/auth/sign-in";

export function authCallbackUrl(origin: string, next = CUSTOMER_ACCOUNT_PATH): string {
  const callback = new URL("/auth/callback", origin);
  callback.searchParams.set("next", next);
  return callback.toString();
}

export function passwordRecoveryUrl(origin: string): string {
  return new URL("/auth/update-password", origin).toString();
}

export function isVerifiedCustomer(emailConfirmedAt: string | null | undefined, role: AppRole | null): boolean {
  return Boolean(emailConfirmedAt) && role === "customer";
}

export function isCustomerRole(role: AppRole | null): boolean {
  return role === "customer";
}

export function customerMembershipDefaults() {
  return { role: "customer" as const, status: "active" as const };
}
