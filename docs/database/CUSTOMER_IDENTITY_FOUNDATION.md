# Customer Identity Foundation

Customer registration uses Supabase Auth `signUp` with an email-confirmation callback to `/auth/callback?next=/account`. Supabase Email Confirmations must be enabled in every environment; an account is not active in the application until `email_confirmed_at` is present.

After a confirmed Auth user is inserted or updated, the `handle_verified_customer` database trigger creates a single active `customer` membership in the active `kawalis-china` platform organization. It is idempotent through the membership unique constraint and `on conflict do nothing`; it never changes an existing membership, including staff or suspended memberships.

The platform organization must be created first through the reviewed owner bootstrap process. If it is absent, confirmation grants no membership and the account remains pending rather than guessing a tenant.

Password reset uses `resetPasswordForEmail` and Supabase's recovery session before calling `updateUser`. No service-role key or browser role mutation is used. Customer onboarding, invitation delivery, and multi-organization selection remain deferred.
