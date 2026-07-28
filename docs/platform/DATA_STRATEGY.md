# KC Platform V2 — Data Strategy

**Document ID:** KC-V2-003
**Status:** Active
**Version:** 1.0
**Approved On:** 2026-07-21
**Approved By:** Kawalis China (Owner)
**Owner:** Kawalis China
**Platform:** KC Platform V2
**Official Branch:** `kc-platform-v2`
**Parent Documents:** `KC-V2-001 — PLATFORM_BLUEPRINT.md`, `KC-V2-002 — ARCHITECTURE.md`

---

## 1. Purpose

This document defines the official data strategy for KC Platform V2.

It establishes how platform data is owned, created, classified, stored, accessed, changed, audited, retained, archived, and governed. It is the policy baseline for the future database model, Row-Level Security policies, APIs, migrations, reporting, storage, and integrations.

This document does not create database tables, execute a migration, or approve production data transfer. Detailed schemas, permissions, and migration scripts require separate review and approval.

### Objectives

- Establish one authoritative owner for each class of data.
- Protect customer, supplier, commercial, and operational information.
- Preserve reliable business history and accountability.
- Support gradual migration from the existing MVP.
- Keep the initial platform simple while allowing measured growth.
- Prevent Notion, spreadsheets, files, and external tools from becoming competing transactional databases.
- Give implementation teams clear rules without prematurely freezing a physical schema.

### Scope

This strategy applies to:

- Public website submissions
- Customer and organization records
- Sourcing requests and requested products
- Supplier and quotation workflows
- Customer approvals
- Purchasing, payment, inspection, shipment, and delivery records
- Operational documents and media
- Authentication and authorization data
- Status history, activities, and audit records
- Approved integrations, reporting, exports, and migrations

---

## 2. Data Principles

### 2.1 Single Source of Truth

Every authoritative fact must have one declared system of record. Copies, caches, search indexes, exports, and reporting views may exist, but they must not compete with the authoritative source.

### 2.2 Security and Privacy by Default

Data is private unless explicitly classified otherwise. Access follows least privilege, verified ownership, approved roles, and a legitimate operational purpose.

### 2.3 Integrity Before Convenience

Database constraints, validated state transitions, transactions, and referential integrity take precedence over shortcuts that can create contradictory or orphaned records.

### 2.4 Intentional Customer Visibility

Internal data never becomes customer-visible automatically. Customer-facing records must be explicitly approved and exposed through restricted queries, views, or customer-safe DTOs.

### 2.5 Traceable Business History

Important business actions, approvals, price changes, and status changes must be attributable and reviewable. Historical evidence must not be silently overwritten or discarded.

### 2.6 Data Minimization

Collect, expose, export, and retain only data needed for a defined business, security, contractual, or legal purpose.

### 2.7 Clear Ownership

Each dataset must have a business owner and a technical custodian. Business ownership defines meaning and approved use; technical custody defines implementation, security, and reliability.

### 2.8 Gradual Migration

Migration from the existing MVP and Notion must be staged, reversible where practical, verified, and supported by backups. No destructive migration is authorized by this document.

### 2.9 Simplicity Before Scale

The platform must not add tenant models, warehouses, ledgers, integrations, or reference catalogs before a confirmed requirement exists. Future-readiness must not become premature complexity.

### 2.10 Portability and Auditability

Core operational records must be exportable in documented formats and understandable independently of a single interface or vendor.

---

## 3. System Data Ownership

| System | Authoritative responsibility | Must not own |
|---|---|---|
| Supabase PostgreSQL | Structured operational and transactional data | Source code, SOPs, binary file bodies |
| Supabase Auth | Authentication identities, sessions, and authentication factors | Business roles as the sole authorization control |
| Supabase Storage | Operational file bodies and media | Authoritative business metadata or unrestricted public access |
| Notion | KCOS, SOPs, knowledge, planning, research, and management references | Long-term transactional records, authentication, payment ledger, or customer authorization |
| GitHub | Source code, migrations, infrastructure definitions, and versioned technical documentation | Customer or live operational records |
| Next.js application | Validated workflows and controlled presentation of data | An independent persistent source of truth |
| Approved external services | The narrow service-specific data required by their contracts | Uncontrolled copies of the operational database |

### 3.1 Supabase Responsibilities

Supabase is the operational source of truth for:

- Organizations, users, customers, and contacts
- Sourcing requests and requested products
- Suppliers and supplier contacts
- Quotations and quotation items
- Customer decisions and approvals
- Purchases, payments, inspections, shipments, and deliveries when implemented
- Operational document metadata
- Status history, assignments, activities, and audit records
- Application roles, memberships, and authorization data

### 3.2 Notion Responsibilities

Notion is the knowledge and documentation source of truth for:

- KCOS documentation
- Standard operating procedures
- Policies, templates, research, and internal guidance
- Strategic planning and management references
- Human-readable content planning

Operational summaries may be synchronized to Notion only when the source, direction, owner, permitted fields, and failure behavior are documented. Sensitive operational data is not copied by default.

### 3.3 Operational Data Governance

Supabase is the authoritative operational source of truth for KC Platform V2. The KC Platform Dashboard is the exclusive operational interface for creating, updating, reviewing, approving, tracking, and managing operational records, workflows, tasks, statuses, documents and metadata, and customer-visible and internal operational activity.

Notion may be used only for KCOS, knowledge management, SOP documentation, strategic planning, internal documentation, research, the AI prompt library, product planning, roadmaps, decision records, administrative references, and non-operational project management. It must never be used as an operational source of truth, operational database, operational workflow engine, required dependency for daily operations, or storage location for authoritative customer, supplier, RFQ, quotation, purchase-order, shipment, payment, task, or approval records.

Any operational record currently stored in Notion belongs to the legacy MVP only and is non-authoritative for KC Platform V2. The legacy Notion operational dependency must not be expanded. Any future operational workflow that depends on Notion is non-compliant with the approved architecture.

The approved responsibility model is:

- KC Platform Dashboard = sole operational interface
- Supabase = authoritative operational database and source of truth
- Notion = knowledge, documentation, SOPs, planning, research, and KCOS only
- GitHub = source code, migrations, and versioned technical documentation

### 3.4 GitHub Responsibilities

GitHub owns versioned technical artifacts, including:

- Application code
- Database migrations and seed definitions
- Infrastructure and deployment configuration
- Approved Markdown documentation
- Architecture Decision Records

Secrets, customer exports, production backups, and operational attachments must never be committed.

### 3.5 External Service Boundary

Before an external service receives data, the project must document:

- Purpose and lawful business need
- Exact fields transferred
- Data classification
- Retention and deletion behavior
- Authentication and authorization method
- Failure, retry, reconciliation, and audit behavior
- Vendor ownership and exit process

---

## 4. System Boundaries

### 4.1 Operational Boundary

Supabase stores authoritative operational state. All writes must pass database constraints and approved authorization controls. Sensitive or multi-step operations must use server-side application services.

### 4.2 Knowledge Boundary

Notion may explain how work should be performed, but it must not determine live customer access, payment truth, quotation visibility, or request state.

### 4.3 Application Boundary

Next.js coordinates validated use cases and returns only the data required by the caller. UI state, hidden controls, and client-side validation are not authoritative security boundaries.

### 4.4 Storage Boundary

File bodies belong in controlled object storage. PostgreSQL stores metadata, ownership, classification, visibility, checksums where appropriate, and links to the relevant business record.

### 4.5 Analytics and Export Boundary

Analytics, exports, caches, and reports are derived data. They must identify their source and freshness and must not write authoritative operational state unless explicitly designed and approved.

### 4.6 Environment Boundary

Local, preview or staging, and production environments must use separate credentials and data. Production personal or commercially sensitive data must not be copied into non-production environments without approval and appropriate masking.

---

## 5. Operational Database

Supabase PostgreSQL is the approved operational database.

### 5.1 Required Capabilities

The database must support:

- Referential integrity through foreign keys
- Appropriate uniqueness and check constraints
- Transactions for multi-record business operations
- Row-Level Security for sensitive tables
- Indexed access for confirmed query patterns
- Stable timestamps and attributable changes
- Schema migrations stored in Git
- Backup, restore, and reconciliation procedures

### 5.2 Access Rules

- Anonymous access is denied unless an explicit public use case requires it.
- Public submissions use narrow, validated server-side endpoints.
- Authenticated access does not imply authorization.
- Service-role credentials remain server-side and are used only when necessary.
- Administrative SQL access is restricted and auditable.
- Browser queries must never receive unrestricted internal records.

### 5.3 Schema Design Rules

- Normalize authoritative business facts sufficiently to prevent contradictions.
- Denormalize only for a measured read or reporting requirement.
- Use database constraints for invariants that must always hold.
- Avoid storing multiple facts in free-text or comma-separated fields.
- Use JSON only for variable data that does not require normal relational querying or integrity.
- Monetary values must not use floating-point types.
- Store timestamps in UTC and localize them at presentation boundaries.
- Schema changes require versioned migrations; manual production drift is prohibited.

### 5.4 Environments

At minimum, the platform will maintain:

- Local development
- Preview or staging
- Production

Production access, keys, backups, and storage policies must remain separate from non-production environments.

---

## 6. Master Data

Master data identifies durable business parties and reusable entities. The final physical model will be defined separately.

### 6.1 Organizations

Represents a customer company or other approved business account when organizational accounts are required.

Minimum concerns:

- Legal or trading name
- Status
- Primary country and preferred language
- Approved contacts and memberships
- Billing or compliance attributes only when required

A single-person customer experience may exist without exposing organization complexity in the initial UI.

### 6.2 User Profiles and Memberships

Authentication identity remains in Supabase Auth. Application profiles and memberships store business-facing identity, organization membership, role assignment, and account state.

Authentication identity and authorization membership must remain separate.

### 6.3 Customers and Contacts

Customer records represent the commercial relationship. Contacts represent people and communication endpoints. Duplicate identities must be resolved carefully rather than silently merged.

### 6.4 Suppliers and Supplier Contacts

Supplier records may include approved identity, capabilities, locations, certifications, status, and internal evaluation. Supplier contact information and evaluations are internal by default.

### 6.5 Products and Product Specifications

Reusable product definitions may be introduced where operationally useful. A requested product must preserve the specification agreed for that request even if a reusable catalog record later changes.

### 6.6 Internal Users and Teams

Internal profiles, teams, assignments, and capabilities support authorization and workflow ownership. Employment or highly sensitive HR data is outside the platform scope unless separately approved.

### 6.7 Master Data Quality

Master records require:

- Clear ownership
- Duplicate detection and reviewed merge processes
- Status rather than uncontrolled deletion
- Validated key fields
- Traceable corrections for important attributes

---

## 7. Transactional Data

Transactional data records business events and workflow state.

### 7.1 Sourcing Requests (RFQs)

The sourcing request is the primary case record. It must include ownership, public tracking reference, internal and customer-visible status, timestamps, source, and lifecycle state.

### 7.2 Requested Products

Each RFQ may include one or more requested products with quantities, units, specifications, targets, attachments, and clarification history. Product requirements must not be overwritten after commercial decisions without preserving revisions.

### 7.3 Supplier Engagements

Supplier inquiries, responses, and sourcing evidence remain internal. Communications may be summarized or linked; sensitive credentials or unnecessary private conversation content must not be stored.

### 7.4 Quotations

Supplier quotations and customer-visible quotations are distinct concerns. The system must preserve:

- Source quotation data
- Normalized commercial comparison
- Currency and applicable conversion context
- Version and approval state
- Customer-visible representation
- Publication and decision history

Only explicitly approved quotation versions may be visible to customers.

### 7.5 Customer Decisions

Selections, rejections, clarification requests, and approvals must record the actor, timestamp, target version, and relevant terms. A later quotation revision must not rewrite the decision against an earlier version.

### 7.6 Purchases and Supplier Orders

When implemented, purchase records must link to approved commercial decisions while preserving supplier terms, ordered items, quantities, amounts, and lifecycle history.

### 7.7 Payments

Payment records represent business payment events and status, not a full accounting ledger unless separately approved. Monetary fields must store amount and currency explicitly. Sensitive card or bank credentials must not be stored.

### 7.8 Inspections

Inspection records must preserve scope, provider or inspector, findings, evidence, result, corrections, and approval. Evidence visibility is internal until explicitly approved for the customer.

### 7.9 Shipments and Deliveries

Shipment records may contain method, legs, carriers, identifiers, milestone dates, documents, and customer-safe status. Internal exceptions and risk notes remain restricted.

### 7.10 Messages, Activities, and Notifications

Operational messages and activities must identify author, audience, visibility, subject record, and time. Notification delivery is not itself proof that a business action was approved.

### 7.11 Transaction Rules

- Critical state transitions must be validated.
- Related writes that form one business action should be transactional.
- Financial and commercial facts must preserve currency, version, and approval context.
- Historical decisions must reference the exact version reviewed.
- Cancellation and reversal are explicit states or events, not silent deletion.

---

## 8. Reference Data

Reference data provides controlled values used across records.

Potential reference domains include:

- Countries and regions
- Currencies
- Languages and locales
- Units of measure
- Incoterms when required
- Ports and shipping methods when required
- Request, quotation, payment, inspection, and shipment statuses
- Document types
- Product or service categories

### Rules

- Use recognized standards where practical, such as ISO country and currency codes.
- Store stable codes separately from translated display labels.
- Do not hard-code business reference values across UI components.
- Status values require documented transitions and customer-visible mappings.
- Reference values should be deactivated rather than deleted when historical records use them.
- Exchange rates, if stored, must include source, rate, base and quote currencies, and effective time; historical commercial records preserve the rate context used.

---

## 9. Relationship Strategy

The conceptual relationship model is:

```text
Organization
├── Memberships ── User Profiles ── Auth Identities
└── Customers / Contacts
    └── Sourcing Requests (RFQs)
        ├── Requested Products
        ├── Assignments and Activities
        ├── Supplier Engagements ── Suppliers
        ├── Quotations
        │   ├── Quotation Versions
        │   ├── Quotation Items
        │   └── Customer Decisions
        ├── Purchases
        │   └── Payments
        ├── Inspections
        ├── Shipments
        └── Documents
```

This diagram is conceptual and does not approve table names or cardinalities by itself.

### Relationship Rules

- Required parent-child relationships use foreign keys.
- Many-to-many relationships use explicit join records when they carry business meaning.
- Cross-organization relationships are prohibited unless explicitly modeled and authorized.
- Historical transactional records should reference stable snapshots or versions where later master-data edits would change meaning.
- Deletion behavior must be explicit; cascading deletion of business history is prohibited by default.
- Polymorphic relationships may be used only when integrity, indexing, and authorization remain clear.
- Every customer-visible record must be traceable to the owning customer or organization.

---

## 10. Identifier Strategy

### 10.1 Internal Primary Keys

- Use UUIDs for primary identifiers unless a documented requirement justifies another type.
- Internal identifiers are immutable and never reused.
- Database sequence values must not be exposed as public tracking identifiers.

### 10.2 Public References

Customer-facing objects may receive a separate human-safe reference, such as an RFQ tracking reference.

Public references must be:

- Unique and stable
- Difficult to enumerate or guess
- Case-normalized where appropriate
- Safe to communicate verbally and in writing
- Protected by verification or authentication when they lead to sensitive data

The exact public reference format will be approved during schema design. The reference must not encode sensitive customer, supplier, or commercial information.

### 10.3 External Identifiers

Identifiers from payment, shipping, messaging, or other services must be stored with provider and environment context. They must not replace the platform's internal primary key.

### 10.4 Idempotency Keys

Sensitive or repeatable operations such as public submission, payment callbacks, and integration retries should use idempotency controls to prevent duplicate effects.

---

## 11. Naming Convention

### 11.1 General Rules

- Database identifiers use lowercase `snake_case` English names.
- Names describe business meaning and avoid unexplained abbreviations.
- Tables use consistent plural nouns.
- Primary keys use `id`.
- Foreign keys use `<entity>_id`.
- Boolean fields use clear predicates such as `is_active` or `is_customer_visible`.
- Timestamps use the `_at` suffix; dates without time use `_on` when appropriate.
- Monetary fields pair an amount with a currency code.
- Unit-bearing numeric fields identify their unit or reference a unit code.

### 11.2 Standard Columns

Where applicable, records use:

- `id`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`
- `archived_at`
- `archived_by`

These columns are not required mechanically on every lookup or immutable event table; their use must match the record lifecycle.

### 11.3 Constraints and Indexes

Use predictable names such as:

- `pk_<table>`
- `fk_<table>_<column>`
- `uq_<table>_<columns>`
- `ck_<table>_<rule>`
- `idx_<table>_<columns>`

### 11.4 Enumerations and Statuses

Stable codes use lowercase machine-readable values. Display text and Arabic or English labels belong in presentation or approved localization structures. Database enums should be used cautiously when workflows are expected to evolve.

### 11.5 API and Type Naming

Database naming may be mapped to idiomatic TypeScript at controlled boundaries. API contracts must remain deliberate and must not expose database rows automatically.

---

## 12. Data Lifecycle

The standard lifecycle is:

```text
Create → Validate → Use → Revise or Version → Complete → Archive → Dispose when approved
```

### 12.1 Creation

The system records the source, creation time, and responsible actor when known. Public submissions are untrusted until validated.

### 12.2 Active Use

Authorized users may change records within approved workflows. Critical transitions require business validation and attributable actors.

### 12.3 Completion

Completed records remain readable according to permissions and are protected from casual editing. Corrections must preserve evidence of the previous state where material.

### 12.4 Archival

Archival removes records from routine workflows without destroying operational history. Archived data remains subject to access control and retention rules.

### 12.5 Disposal

Permanent deletion requires an approved purpose, authority, dependency review, and audit evidence where appropriate. Legal or contractual obligations take precedence.

### 12.6 Record State

Business status, archival state, and deletion state are separate concepts. A cancelled RFQ is not automatically archived or deleted.

---

## 13. Soft Delete Strategy

### 13.1 Default Policy

Core business records are not hard-deleted through ordinary application workflows. Prefer cancellation, deactivation, archival, or soft deletion depending on business meaning.

### 13.2 Candidate Records

Soft deletion or archival may apply to:

- Customer contacts
- Supplier contacts
- Draft or duplicate records after reviewed resolution
- Documents removed from routine use
- Configurable reference values

Transactional history, approvals, payments, audit events, and published quotation versions must not be casually soft-deleted.

### 13.3 Required Metadata

Where soft deletion applies, record:

- `deleted_at`
- `deleted_by`
- Reason or approved reference when required

### 13.4 Query and Uniqueness Behavior

- Normal application queries exclude soft-deleted records by default.
- Administrative recovery is permission-controlled.
- Unique constraints must define whether archived or deleted values can be reused.
- Related records must not become inaccessible or misleading after a parent is archived.

### 13.5 Hard Deletion

Hard deletion is reserved for approved privacy, legal, security, test-data, or retention workflows. It requires dependency checks and must not break required auditability.

---

## 14. Audit Strategy

### 14.1 Audit Scope

Audit-relevant events include:

- Authentication and privileged access events where appropriate
- Creation, assignment, cancellation, archival, and reopening of RFQs
- Quotation creation, versioning, approval, publication, and price changes
- Customer decisions
- Purchase and payment status changes
- Inspection results and approvals
- Shipment milestones and document visibility changes
- Role, permission, membership, and configuration changes
- Exports, destructive actions, and sensitive administrative corrections

### 14.2 Minimum Event Data

An audit event should contain:

- Event identifier
- Event type
- Actor identity or system actor
- Timestamp in UTC
- Subject type and identifier
- Organization or scope where applicable
- Outcome
- Correlation or request identifier where useful
- Reason for sensitive actions where required
- Safe before-and-after data or a structured change summary when appropriate

### 14.3 Protection

- Audit logs are append-oriented and restricted.
- Ordinary users cannot edit audit records.
- Logs must not store passwords, tokens, secret keys, full payment credentials, or unnecessary personal data.
- Access to audit data is itself restricted and may be audited.

### 14.4 Business History vs Technical Logs

Business history records customer and operational decisions. Technical logs support diagnostics and security. Neither should substitute for the other, and they may have different retention rules.

---

## 15. File Strategy

### 15.1 Storage Model

Supabase Storage is the default operational file store. PostgreSQL stores file metadata and its relationship to business records.

Metadata should include, where applicable:

- File identifier
- Owning organization or customer
- Related business record
- Storage bucket and object path
- Original and safe display name
- MIME type and size
- Classification and visibility
- Uploading actor and timestamp
- Checksum or integrity metadata
- Version, review, and archival state

### 15.2 File Categories

- Product images and specifications
- Supplier quotations and certifications
- Purchase and payment documents
- Inspection photos, videos, and reports
- Shipping and delivery documents
- Customer-visible reports
- Internal operational evidence

### 15.3 Access Rules

- Sensitive operational files use private buckets.
- Access is granted through authenticated policies or short-lived signed URLs.
- Customer visibility requires explicit approval.
- Object paths are not treated as authorization secrets.
- Supplier and internal files are not customer-visible by default.

### 15.4 Upload Controls

- Enforce file size and allowed-type rules.
- Verify content where practical rather than trusting extensions.
- Generate safe storage names and preserve original names as metadata.
- Consider malware scanning before production use for untrusted uploads.
- Prevent executable content from being served in unsafe contexts.
- Apply upload rate and quota controls.

### 15.5 Versioning and Deletion

Material commercial or inspection documents should preserve versions. Replacing a file must not silently alter evidence used for an approval or decision. Storage deletion follows the related record's approved lifecycle and retention rule.

---

## 16. Data Security

### 16.1 Classification

| Classification | Examples | Default access |
|---|---|---|
| Public | Published service content, approved public assets | Anyone |
| Customer-visible | The customer's request status and approved quotations | Verified owning customer and authorized staff |
| Internal | Assignments, general supplier workflow, internal process metadata | Authorized team members |
| Confidential | Customer contact data, supplier contacts, costs, margins, payment and inspection details | Restricted roles with operational need |
| Restricted | Secrets, privileged security data, highly sensitive financial or identity data | Minimal approved custodians; never exposed through ordinary UI |

### 16.2 Core Controls

- Supabase Row-Level Security on sensitive operational tables
- Server-side authorization for privileged and multi-step actions
- Organization and ownership checks
- Role-based permissions with least privilege
- Encryption in transit and provider-managed encryption at rest
- Secure environment variables and credential rotation
- Private storage and controlled downloads
- Input validation, rate limiting, duplicate protection, and safe errors
- Logging and alerting for critical failures and suspicious behavior

### 16.3 Customer/Internal Separation

Customer responses must use approved views, restricted queries, or DTO allowlists. Full internal database records are never serialized directly to customer clients.

Customers must not receive:

- Internal costs, margins, and negotiation details
- Supplier private contact details
- Draft or rejected quotation versions
- Internal notes, risk assessments, or employee discussions
- Other customers' data
- Authorization or audit metadata not intended for them

### 16.4 Personal and Financial Data

- Collect only necessary personal data.
- Avoid storing full payment-card or online banking credentials.
- Limit exports and downloads of confidential datasets.
- Mask or synthesize sensitive production data used outside production.
- Privacy requests and incident handling require documented operational procedures before launch.

### 16.5 Secrets

Secrets must not be stored in GitHub, Notion, client code, audit logs, or ordinary database rows. Use approved secret and environment management appropriate to the deployment platform.

---

## 17. Multi-tenancy Strategy

### 17.1 Direction

KC Platform V2 should be organization-aware where needed, but the initial release must avoid unnecessary multi-tenant complexity. The immediate business is Kawalis China operating customer cases, not a self-service SaaS platform for independent operators.

### 17.2 Tenant Boundary

Where customer organizations are implemented:

- An organization is the primary customer-account boundary.
- Membership links users to organizations and approved roles.
- Customer-owned records carry an explicit organization or customer ownership path.
- RLS and server authorization enforce the boundary.
- Internal Kawalis China roles operate under separate, explicit permissions.

### 17.3 Isolation Rules

- No query may rely only on UI filtering for tenant isolation.
- Cross-organization access is denied by default.
- Shared supplier and reference data must be explicitly modeled; it must not inherit customer visibility.
- Administrative cross-tenant access requires a legitimate role and auditability.
- Files follow the same tenant boundary as their parent record.

### 17.4 Future Expansion

Support for independent operating companies, partners, franchises, or country entities is not approved in the initial MVP. Such expansion requires an Architecture Decision Record, threat review, permission redesign, and migration plan.

---

## 18. Data Retention

### 18.1 Policy

Retention is driven by operational need, customer commitments, applicable law, dispute risk, security, and cost. Exact legal periods must be approved with qualified legal or compliance advice before production launch in each jurisdiction.

### 18.2 Retention Schedule

Before production launch, the owner must approve a schedule covering at least:

- Customer and organization profiles
- RFQs and requested products
- Quotations and commercial approvals
- Purchases and payments
- Inspections, shipments, and delivery evidence
- Messages and notifications
- Files and exports
- Authentication, security, technical, and audit logs
- Backups and deleted-record recovery windows

### 18.3 Retention Rules

- Preserve records required for active operations, contracts, disputes, audit, or law.
- Do not retain unneeded personal data indefinitely.
- Archive closed records according to policy.
- Apply legal holds when required.
- Delete expired data through controlled, logged processes.
- Ensure derived copies, exports, caches, and backups are addressed by the same policy.
- Backup expiration is not a substitute for deleting live data.

### 18.4 Customer Requests

Access, correction, export, or deletion requests must be verified and reviewed against applicable obligations and other parties' rights. Deletion may mean anonymization or restricted archival where complete removal is not lawful or operationally possible.

### 18.5 Backups

Backup frequency, retention, encryption, restoration ownership, and recovery testing must be documented before production launch. Restore tests are required; a backup that cannot be restored is not sufficient.

---

## 19. Future Scalability

### 19.1 Multiple Countries

- Use standard country codes.
- Keep jurisdiction-sensitive policies configurable and documented.
- Avoid assuming one address, tax, customs, or shipping format globally.

### 19.2 Multiple Currencies

- Every monetary amount includes a currency.
- Do not overwrite historical amounts after exchange-rate changes.
- Store conversion context when converted values affect a decision.
- A full accounting ledger is outside the initial scope.

### 19.3 Multiple Languages

- Stable machine codes remain language-neutral.
- Arabic is the primary interface language and RTL is first-class.
- Translated labels and content do not duplicate authoritative operational facts.
- User-generated content is not automatically translated without preserving the original.

### 19.4 Multiple Warehouses and Logistics Legs

The model may evolve to support multiple shipment legs, locations, and warehouses, but these structures are introduced only with confirmed operational requirements.

### 19.5 Reporting and Analytics

Start with governed database views and approved exports. Introduce a warehouse or specialized analytics platform only when scale, isolation, performance, or historical analysis justifies it.

### 19.6 Search and Real-time Features

PostgreSQL capabilities should be evaluated first. External search or real-time infrastructure requires evidence, documented ownership, and an approved ADR.

### 19.7 Partitioning and Performance

Indexes, caching, materialized views, read replicas, and partitioning must respond to measured workloads. Premature optimization is prohibited.

### 19.8 Vendor Portability

Core schema, migrations, and exports should use portable PostgreSQL and documented formats where practical. Provider-specific features may be used when their value and exit implications are understood.

---

## 20. Data Governance

### 20.1 Roles

| Role | Responsibility |
|---|---|
| Project Owner | Approves strategy, major scope, destructive changes, production migration, and material data-risk decisions |
| Business Data Owner | Defines meaning, quality expectations, permitted use, and retention need for a domain |
| Technical Custodian | Implements schemas, migrations, security, backup, monitoring, and recovery controls |
| Application Maintainer | Maintains validated workflows and API contracts |
| Authorized Operator | Creates or updates data within approved procedures and permissions |
| Reviewer | Reviews migrations, permissions, data exposure, and high-risk changes independently where practical |

One person may hold multiple roles initially, but the responsibilities must remain explicit.

### 20.2 Change Classification

**Routine change:** additive, reversible, low-risk change that does not alter ownership or expose sensitive data.
**Major change:** new core entity, changed source of truth, new sensitive integration, tenant-boundary change, material retention change, or breaking API contract.
**Destructive change:** deletion, irreversible transformation, narrowing that may lose data, or migration without a direct rollback path.

### 20.3 Required Change Process

Schema and data-policy changes must:

1. State the business purpose.
2. Identify affected data classes and owners.
3. Evaluate security, privacy, tenant, and customer-visibility impact.
4. Include a versioned migration where applicable.
5. Define validation, backup, rollback, and reconciliation.
6. Receive review proportional to risk.
7. Update documentation and API contracts.
8. Be verified in a non-production environment.
9. Receive explicit owner approval when major or destructive.

### 20.4 Migration Governance

- Never edit an applied production migration in place.
- Do not change production schemas manually outside the approved workflow except for a documented emergency response.
- Backfills must be idempotent or restart-safe where practical.
- Large migrations must define batching, locking, monitoring, and recovery.
- Data integrity must be reconciled before old dependencies are retired.
- Production migration from Notion is not approved by this document.

### 20.5 Access Governance

- Access is granted for a defined role and purpose.
- Privileged access is reviewed periodically and revoked promptly when no longer needed.
- Shared user accounts and shared production credentials are prohibited.
- Service accounts have named ownership and minimum permissions.
- Emergency access is time-limited and documented.

### 20.6 Data Quality Governance

Each important domain should define:

- Required and validated fields
- Uniqueness expectations
- Allowed status transitions
- Duplicate review and merge procedure
- Completeness and reconciliation checks
- Owner responsible for correction

Automated correction must not overwrite material commercial history without traceability.

### 20.7 Integration Governance

Every integration must have an owner, documented data contract, classification review, retry and reconciliation behavior, observability, and a safe disablement or exit path.

### 20.8 Incident Governance

Suspected exposure, corruption, unauthorized access, or loss must be contained and documented. Response procedures must define escalation, evidence preservation, recovery, required notifications, and post-incident corrective actions before production launch.

### 20.9 Required Follow-up Artifacts

Before implementing or migrating production data, create and approve:

- Logical and physical data model
- Data dictionary
- Role and permission matrix
- RLS policy specification and tests
- Status transition catalog
- Migration and reconciliation plan
- Retention schedule
- Backup and recovery procedure
- Data classification and exposure review
- Integration data contracts

### 20.10 Prohibited Practices

- Using Notion as the long-term transactional database
- Storing secrets in operational records or source control
- Exposing internal rows directly to customers
- Relying on hidden UI controls for authorization
- Disabling RLS to solve ordinary application problems
- Unreviewed production schema changes
- Destructive migration without backup and explicit approval
- Silent rewriting of approved quotations or business history
- Copying production data into development without approved protection
- Creating competing sources of truth through spreadsheets or integrations

---

## 21. Approval Status

**Status:** Active
**Version:** 1.0
**Approved On:** 2026-07-21
**Approved By:** Kawalis China (Owner)

This document has been explicitly approved by the project owner and is now **Active**.

As an active document:

- It becomes the official data-strategy reference for KC Platform V2.
- Database, storage, API, migration, reporting, and integration decisions must align with it.
- It does not by itself authorize production schema changes, data migration, vendor activation, or destructive action.
- Material changes to data ownership, security boundaries, tenancy, retention, or migration require a documented revision and explicit approval.

### Acceptance Criteria

This document is ready for approval when:

- Supabase is clearly established as the operational source of truth.
- Notion is limited to documentation, knowledge, planning, and approved summaries.
- GitHub and storage responsibilities are clearly bounded.
- Master, transactional, reference, and file data are distinguished.
- Customer and internal data separation is mandatory.
- Identifier, naming, lifecycle, deletion, audit, and retention rules are defined.
- Multi-tenancy supports the approved present scope without premature SaaS complexity.
- Governance controls schema changes, access, migrations, data quality, integrations, and incidents.
- Follow-up implementation artifacts are explicitly required.
- No migration or production change is authorized during this documentation phase.

---

## Related Documents

- `KC-V2-001 — PLATFORM_BLUEPRINT.md`
- `KC-V2-002 — ARCHITECTURE.md`
- `KC-V2-004 — BRAND_GUIDELINES.md`
- `KC-V2-005 — DESIGN_SYSTEM.md`
- `KC-V2-006 — DEVELOPMENT_RULES.md`
- `KC-V2-007 — GIT_WORKFLOW.md`
