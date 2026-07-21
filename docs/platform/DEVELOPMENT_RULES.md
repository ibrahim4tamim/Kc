# KC Platform V2 — Development Rules

**Document ID:** KC-V2-006
**Status:** Active
**Version:** 1.0
**Approved On:** 2026-07-21
**Approved By:** Kawalis China (Owner)
**Owner:** Kawalis China
**Platform:** KC Platform V2
**Official Branch:** `kc-platform-v2`
**Parent Documents:** `KC-V2-001 — PLATFORM_BLUEPRINT.md`, `KC-V2-002 — ARCHITECTURE.md`, `KC-V2-003 — DATA_STRATEGY.md`, `KC-V2-005 — DESIGN_SYSTEM.md`

---

## 1. Purpose

This document defines the official development rules for KC Platform V2.

It establishes the minimum engineering standards for application code, database changes, security, accessibility, testing, documentation, review, and delivery.

These rules apply to:

- Public website development
- Sourcing request workflows
- Customer portal development
- Internal operations and administration interfaces
- Next.js server and client code
- Supabase database, authentication, storage, and Row-Level Security
- APIs, integrations, migrations, scripts, and tests

These rules protect the existing operational MVP, reduce regressions, and ensure that V2 evolves through controlled, reviewable changes.

---

## 2. Engineering Principles

All development must follow these principles:

### 2.1 Security by Default

Treat all external input as untrusted. Protect sensitive data through server-side authorization, Row-Level Security, validation, and least privilege.

### 2.2 Simplicity Before Abstraction

Choose the smallest clear solution that meets a confirmed requirement. Do not create frameworks, layers, services, or generic components without demonstrated reuse.

### 2.3 Preserve Working Logic

Secure, maintainable operational logic from the existing MVP should be preserved or migrated gradually. Replacement requires evidence and a clear benefit.

### 2.4 Explicit Boundaries

Keep presentation, application logic, data access, integrations, and authorization responsibilities distinct.

### 2.5 Type and Data Integrity

Use TypeScript, validation schemas, database constraints, and explicit contracts to prevent invalid states.

### 2.6 User-Centered Delivery

Implementation must support clear Arabic RTL and mobile-first workflows. Technical elegance does not compensate for a confusing customer experience.

### 2.7 Evidence-Based Change

Performance work, architectural replacement, and major refactoring require evidence. Avoid speculative rewrites.

### 2.8 Reviewable Progress

Prefer small, focused changes with clear tests and documentation over large mixed commits.

---

## 3. Approved Technology Direction

The approved direction is:

| Area | Technology |
|---|---|
| Application framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS and approved design tokens |
| Operational backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| File storage | Supabase Storage |
| Knowledge and SOPs | Notion |
| Version control | GitHub |

Replacing a core technology requires an approved Architecture Decision Record and explicit owner approval.

Adding a dependency requires a confirmed need, maintenance review, license review, security consideration, and comparison with platform or standard-library capabilities.

---

## 4. Repository and Scope Safety

- All V2 work belongs on `kc-platform-v2` or an approved branch derived from it.
- The branch `claude/kawalis-china-sourcing-mvp-hpz3po` is a preserved reference and must not be modified.
- Do not change the default branch without explicit owner approval.
- Do not merge, deploy, or publish production changes without approval.
- Do not delete working MVP behavior without verified justification.
- Inspect the repository and current changes before editing.
- Preserve unrelated user changes in a dirty worktree.
- Never use destructive Git operations to simplify local work.

Detailed branch, commit, and review rules are defined in `KC-V2-007 — GIT_WORKFLOW.md`.

---

## 5. Project Structure

The repository should organize code by clear responsibility.

Recommended areas include:

```text
app/                  # Next.js routes, layouts, pages, and route handlers
components/
├── ui/               # Reusable UI primitives
├── forms/            # Shared form patterns
├── layout/           # Navigation and layout structures
├── feedback/         # Error, empty, loading, and status patterns
└── features/         # Domain-specific composed components
lib/
├── auth/             # Authentication and authorization helpers
├── validation/       # Shared schemas
├── data/             # Controlled data access
├── services/         # Application use cases
├── integrations/     # External service adapters
└── utilities/        # Focused shared utilities
supabase/
├── migrations/       # Versioned schema changes
└── tests/            # Database and RLS verification where supported
docs/                 # Approved project documentation
tests/                # Unit, integration, and end-to-end tests
```

The exact structure may adapt to the existing repository. Do not move files merely to match this illustration. Structural changes require a concrete maintenance or architecture benefit.

---

## 6. TypeScript Rules

### 6.1 Strictness

- TypeScript strict mode must remain enabled.
- New type errors are prohibited.
- Do not weaken compiler settings to bypass an implementation problem.
- Avoid `any`. If unavoidable at an external boundary, contain it, validate it, and document the reason.
- Prefer `unknown` for untrusted data until validated.

### 6.2 Types and Interfaces

- Model domain concepts with meaningful names.
- Prefer narrow types and discriminated unions for stateful workflows.
- Avoid broad records that combine customer-safe and internal fields.
- Do not duplicate types manually when they can be derived safely from a validation schema or generated database definitions.
- Public API and component contracts must not expose database implementation details unnecessarily.

### 6.3 Nullability

- Distinguish absent, unknown, empty, and not-applicable values.
- Do not use non-null assertions to silence uncertain data without a proven invariant.
- Validate optional external data before use.

### 6.4 Assertions

- Type assertions must not substitute for validation.
- Double assertions such as `as unknown as` require exceptional justification.
- Exhaustive checks should protect important union-based workflows.

### 6.5 Generated Types

Generated Supabase types should be reproducible and updated with approved schema changes. Generated files must not be hand-edited unless the generation process explicitly supports it.

---

## 7. Naming Conventions

### Code

- Components and exported classes: `PascalCase`
- Functions, variables, hooks, and instances: `camelCase`
- Constants: `UPPER_SNAKE_CASE` only for true constants
- Files: follow the existing project convention consistently
- React hooks: begin with `use`
- Boolean values: use clear predicates such as `isApproved`, `hasAccess`, or `canEdit`

### Database

- Tables and columns: lowercase `snake_case`
- Primary keys: `id`
- Foreign keys: `<entity>_id`
- Timestamps: `_at`
- Date-only fields: `_on` where appropriate
- Boolean columns: `is_` or another clear predicate

### General

- Prefer complete business terms over unexplained abbreviations.
- Use one term for one concept across code, database, UI, and documentation.
- Tracking references and internal IDs must have distinct names.

---

## 8. Code Style

- Follow the repository's configured formatter and linter.
- Do not introduce an alternative formatter without approval.
- Prefer small functions with one clear responsibility.
- Use early returns when they improve clarity.
- Avoid deeply nested conditional logic.
- Avoid clever code that hides business meaning.
- Remove dead code and unused imports in the edited scope.
- Do not leave commented-out implementations.
- Comments should explain why, risk, or invariant—not restate obvious code.
- TODO comments require an owner or issue reference when they represent required work.

Formatting changes should remain scoped. Do not reformat unrelated files in a feature change.

---

## 9. React and Next.js Rules

### 9.1 Server First

- Prefer Server Components for data reading and static presentation when interaction does not require a Client Component.
- Add `'use client'` only at the smallest necessary boundary.
- Keep secrets and privileged operations on the server.
- Do not import server-only modules into client bundles.

### 9.2 Components

- Components should have one coherent responsibility.
- Prefer composition over large components with many flags.
- Keep feature business logic out of reusable visual primitives.
- Do not store derived values in state when they can be calculated reliably.
- Avoid effects for ordinary data transformation.
- Stable list keys must represent the item identity.

### 9.3 Routing

- Use route groups and layouts to clarify public, customer, and internal areas.
- Protected routes require server-side authentication and authorization.
- URL parameters are untrusted input and must be validated.
- Redirects must use approved destinations and prevent open-redirect vulnerabilities.

### 9.4 Data Fetching

- Fetch data at the layer that can enforce access and minimize transfer.
- Request only required fields.
- Define caching and revalidation intentionally.
- Sensitive customer or operational data must not enter public caches.
- Handle loading, empty, error, and unauthorized states.

### 9.5 Mutations

- Mutations must validate, authenticate, authorize, execute business rules, and return a safe result.
- Use transactions for multi-record operations that must succeed together.
- Prevent duplicate effects with idempotency or equivalent controls where needed.
- Revalidation must not reveal or refresh unauthorized data.

---

## 10. Client and Server Boundaries

Server-only responsibilities include:

- Secrets and service-role credentials
- Privileged database operations
- Authorization decisions
- Payment and webhook verification
- Internal supplier data transformation
- Customer-safe DTO creation
- Sensitive integration calls

Client responsibilities include:

- Presentation
- Local interaction state
- Accessible input feedback
- Non-authoritative client validation
- Calling controlled server boundaries

The browser must never receive data merely because it is later hidden by the interface.

---

## 11. Validation

### 11.1 External Input

Validate all external input, including:

- Form data
- JSON payloads
- URL and route parameters
- Query strings
- Cookies and headers when consumed
- File metadata and uploads
- Webhooks
- Integration responses
- Environment variables

### 11.2 Rules

- Server-side validation is mandatory.
- Client validation improves usability but is not a security control.
- Prefer shared schemas when client and server requirements are truly identical.
- Normalize only after validation and without changing intended meaning.
- Reject unexpected fields at sensitive boundaries or use explicit allowlists.
- Return field-level errors safely.
- Do not expose stack traces, SQL details, or internal identifiers.

### 11.3 Business Validation

Schema validity does not prove a business action is permitted. Business validation must confirm state transitions, ownership, visibility, currency, version, approval, and other domain invariants.

---

## 12. Authentication

- Supabase Auth is the approved authentication direction.
- Authentication confirms identity; it does not grant business access by itself.
- Session handling must follow official secure server-side patterns.
- Do not implement custom password storage.
- Password reset, verification, and account recovery must avoid account enumeration where practical.
- Privileged internal roles should support stronger authentication when implemented.
- Sign-out and session expiry must fail safely.

---

## 13. Authorization

Every protected action must verify:

1. Authentication
2. Role or capability
3. Resource ownership or permitted scope
4. Current business state
5. Customer visibility when returning customer data

### Rules

- Authorization occurs on the server and in database RLS where applicable.
- Hidden controls are not authorization.
- Deny access by default.
- Use least privilege.
- Administrative access must remain scoped and auditable.
- Employees do not automatically receive access to all customer, supplier, financial, or audit data.
- Customer access must follow the owning customer or organization relationship.

---

## 14. Customer and Internal Data Separation

Customer-visible responses must use:

- Explicit select lists
- Restricted queries or approved database views
- Customer-safe DTOs
- Server-side mapping

Do not serialize complete internal records to customer clients.

Customers must not receive:

- Supplier private contact information
- Internal costs or margins
- Draft or rejected quotations
- Negotiation notes
- Internal risk assessments
- Employee discussions
- Other customers' information
- Privileged workflow or audit metadata

Only explicitly approved quotation and document versions may become customer-visible.

---

## 15. Supabase and Database Rules

- Sensitive tables must use Row-Level Security where applicable.
- Public table access is denied unless specifically required and reviewed.
- Service-role credentials remain server-side.
- Database constraints enforce critical invariants.
- Schema changes use versioned migrations committed to Git.
- Never edit an applied production migration in place.
- Manual production schema drift is prohibited.
- Use transactions for atomic business operations.
- Avoid floating-point types for money.
- Store timestamps in UTC.
- Use indexed queries based on confirmed access patterns.
- Avoid unrestricted `select *` across security or API boundaries.

Detailed data rules are defined in `KC-V2-003 — DATA_STRATEGY.md`.

---

## 16. Row-Level Security

RLS policies must be:

- Deny-by-default
- Readable and documented
- Based on stable ownership and membership relationships
- Tested for positive and negative cases
- Separate for select, insert, update, and delete where needed
- Resistant to privilege escalation through writable ownership columns

Minimum tests should confirm:

- A customer can access permitted records.
- A customer cannot access another customer's records.
- A customer cannot access internal or unapproved data.
- An authorized employee can perform the allowed action.
- An unauthorized employee cannot perform it.
- Anonymous users cannot access private records.

Do not disable RLS to solve ordinary application problems.

---

## 17. API and Server Action Rules

Every endpoint or server action must define:

- Purpose
- Caller and authentication requirement
- Authorization rule
- Input schema
- Output contract
- Error behavior
- Rate-limit or abuse considerations
- Audit behavior when relevant

### Rules

- Use consistent safe response shapes.
- Return only required data.
- Avoid exposing database structure unnecessarily.
- Use appropriate HTTP semantics for route handlers.
- Never trust a customer-supplied owner, role, price approval, or visibility flag.
- Validate webhook signatures before processing.
- Make retryable operations idempotent where practical.
- Apply pagination and bounded limits to list endpoints.

---

## 18. Error Handling

### Customer-Facing Errors

Errors must be:

- Clear
- Safe
- Non-technical
- Actionable where possible
- Available in the active interface language

### Internal Errors

Internal logging may include technical context but must not include:

- Passwords
- Access or refresh tokens
- Secret keys
- Full payment credentials
- Unnecessary personal data
- Full sensitive request bodies

### Rules

- Handle expected domain failures explicitly.
- Use a trace or correlation reference for unexpected failures when useful.
- Do not silently ignore failures.
- Do not reveal whether a protected record exists to an unauthorized caller.
- Define recovery or retry behavior for integration failures.

---

## 19. Logging and Observability

Logs should support debugging, security, and operations without creating a shadow sensitive-data store.

Log where appropriate:

- Operation and outcome
- Safe actor or system reference
- Safe record reference
- Correlation ID
- Duration and failure category
- Integration attempt and retry state

Do not log secrets or unnecessary payloads.

Critical workflows should provide enough observability to distinguish:

- Validation failure
- Authentication failure
- Authorization failure
- Business-rule rejection
- Database failure
- External integration failure
- Timeout or rate limit

---

## 20. Audit Logging

Audit-relevant actions include:

- RFQ creation, assignment, cancellation, and reopening
- Quotation creation, versioning, approval, and publication
- Customer decisions
- Price and visibility changes
- Payment confirmation
- Inspection approval
- Shipment milestone changes
- Role and permission changes
- Sensitive exports and administrative corrections

Audit records must be append-oriented and protected from ordinary editing. Business audit history and technical diagnostic logs are separate concerns.

---

## 21. Rate Limiting and Abuse Protection

Protect public and sensitive endpoints, including:

- RFQ submission
- Request tracking
- Authentication and password reset
- Contact forms
- File upload
- Search and export
- Webhook processing

Controls may include:

- Rate limits
- Cooldowns
- Idempotency keys
- Duplicate detection
- Request-size limits
- CAPTCHA when justified
- Suspicious activity logging

Controls must reduce abuse without creating unnecessary friction for legitimate customers.

---

## 22. Duplicate Submission Protection

- Disable repeated submission while a request is pending.
- Use server-side idempotency where duplicate effects matter.
- Treat client-generated duplicate controls as advisory until verified.
- Detect likely duplicates using approved attributes and time windows.
- Never silently discard a legitimate request.
- Flag or merge duplicates through a controlled, auditable process.

---

## 23. File Upload and Storage

- Use private Supabase Storage buckets for sensitive files.
- Store authoritative metadata in PostgreSQL.
- Enforce file size, type, count, and ownership rules.
- Do not trust filename extensions alone.
- Generate safe storage object names.
- Preserve original display names as metadata when needed.
- Use signed URLs or authenticated access.
- Customer visibility requires explicit approval.
- Consider malware scanning before production launch for untrusted uploads.
- Do not replace evidence files silently after approval; preserve versions.

---

## 24. Integrations

External services must be isolated behind focused adapters.

Each integration must define:

- Purpose and owner
- Data sent and received
- Authentication method
- Timeouts
- Retry and idempotency behavior
- Failure and reconciliation behavior
- Logging and privacy rules
- Disablement or exit path

### Rules

- External services cannot directly authorize core platform actions.
- Validate integration responses.
- Verify webhook signatures.
- Use bounded retries with backoff.
- Avoid retrying permanent validation failures.
- Do not copy broad operational datasets when narrow fields are sufficient.
- New vendors require review and approval proportional to risk.

---

## 25. Notion Boundary

Notion is used for KCOS, SOPs, knowledge, planning, and approved management references.

Notion must not:

- Authenticate users
- Determine authorization
- Remain the long-term RFQ database
- Become the payment ledger
- Expose operational records directly to customers
- Store platform secrets

Any synchronization must document source of truth, direction, fields, frequency, error handling, and conflict resolution.

---

## 26. Environment and Configuration

- Validate required environment variables at startup or build time.
- Separate local, preview or staging, and production credentials.
- Do not use production secrets for routine development.
- Do not commit `.env` files containing secrets.
- Provide a safe example environment file with names only when useful.
- Public environment variables must be safe for browser exposure.
- Feature flags must have named ownership and cleanup plans.
- Environment-specific behavior must not weaken security checks.

---

## 27. Secret Management

- Store secrets only in approved environment or secret-management facilities.
- Use least-privilege keys.
- Rotate credentials after exposure or personnel/access changes when appropriate.
- Never display secrets in logs, screenshots, documentation, issues, or pull requests.
- Never send secrets to the browser unless the value is explicitly designed to be public.
- Service-account credentials require an owner and purpose.

---

## 28. Privacy and Sensitive Data

- Collect only data required for an approved purpose.
- Classify public, customer-visible, internal, confidential, and restricted data.
- Avoid exposing personal or commercial information in analytics.
- Mask or synthesize production data used in non-production environments.
- Limit exports to authorized users and necessary fields.
- Define retention and deletion operations before production launch.
- Report suspected exposure or loss through the approved incident process.

---

## 29. Financial and Commercial Data

- Every monetary amount includes a currency.
- Do not use floating-point arithmetic for money.
- Preserve source, converted amount, exchange-rate context, and effective time when conversion affects decisions.
- Quotations must preserve versions.
- Customer decisions reference the exact approved version.
- Internal cost, margin, and supplier terms remain restricted.
- Do not store card or online banking credentials.
- Payment gateway events require signature verification and reconciliation.

---

## 30. Status and Workflow Rules

- Internal and customer-visible statuses are separate.
- Status transitions must follow documented rules.
- Critical transitions require authorization and may require a reason.
- Record previous state, new state, actor, and time for important changes.
- Do not let arbitrary strings become production statuses.
- Cancellation and reversal must be explicit.
- Customer language must remain clear and must not reveal internal process details.

---

## 31. Accessibility

Core workflows target WCAG 2.2 AA.

Development requirements include:

- Semantic HTML
- Keyboard accessibility
- Visible focus indicators
- Correct labels, names, and descriptions
- Error association and summaries
- Sufficient contrast
- Meaning independent of color
- Screen-reader announcements for meaningful dynamic changes
- Reduced-motion support
- Zoom and responsive text support
- Adequate touch targets

Accessibility defects in core customer or operational workflows block completion.

---

## 32. RTL and Localization

- Arabic is the primary platform language.
- Build and test RTL from the beginning.
- Use logical CSS properties.
- Avoid hardcoded left and right positioning.
- Mirror directional icons only when semantics require it.
- Preserve LTR behavior for emails, URLs, identifiers, and codes where required.
- Test Arabic and English mixed content.
- Keep machine codes separate from localized labels.
- Do not use literal translation that damages meaning.
- Dates, numbers, currencies, and units must remain unambiguous.

---

## 33. Design-System Compliance

UI implementation must follow `KC-V2-005 — DESIGN_SYSTEM.md`.

- Use approved tokens rather than scattered literal styles.
- Reuse existing patterns before creating new ones.
- Do not introduce unofficial colors, fonts, or logo variants.
- Components define interaction, loading, error, disabled, and responsive states.
- Avoid nested cards, excessive shadows, and generic SaaS styling.
- Trust claims require verified evidence.
- Mobile and RTL behavior are part of completion.

---

## 34. Performance

- Prioritize fast mobile loading.
- Avoid unnecessary Client Components and JavaScript.
- Request only required database fields.
- Paginate large result sets.
- Optimize images and fonts.
- Prevent avoidable layout shifts.
- Use caching only with clear freshness and privacy rules.
- Do not cache sensitive user data publicly.
- Add indexes based on real query patterns.
- Measure before introducing complex optimization.
- Real-time features require confirmed operational value.

Performance regressions in core flows must be investigated before release.

---

## 35. Dependency Management

Before adding a dependency, confirm:

- The requirement cannot be met safely with existing tools.
- The package is actively maintained.
- The license is acceptable.
- The security history and transitive dependency cost are reasonable.
- Browser bundle impact is acceptable where relevant.
- Server/client compatibility is understood.
- Removal or replacement is feasible.

### Rules

- Pin and update dependencies using the repository's package manager and lockfile.
- Do not mix package managers.
- Review major upgrades deliberately.
- Remove unused dependencies.
- Do not use abandoned packages for critical security or financial behavior.

---

## 36. Testing Strategy

Testing must be proportional to risk and must verify behavior rather than implementation detail.

### 36.1 Unit Tests

Use for:

- Pure business rules
- Validation
- Data transformations
- Formatting with commercial impact
- Permission helper logic

### 36.2 Integration Tests

Use for:

- Application services
- Database constraints
- Supabase queries and RLS
- Route handlers and server actions
- Integration adapters
- Transactions and state transitions

### 36.3 End-to-End Tests

Cover critical journeys:

- Submit sourcing request
- Receive public tracking reference
- Prevent duplicate submission
- Authenticate customer
- Access only owned records
- View only approved quotations
- Perform customer decision
- Complete key internal approval steps

### 36.4 Security Tests

Include negative cases for:

- Cross-customer access
- Unauthorized employee access
- Unapproved quotation access
- Invalid input
- File access
- Rate limits and duplicate effects
- Privilege escalation

### 36.5 UI and Accessibility Tests

- Keyboard operation
- Focus behavior
- Accessible names and errors
- Arabic RTL rendering
- Mobile viewports
- Loading, empty, error, and disabled states

---

## 37. Test Quality Rules

- Tests must be deterministic.
- Do not depend on production data.
- Create isolated test fixtures.
- Test names describe expected behavior.
- Avoid broad snapshots that hide meaningful changes.
- Mock external services at controlled boundaries.
- Keep at least one realistic integration path for critical integrations where practical.
- A test must fail for the defect it is intended to catch.
- Do not delete or weaken tests merely to make a change pass.

---

## 38. Required Checks

Before a change is considered ready, run the relevant available checks, including:

- Formatting check
- Lint
- Type check
- Unit tests
- Integration tests
- Build
- Targeted end-to-end tests for affected critical journeys
- Database and RLS verification when affected
- Accessibility and RTL checks for interface changes

If a check cannot run, document the reason, risk, and required follow-up. "Not run" is not equivalent to "passed."

---

## 39. Code Review

Review must evaluate:

- Correctness
- Security and authorization
- Customer/internal separation
- Data integrity
- Failure behavior
- Accessibility
- RTL and mobile experience
- Test coverage
- Performance impact
- Documentation
- Scope discipline

Review comments should identify the risk, affected behavior, and a clear corrective direction.

High-risk security, migration, financial, and permission changes require independent review when practical.

---

## 40. Database Migration Rules

Every migration must:

- Have one clear purpose.
- Be versioned and committed.
- Be reviewed before production.
- Define compatibility with current application code.
- Define backfill and validation when required.
- Define rollback or recovery behavior.
- Avoid unnecessary table locking and downtime.
- Preserve data unless destructive action is explicitly approved.

Never:

- Modify an already-applied production migration.
- Run an unreviewed destructive migration.
- Remove old fields before the application no longer depends on them.
- Assume a migration succeeded without reconciliation.

---

## 41. Migration from Existing MVP

The approved sequence is:

1. Audit existing code and data dependencies.
2. Identify reusable secure behavior.
3. Approve the target data model and permission matrix.
4. Build Supabase structures and RLS.
5. Create migration scripts.
6. Test with non-production data.
7. Reconcile counts, relationships, files, and critical fields.
8. Execute approved staged migration.
9. Verify application behavior and rollback readiness.
10. Retire old dependencies only after acceptance.

This document does not authorize production data migration.

---

## 42. Documentation

Update documentation when a change affects:

- Architecture
- Data ownership or schema
- Permissions or RLS
- API contracts
- Environment configuration
- Operational workflow
- Status vocabulary
- Design-system behavior
- Integration or deployment procedure

### Rules

- Documentation must describe current approved behavior.
- Do not leave knowingly false setup instructions.
- Major decisions require an ADR.
- Public APIs and important application services need clear contracts.
- Comments and docs must not contain secrets or live customer data.

---

## 43. Architecture Decision Records

Create an ADR for material decisions such as:

- Replacing a core technology
- Adding a core infrastructure provider
- Changing authentication or authorization strategy
- Changing operational data ownership
- Introducing a new tenant model
- Adding a critical external integration
- Changing production deployment strategy
- Performing a major or destructive migration

Each ADR includes context, decision, alternatives, consequences, date, and approval.

---

## 44. Feature Flags

- Use feature flags only for controlled rollout, experimentation, or safe operational release.
- Flags do not replace authorization.
- Each flag has an owner, purpose, default state, environments, and removal condition.
- Do not leave permanent stale flags.
- Sensitive server behavior must not rely solely on a client-visible flag.

---

## 45. Analytics and Telemetry

- Collect only events with a defined product or operational purpose.
- Do not send unnecessary personal, supplier, commercial, or document data.
- Define event names and properties consistently.
- Respect consent and applicable privacy requirements.
- Analytics do not become the source of truth for operational records.
- Avoid recording sensitive form contents in session replay tools.
- Review third-party telemetry before production activation.

---

## 46. Background Jobs and Automation

When background processing is introduced:

- Jobs must be idempotent or safely retryable.
- Record job state and failure reason.
- Use bounded retries and backoff.
- Send irrecoverable failures to a reviewable state.
- Authenticate job triggers.
- Prevent duplicate side effects.
- Human approval remains required for critical commercial decisions.
- Automation must not publish quotations, confirm payments, or approve inspections without authorized rules.

---

## 47. Email, Messaging, and Notifications

- Notifications must follow authoritative platform state.
- Delivery does not replace recording the business event.
- Do not include unnecessary confidential data.
- Use safe, expiring links where required.
- Templates follow the approved brand and language rules.
- Provide clear sender identity and next action.
- Handle delivery failure and retry without duplicating the underlying business action.

---

## 48. Release Readiness

A release is ready only when:

- Scope is approved and implemented.
- Relevant checks pass.
- Security and authorization are reviewed.
- Database migrations are reviewed and rehearsed where necessary.
- Environment configuration is documented.
- Monitoring and failure handling are sufficient.
- Accessibility, RTL, and mobile workflows are verified.
- Documentation is current.
- Rollback or recovery is understood.
- No unresolved critical defect remains.
- The owner approves production release when required.

---

## 49. Definition of Done

A development task is complete when:

- The requested behavior works as approved.
- The change is scoped and understandable.
- TypeScript, lint, and relevant tests pass.
- Server validation and authorization are enforced.
- Customer/internal data separation is preserved.
- Loading, empty, error, and success behavior are handled.
- Arabic RTL and mobile behavior are verified when affected.
- Accessibility requirements are met.
- Database and storage changes use approved migrations and policies.
- Documentation is updated.
- No secrets or unrelated changes are included.
- The change has been reviewed in proportion to risk.

Code written without verification is not complete.

---

## 50. Prohibited Practices

- Secrets in Git, client code, documentation, or logs
- Disabling TypeScript strictness to avoid fixing errors
- Unvalidated external input
- Client-only authorization
- Unrestricted browser database access
- Disabling RLS as a shortcut
- Returning full internal records to customers
- Publishing unapproved quotations or documents
- Storing money as floating point
- Manual untracked production schema changes
- Destructive migrations without backup and approval
- Using Notion as the long-term transactional backend
- Silent failure or empty catch blocks
- Unbounded retries or queries
- Tests that rely on production data
- Unsupported trust claims or placeholder statistics
- Desktop-only critical workflows
- Hardcoded directional styling that breaks RTL
- Large rewrites without evidence
- Force-pushing or modifying the preserved Claude branch

---

## 51. Exceptions

An exception to these rules requires:

- The affected rule
- Business or technical justification
- Risk assessment
- Scope and duration
- Mitigation
- Owner or delegated approver
- Follow-up or removal date when temporary

Emergency action may occur to contain a live incident, but it must be documented and reviewed afterward. Emergency authority does not permit unrelated expansion.

---

## 52. Governance

The development rules are maintained through documented revisions.

Explicit owner approval is required for:

- Weakening a security or privacy control
- Changing core technology direction
- Changing customer/internal data separation
- Destructive migration
- Changing production deployment authority
- Removing RTL, mobile, or accessibility requirements
- Modifying the preserved reference branch

Implementation details may evolve when they remain within the approved architecture and do not weaken these rules.

---

## 53. Approval Status

**Status:** Active
**Version:** 1.0
**Approved On:** 2026-07-21
**Approved By:** Kawalis China (Owner)

This document has been explicitly approved by the project owner and is now **Active**.

It serves as the official development standard for KC Platform V2.

All future implementation, review, testing, migration, and release work must comply with this document unless a newer approved version supersedes it.

### Acceptance Criteria

This document is active because it:

- Defines engineering, TypeScript, Next.js, Supabase, API, and database rules.
- Enforces server-side security and customer/internal data separation.
- Defines validation, error, logging, rate-limit, file, and integration requirements.
- Makes accessibility, RTL, mobile, and design-system compliance mandatory.
- Establishes testing, review, documentation, migration, and release expectations.
- Defines a complete Definition of Done.
- Protects the preserved Claude branch and prohibits destructive shortcuts.

---

## Related Documents

- `KC-V2-001 — PLATFORM_BLUEPRINT.md`
- `KC-V2-002 — ARCHITECTURE.md`
- `KC-V2-003 — DATA_STRATEGY.md`
- `KC-V2-004 — BRAND_GUIDELINES.md`
- `KC-V2-005 — DESIGN_SYSTEM.md`
- `KC-V2-007 — GIT_WORKFLOW.md`
