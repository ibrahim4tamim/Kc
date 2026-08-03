# Supplier Candidate Foundation

Sprint 2D adds an organization-scoped transactional pairing of one Supplier and one RFQ Item. It is not a quotation, supplier communication, evaluation, purchase, attachment, or customer-visible record. A partial unique index prevents duplicate active supplier/RFQ-item pairs; archival preserves history. RLS grants management to owner/admin/operations/purchasing and read-only access to inspection/finance. Customers and anonymous users have no policy, grant, DTO, or server path.

Types are manually maintained. Validate locally with `supabase start`, `supabase db reset`, `supabase db lint`, and `npm test`; do not run remote migrations. Supplier requests, responses, quotations, samples, and evaluations remain deferred.
