# KC Platform V2 — Platform Blueprint

**Document ID:** KC-V2-001
**Status:** Draft
**Version:** 1.0
**Owner:** Kawalis China
**Platform:** KC Platform V2
**Official Branch:** `kc-platform-v2`
**Preserved Reference Branch:** `claude/kawalis-china-sourcing-mvp-hpz3po`

---

## 1. Purpose

This document defines the official product direction, scope, operating model, and development boundaries of KC Platform V2.

It serves as the primary product reference for all future design, technical, operational, and implementation decisions.

All platform work must remain aligned with this blueprint unless a critical architectural, security, or operational issue requires an approved revision.

---

## 2. Platform Vision

KC Platform V2 is a professional sourcing and trade operations platform that helps customers source products from China through a clear, trustworthy, and trackable process.

The platform transforms sourcing from an informal communication-based service into a structured digital journey covering:

- Customer requests
- Product sourcing
- Supplier communication
- Quotations
- Approvals
- Purchasing
- Inspection
- Shipping
- Delivery tracking

The platform should make importing from China easier to understand, safer to manage, and more transparent for customers.

---

## 3. Brand Promise

Kawalis China helps customers understand and navigate the Chinese sourcing and trade ecosystem.

The platform must communicate:

- Trust
- Clarity
- Professionalism
- Transparency
- Operational control
- Local understanding of customer needs
- Practical knowledge of China

**English Tagline:**
China Decoded for the World

**Arabic Tagline:**
نفك شيفرة الصين للعالم

---

## 4. Problem Statement

Customers who want to source products from China often face several challenges:

- Difficulty finding reliable suppliers
- Unclear product specifications
- Inconsistent supplier quotations
- Language and communication barriers
- Limited visibility into request progress
- Poor documentation
- Unclear payment stages
- Weak quality control
- Shipping uncertainty
- Dependence on fragmented WhatsApp conversations
- Lack of a centralized customer record

KC Platform V2 addresses these problems through one structured sourcing and trade workflow.

---

## 5. Target Users

### 5.1 Primary Customers

- Small and medium-sized businesses
- Retailers
- E-commerce sellers
- Importers
- Entrepreneurs
- Startup founders
- Restaurant and café owners
- Project owners
- Companies seeking private-label products
- Customers sourcing equipment, packaging, furniture, or production lines

### 5.2 Internal Users

- Sourcing specialists
- Supplier coordinators
- Quotation reviewers
- Purchasing officers
- Quality inspection staff
- Logistics coordinators
- Finance staff
- Customer service staff
- Platform administrators
- Management

---

## 6. Core Value Proposition

KC Platform V2 provides customers with:

- One structured sourcing request process
- A unique request tracking number
- Clear request status
- Professionally reviewed supplier quotations
- Controlled access to approved information
- Centralized communication
- Organized documents and product details
- Greater visibility across the sourcing journey
- Reduced sourcing risk
- Better decision-making

For the internal team, the platform provides:

- Standardized workflows
- Clear ownership
- Centralized operational data
- Customer history
- Supplier records
- Quotation comparison
- Approval controls
- Auditability
- Reduced manual errors
- Better team coordination

---

## 7. Core Customer Journey

The official customer journey is:

1. The customer visits the Kawalis China website.
2. The customer learns about the sourcing service.
3. The customer submits a sourcing request.
4. The platform validates the submitted information.
5. The request receives a unique tracking number.
6. The customer receives confirmation.
7. The internal team reviews the request.
8. Missing information is requested when required.
9. The sourcing team researches suppliers.
10. Supplier offers are collected internally.
11. Quotations are reviewed and compared.
12. Only approved quotations are shown to the customer.
13. The customer reviews the approved options.
14. The customer selects, rejects, or requests clarification.
15. The project moves to payment and purchasing when approved.
16. Inspection, shipping, customs, and delivery stages are added progressively.
17. The customer tracks the request until completion.

---

## 8. Internal Operating Workflow

The internal workflow should support the following stages:

### 8.1 Request Intake

- Receive customer request
- Validate contact information
- Validate product requirements
- Detect duplicate submissions
- Generate a unique request number
- Store the request securely

### 8.2 Initial Review

- Review customer requirements
- Identify missing information
- Assess request feasibility
- Assign internal ownership
- Define priority and expected response time

### 8.3 Supplier Sourcing

- Search for suitable suppliers
- Record supplier information
- Request pricing and specifications
- Collect documents, photos, videos, and certifications
- Compare supplier suitability

### 8.4 Quotation Review

- Review supplier quotations internally
- Normalize pricing and units
- Add service fees where applicable
- Assess quality, risk, lead time, and terms
- Approve customer-visible quotations

### 8.5 Customer Decision

- Present approved quotations
- Allow customer review
- Record customer selection
- Record requested changes or clarification
- Maintain a decision history

### 8.6 Purchasing

- Confirm final product specifications
- Confirm payment terms
- Create purchase records
- Track supplier payments
- Track order production

### 8.7 Inspection

- Schedule inspection when applicable
- Record inspection findings
- Upload evidence
- Approve, reject, or request correction

### 8.8 Shipping

- Create shipment record
- Record shipping method
- Record container or parcel details
- Track documents
- Track departure and arrival
- Record customs and delivery status

### 8.9 Completion

- Confirm delivery
- Close the request
- Store final documents
- Record customer feedback
- Preserve the complete project history

---

## 9. Platform Scope

KC Platform V2 includes the following approved functional areas:

### 9.1 Public Website

- Homepage
- Service explanation
- How it works
- Trust and credibility sections
- Sourcing request form
- Request tracking entry
- Contact and support information

### 9.2 Customer Portal

- Secure customer access
- Request overview
- Status tracking
- Approved quotations
- Documents
- Messages and updates
- Payment records
- Shipping updates
- Customer actions

### 9.3 Internal Operations Portal

- Request management
- Customer records
- Product records
- Supplier records
- Quotation management
- Approval workflow
- Purchasing records
- Payment tracking
- Inspection records
- Shipment tracking
- Internal notes
- Role-based access

### 9.4 Administrative Functions

- User management
- Permission management
- Status configuration
- Audit logs
- Data control
- Operational reporting
- Platform settings

---

## 10. MVP Scope

The first implementation of KC Platform V2 should focus on the essential sourcing journey.

### 10.1 Included in the MVP

- Professional public website
- Mobile-first sourcing request form
- Unique request number
- Request confirmation
- Request tracking
- Internal request management
- Customer records
- Product request details
- Supplier information
- Internal quotations
- Approved customer quotations
- Customer-visible status
- Secure customer data separation
- Basic customer portal
- Basic admin portal
- Authentication
- Validation
- Rate limiting
- Duplicate submission protection
- Audit-friendly records

### 10.2 Not Required in the Initial MVP

- Full accounting system
- Automated customs clearance
- Advanced warehouse management
- Marketplace functionality
- Supplier self-service portal
- Automated international payments
- Advanced ERP functionality
- Fully automated logistics integrations
- Artificial intelligence decision-making
- Native mobile applications
- Multi-country legal entity management

These capabilities may be introduced later when justified by actual operational needs.

---

## 11. Phased Platform Evolution

### Phase 1 — Documentation and Foundation

- Approve platform documentation
- Define architecture
- Define data strategy
- Define brand and design system
- Define development rules
- Define Git workflow
- Audit the existing MVP

### Phase 2 — Experience Redesign

- Redesign homepage
- Redesign navigation
- Redesign request flow
- Improve mobile experience
- Apply official brand identity
- Improve Arabic RTL experience
- Clarify customer messaging

### Phase 3 — Operational Core

- Implement operational database
- Implement authentication
- Implement request management
- Implement internal quotation workflow
- Implement customer-visible quotation controls
- Implement customer portal
- Implement admin portal

### Phase 4 — Trade Operations

- Add purchasing
- Add payments
- Add inspections
- Add shipping
- Add delivery tracking
- Add document management

### Phase 5 — Automation and Intelligence

- Notifications
- Workflow automation
- Operational dashboards
- Performance analytics
- Assisted supplier comparison
- Assisted quotation review
- AI-enabled internal productivity tools

Automation must support human decisions, not replace critical approval controls without explicit authorization.

---

## 12. Existing MVP Strategy

The existing Claude-built MVP is treated as a preserved reference, not as the final platform architecture.

The project must not be rebuilt blindly.

### 12.1 Preserve When Secure and Maintainable

- Sourcing request workflow
- Unique request number logic
- Request tracking
- Approved quotation visibility rules
- Customer data protection
- Server-side integrations
- Validation
- Rate limiting
- Duplicate submission protection
- Customer-visible DTO restrictions
- Separation of customer and internal data

### 12.2 Redesign or Replace When Justified

- Homepage
- User experience
- Navigation
- Visual design
- Mobile experience
- Customer portal
- Admin experience
- Marketing messaging
- Project structure
- Data access patterns
- Long-term Notion dependency

No working component should be removed without technical or product justification.

---

## 13. Data Direction

KC Platform V2 uses a clear separation between operational and knowledge systems.

### Supabase

Supabase will progressively become responsible for:

- Operational platform data
- Authentication
- Structured customer records
- Requests
- Products
- Suppliers
- Quotations
- Payments
- Inspections
- Shipments
- Permissions
- File storage
- Audit-related records

### Notion

Notion remains responsible for:

- KCOS documentation
- Standard operating procedures
- Knowledge management
- Internal planning
- Research
- Content management
- Management references
- Strategic documentation

Notion must not remain the long-term primary transactional database of KC Platform V2.

Migration must be gradual and must not begin before the relevant data model is approved.

---

## 14. Product Principles

All platform decisions must follow these principles:

### 14.1 Trust Before Complexity

The platform should feel reliable and understandable before it becomes feature-rich.

### 14.2 Mobile First

The primary experience must work smoothly on mobile devices.

### 14.3 RTL First

Arabic interfaces must be treated as a primary experience, not as a secondary translation.

### 14.4 Security by Default

Customer, supplier, quotation, and payment data must be protected by design.

### 14.5 Internal and Customer Data Separation

Customers must see only approved information intended for them.

### 14.6 Human Approval for Critical Decisions

Supplier selection, quotation approval, payment confirmation, inspection approval, and shipping decisions require controlled human authorization.

### 14.7 Gradual Migration

Existing working logic should be preserved where appropriate and migrated carefully.

### 14.8 Operational Simplicity

The platform should reduce operational burden, not create unnecessary complexity.

### 14.9 Auditability

Important changes, approvals, and decisions should be traceable.

### 14.10 No Uncontrolled Expansion

New features should not be introduced unless they solve a confirmed customer or operational problem.

---

## 15. Security Boundaries

The platform must enforce the following boundaries:

- Secrets must remain server-side.
- Customers must not access internal supplier data unless approved.
- Customers must not access internal costs, margins, or notes.
- Customer-visible quotations must be explicitly approved.
- User permissions must follow least-privilege principles.
- Sensitive actions must be authenticated.
- Submitted data must be validated.
- Public forms must include abuse protection.
- Duplicate submissions must be controlled.
- File access must follow permissions.
- Production data must not be exposed in frontend code.
- Administrative actions should be auditable.

---

## 16. Experience Principles

The customer experience must be:

- Clear
- Calm
- Professional
- Premium
- Transparent
- Mobile-friendly
- Easy to navigate
- Easy to understand
- Free from unnecessary technical language

The design must avoid:

- Generic SaaS appearance
- Excessive dashboards
- Visual clutter
- Unnecessary animations
- Overuse of Chinese symbols
- Aggressive sales language
- Confusing status terminology
- Long and intimidating forms

---

## 17. Platform Non-Goals

KC Platform V2 is not intended to become:

- A general marketplace
- A public supplier directory
- A direct replacement for Alibaba
- A social network
- A complete ERP from day one
- A shipping company system
- A customs authority system
- A banking platform
- An uncontrolled supplier bidding platform
- A fully automated sourcing agent without human oversight

The platform exists to support Kawalis China's sourcing and trade operations.

---

## 18. Success Criteria

The platform will be considered successful when it achieves the following:

### Customer Success

- Customers can submit requests easily.
- Customers understand the sourcing process.
- Customers can track request progress.
- Customers receive clear approved quotations.
- Customers trust the platform with their sourcing projects.
- Customers require fewer repetitive follow-ups.

### Operational Success

- Requests are not lost.
- Each request has a clear owner.
- Supplier and quotation information is organized.
- Customer-visible information is controlled.
- Teams can track the complete request history.
- Manual duplication is reduced.
- Operational handoffs are clear.

### Technical Success

- The platform is secure.
- The platform performs well on mobile devices.
- Arabic RTL interfaces work correctly.
- Data is structured and scalable.
- Sensitive data is separated properly.
- The platform can evolve without destructive rebuilding.
- Production changes follow an approved workflow.

---

## 19. Decision Authority

This blueprint is the official product baseline for KC Platform V2.

The following changes require explicit owner approval:

- Major platform scope changes
- New core modules
- Changes to data ownership
- Changes to the customer journey
- Changes to brand identity
- Changes to the official technology direction
- Destructive migrations
- Removal of critical security controls
- Merge or deployment to production

Minor implementation decisions may be made within the approved architecture, provided they do not change the platform intent.

---

## 20. Approval Status

**Current Status:** Draft

This document becomes active only after owner review and explicit approval.

Once approved:

- It becomes the official platform product reference.
- Technical and design documents must align with it.
- Implementation must not expand beyond its approved scope.
- Any future revision must be documented and approved.
