# KC Platform V2 — Unified Roadmap

**Document ID:** KC-V2-009  
**Status:** Proposed  
**Version:** 0.1  
**Prepared On:** 2026-08-08  
**Owner:** Kawalis China  
**Official Branch:** `kc-platform-v2`  
**Parent Documents:** `KC-V2-001 — PLATFORM_BLUEPRINT.md`, `KC-V2-008 — BUSINESS_DOMAIN_MODEL.md`

---

## 1. Purpose

This roadmap provides one ordered view of KC Platform V2 delivery. It connects the approved platform direction and business-domain model to small, reviewable implementation increments.

It is a planning and sequencing document. It does not authorize production deployment, data migration, scope expansion, or bypassing the approvals, RLS review, validation, and test requirements in the active platform documents.

## 2. Delivery Principles

- Build the organization and security boundary before operational records.
- Make each domain addition additive, organization-scoped, auditable, and protected by RLS.
- Preserve the approved hierarchy: Organization → Customer → RFQ → RFQ Item → Supplier Candidate.
- Complete one useful operational slice at a time; do not create competing sources of truth.
- Keep the dashboard as the sole internal operational interface and Supabase as the operational system of record.
- Treat customer-visible information as an explicit publishing decision, never as a side effect of internal work.

## 3. Current Baseline

The following foundation increments have been committed on `kc-platform-v2`:

| Increment | Outcome | Status |
|---|---|---|
| Sprint 1 | Supabase authentication and organization/RBAC foundation | Complete |
| Sprint 2A | Organization membership and owner bootstrap | Complete |
| Sprint 2B | Customer identity and customer-contact foundation | Complete |
| Sprint 2C | RFQ workspace and RFQ-item foundation | Complete |
| Sprint 2D | Supplier master data and supplier-candidate foundation | Complete |
| Sprint 2E | Supplier request and response foundation | Complete |

The latest completed increment is `f84bbce — feat: add supplier request and response foundation`.

## 4. Delivery Sequence

### Phase 1 — Secure operating foundation

**Objective:** establish authenticated, organization-scoped access and the customer/RFQ workspace.

**Includes:** authentication, roles, organization membership, customers, contacts, RFQs, and RFQ items.

**Exit criteria:** authorized team members can create and work within organization-scoped customer and RFQ records; unauthorized access is denied and covered by tests.

**Status:** complete through the current foundation scope.

### Phase 2 — Supplier sourcing foundation

**Objective:** enable repeatable sourcing work for each RFQ item without mixing supplier master data with transaction data.

**Includes:** supplier master data, supplier candidates, supplier requests, and supplier responses.

**Exit criteria:** a team member can identify a supplier, associate it with one RFQ item, send or record a structured request, and record a response with traceable ownership.

**Status:** complete through Sprint 2E.

### Phase 3 — Commercial comparison and selection

**Objective:** turn supplier responses into controlled, comparable commercial decisions.

**Planned increments:**

1. Immutable quotation versions, including structured commercial terms and source attachments.
2. Supplier-evaluation dimensions: Commercial, Technical, Reliability, and Strategic.
3. Candidate decision workflow, status history, selection evidence, and winner designation.
4. Internal comparison workspace and explicit customer-visible quotation publishing.

**Exit criteria:** the team can preserve quotation history, compare candidates, document a decision, and share only approved information with a customer.

### Phase 4 — Sample and quality workflow

**Objective:** manage sample evidence and product-quality decisions before purchase.

**Planned increments:** sample lifecycle, sample attachments, approval/rejection evidence, and inspection records with findings and supporting media.

**Exit criteria:** sample and inspection outcomes remain traceable to the relevant supplier candidate, RFQ item, and decision.

### Phase 5 — Purchase and financial control

**Objective:** convert the approved sourcing decision into controlled purchase execution.

**Planned increments:** purchase orders, supplier-payment milestones, customer-payment visibility, production tracking, and commercial-document ownership.

**Exit criteria:** an approved supplier decision can produce a traceable purchase record without rewriting sourcing history.

### Phase 6 — Shipping, delivery, and closure

**Objective:** give the team and customer a reliable execution trail from shipment to final delivery.

**Planned increments:** shipment records, transport and document tracking, customs and delivery status, delivery confirmation, closure, and feedback.

**Exit criteria:** an RFQ can be progressed to completion with source records and an understandable customer-facing status.

### Phase 7 — Cross-cutting operational maturity

**Objective:** strengthen the platform after the core journey is operational.

**Planned increments:** unified RFQ activity timeline, attachments and storage policies, notification rules, reporting, data-quality controls, audit review, and performance hardening.

**Exit criteria:** cross-cutting functions derive from authoritative source records and do not replace them.

## 5. Required Gate for Every Increment

Before an increment is considered complete, it must have:

- a scoped task with clear business ownership and acceptance criteria;
- additive database changes with organization scope and RLS review;
- server-side authorization and input validation;
- tests for the intended behavior and access boundary;
- non-production verification; and
- updated technical or domain documentation when the entity meaning, workflow, or boundary changes.

## 6. Explicitly Deferred

The roadmap does not schedule autonomous supplier outreach, automatic commercial decisions, customer access to internal supplier or decision data, or production deployment. These require separate approved scope and controls.

## 7. Change Control

This roadmap must be updated when an increment is completed, reprioritized, split, or materially re-scoped. Any conflict with an active platform document must be resolved by revising and approving the affected governing document before implementation proceeds.

## 8. Related Documents

- `KC-V2-001 — PLATFORM_BLUEPRINT.md`
- `KC-V2-002 — ARCHITECTURE.md`
- `KC-V2-003 — DATA_STRATEGY.md`
- `KC-V2-006 — DEVELOPMENT_RULES.md`
- `KC-V2-007 — GIT_WORKFLOW.md`
- `KC-V2-008 — BUSINESS_DOMAIN_MODEL.md`
