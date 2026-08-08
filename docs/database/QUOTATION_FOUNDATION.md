# Quotation Foundation

**Scope:** Sprint 2F, KC Platform V2
**Status:** Active implementation foundation

Quotations are internal commercial records linked to one organization, RFQ, RFQ item, supplier, and supplier candidate. They are not customer-facing and do not replace supplier requests or responses.

## Model and versioning

- `quotations` stores the commercial header: reference, currency, quotation date, validity, payment terms, Incoterm, lead time, MOQ, supplier notes, and internal notes.
- `quotation_items` stores quantity, unit, unit price, generated total, MOQ, packaging, lead-time override, and notes.
- One supplier candidate can have many immutable-numbered quotation versions. `create_quotation_revision` serializes creation with an advisory transaction lock, derives the authenticated member from `auth.uid()`, verifies organization-scoped relationships, supersedes active working versions, creates the next version, and appends the internal RFQ activity event atomically.
- Quotation and line-item hard deletion are not granted. A quotation is archived by status and timestamp.

## Access and boundaries

Owner, admin, operations, and purchasing manage quotations. Inspection and finance read them. Customer and anonymous users have no quotation access. The RLS policy set contains only select, insert, and update policies; there is no delete policy or delete grant.

Server helpers return only `QuotationListDTO`, `QuotationDetailsDTO`, `QuotationItemDTO`, or `QuotationAttachmentDTO`. Supabase rows remain inside the server data layer. Quotation attachments reuse `rfq_attachments` as internal metadata only; binary storage and public paths are outside this foundation.

## Timeline

`quotation_received`, `quotation_revised`, and `quotation_status_changed` are internal RFQ timeline events. They never appear in customer-facing activity RPC output.
