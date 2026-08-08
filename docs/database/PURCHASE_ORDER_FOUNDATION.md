# Purchase Order Foundation

**Scope:** Sprint 2H, KC Platform V2
**Status:** Active implementation foundation

A Purchase Order is an internal, organization-scoped purchasing instruction created only from an active Supplier Selection. It traces the RFQ, RFQ Item, supplier, candidate, selection, eligible quotation, and quotation version.

The creation RPC derives the actor from `auth.uid()`, verifies active management membership and selection/quotation consistency, creates a human-readable `KC-PO-YYYY-XXXXXXXX` reference, and snapshots the selected quotation line terms. The snapshot preserves quantity, unit price, currency, lead time, MOQ, packaging, and product description, so later quotation revisions cannot alter the PO agreement.

PO statuses are `draft`, `approved`, `issued`, `acknowledged`, `cancelled`, `superseded`, and `archived`. Drafts are editable by internal managers. Approval captures approver and timestamp. Approved/issued and historical POs cannot silently change commercial terms; revisions, payments, production, inspection, shipping, and customer visibility remain separate future work.

Attachments reuse `rfq_attachments` as internal metadata with `purchase_order` ownership. They expose safe filename/type/size DTOs only, never storage paths. The RFQ timeline is reused for internal PO creation, approval, issue, revision, and cancellation events.

RLS allows manager operations and finance/inspection reads; customer and anonymous access are denied. There is no DELETE policy, grant, or helper. All shared server operations return explicit PO, PO item, attachment, or history DTOs.
