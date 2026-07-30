# Customer and Contact Data Foundation

Sprint 2A creates one organization-scoped `customers` model for both `individual` and `company` parties. A company can have multiple contacts; an individual uses the same model and may also have contacts. Customer states are `lead`, `active`, `inactive`, and `archived`; contact states are `active`, `inactive`, and `archived`. Archival is represented by matching status and `archived_at`; ordinary users have no delete policy.

`customer_contacts` uses a composite foreign key to `customers(id, organization_id)`, preventing a contact from referencing a customer in another organization. A partial unique index permits at most one unarchived primary contact per customer. Contacts require email, phone, or WhatsApp, but no method is globally unique.

`customers.profile_id` is optional: staff may create customers without an Auth account. Linking requires the protected `link_customer_profile` database function, which verifies both staff manager authority and an active same-organization `customer` membership. Customers cannot self-link or claim legacy records. Legacy RFQ linking is deferred.

Customers receive no base-table access. Safe customer data and contacts are returned only by no-argument security-definer functions that derive identity from `auth.uid()` and omit internal notes and commercial identifiers. Internal roles use RLS: owner/admin/operations manage; purchasing/inspection/finance read only.

Local validation after starting an isolated Supabase environment:

```text
supabase start
supabase db reset
supabase db lint
npm test
```

Do not run these migrations against a remote project without approved migration and rollback review.
