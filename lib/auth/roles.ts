import { APP_ROLES, type AppRole } from "../supabase/types";

export { APP_ROLES, type AppRole };

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && APP_ROLES.includes(value as AppRole);
}

export function isInternalRole(role: AppRole): boolean {
  return role !== "customer";
}
