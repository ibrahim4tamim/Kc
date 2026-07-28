# KC Platform V2 — Architecture

**Document ID:** KC-V2-002
**Status:** Active
**Version:** 1.0
**Approved On:** 2026-07-21
**Approved By:** Kawalis China (Owner)
**Owner:** Kawalis China
**Official Branch:** `kc-platform-v2`
**Parent Document:** `KC-V2-001 — PLATFORM_BLUEPRINT.md`

> النسخة التاريخية لمعمارية MVP v1.0 محفوظة كما هي في
> [../legacy/ARCHITECTURE.md](../legacy/ARCHITECTURE.md) ولا تُعدَّل.

---

# 1. Purpose

This document defines the official technical architecture of KC Platform V2.

It establishes the technical foundation that every future implementation must follow.

The architecture defines:

- System boundaries
- Technology stack
- Application layers
- Data ownership
- Authentication
- Authorization
- Security principles
- Deployment strategy
- Migration strategy
- Development constraints

No implementation should contradict this document after approval.

---

# 2. Architecture Principles

The architecture is designed around the following principles:

- Security by Default
- Simplicity Before Complexity
- Server-First Logic
- Mobile-First Experience
- RTL-First Interface
- Modular Design
- Scalable Infrastructure
- Separation of Responsibilities
- Single Source of Truth
- Auditability
- Maintainability

Whenever two technical options exist, the simpler maintainable solution should be preferred unless scalability or security clearly require otherwise.

---

# 3. High-Level Architecture

KC Platform V2 consists of six primary layers.

```text
                 Users
                    │
      ┌─────────────┴─────────────┐
      │                           │
 Public Website            Authenticated Users
      │                           │
      └─────────────┬─────────────┘
                    │
            Next.js Application
                    │
        ┌───────────┼───────────┐
        │           │           │
 Public UI    Customer Portal   Admin Portal
        │           │           │
        └───────────┼───────────┘
                    │
           Application Services
                    │
             Business Logic Layer
                    │
        ┌───────────┼───────────┐
        │                       │
     Supabase              External APIs
        │
 PostgreSQL + Auth + Storage
        │
     Operational Data

                Notion
         Documentation & KCOS
```

---

# 4. Core Technologies

The approved technology stack is:

| Layer | Technology |
|-------|------------|
| Frontend | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| Documentation | Notion |
| Version Control | GitHub |
| Deployment | Vercel (Default) |

Technology replacements require explicit approval.

---

# 5. System Components

The platform consists of the following major modules.

## Public Website

Responsible for:

- Landing Pages
- Services
- Company Information
- Trust Building
- Contact
- RFQ Submission
- SEO Pages
- Blog (Future)

The public website is accessible without authentication.

---

## Customer Portal

Provides secure access for customers.

Customers can:

- Submit Requests
- View Requests
- Review Quotations
- Upload Files
- View Invoices
- Track Shipments
- Communicate with Operations

Customers must never access internal operational data.

---

## Internal Operations Portal

Used by the Kawalis China team.

Responsible for:

- Customer Management
- Request Processing
- Supplier Management
- Quotations
- Purchasing
- Inspections
- Shipping
- Documents
- Internal Notes
- Reporting

Access is controlled through authentication and authorization.

---

## Administration

Responsible for:

- User Management
- Permissions
- System Configuration
- Audit Review
- Global Settings
- Operational Control

Administrative functions are restricted to authorized personnel only.

---

# 6. Application Layers

The application follows a layered architecture.

## Presentation Layer

Responsible for:

- UI Components
- Pages
- Forms
- Navigation
- Responsive Layouts
- Accessibility

This layer must not contain sensitive business logic.

---

## Application Layer

Responsible for:

- Business Workflows
- Validation
- Authorization
- Coordination
- Use Cases
- Service Logic

All sensitive operations pass through this layer.

---

## Data Layer

Responsible for:

- Database Access
- Queries
- Transactions
- Relationships
- Persistence

Direct uncontrolled database access is prohibited.

---

## Integration Layer

Responsible for:

- Email
- WhatsApp
- Payment Gateways
- Shipping Providers
- Future APIs
- Internal Synchronization

External services must remain isolated from core business logic.

---

# 7. Data Ownership

Every type of information has one official owner.

## Operational System Principle

The KC Platform Dashboard is the sole operational interface for all day-to-day business activities. All operational workflows must be executed through the Dashboard, including customer and organization management; users, roles, and permissions; RFQs and product requests; suppliers and quotations; customer approvals; purchase orders; manufacturing follow-up; inspections; shipments and containers; payments, invoices, and balance tracking; notifications; tasks and internal approvals; activity history, reporting, and operational documents.

Employees must be able to complete daily operational work entirely through the KC Platform Dashboard. Supabase is the authoritative operational data store, and the Dashboard is its operational interface.

Notion is a non-operational knowledge and documentation system. It must never act as an operational database or workflow engine; be required for daily operational work; store authoritative operational business records that belong to Supabase; or become a dependency for customer, supplier, quotation, purchasing, inspection, shipment, payment, approval, or internal operational workflows. It must not be the primary interface for creating, updating, approving, or tracking operational records.

Any current operational dependency on Notion is classified as a temporary legacy MVP dependency only and must not be expanded. All KC Platform V2 operational capabilities must be implemented through the Dashboard and stored in Supabase.

---

## Supabase

Owns all operational data including:

- Users
- Customers
- Requests
- Products
- Suppliers
- Quotations
- Purchases
- Payments
- Shipments
- Inspections
- Attachments
- Audit Records

Supabase is the operational source of truth.

---

## Notion

Owns organizational knowledge including:

- KCOS
- SOPs
- Documentation
- Policies
- Research
- Templates
- Strategic Planning
- Internal Knowledge

Notion is not the operational database.

---

# 8. Authentication

Authentication is managed by Supabase Auth.

Supported account types include:

- Customer Accounts
- Employee Accounts
- Administrator Accounts

Authentication responsibilities include:

- Secure Sign In
- Secure Sign Out
- Password Reset
- Session Management
- Email Verification
- Future Multi-Factor Authentication (MFA)

Authentication confirms **who the user is**.

Authentication alone never grants access to data.

---

# 9. Authorization

Authorization determines **what an authenticated user can access**.

The platform follows Role-Based Access Control (RBAC).

Example roles include:

- Customer
- Customer Service
- Sourcing Specialist
- Purchasing Officer
- Inspection Team
- Logistics Coordinator
- Finance
- Operations Manager
- Administrator

Every protected request must verify:

1. Authentication
2. Authorization
3. Resource Ownership

Hidden UI elements are **not** considered security.

All permission checks must occur on the server.

---

# 10. Row-Level Security (RLS)

All sensitive operational tables must use Supabase Row-Level Security.

Examples:

- Customers can only read their own requests.
- Customers can only view approved quotations.
- Employees only access records permitted by their role.
- Administrators have elevated access according to policy.

Service Role credentials must never be exposed to the browser.

---

# 11. Customer vs Internal Data

Customer data and internal operational data must remain separated.

Customers may view:

- Approved Quotations
- Shipment Status
- Inspection Reports
- Customer Documents
- Payment Information
- Public Messages

Customers must never view:

- Internal Notes
- Supplier Negotiations
- Internal Costs
- Profit Margins
- Internal Risk Assessments
- Employee Discussions
- Draft Quotations
- Internal Workflow Metadata

Every customer response should be intentionally prepared.

The frontend must never expose complete database records.

---

# 12. API Architecture

All business operations are executed through secure server-side endpoints.

Responsibilities include:

- Validation
- Authentication
- Authorization
- Business Rules
- Logging
- Error Handling

API principles:

- Validate all input.
- Return only required data.
- Never expose secrets.
- Never expose unnecessary database fields.
- Use consistent responses.
- Keep sensitive logic on the server.

---

# 13. Validation

Every external input must be validated.

Validation applies to:

- Forms
- API Requests
- Query Parameters
- Uploaded Files
- Payment Values
- Dates
- Status Updates
- Customer Actions

Validation occurs on:

- Client (UX)
- Server (Security)

Server-side validation is mandatory.

---

# 14. Request Tracking

Every sourcing request receives two identifiers.

## Internal ID

Used by the platform.

Characteristics:

- Database Identifier
- Never exposed publicly
- Used internally

## Public Tracking ID

Visible to customers.

Requirements:

- Unique
- Difficult to guess
- Stable
- Safe to share

Public IDs must never reveal database sequence numbers.

---

# 15. File Storage

Operational files are stored in Supabase Storage.

Supported categories:

- Product Images
- Product Specifications
- Supplier Quotations
- Certifications
- Inspection Photos
- Inspection Videos
- Shipping Documents
- Payment Receipts
- Customer Attachments

Storage requirements:

- Authentication Required
- File Size Limits
- File Type Restrictions
- Secure URLs
- Permission-Based Access

Sensitive files must never be publicly accessible.

---

# 16. Status System

The platform separates operational statuses into independent categories.

Examples include:

- Request Status
- Quotation Status
- Approval Status
- Payment Status
- Inspection Status
- Shipment Status

Internal workflow statuses should not automatically appear to customers.

Customer-facing statuses should remain simple and understandable.

Every status change should record:

- Previous Status
- New Status
- Timestamp
- Responsible User
- Optional Notes

---

# 17. Audit Logging

Critical business operations must be traceable.

Audit events include:

- Request Creation
- Status Changes
- Quotation Approval
- Price Changes
- Payment Confirmation
- Shipment Updates
- Permission Changes
- User Administration
- Document Visibility Changes

Audit logs should be immutable whenever possible.

---

# 18. Security Principles

The platform follows a Security-by-Default philosophy.

Security requirements include:

- Environment Variables
- Least Privilege
- Server-Side Authorization
- Secure Sessions
- Input Validation
- Rate Limiting
- CSRF Protection
- Secure File Access
- Audit Logging
- Dependency Updates

Secrets must never be committed to Git.

Production credentials must never be exposed to client-side code.

---

# 19. Abuse Protection

Public endpoints require abuse prevention.

Protected features include:

- Login
- Registration
- Contact Forms
- RFQ Submission
- File Uploads
- Password Reset

Protection techniques may include:

- Rate Limiting
- CAPTCHA
- Duplicate Detection
- Request Throttling
- Logging Suspicious Activity

Protection mechanisms should minimize friction for legitimate users.

---

# 20. Error Handling

Errors must be handled consistently.

Customer-facing messages should be:

- Clear
- Friendly
- Non-Technical
- Actionable

Internal logs may contain technical information but must never store:

- Passwords
- Tokens
- Secrets
- Sensitive Payment Data

Unexpected failures should generate traceable log entries.

---

# 21. Logging and Monitoring

The platform should progressively support operational monitoring.

Monitoring includes:

- Application Errors
- Authentication Failures
- API Failures
- Integration Failures
- Performance Metrics
- Security Events
- Database Health
- Infrastructure Status

Monitoring tools should collect only the information necessary for troubleshooting and operational awareness.

---

# 22. Performance Strategy

Performance is a core architectural requirement.

The platform should prioritize:

- Mobile-first performance
- Fast initial page load
- Server-side rendering where beneficial
- Optimized database queries
- Image optimization
- Lazy loading
- Pagination
- Efficient caching
- Indexed database columns

Real-time functionality should only be introduced where it provides clear business value.

---

# 23. Accessibility

Accessibility must be considered from the beginning of development.

The platform should support:

- Semantic HTML
- Keyboard Navigation
- Screen Readers
- Visible Focus States
- Accessible Forms
- Proper Labels
- Color Contrast
- Responsive Typography
- Reduced Motion Preferences

Accessibility is a design requirement, not a post-development enhancement.

---

# 24. RTL and Localization

Arabic is the primary language of the platform.

The interface must support:

- RTL Layout
- Logical CSS Properties
- Arabic Typography
- Mixed Arabic and English Content
- Responsive RTL Navigation
- Correct Icon Mirroring
- Localized Dates
- Localized Numbers where appropriate

Developers should avoid hardcoded left and right positioning.

Preferred CSS properties include:

- margin-inline
- padding-inline
- inset-inline
- border-inline

---

# 25. Responsive Design

The application follows a Mobile-First approach.

Supported devices include:

- Mobile Phones
- Tablets
- Laptops
- Desktop Computers

Core workflows must remain fully functional on mobile devices, including:

- RFQ Submission
- Customer Login
- Request Tracking
- Quotation Review
- Shipment Tracking
- Customer Communication

Desktop-only workflows are discouraged unless operationally justified.

---

# 26. External Integrations

External services must communicate through controlled integration layers.

Potential integrations include:

- Email Services
- WhatsApp
- Payment Gateways
- Shipping Providers
- Accounting Systems
- Analytics Platforms
- Customer Support Systems

Each integration should define:

- Purpose
- Authentication Method
- Data Flow
- Failure Handling
- Retry Policy
- Logging Requirements

No third-party integration may directly control core business data without server-side validation.

---

# 27. Notion Integration

Notion remains the official documentation platform.

Approved responsibilities include:

- KCOS Documentation
- SOPs
- Internal Knowledge
- Research
- Templates
- Strategic Planning

Notion must not:

- Authenticate Users
- Store Customer Passwords
- Replace Operational Database
- Store Financial Transactions
- Manage Customer Permissions
- Expose Operational Records

Operational data belongs to Supabase.

---

# 28. Migration Strategy

Migration from the existing MVP should occur gradually.

Approved sequence:

1. Audit Existing Codebase
2. Identify Reusable Components
3. Document Current Data
4. Design New Data Model
5. Configure Supabase
6. Implement New Architecture
7. Create Migration Scripts
8. Test Using Non-Production Data
9. Validate Data Integrity
10. Execute Controlled Migration
11. Verify Platform Stability
12. Retire Legacy Components

No destructive migration should occur without backup and approval.

---

# 29. Existing MVP Reuse Policy

Existing code should be preserved when it is:

- Secure
- Well Structured
- Maintainable
- Compatible
- Understandable
- Cost Effective to Maintain

Existing code should be replaced when it:

- Creates Security Risks
- Prevents Scalability
- Exposes Sensitive Data
- Violates Approved Architecture
- Is Difficult to Maintain
- Cannot Support Required Permissions

Reuse decisions should be based on technical evidence rather than preference.

---

# 30. Environment Strategy

Separate environments must be maintained.

Recommended environments:

- Local Development
- Preview
- Staging
- Production

Each environment should use separate:

- Environment Variables
- Database Credentials
- API Keys
- Storage Configuration
- Authentication Settings

Production secrets must never be used during development.

---

# 31. Deployment Strategy

Deployment follows a Git-based workflow.

Recommended flow:

Feature Branch
→ Pull Request
→ Review
→ Testing
→ Approval
→ Merge
→ Production Deployment

Deployment requirements:

- Successful Build
- Code Review
- Documentation Updated
- No Critical Errors
- Approval Before Production

Direct production changes are prohibited.

---

# 32. Backup and Recovery

Critical platform data must be recoverable.

Backup scope includes:

- Database
- Uploaded Files
- Configuration
- Infrastructure
- Migration Scripts

Recovery planning should define:

- Recovery Owner
- Recovery Process
- Integrity Verification
- Incident Documentation

---

# 33. Data Retention

Operational records should follow controlled retention policies.

The platform should support:

- Soft Delete
- Archiving
- Permanent Deletion When Approved
- Audit Preservation

Deletion should never compromise operational history or legal obligations.

---

# 34. Architecture Decision Records (ADR)

Major technical decisions should be documented.

Each ADR should include:

- Context
- Decision
- Alternatives
- Consequences
- Approval
- Date

Examples:

- Technology Changes
- Authentication Changes
- Database Changes
- Infrastructure Changes
- Deployment Changes

---

# 35. Prohibited Patterns

The following practices are prohibited:

- Secrets in Frontend Code
- Secrets Committed to Git
- Direct Browser Access to Sensitive Tables
- Customer Access to Internal Data
- Authorization Only in the Frontend
- Public Storage of Sensitive Files
- Destructive Database Changes Without Backup
- Unreviewed Production Deployments
- Uncontrolled Third-Party Integrations
- Business Logic Inside UI Components

---

# 36. Initial Deliverables

Before production development begins, the following documents must be approved:

- Platform Blueprint
- Architecture
- Data Strategy
- Brand Guidelines
- Design System
- Development Rules
- Git Workflow
- Initial Database Model
- Permission Matrix
- Migration Plan

Implementation starts only after the architectural foundation is approved.

---

# 37. Architecture Acceptance Criteria

This document is considered complete when:

- Responsibilities are clearly separated.
- Supabase is the operational source of truth.
- Notion is the documentation source of truth.
- Customer and internal data are isolated.
- Authentication and authorization are independent.
- Sensitive operations remain server-side.
- Mobile-first principles are preserved.
- RTL support is guaranteed.
- Migration strategy is documented.
- Deployment workflow is controlled.
- Security principles are enforced.

---

# 38. Decision Authority

Changes requiring explicit approval include:

- Replacing Next.js
- Replacing Supabase
- Changing Operational Database Ownership
- Replacing Authentication Provider
- Weakening Security Controls
- Major Infrastructure Changes
- Destructive Migration
- Production Deployment Strategy Changes

Minor implementation details may evolve without changing the approved architecture.

---

# 39. Related Documents

- KC-V2-001 — Platform Blueprint
- KC-V2-003 — Data Strategy
- KC-V2-004 — Brand Guidelines
- KC-V2-005 — Design System
- KC-V2-006 — Development Rules
- KC-V2-007 — Git Workflow

---

# 40. Approval Status

**Status:** Active
**Approved On:** 2026-07-21
**Approved By:** Kawalis China (Owner)

This document has been explicitly approved by the project owner and is now **Active**.

It serves as the official technical architecture reference for KC Platform V2.

All implementation decisions must comply with this document unless a newer approved version supersedes it.
