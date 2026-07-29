import { MEMBERSHIP_STATUSES, type AppRole, type MembershipStatus } from "../supabase/types";

export { MEMBERSHIP_STATUSES };

export function isMembershipStatus(value: unknown): value is MembershipStatus {
  return typeof value === "string" && MEMBERSHIP_STATUSES.includes(value as MembershipStatus);
}

export function isActiveMembership(status: MembershipStatus): boolean {
  return status === "active";
}

export function canReadOrganizationMemberships(role: AppRole): boolean {
  return role === "owner" || role === "admin";
}

export function canAssignMembershipRole(actorRole: AppRole, nextRole: AppRole): boolean {
  if (nextRole === "owner") return false;
  return actorRole === "owner" || actorRole === "admin";
}

export function canPerformOwnerOperation(role: AppRole): boolean {
  return role === "owner";
}

export function isSelfElevationAttempt(
  actorUserId: string,
  targetUserId: string,
  nextRole: AppRole
): boolean {
  return actorUserId === targetUserId && nextRole !== "customer";
}
