# Organization Membership and Owner Bootstrap Foundation

## Scope and authority

Sprint 1B adds the minimum organization tenancy boundary for KC Platform V2. `organization_memberships` is the sole authoritative source for a user's role within an organization. `profiles` remains identity metadata only. The former `user_roles` table is retained without client grants as a non-destructive compatibility record and must not be used for authorization.

No organization membership is created automatically when a user authenticates. This prevents unknown users from gaining customer or staff access by default. Customer onboarding, staff invitation delivery, owner transfer, and active-organization switching UX remain separate decisions.

## Schema and RLS

- `organizations` stores an immutable UUID, name, normalized lowercase kebab-case slug, active/archived status, and timestamps.
- `organization_memberships` connects one `auth.users`-backed profile to one organization with exactly one approved role and an `active`, `invited`, or `suspended` status. `(organization_id, user_id)` is unique.
- Both tables have RLS enabled. Anonymous roles receive no grants. Active members may read only their own organization and membership; owners and admins may read memberships in their organization. No browser client can insert, update, or delete either table.
- The security-definer checks use `auth.uid()`, fixed `search_path`, no client-supplied identity, and are executable only by `authenticated` for boolean policy evaluation. The owner bootstrap function has no application-role execute grant.

## Controlled owner bootstrap

First create the target user through the approved Supabase Auth process. Then, as a database administrator in a reviewed non-production environment, run:

```text
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 \
  -v target_user_id='AUTH_USER_UUID' \
  -v organization_name='Kawalis China' \
  -v organization_slug='kawalis-china' \
  -f supabase/bootstrap/owner-bootstrap.sql
```

The script invokes a database-admin-only function that verifies the auth user, validates the slug, creates the organization only when absent, refuses a second active owner, and refuses a duplicate membership. It is never called by application startup or browser code.

If the operation must be recovered before any production use, remove the newly created membership and, only when it has no dependent memberships or operational records, archive the organization in a separate reviewed transaction. Do not delete an organization as routine recovery.

## Local verification

After installing and starting a local Supabase stack, apply migrations and run the policy checks in a disposable database:

```text
supabase start
supabase db reset
supabase db lint
npm test
```

Do not link, push, or execute these migrations against a remote production project without explicit approval.

## Deferred decisions

- Customer self-registration and customer membership assignment policy.
- Staff invitation delivery provider and acceptance flow.
- Explicit multi-organization selection UX.
- Protected owner transfer and last-owner recovery process.
- Production Supabase project provisioning and migration runbook.
