# RFQ Core Foundation

Sprint 2B establishes the authoritative V2 RFQ workspace. One RFQ belongs to one organization and one customer, may select a contact proven by composite foreign keys to belong to that customer, and may contain one or more independently numbered items. It is not connected to the legacy public MVP.

## Lifecycle and reference

RFQs use only the approved `draft`, `submitted`, `under_review`, `sourcing`, `awaiting_customer`, `approved`, `cancelled`, `completed`, and `archived` states, plus low/normal/high/urgent priority. Archival is the ordinary removal mechanism. `KC-RFQ-YYYY-XXXXXXXX` is database-generated from randomness, database-unique, stable, and contains no sequential or tenant identifier. A legacy reference mapping is deferred to a separately approved migration.

## Items, attachments, and activity

Items retain requested-product context, support one or many items, and are bound by a composite RFQ/organization foreign key. Supplier and product-master relationships are deliberately deferred. `rfq_attachments` stores metadata only for `rfq` and `rfq_item` owners; object storage, signed delivery, and Storage policies require a linked local Supabase project and are deferred. `rfq_activity_events` allows only append operations by managers and uses an explicit customer/internal visibility value.

## Access and validation

Owner, admin, and operations manage RFQs, items, metadata, and activity in their active organization. Purchasing, inspection, and finance are read-only. Customers have no base-table policy: security-definer functions project only records owned by their explicitly linked customer, omit internal notes, storage paths, metadata, and staff fields, and filter customer visibility. All tables have RLS; anonymous access and ordinary delete/update of activity events are absent.

Client inputs are validated with Zod; the database retains enum, range, composite-FK, and uniqueness constraints. Type definitions are manually maintained because no live schema was contacted. Regenerate after local migration with `supabase gen types typescript --local > lib/supabase/types.ts`.

## Local-only validation

No remote migration was run. With a local Supabase stack, validate with `supabase start`, `supabase db reset`, and targeted role/session RLS tests. Do not connect this command sequence to production. The legacy Notion adapter, public submission flow, tracking, quote feedback, and Netlify Blob behavior remain unchanged; no dual-write exists.
