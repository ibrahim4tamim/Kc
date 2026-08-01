# KC Platform V2 — Business Domain Model

**Document ID:** KC-V2-008
**Status:** Active
**Version:** 1.0
**Approved On:** 2026-08-01
**Approved By:** Kawalis China (Owner)
**Owner:** Kawalis China
**Official Branch:** `kc-platform-v2`
**Parent Documents:** `KC-V2-001 — PLATFORM_BLUEPRINT.md`, `KC-V2-002 — ARCHITECTURE.md`, `KC-V2-003 — DATA_STRATEGY.md`

---

## 1. Purpose

This document defines the approved business-domain model for KC Platform V2. It is the authoritative reference for future business database design and implementation. It defines domain meaning and ownership; it does not itself authorize production migrations, data migration, or business-feature delivery.

## 2. Domain Direction

KC Platform is an import operations platform. The operational workspace for one import project is an **RFQ**. An RFQ is not a product and not merely a quotation request: it is the container for the operational work required to complete that import project.

The approved hierarchy is:

```text
Organization → Customer → RFQ → RFQ Item → Supplier Candidate
                                              ├─ Supplier Requests / Responses
                                              ├─ Quotation Versions
                                              ├─ Samples
                                              └─ Supplier Evaluation

RFQ → Purchase Orders → Inspection → Shipping → Delivery
```

## 3. Customer Model

A Customer is one organization-scoped business party. It may be an `individual` or a `company`; separate authoritative individual or company tables are prohibited. A customer may exist before it has an authenticated portal account.

Customer data supports future RFQs, quotations, purchase orders, payments, shipments, documents, and reporting without making those modules part of this document's implementation authorization.

## 4. Customer Contacts

Every customer may have multiple contacts. Each contact may include name, position, email, phone, WhatsApp, and preferred language. Only one active primary contact is permitted per customer. Individual customers use the same Customer and Customer Contact model and may have one or more contacts where needed.

## 5. RFQ Operational Workspace

An RFQ represents the complete import project and owns its operational lifecycle. Every operational activity belongs to one RFQ through a direct or nested ownership path. An RFQ contains one or more RFQ Items.

## 6. RFQ Items

An RFQ Item represents one requested product within an RFQ. Each item has its own sourcing process and may have multiple supplier candidates. Product master-data implementation, if needed later, must not redefine RFQ Item as an RFQ substitute.

## 7. Supplier Master Data

A Supplier is independent master data. A supplier never belongs to an RFQ and may participate in unlimited RFQs through Supplier Candidates. Supplier identity, capabilities, certifications, and master contacts remain separate from one item's transactional sourcing work.

## 8. Supplier Candidate

A Supplier Candidate represents one Supplier participating in one RFQ Item. It belongs to exactly one RFQ Item and one Supplier. It owns transactional sourcing work for that supplier-item pairing, including supplier requests, supplier responses, quotations, samples, evaluation, and the selection decision.

## 9. Supplier Requests and Responses

Supplier Requests record structured requests sent to a Supplier Candidate. Supplier Responses record the corresponding received information. They preserve source, timing, and operational context; neither replaces immutable quotation versions or supplier communication history.

## 10. Quotation Versions

Every Supplier Candidate may have multiple Quotation Versions. A revised quotation creates a new version; an earlier quotation is never overwritten. Quotation history must remain available for authorized audit and operational review.

## 11. Samples

Samples belong to a Supplier Candidate. Multiple samples are supported. Each sample may record request, shipment, and receipt dates, result, and notes. Sample evidence and attachments belong to the sample, not directly to the RFQ.

## 12. Supplier Evaluation

Supplier evaluation is multidimensional and belongs to the Supplier Candidate in the relevant RFQ Item context. Required dimensions are Commercial, Technical, Reliability, and Strategic. Each dimension has its own score; an overall score is calculated from those dimensions without replacing the individual evidence.

## 13. Decision Workflow

The approved Supplier Candidate workflow is:

```text
Draft → Contacted → Waiting Quotation → Quotation Received → Technical Review
→ Commercial Review → Negotiation → Sample Requested → Sample Received
→ Sample Approved → Final Selection → Winner
```

Alternative endings are `Rejected`, `Lost`, and `On Hold`. Status history and material decisions must be traceable; implementation must not silently overwrite decision evidence.

## 14. Attachment Ownership

Attachments belong to the entity that owns their business meaning, never directly to an RFQ by default. For example: quotation PDFs belong to Quotation Versions; inspection images to Inspections; sample photos to Samples; and certificates to Suppliers. File storage and access follow the entity's organization, role, and customer-visibility boundary.

## 15. Activity Timeline

Operational entities contribute events to one unified RFQ Activity Timeline. Events include supplier contact, quotation receipt, sample request, inspection completion, shipment departure, payment completion, and delivery confirmation. The timeline is an operational history view, not a replacement for source entity records or audit controls.

## 16. Domain Principles

- RFQ is the Operational Workspace.
- Customer is one Business Party model for individuals and companies.
- Supplier is Master Data; Supplier Candidate is Transaction Data.
- Quotation Versions and material business history are immutable rather than overwritten.
- Each business entity has one clear owner entity and organization scope where applicable.
- Operational data belongs to Supabase; Notion remains documentation and knowledge only.
- KC Platform Dashboard is the sole operational interface.
- Customer-visible data is explicitly controlled; internal supplier, commercial, and decision data is not customer-visible by default.
- Domain expansion must preserve existing entity meaning rather than introduce competing sources of truth.

## 17. Implementation Boundaries

This active model authorizes future domain design to align with these meanings, but does not by itself authorize RFQ, supplier, quotation, purchasing, payment, inspection, shipping, delivery, attachment, or timeline implementation. Each module requires an approved scoped task, additive migration, RLS review, validation, tests, and non-production verification.

## 18. Related Documents

- `KC-V2-001 — PLATFORM_BLUEPRINT.md`
- `KC-V2-002 — ARCHITECTURE.md`
- `KC-V2-003 — DATA_STRATEGY.md`
- `KC-V2-006 — DEVELOPMENT_RULES.md`
- `KC-V2-007 — GIT_WORKFLOW.md`
