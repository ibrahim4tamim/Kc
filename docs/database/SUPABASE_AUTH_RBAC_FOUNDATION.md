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

The migration creates `profiles` and `user_roles` only. Every new user receives the `customer` role through a security-definer database trigger. Authenticated users may read their own profile and role, and may update only their own `display_name`; they cannot insert, delete, or change role assignments directly.

The owner bootstrap process, organization/membership model, staff invitations, and production migration process remain owner decisions. They are intentionally not implemented here.

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
