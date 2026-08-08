# Quote Comparison & Supplier Selection Foundation

**Scope:** Sprint 2G, KC Platform V2
**Status:** Active implementation foundation

## Comparison

The comparison is a server-only, organization-scoped read model for the current eligible quotation of each supplier candidate on one RFQ Item. Eligible quotations are the latest non-archived version with status `received`, `under_review`, or `accepted`. Draft, rejected, superseded, and archived versions remain historical records and are not current comparison offers.

Comparison reports the quotation count and `comparisonReady` at three or more eligible quotations. Three is an operational target, never a database minimum. It exposes original currency and sets `currencyMismatch` when multiple currencies are present; no exchange-rate conversion or implicit cross-currency price comparison occurs.

Deterministic facts include lowest unit price within the same currency, highest/lowest MOQ, shortest lead time, validity, Incoterm, payment terms, and commercial line totals. These facts are not recommendations, scoring, or an automatic selection.

## Human supplier selection

`supplier_selections` is the formal, append-preserving decision record. It references the same organization, RFQ, RFQ Item, supplier candidate, supplier, and current eligible quotation. The database function derives the user from `auth.uid()`, verifies active manager membership and all entity relationships, and requires a selection reason.

One RFQ Item has at most one active selection through a partial unique index. Replacement takes an advisory transaction lock, supersedes the prior active record, creates the new record, and appends the corresponding timeline event atomically. A selection below three eligible quotations requires an explicit justification. Cancellation preserves the record and appends an internal cancellation event. There is no hard-delete path.

## Access, RLS, and timeline

Owner, admin, operations, and purchasing manage selections. Inspection and finance can read comparisons and selections. Customer and anonymous users have no access. RLS is enabled on the persisted selection table, with no DELETE policy or grant. Shared server helpers return explicit comparison and selection DTOs only.

The existing RFQ Activity Timeline receives `quote_comparison_reviewed`, `supplier_selected`, `supplier_selection_changed`, and `supplier_selection_cancelled` as internal-only events. No customer DTO or customer visibility is created.

## Sprint 2H readiness

The active supplier selection and immutable quotation reference provide the commercial decision input for a future Purchase Order foundation. Purchase Orders, FX conversion, scoring, and notifications remain deferred.
