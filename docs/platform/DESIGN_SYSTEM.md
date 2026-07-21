# KC Platform V2 — Design System

**Document ID:** KC-V2-005
**Status:** Active
**Version:** 1.0
**Approved On:** 2026-07-21
**Approved By:** Kawalis China (Owner)
**Owner:** Kawalis China
**Platform:** KC Platform V2
**Official Branch:** `kc-platform-v2`
**Parent Documents:** `KC-V2-001 — PLATFORM_BLUEPRINT.md`, `KC-V2-004 — BRAND_GUIDELINES.md`

---

## 1. Purpose

This document defines the official interface design system for KC Platform V2.

It translates the frozen Kawalis China brand into implementation-ready foundations, patterns, and component rules for the public website, sourcing request flow, customer portal, internal operations portal, and administrative interfaces.

The system is designed to provide:

- A consistent visual language
- Arabic RTL-first behavior
- Mobile-first usability
- Accessible interaction
- Clear operational information
- Reusable implementation rules
- A premium editorial identity without visual clutter

This document defines the system contract. It does not require building a complete component library before the components are needed.

---

## 2. Design Direction

The approved direction is:

> **Editorial Luxury + Modern Trade Platform**

The experience combines calm editorial presentation with the clarity, reliability, and density controls required by sourcing and trade operations.

### Core Qualities

- Professional
- Trustworthy
- Calm
- Premium
- Precise
- Human
- Operationally clear
- Culturally respectful

### Product Principles

- Arabic and RTL are primary, not adaptations.
- Mobile workflows must be complete, not reduced demos.
- Trust comes from process evidence and clarity.
- Decoration must never compete with an action or status.
- Customer-visible information must be intentionally presented.
- Internal interfaces may be denser than marketing pages, but never confusing.
- Accessibility is part of the component contract.

---

## 3. Design Tokens

All repeated visual decisions must be represented by semantic tokens rather than scattered literal values.

Token layers:

1. **Primitive tokens** — raw colors, dimensions, and font values.
2. **Semantic tokens** — purpose-based values such as `surface-primary` or `text-muted`.
3. **Component tokens** — scoped values such as `button-primary-background`.

Components should consume semantic or component tokens. Primitive values should remain centralized.

### Naming Pattern

```text
<category>-<role>-<state>-<variant>
```

Examples:

```text
color-text-primary
color-surface-brand
color-border-danger
space-section-lg
radius-control-md
shadow-card-rest
```

Tokens must describe purpose rather than a temporary appearance. Prefer `color-action-primary` over `color-red-button`.

---

## 4. Color System

### 4.1 Official Brand Colors

| Token | Value | Role |
|---|---:|---|
| `brand-gold` | `#C9A24A` | Premium accents and selected highlights |
| `brand-red` | `#CC2828` | Primary action and brand emphasis |
| `brand-charcoal` | `#222222` | Primary text and dark surfaces |
| `brand-ivory` | `#F8F5EF` | Primary warm page background |

These values are frozen. Derived tones may support interaction and accessibility but must not replace the official brand colors in logo assets.

### 4.2 Neutral Tokens

The implementation must define a restrained neutral scale derived to work with charcoal and ivory.

Recommended semantic roles:

| Token | Purpose |
|---|---|
| `surface-page` | Primary page canvas, normally ivory |
| `surface-card` | Elevated content surface |
| `surface-subtle` | Quiet grouped content |
| `surface-inverse` | Charcoal or approved dark surface |
| `text-primary` | Primary readable text |
| `text-secondary` | Supporting text |
| `text-muted` | Low-emphasis metadata that remains accessible |
| `text-inverse` | Text on dark surfaces |
| `border-default` | Standard separation |
| `border-strong` | Emphasized boundary |
| `border-subtle` | Quiet separation |

Exact derived values must be centralized in the implementation and verified for contrast.

### 4.3 Semantic Colors

Brand red and gold are not universal status colors. The design system must define distinct accessible semantic colors for:

- Success
- Information
- Warning
- Error or danger
- Neutral or pending

Each semantic family must provide:

- Text color
- Icon color
- Border color
- Subtle background
- Strong background where required
- Hover and active states for interactive use

### 4.4 Color Rules

- Never use color as the only status indicator.
- Gold must not be used for small body text on ivory or white.
- Red actions must not make every page feel dangerous or urgent.
- Customer and internal statuses must use consistent semantic mappings.
- Disabled controls must remain readable and identifiable.
- Hover states are supplementary; touch users must receive the same information.
- Contrast must meet WCAG 2.2 AA for normal product use.

---

## 5. Typography

### 5.1 Font Families

| Language | Primary typeface | Fallback direction |
|---|---|---|
| Arabic | IBM Plex Sans Arabic | Compatible Arabic system sans-serif |
| English and Latin | Montserrat | Compatible system sans-serif |

Gotham may be used only when properly licensed and available. The platform must not download or bundle unauthorized font files.

### 5.2 Type Roles

The system must define the following roles:

- Display
- Page title
- Section title
- Subsection title
- Body large
- Body
- Body small
- Label
- Caption
- Data or tabular value

### 5.3 Recommended Responsive Scale

| Role | Mobile | Desktop | Weight guidance |
|---|---:|---:|---|
| Display | 36px | 56px | 600–700 |
| Page title | 30px | 40px | 600–700 |
| Section title | 24px | 32px | 600 |
| Subsection title | 20px | 24px | 600 |
| Body large | 18px | 20px | 400–500 |
| Body | 16px | 16px | 400 |
| Body small | 14px | 14px | 400–500 |
| Caption | 12px | 12px | 400–500 |

The implementation may refine line height and letter spacing by language while preserving hierarchy.

### 5.4 Typography Rules

- Arabic body text must use a comfortable line height.
- Avoid applying Latin letter-spacing conventions to Arabic.
- Headings should be concise and scannable.
- Long content needs readable line length.
- Tabular numbers may use supported numeric features where helpful.
- Tracking references, codes, prices, and units must remain unambiguous.
- Do not use typography alone to indicate interactive behavior.

---

## 6. Spacing System

Use a consistent spacing scale based on a 4px foundation.

| Token | Value |
|---|---:|
| `space-0` | 0 |
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |
| `space-20` | 80px |
| `space-24` | 96px |

### Rules

- Use tighter spacing inside related controls.
- Use larger spacing between unrelated groups and page sections.
- Marketing pages may use a more generous editorial rhythm.
- Operational screens should prioritize scanability without becoming cramped.
- Do not introduce one-off spacing values without a confirmed need.

---

## 7. Layout and Grid

### 7.1 Page Container

Pages use a centered responsive container with logical inline padding.

Recommended maximum widths:

- Reading content: approximately 720px
- Standard application content: approximately 1200px
- Wide operational tables: approximately 1440px when required

### 7.2 Grid

- Use a fluid mobile-first grid.
- Mobile layouts begin with one primary column.
- Add columns only when content relationships and available width justify them.
- Forms should not become multi-column merely to reduce page length.
- Important actions and status summaries remain visible in the natural reading order.

### 7.3 Logical Properties

Use logical CSS properties:

```css
margin-inline
margin-block
padding-inline
padding-block
inset-inline
border-inline
text-align: start
```

Avoid hardcoded `left` and `right` except when a physical direction is truly required.

---

## 8. Breakpoints

The implementation should use content-driven breakpoints. Recommended starting points:

| Name | Minimum width | Typical use |
|---|---:|---|
| `sm` | 640px | Large phones and small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops and compact desktop layouts |
| `xl` | 1280px | Wide application layouts |
| `2xl` | 1536px | Optional wide operational content |

### Rules

- Build the mobile experience first.
- Do not hide essential features on mobile.
- Test at widths between named breakpoints.
- Breakpoints must respond to content failure, not device labels alone.
- Touch targets remain usable at all sizes.

---

## 9. Shape and Border Radius

The platform uses restrained, modern rounding.

| Token | Value | Use |
|---|---:|---|
| `radius-none` | 0 | Data separators or edge-aligned surfaces |
| `radius-sm` | 6px | Small labels and compact controls |
| `radius-md` | 10px | Inputs and buttons |
| `radius-lg` | 16px | Cards and grouped panels |
| `radius-xl` | 24px | Selected editorial surfaces |
| `radius-full` | 9999px | Avatars and approved pill controls |

Avoid excessive rounded containers and nested "card inside card" layouts.

---

## 10. Elevation and Shadows

Elevation must remain subtle.

Recommended levels:

- `shadow-none` — flat surfaces
- `shadow-sm` — quiet card separation
- `shadow-md` — menus, popovers, and selected floating content
- `shadow-lg` — dialogs only when required

### Rules

- Prefer border, background, and spacing before adding shadow.
- Do not use glow, bevel, or heavy glossy effects.
- Elevated content must still have a clear boundary in high-contrast or reduced-visual environments.
- Shadow does not replace focus indication.

---

## 11. Iconography

- Use one coherent icon family.
- Keep stroke weight and optical size consistent.
- Icons support text labels where meaning is not universal.
- Directional icons mirror correctly in RTL.
- Brand and semantic colors are applied by purpose.
- Decorative icons must not increase cognitive load.
- Interactive icons require accessible names and adequate targets.

Recommended product icon sizes:

- 16px for compact metadata
- 20px for standard controls
- 24px for prominent controls
- Larger sizes only for intentional empty states or feature explanations

---

## 12. Motion

Motion must clarify change, hierarchy, or feedback.

### Approved Uses

- Menu and dialog transitions
- Expand and collapse behavior
- Step transitions
- Loading and completion feedback
- Subtle page or section entry where it does not delay use

### Rules

- Typical interface duration: 120–240ms.
- Avoid long or theatrical transitions in operational workflows.
- Respect `prefers-reduced-motion`.
- Do not use animation as the only explanation of state.
- Never animate the official logo without explicit approval.

---

## 13. Interaction States

Every interactive component must define:

- Default
- Hover when relevant
- Focus-visible
- Active or pressed
- Disabled
- Loading when relevant
- Error or invalid when relevant
- Selected when relevant

### Requirements

- Focus-visible states must be clearly distinguishable.
- Disabled elements must not appear interactive.
- Loading states must prevent accidental duplicate submission where required.
- Destructive actions require explicit visual and textual treatment.
- Touch interactions must not depend on hover.

---

## 14. Buttons

### 14.1 Variants

**Primary** — the main action in a view, typically using Chinese Red.
**Secondary** — important alternative action with restrained emphasis.
**Tertiary or ghost** — low-emphasis action.
**Danger** — destructive or high-risk action using semantic danger styling.
**Link** — navigation or low-friction contextual action.

### 14.2 Sizes

- Small: compact internal interfaces only
- Medium: default
- Large: prominent mobile and marketing actions

### 14.3 Rules

- Use clear action verbs.
- Prefer one primary action per logical section.
- Minimum touch target should be approximately 44×44px.
- Loading buttons preserve their width and communicate progress.
- Icon-only buttons require accessible labels.
- Destructive actions must not use brand red merely because it is available; danger semantics must be clear.
- Disabled buttons must not be used to hide unexplained requirements; explain what is missing.

---

## 15. Links

- Links must be visually identifiable without relying only on color in body content.
- External links should be indicated when the distinction matters.
- Links and buttons must not be styled interchangeably when their behavior differs.
- Tracking references may be links only when they navigate to a permitted record.
- Focus, hover, visited, and active behavior must remain accessible.

---

## 16. Form Foundations

Forms are central to the sourcing journey and must be clear, forgiving, and secure.

### 16.1 General Rules

- Labels remain visible; placeholders do not replace labels.
- Required and optional fields are identified consistently.
- Help text explains format or purpose before an error occurs.
- Server validation remains authoritative.
- Preserve user input after recoverable errors.
- Use sensible defaults without making commercial assumptions.
- Long forms should be divided into meaningful steps.
- Display a review step when submission has material consequences.

### 16.2 Field Anatomy

A field may include:

1. Label
2. Required or optional indicator
3. Control
4. Supporting hint
5. Validation or error message
6. Character, file, or unit constraint when relevant

### 16.3 Error Behavior

- Place field errors next to the affected control.
- Provide an error summary for long or multi-step forms.
- Move focus appropriately after failed submission.
- Use human, actionable language.
- Do not expose internal errors or validation implementation details.

---

## 17. Text Inputs and Text Areas

- Default control height should support comfortable touch use.
- Use a visible border and clear focus ring.
- Align Arabic text to the logical start.
- Allow deliberate LTR direction for emails, URLs, codes, and tracking references.
- Text areas should resize or provide adequate space for detailed product requirements.
- Prefixes and suffixes must not obscure the entered value.
- Maximum lengths should reflect real storage and operational requirements.

---

## 18. Selects, Comboboxes, and Autocomplete

- Use native select behavior when it meets the requirement.
- Use searchable comboboxes for long lists such as countries or suppliers.
- Keyboard and screen-reader interaction must follow established patterns.
- Selected values must remain visible and removable where multiple selection is allowed.
- Do not load unrestricted sensitive internal options into the browser.
- Use stable codes for stored values and localized labels for display.

---

## 19. Radio Buttons, Checkboxes, and Switches

**Radio buttons** select one option from a visible set.
**Checkboxes** select zero or more independent options or confirm a statement.
**Switches** change an immediate setting state.

### Rules

- Provide a clear group label.
- Make the label and control one touch target.
- Do not use switches for destructive actions or decisions requiring confirmation.
- Do not preselect consent or optional marketing choices.
- Explain consequences when a setting changes customer visibility or workflow behavior.

---

## 20. Date, Time, Currency, and Quantity Inputs

- Store timestamps in UTC and present them in the appropriate locale and time zone.
- Preserve unambiguous machine values behind localized presentation.
- Every monetary value includes a currency.
- Quantities include a unit when necessary.
- Accept Arabic and Latin numeral input when practical without changing identifiers.
- Avoid date formats that can be interpreted in multiple ways.
- Do not use floating-point arithmetic for commercial amounts.

---

## 21. File Upload

The upload component must communicate:

- Allowed types
- Maximum size
- Maximum count
- Upload progress
- Success or failure
- Removal or replacement behavior
- Customer or internal visibility when relevant

### Rules

- Support keyboard and touch selection; drag and drop is optional enhancement.
- Show safe previews only for supported formats.
- Do not imply that upload equals approval.
- Prevent duplicate submissions while uploads finalize.
- Explain when a file is internal or customer-visible.
- Errors must distinguish type, size, network, and authorization problems.

---

## 22. Multi-step Sourcing Request Form

The RFQ form should reduce cognitive load while preserving required detail.

### Recommended Structure

1. Contact or account context
2. Product basics
3. Specifications and quantity
4. Commercial and timing context
5. Attachments
6. Review and submit

The exact steps may adapt to the approved product workflow.

### Requirements

- Show current step and overall progress.
- Use meaningful step names, not numbers alone.
- Allow back navigation without losing data.
- Validate the current step without blocking harmless exploration.
- Provide a final review before submission.
- Prevent accidental duplicate submissions.
- Confirm success with the public tracking reference and next expectation.
- Do not expose the internal database identifier.

---

## 23. Cards and Surfaces

Cards group related content; they must not become the default wrapper for every element.

### Card Types

- Editorial or service card
- Request summary card
- Quotation card
- Status summary card
- Action-required card
- Metric card for verified operational data

### Rules

- Use one clear heading.
- Keep primary action placement consistent.
- Avoid nested cards.
- Distinguish interactive cards from static cards.
- Do not show unsupported statistics.
- Use borders and subtle surfaces before heavy shadows.

---

## 24. Status Indicators

Statuses must combine:

- Clear text
- Semantic color
- Optional icon
- Supporting explanation when needed

### Status Families

- Neutral or not started
- In progress
- Waiting for customer
- Waiting internally
- Approved or completed
- Warning or attention
- Rejected, failed, or cancelled

### Rules

- Internal and customer-visible statuses are separate mappings.
- A red brand accent is not automatically an error.
- Use concise labels and explain the next step nearby.
- Status changes must not rely on animation.
- Status chips should not become an uncontrolled rainbow of colors.

---

## 25. Badges and Tags

Badges represent compact metadata, not full explanations.

- Use sentence case.
- Keep labels short.
- Use consistent semantic variants.
- Avoid excessive pills in tables and cards.
- Do not use a badge as the sole warning for a critical condition.
- Interactive filters must be distinguishable from static tags.

---

## 26. Alerts and Feedback

### Variants

- Information
- Success
- Warning
- Error

### Rules

- State what happened.
- Explain the consequence or next action.
- Use an accessible heading for important alerts.
- Do not dismiss critical information automatically.
- Place local alerts near the related task.
- Use page-level alerts for broader system conditions.
- Never include secrets or technical stack traces.

---

## 27. Toasts

Toasts provide brief confirmation for non-critical actions.

- Keep messages concise.
- Do not use a toast as the only record of a critical failure.
- Allow sufficient reading time.
- Pause or preserve access for assistive technology when required.
- Avoid stacking many notifications.
- Provide persistent inline recovery for actions the user must fix.

---

## 28. Empty States

An empty state should explain:

- What the section contains
- Why it is currently empty
- What the user can do next

Use calm, useful language. Illustration is optional and must not overwhelm the action. Distinguish no data, no search results, restricted access, and temporary loading failure.

---

## 29. Loading States

- Use skeletons for predictable content structure.
- Use progress indicators for actions with meaningful duration.
- Preserve context during refreshes.
- Avoid layout shifts.
- Prevent duplicate actions while a critical mutation is pending.
- Do not show indefinite loading without timeout, recovery, or error handling.
- Use optimistic updates only when reversal and reconciliation are safe.

---

## 30. Tables and Data Lists

Tables are appropriate for structured comparison and operational work.

### Requirements

- Use clear column headings.
- Align text to logical start.
- Align comparable numbers consistently.
- Keep essential identifiers and status visible.
- Support horizontal overflow deliberately on small screens.
- Provide a mobile list or priority-column treatment when a full table becomes unusable.
- Define loading, empty, error, and pagination states.
- Keep row actions discoverable and keyboard accessible.

### Rules

- Do not expose internal columns to customers.
- Avoid excessive columns by default.
- Filters and sorting must reflect real query behavior.
- Selection must communicate scope across pagination.
- Destructive bulk actions require confirmation and permission.

---

## 31. Quotation Presentation

Quotation interfaces must preserve commercial clarity and version integrity.

Customer-visible quotation views should show only approved fields, such as:

- Approved product description
- Quantity and unit
- Customer price and currency
- Approved lead-time information
- Approved terms and validity
- Customer actions

They must not expose:

- Internal supplier cost
- Margin
- Supplier private contact data
- Internal negotiation notes
- Draft or rejected versions
- Internal risk assessment

### Comparison Rules

- Compare equivalent units and terms.
- State when values are estimates.
- Preserve currency context.
- Avoid visually declaring a "best" option unless approved criteria justify it.
- Customer decisions must reference the exact quotation version displayed.

---

## 32. Navigation

### Public Navigation

Keep the primary structure concise:

- Home
- Services
- How it works
- Start a sourcing request
- Track a request
- Contact or support

Exact labels may be refined through content design.

### Authenticated Navigation

Customers should reach requests, actions, quotations, documents, and support without navigating internal operational concepts.

Internal navigation may expose operational modules according to role.

### Rules

- Reflect RTL order correctly.
- Highlight the current location.
- Preserve essential actions on mobile.
- Do not overload the top-level navigation.
- Hide unauthorized destinations on the client while enforcing access on the server.

---

## 33. Breadcrumbs

Use breadcrumbs for deep operational hierarchy, not simple top-level pages.

- Follow logical RTL order.
- Use meaningful labels rather than raw IDs alone.
- The current page is identifiable and normally not a link.
- Breadcrumbs supplement, not replace, clear page titles and back behavior.

---

## 34. Tabs

- Use tabs for peer sections of the same context.
- Keep tab labels short and stable.
- Do not use tabs as a substitute for a long sequential workflow.
- Support keyboard navigation.
- Preserve selected state in navigation when appropriate.
- Use scroll or an alternative pattern when tabs overflow on mobile.

---

## 35. Dialogs, Drawers, and Confirmation

### Dialogs

Use for focused decisions that require interruption, such as confirming a destructive action.

### Drawers

Use for supporting details or compact workflows when preserving the underlying context is valuable.

### Rules

- Move focus into the overlay and restore it on close.
- Trap focus only while a modal interaction is active.
- Provide a visible title and close mechanism.
- Do not place long, primary workflows in small dialogs.
- Confirm destructive, irreversible, or commercially material actions.
- Explain the consequence and identify the affected record.

---

## 36. Tooltips and Help

- Tooltips explain unfamiliar icons or brief concepts.
- Essential instructions must remain visible without hover.
- Tooltips must support keyboard and touch access.
- Use inline help or expandable explanations for complex sourcing terms.
- Do not hide legal, pricing, or visibility implications inside a tooltip alone.

---

## 37. Pagination, Search, and Filters

### Pagination

- Use server-aware pagination for large operational datasets.
- Preserve filters and sort state.
- Communicate the current result range when useful.

### Search

- Explain what fields can be searched when not obvious.
- Protect sensitive results according to role and ownership.
- Debounce responsibly without hiding explicit submit behavior where helpful.

### Filters

- Use known status, date, owner, customer, or workflow dimensions.
- Show active filters clearly.
- Provide a reset action.
- Make mobile filter interfaces usable without permanent screen obstruction.

---

## 38. Authentication Interfaces

- Use clear sign-in language.
- Never reveal whether an unrelated account exists when that would create a security risk.
- Explain verification and recovery steps.
- Preserve safe return destinations after authentication.
- Make passwordless or MFA flows understandable when introduced.
- Separate authentication failure from authorization denial.
- Privileged internal access may require stronger authentication.

---

## 39. Customer Portal Patterns

The customer portal prioritizes:

1. Current requests
2. Required customer actions
3. Clear status and next step
4. Approved quotations
5. Approved documents and updates
6. Support

### Rules

- Use customer-safe terminology.
- Do not mirror the internal admin interface.
- Surface urgent required actions without false urgency.
- Show timestamps and document visibility clearly.
- Explain when a stage depends on the customer, supplier, or Kawalis China.

---

## 40. Internal Operations Patterns

Internal screens may support higher information density but must preserve:

- Clear ownership
- Status and priority
- Customer visibility labels
- Role-based actions
- Audit context
- Safe defaults
- Explicit approvals

### Rules

- Separate draft, approved, and customer-visible states.
- Avoid changing critical status through ambiguous inline controls.
- Protect financial and commercial fields according to role.
- Provide confirmation and reason capture for sensitive corrections.
- Do not expose all data merely because the user is an employee.

---

## 41. Accessibility Standard

KC Platform V2 targets WCAG 2.2 AA for core customer and operational workflows.

### Requirements

- Semantic HTML
- Complete keyboard access
- Visible focus states
- Correct labels and instructions
- Error identification and association
- Accessible names for icons and controls
- Sufficient contrast
- Logical heading hierarchy
- Meaning independent of color
- Screen-reader announcements for important dynamic changes
- Reduced-motion support
- Touch targets appropriate for mobile use
- Zoom and text resizing without loss of function

Accessibility defects in core workflows block completion.

---

## 42. RTL Requirements

- Set document or section direction intentionally.
- Use CSS logical properties.
- Align content to logical start.
- Mirror directional navigation icons where semantics require it.
- Do not mirror universal or brand symbols.
- Keep phone numbers, emails, URLs, codes, and tracking references readable.
- Test mixed Arabic, English, numbers, punctuation, and currency.
- Verify tables, charts, pagination, steppers, drawers, and breadcrumbs in RTL.
- Arabic must not be treated as a final translation pass.

---

## 43. Content Design

Interface copy must be:

- Clear
- Concise
- Specific
- Calm
- Actionable
- Operationally accurate

### Rules

- Use the same term for the same concept.
- State what happened and what comes next.
- Explain estimates and dependencies.
- Avoid unsupported promises.
- Avoid technical errors in customer-facing messages.
- Do not use placeholder statistics.
- Use Arabic that reads naturally rather than literal translation.

---

## 44. Responsive Component Behavior

Every component must define:

- Minimum supported width
- Wrapping behavior
- Overflow behavior
- Touch behavior
- Priority of visible content
- Mobile alternative where necessary

Responsive behavior must preserve function. Converting a table to cards, moving actions into a menu, or stacking form fields is acceptable only when the user can still understand and complete the task.

---

## 45. Performance Requirements

The design system should enable fast mobile experiences.

- Avoid unnecessary client-side JavaScript.
- Optimize font loading and prevent layout shifts.
- Use responsive images.
- Keep animation lightweight.
- Load heavy operational data progressively.
- Virtualize only when dataset size justifies it.
- Avoid shipping unused component-library code.
- Measure important pages and workflows rather than optimizing by assumption.

Visual richness must not compromise core performance.

---

## 46. Implementation Guidance

### Technology Direction

The current platform uses Next.js, TypeScript, and Tailwind CSS. The implementation should:

- Store tokens centrally, preferably through CSS custom properties mapped into Tailwind.
- Keep reusable primitives separate from feature-specific components.
- Use typed component variants.
- Use composition instead of large components with many unrelated flags.
- Preserve server and client boundaries.
- Avoid locking the system to an unnecessary third-party UI framework.

### Suggested Structure

```text
components/
├── ui/              # Reusable primitives
├── forms/           # Shared form patterns
├── layout/          # Shells, containers, navigation
├── feedback/        # Alerts, empty, loading, error patterns
└── features/        # Domain-specific composed components

styles/
├── tokens.css
├── globals.css
└── utilities.css    # Only when justified
```

The final repository structure must follow the approved project architecture and may adapt to the existing codebase.

---

## 47. Component API Rules

- Components expose clear, typed props.
- Variants map to approved semantic roles.
- Accessibility defaults are built in.
- Components forward necessary native attributes where safe.
- Controlled and uncontrolled behavior must be deliberate.
- Error, loading, and disabled states are documented.
- Direction must inherit correctly unless a field requires explicit LTR.
- Feature permissions do not belong solely inside visual components.

---

## 48. Documentation and Testing

Each reusable component should document:

- Purpose
- Variants
- States
- Content constraints
- RTL behavior
- Accessibility behavior
- Responsive behavior
- Usage and prohibited usage

Test proportionally using:

- Unit tests for behavior and variant logic
- Accessibility checks
- Keyboard interaction checks
- RTL visual checks
- Mobile viewport checks
- Visual regression for stable shared components when available
- End-to-end tests for core workflows

---

## 49. Definition of Done for UI Components

A reusable component is complete when:

- It uses approved tokens.
- It supports required variants and states.
- It works in Arabic RTL.
- It works at supported mobile and desktop sizes.
- It has keyboard and screen-reader behavior appropriate to its role.
- Contrast and focus are accessible.
- Loading, empty, error, and disabled behavior are defined where relevant.
- It does not expose internal data or weaken authorization.
- It is documented and tested in proportion to risk.
- It has been reviewed in its real product context.

---

## 50. Governance

### Owner Approval Required

- Changes to official brand colors
- Changes to official typefaces
- New primary visual direction
- Material changes to the logo system
- Removal of accessibility requirements
- New permanent component conventions that affect the whole platform

### Design-System Maintainer May Approve

- Accessible derived color tones
- New semantic tokens within the approved identity
- New component variants for confirmed use cases
- Responsive refinements
- Bug fixes and accessibility improvements

### Change Process

1. Identify the confirmed product need.
2. Check whether an existing pattern solves it.
3. Design the smallest reusable addition.
4. Test RTL, mobile, accessibility, and states.
5. Document the decision.
6. Obtain approval proportional to its scope.

Do not add components or variants "for future use" without a confirmed need.

---

## 51. Prohibited Patterns

- Unsupported or invented statistics
- Generic SaaS visual language that overrides the brand
- Excessive gradients, shadows, cards, or rounded pills
- Gold body text with insufficient contrast
- Using color alone for status
- Placeholder-only form labels
- Client-only validation for sensitive actions
- Authorization based on hidden buttons
- Desktop-only core workflows
- Hardcoded left/right layouts that break RTL
- Full internal database records exposed to customers
- Unlicensed fonts or unofficial logo assets
- Auto-publishing draft quotations
- Destructive actions without clear consequence and confirmation
- Animation that blocks or delays operational work

---

## 52. Initial Implementation Priorities

The first design-system implementation should cover only what the initial release requires:

1. Tokens and typography
2. Page container and responsive layout
3. Buttons and links
4. Form controls and validation
5. Multi-step RFQ form
6. Alerts, status indicators, loading, and empty states
7. Cards and customer request summaries
8. Approved quotation presentation
9. Public and authenticated navigation
10. Dialog and confirmation patterns
11. Tables or lists required by the initial internal portal

A full component catalog is not required before development begins.

---

## 53. Approval Status

**Status:** Active
**Version:** 1.0
**Approved On:** 2026-07-21
**Approved By:** Kawalis China (Owner)

This document has been explicitly approved by the project owner and is now **Active**.

It serves as the official interface design-system reference for KC Platform V2.

All product interface implementation must align with this document unless a newer approved version supersedes it.

### Acceptance Criteria

This document is active because it:

- Translates the frozen brand into implementation-ready rules.
- Defines color, typography, spacing, layout, shape, elevation, icon, and motion foundations.
- Defines core form, feedback, navigation, data, quotation, customer, and internal patterns.
- Treats Arabic RTL and mobile as primary requirements.
- Establishes WCAG 2.2 AA as the accessibility target.
- Preserves customer and internal data separation.
- Defines implementation, testing, completion, and governance rules.
- Limits initial implementation to confirmed product needs.

---

## Related Documents

- `KC-V2-001 — PLATFORM_BLUEPRINT.md`
- `KC-V2-002 — ARCHITECTURE.md`
- `KC-V2-003 — DATA_STRATEGY.md`
- `KC-V2-004 — BRAND_GUIDELINES.md`
- `KC-V2-006 — DEVELOPMENT_RULES.md`
- `KC-V2-007 — GIT_WORKFLOW.md`
