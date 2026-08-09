# KC Platform V2 — Technical Implementation Roadmap

**Document ID:** KC-V2-009  
**Status:** Active
**Version:** 1.0
**Owner:** Kawalis China  
**Official Branch:** `kc-platform-v2`

## 1. Current State

- **Project Status:** PAUSED
- **Current Milestone:** Execution Workflow — IN PROGRESS
- **Last Completed Sprint:** Sprint 3A — Payments Foundation
- **Resume Point:** Sprint 3B — Production Tracking Foundation
- **Approved baseline:** `43b15bdfad1eb9ae043db915675eeab160ed7967` on `kc-platform-v2`.

## 2. Frozen Architecture Principles

1. KC Dashboard is the sole operational interface.
2. Supabase is the authoritative operational source of truth.
3. Notion is for planning, documentation, SOPs, decisions, and project visibility only.
4. GitHub is the technical source of truth.
5. Operational workflows must never depend on Notion.
6. Development continues through isolated, reviewable sprints.
7. Do not redesign completed foundations without a proven architectural defect.

## 3. Milestones

### Milestone 1 — Foundation — COMPLETE

Supabase foundation; Authentication; RBAC; Organizations; Memberships; Customer authentication/onboarding; Customer master data and contacts; RFQ and RFQ Items; RFQ attachments/activity foundation; Supplier master data, contacts, and certificates; Supplier Candidates; Supplier Requests; Supplier Responses.

### Milestone 2 — Commercial Workflow — COMPLETE

- **Sprint 2F — Quotation Foundation:** approved.
- **Sprint 2G — Quote Comparison & Supplier Selection:** approved.
- **Sprint 2H — Purchase Orders:** approved.

### Milestone 3 — Execution Workflow — IN PROGRESS

Sprint 3A — Payments Foundation is complete. Production Tracking, Inspection, Shipment, and Delivery have not started. Resume with Sprint 3B — Production Tracking Foundation.

### Milestone 4 — Customer Portal

### Milestone 5 — Internal Operations

### Milestone 6 — Reports & Intelligence

### Milestone 7 — Production Release

## 4. Sprint History

| Sprint | Status |
| --- | --- |
| 1A through 2E | Approved |
| 2F | Approved |
| 2G | Approved |
| 2H | Approved |
| 3A — Payments Foundation | Complete |
| 3B — Production Tracking Foundation | Resume point; not started |

## 5. Delivery Rule

Every sprint remains additive, organization-scoped, RLS-protected, server-authorized, validated, tested, documented, and reviewable before it is committed. This roadmap does not authorize production deployment, live migration, or scope expansion.

## 6. Related Documents

- `KC-V2-001 — PLATFORM_BLUEPRINT.md`
- `KC-V2-002 — ARCHITECTURE.md`
- `KC-V2-003 — DATA_STRATEGY.md`
- `KC-V2-006 — DEVELOPMENT_RULES.md`
- `KC-V2-008 — BUSINESS_DOMAIN_MODEL.md`
- `PROJECT_CHECKPOINT.md`
