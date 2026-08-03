# Supplier Request and Response Foundation

Supplier Requests record a specific internal request for a Supplier Candidate; Supplier Responses preserve received supplier information. Responses may be partial or explicitly complete. Overdue is derived at read time when a non-terminal request has a past due date. No provider integration, quotation, sample, or certificate extraction is introduced.

Access is organization-scoped: owner/admin/operations/purchasing manage; inspection/finance read; customers/anonymous users have none. Rows have RLS and no DELETE grants/policies. Types are manually maintained; local validation uses `supabase start`, `supabase db reset`, `supabase db lint`, and `npm test`.
