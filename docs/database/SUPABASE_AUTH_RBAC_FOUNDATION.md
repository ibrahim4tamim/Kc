# Supabase Auth and RBAC Foundation

## Scope

This foundation adds only Supabase Auth session handling, application profiles, approved roles, and Row-Level Security. It does not migrate Notion data, replace the public MVP, or create operational business tables.

## Local setup

1. Create a local `.env.local` from `.env.example`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from a non-production Supabase project.
3. Apply the versioned migration in `supabase/migrations/` to a new, non-production database after reviewing it.
4. Configure the Supabase Auth redirect URL for `/auth/callback` in that environment.

No service-role key is required for normal browser authentication. Do not add one to client code or any `NEXT_PUBLIC_` variable.

## Database boundary

The initial migration creates `profiles` and the legacy `user_roles` compatibility table. The Sprint 1B organization membership migration keeps automatic profile creation but ends automatic role assignment. `organization_memberships` is now the only authoritative role source; no authenticated user receives a membership automatically. See [ORGANIZATION_MEMBERSHIP_FOUNDATION.md](ORGANIZATION_MEMBERSHIP_FOUNDATION.md) for controlled owner bootstrap, RLS, and deferred onboarding decisions.

## Type generation

`lib/supabase/types.ts` is a temporary contract maintained to match the initial migration. After a local Supabase project is available, replace it with generated types using the approved CLI workflow, for example:

```text
supabase gen types typescript --local > lib/supabase/types.ts
```

Do not run this command against production without approval.

## Current limitations

- The legacy Notion MVP remains the active public persistence layer until a separate approved migration and cutover.
- The current rate limiter remains process-local. It trusts only Netlify's client-IP header and falls back to a shared `unknown` bucket outside that platform; a durable distributed limiter is deferred.
- Netlify configuration remains unchanged. The existing Netlify/Vercel documentation inconsistency requires a separate deployment decision.
