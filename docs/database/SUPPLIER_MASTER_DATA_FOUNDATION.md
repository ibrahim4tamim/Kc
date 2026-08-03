# Supplier Master Data Foundation

Sprint 2C adds organization-scoped supplier master data only. A supplier is independent of RFQs; Supplier Candidates and all sourcing relationships are deferred. Suppliers have company/individual legal forms, multiple approved capabilities, soft archival, contacts with one active primary contact, and metadata-only certificates.

RLS permits owner/admin/operations management and purchasing/inspection/finance reads in their active organization. Customers and anonymous callers have no supplier access. Database grants and policies provide SELECT/INSERT/UPDATE only: ordinary authenticated roles have no DELETE policy or grant. Server-only helpers enforce the same membership roles; DTOs do not expose verification notes, archive metadata, or raw organization implementation details.

Types are manually maintained pending local schema generation. Validate locally only with `supabase start`, `supabase db reset`, `supabase db lint`, and `npm test`; do not run against production.
