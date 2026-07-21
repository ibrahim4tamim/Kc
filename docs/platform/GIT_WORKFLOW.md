# KC Platform V2 — Git Workflow

**Document ID:** KC-V2-007
**Status:** Active
**Version:** 1.0
**Approved On:** 2026-07-21
**Approved By:** Kawalis China (Owner)
**Owner:** Kawalis China
**Platform:** KC Platform V2
**Official V2 Branch:** `kc-platform-v2`
**Preserved Reference Branch:** `claude/kawalis-china-sourcing-mvp-hpz3po`
**Parent Documents:** `KC-V2-001 — PLATFORM_BLUEPRINT.md`, `KC-V2-002 — ARCHITECTURE.md`, `KC-V2-006 — DEVELOPMENT_RULES.md`

---

## 1. Purpose

This document defines the official Git and GitHub workflow for KC Platform V2.

It governs:

- Branch ownership and protection
- Preservation of the existing Claude MVP
- Creation and naming of working branches
- Commit scope and messages
- Pull requests and reviews
- Required checks
- Merge authority
- Releases, rollback, and emergency changes
- Documentation-only changes
- Prohibited Git operations

The objective is to make every change traceable, reviewable, reversible where practical, and isolated from preserved work.

---

## 2. Guiding Principles

### 2.1 Preserve History

Do not rewrite shared history or modify the preserved Claude reference branch.

### 2.2 Isolate Work

Each meaningful change should occur in an appropriately scoped branch unless the owner explicitly authorizes direct work on `kc-platform-v2` during the foundation phase.

### 2.3 Keep Changes Reviewable

Prefer small, coherent commits and pull requests that solve one clear problem.

### 2.4 Verify Before Publishing

Inspect the branch, working tree, diff, and checks before committing or pushing.

### 2.5 Approval Before Merge or Deployment

A successful build or review does not replace explicit owner approval where required.

### 2.6 Protect User Work

Never discard, overwrite, reformat, stage, or commit unrelated changes silently.

---

## 3. Branch Roles

### 3.1 Preserved Claude Reference

```text
claude/kawalis-china-sourcing-mvp-hpz3po
```

This branch is the preserved KC v1 MVP reference.

Rules:

- Do not modify it.
- Do not commit to it.
- Do not force-push it.
- Do not rebase it.
- Do not delete or rename it.
- Do not merge V2 work into it.
- Read or compare it only when evaluating reusable MVP behavior.

Any exception requires explicit owner approval and a documented recovery plan.

### 3.2 V2 Integration Branch

```text
kc-platform-v2
```

This is the official integration branch for KC Platform V2.

It contains approved V2 documentation and integrated implementation work. It is not automatically the production branch.

### 3.3 Default Branch

The repository default branch must not be changed during foundation work. Changing it requires:

- V2 readiness review
- Passing required checks
- Deployment and rollback plan
- Explicit owner approval

### 3.4 Working Branches

Development work should normally branch from the latest approved `kc-platform-v2`.

Working branches must remain short-lived and focused.

---

## 4. Branch Naming

Use lowercase names with hyphens.

Approved prefixes:

| Prefix | Use |
|---|---|
| `feature/` | New approved behavior |
| `fix/` | Defect correction |
| `security/` | Security remediation |
| `refactor/` | Behavior-preserving restructuring |
| `docs/` | Documentation-only work |
| `test/` | Test-only improvements |
| `chore/` | Maintenance and tooling |
| `release/` | Approved release preparation |
| `hotfix/` | Urgent production correction |

Examples:

```text
feature/rfq-supabase-persistence
fix/customer-quotation-visibility
security/lock-storage-policies
docs/data-strategy
test/rfq-duplicate-submission
```

Avoid:

- Personal names
- Tool names as ownership labels
- Vague names such as `updates`, `changes`, or `final`
- Spaces or punctuation that complicate automation
- Reusing an old branch for unrelated work

---

## 5. Starting Work

Before editing:

1. Confirm the repository and remote.
2. Confirm the current branch.
3. Fetch the latest remote state.
4. Inspect the working tree.
5. Identify unrelated changes.
6. Confirm the intended base branch.
7. Read relevant approved documentation.
8. Create or switch to the approved working branch.

Example verification:

```text
git status -sb
git branch --show-current
git remote -v
git fetch origin --prune
```

Do not begin work from the preserved Claude branch.

---

## 6. Working Tree Safety

- A dirty worktree may contain user changes.
- Inspect each changed and untracked file before staging.
- Do not use broad staging when unrelated changes exist.
- Stage explicit paths for the task.
- Do not use destructive cleanup commands to create a clean state.
- Do not overwrite files merely because they differ from the expected branch.
- If intended work overlaps unknown changes, stop and request direction.

The following do not grant permission to discard work:

- A failed test
- A merge conflict
- A generated file mismatch
- A desire to simplify the diff
- A tool-created local change

---

## 7. Scope Rules

Every branch and pull request must have one coherent objective.

Acceptable combinations:

- Feature code with its tests and documentation
- Database migration with compatible application changes and tests
- Bug fix with regression test
- Documentation update with its index entry

Avoid combining:

- Unrelated refactoring and a feature
- Formatting across the repository and a targeted fix
- Dependency upgrades and unrelated product behavior
- Multiple architectural decisions in one review
- Documentation approval and unreviewed application changes

If the diff becomes difficult to explain in one concise summary, split the work.

---

## 8. Commit Principles

Each commit should be:

- Intentional
- Coherent
- Buildable where practical
- Reviewable
- Free from secrets
- Limited to the approved scope

Commits should explain a meaningful unit of progress rather than every save operation.

Do not commit:

- Secrets or credentials
- Production data
- Customer or supplier exports
- Unrelated local configuration
- Editor caches
- Debug dumps
- Unapproved generated artifacts
- Temporary screenshots containing sensitive information

---

## 9. Commit Message Format

Use:

```text
<type>: <concise imperative summary>
```

Approved types:

- `feat`
- `fix`
- `security`
- `refactor`
- `docs`
- `test`
- `chore`
- `build`
- `ci`
- `perf`
- `revert`

Examples:

```text
docs: approve DATA_STRATEGY (KC-V2-003)
feat: persist sourcing requests in Supabase
fix: restrict customer quotation fields
security: enforce storage ownership policies
test: cover duplicate RFQ submissions
```

Rules:

- Use a short, specific summary.
- Use imperative language where natural.
- Do not use messages such as `update`, `changes`, `fix stuff`, or `final`.
- Reference a document or issue when it improves traceability.
- Add a body when the reason, risk, migration, or compatibility impact is not obvious.

---

## 10. Documentation Commits

Approved foundation documents should use focused commits.

Recommended examples:

```text
docs: approve PLATFORM_BLUEPRINT (KC-V2-001)
docs: approve ARCHITECTURE (KC-V2-002)
docs: approve DATA_STRATEGY (KC-V2-003)
docs: approve BRAND_GUIDELINES (KC-V2-004)
docs: approve DESIGN_SYSTEM (KC-V2-005)
docs: approve DEVELOPMENT_RULES (KC-V2-006)
docs: approve GIT_WORKFLOW (KC-V2-007)
```

A documentation commit must not include application or infrastructure changes unless the task explicitly requires them.

---

## 11. Staging Rules

Before staging:

- Run `git status`.
- Inspect the diff.
- Confirm the exact files in scope.

Use explicit paths when the worktree is mixed.

After staging:

- Review the staged diff.
- Confirm no secret or unintended file is included.
- Confirm file renames and deletions are intentional.

Do not assume that all untracked files belong to the task.

---

## 12. Pre-commit Verification

Run checks appropriate to the change.

Documentation-only changes:

- Markdown structure review
- Link and path review where available
- Status and approval metadata review
- `git diff --check`

Application changes:

- Formatter check
- Lint
- Type check
- Relevant unit and integration tests
- Build when applicable

Database or security changes:

- Migration review
- RLS positive and negative tests
- Data-integrity checks
- Rollback or recovery review

Interface changes:

- Mobile verification
- Arabic RTL verification
- Accessibility verification
- Loading, empty, error, and success states

If a required check cannot run, record the reason and risk. Do not describe it as passed.

---

## 13. Push Rules

- Push only to the intended working or V2 branch.
- Confirm the branch name immediately before pushing.
- Use normal pushes; force-push is prohibited on shared, protected, preserved, or integration branches.
- Do not push secrets or sensitive data.
- Do not push incomplete destructive migrations.
- Establish upstream tracking for a new branch.
- Verify the remote branch after pushing.

Pushing a branch does not authorize merging or deployment.

---

## 14. Pull Requests

Pull requests are required for implementation work before integration into `kc-platform-v2`, except when the owner explicitly authorizes a narrow direct documentation commit during foundation work.

### PR Title

The title should summarize the complete change.

### PR Description

Include:

- What changed
- Why it changed
- User or operational impact
- Security and data impact
- Database or migration impact
- Screenshots or recordings for relevant UI changes
- Checks performed
- Known limitations or follow-up
- Rollback considerations when relevant

### Draft Status

Open a draft PR when work remains, checks are incomplete, or early review is useful. Mark it ready only when it meets review requirements.

---

## 15. Pull Request Size

Prefer the smallest PR that safely delivers the approved objective.

Split a PR when it includes:

- Multiple unrelated features
- Large mechanical formatting changes
- Independent migrations
- A refactor that can be reviewed separately
- Multiple high-risk permission changes

A large PR is acceptable only when the change cannot be separated safely. The description must explain why.

---

## 16. Review Requirements

Review must evaluate:

- Scope and correctness
- Security and authorization
- Customer/internal data separation
- Data integrity and migration safety
- Error and failure behavior
- Tests
- Accessibility
- RTL and mobile behavior
- Performance impact
- Documentation
- Rollback or recovery

Review approval must come from an authorized reviewer. Tool-generated approval is not owner approval.

High-risk security, payment, authentication, authorization, RLS, and destructive migration changes require independent review when practical.

---

## 17. Review Feedback

- Address actionable comments with code, tests, documentation, or a reasoned response.
- Do not resolve a thread before the underlying concern is handled or explicitly accepted.
- New commits must not silently invalidate earlier approval.
- Material scope changes require renewed review.
- Avoid mixing review fixes with unrelated cleanup.
- Preserve a traceable explanation for accepted risk.

---

## 18. Required Checks

Before merge, the relevant required checks must pass.

Expected checks may include:

- Formatting
- Lint
- Type check
- Unit tests
- Integration tests
- Build
- End-to-end tests
- RLS and database tests
- Accessibility checks
- Dependency and security checks

Branch protection should require applicable checks when GitHub configuration supports it.

Checks must not be bypassed merely to accelerate a routine release.

---

## 19. Merge Authority

Merging into `kc-platform-v2`, a future production branch, or the repository default branch requires explicit authorized approval.

The project owner retains final authority over:

- Major scope changes
- Architecture changes
- Data ownership changes
- Security boundary changes
- Destructive migrations
- Production deployment
- Changing the default branch

An agent, developer, or automation must not merge automatically unless a specifically approved workflow authorizes that exact class of change.

---

## 20. Merge Strategy

The preferred merge strategy is selected per change while preserving understandable history.

### Squash Merge

Preferred for focused feature or fix branches whose intermediate commits do not need long-term preservation.

### Merge Commit

May be used for release or coordinated branches when preserving branch structure is useful.

### Rebase Merge

May be used only when it does not rewrite shared branch history and the repository policy permits it.

### Rules

- Do not merge the preserved Claude branch into V2 wholesale.
- Do not use a merge strategy to bypass failed checks or unresolved conflicts.
- The final commit or PR title must describe the delivered change clearly.

---

## 21. Conflict Resolution

- Understand both sides before resolving a conflict.
- Preserve approved behavior and user changes.
- Do not select “ours” or “theirs” across broad files without inspection.
- Re-run relevant checks after resolution.
- Request review again when conflict resolution changes material logic.
- Database migration conflicts require special care; never renumber or edit applied migrations casually.

If the correct resolution is unclear, stop and request direction.

---

## 22. Updating a Working Branch

Keep working branches aligned with `kc-platform-v2` when needed.

Rules:

- Fetch before deciding the update method.
- Do not rebase a shared branch without coordination.
- Do not force-push a shared branch.
- Resolve conflicts locally and verify the result.
- Re-run checks affected by upstream changes.
- Avoid unnecessary churn when the branch can merge safely without an update.

---

## 23. Database Migration Workflow

Database changes require:

1. Approved data-model intent.
2. A new versioned migration.
3. Application compatibility analysis.
4. Data backfill and reconciliation when needed.
5. RLS policy review and tests.
6. Non-production verification.
7. Backup and recovery planning for risky changes.
8. Explicit approval for destructive production action.

Never edit an applied production migration in place.

Migration PRs must explain:

- Schema effect
- Existing-data effect
- Locking or downtime risk
- Rollback or forward-recovery approach
- Deployment order

---

## 24. Security Change Workflow

Security-sensitive changes include:

- Authentication
- Authorization
- RLS
- Secrets
- File access
- Webhooks
- Payments
- Customer-visible DTOs
- Rate limiting
- Audit behavior

Requirements:

- Explicit threat or risk statement
- Positive and negative tests
- Review of client/server boundaries
- Verification that no secret or internal field is exposed
- Independent review when practical
- Controlled rollout and monitoring for high-risk changes

Do not publish exploitable details before remediation is safely available.

---

## 25. Documentation Workflow

Official documents progress through:

```text
Draft → Reviewed → Active → Superseded or Archived
```

The owner may explicitly approve a document as Active immediately.

An active document must include:

- Document ID
- Status
- Version
- Approval date
- Approver
- Owner
- Related or parent documents

Material revisions should update the version and preserve prior history through Git. Do not silently rewrite an active policy in a mixed implementation commit.

---

## 26. Release Branches and Tags

Release branches may be used when stabilization requires isolation.

Recommended pattern:

```text
release/v2.0.0
```

Release tags should follow semantic versioning where applicable:

```text
v2.0.0
v2.0.1
```

### Rules

- Tags identify reviewed release commits.
- Do not move or reuse published release tags.
- Release preparation contains only approved fixes and release artifacts.
- New feature work returns to an appropriate feature branch.
- Production release requires owner approval.

---

## 27. Versioning

Use semantic versioning for platform releases when the release process begins:

- **Major** — breaking platform or contract change
- **Minor** — backward-compatible approved functionality
- **Patch** — backward-compatible correction

Pre-release identifiers may be used for preview or release candidates.

Document versions are governed independently and must record material approved revisions.

---

## 28. Deployment Boundary

Git merge and production deployment are separate decisions.

- A merged change is not automatically authorized for production.
- Preview deployments may support review when they contain safe non-production data.
- Production deployment requires passing checks, correct configuration, monitoring, and rollback readiness.
- No documentation-phase commit authorizes deployment.
- Production secrets and data must not appear in preview logs or artifacts.

---

## 29. Rollback and Revert

### Code Changes

Prefer a new revert commit on shared history rather than rewriting history.

### Database Changes

Database rollback may be unsafe after data transformation. Define forward recovery, backup restoration, or compensating migrations before deployment.

### Rules

- Identify the exact target and impact.
- Preserve evidence needed for incident review.
- Coordinate application and database compatibility.
- Re-run checks after the revert.
- Document user and operational impact.
- Do not use destructive Git reset on shared branches.

---

## 30. Hotfix Workflow

Use a hotfix only for an urgent production issue.

Recommended process:

1. Confirm severity and affected production version.
2. Create `hotfix/<clear-description>` from the production source branch.
3. Implement the smallest safe correction.
4. Add a regression test when practical.
5. Run targeted and required checks.
6. Obtain expedited authorized review.
7. Deploy through the controlled release path.
8. Merge the correction back into `kc-platform-v2` and other relevant active branches.
9. Document the incident and follow-up.

Urgency does not authorize unrelated changes.

---

## 31. Emergency Access

Emergency actions must be:

- Necessary to contain or recover from a material incident
- Limited to the minimum scope
- Performed by an authorized person
- Logged and communicated
- Reviewed afterward

Emergency access does not permit force-pushing protected branches, deleting history, or hiding changes.

---

## 32. Reverting Approved Documents

If an active document must change:

- Do not erase the historical approval.
- Create a new version or explicit correcting commit.
- Explain the reason and impacted decisions.
- Update related indexes and documents.
- Obtain approval proportional to the change.

If a document is no longer authoritative, mark it `Superseded` or `Archived` and link to the replacement.

---

## 33. Generated Files and Lockfiles

- Commit generated files only when the project requires them for reproducibility or deployment.
- Generated output must be reproducible from committed source.
- Do not hand-edit generated files unless explicitly supported.
- Commit the package-manager lockfile with dependency changes.
- Do not mix package managers or regenerate the lockfile unintentionally.
- Large generated diffs require explanation and focused review.

---

## 34. Binary and Large Files

- Do not store operational uploads, customer documents, backups, or media libraries in Git.
- Use approved object storage for platform files.
- Store only required brand or application assets in the repository.
- Optimize assets before committing.
- Use Git LFS only after an approved need and repository policy.
- Never commit database dumps containing real data.

---

## 35. Secrets and Sensitive Data

Never commit:

- API keys
- Passwords
- Access or refresh tokens
- Service-role keys
- Private certificates
- Production environment files
- Customer, supplier, or payment exports
- Private URLs containing credentials

If a secret is committed:

1. Treat it as exposed.
2. Rotate or revoke it immediately.
3. Assess repository and log exposure.
4. Remove it through an approved incident process.
5. Document the event.

Deleting the line in a later commit does not make the secret safe.

---

## 36. Automation and Agents

Automated tools and coding agents must follow the same workflow as human contributors.

They must:

- Confirm repository, branch, and scope
- Read approved documentation
- Preserve unrelated changes
- Show or summarize the diff
- Run relevant checks
- Avoid secrets
- Request approval before merge, deployment, or destructive action

They must not:

- Modify the preserved Claude branch
- Auto-merge without explicit authorization
- Force-push
- Invent product scope
- Weaken checks to obtain a passing result
- Claim a check passed when it was not run

Tool output is evidence to review, not authority to approve.

---

## 37. Commit Signing and Identity

When repository policy supports it:

- Contributors should use a stable, attributable Git identity.
- Protected release commits or tags may require verified signatures.
- Shared generic identities should be avoided.
- Automation identities must be recognizable and scoped.

Commit authorship must not falsely identify another person.

---

## 38. GitHub Repository Protections

When available, configure protections for important branches:

- Block force-push
- Block deletion
- Require pull requests
- Require applicable status checks
- Require review for high-risk changes
- Dismiss or renew approval after material new changes where appropriate
- Restrict who may push or merge
- Require conversation resolution

The preserved Claude branch should be protected against modification and deletion.

Repository configuration changes require owner approval.

---

## 39. Pull Request Checklist

Before requesting final review, confirm:

- [ ] The branch is based on the correct V2 state.
- [ ] Scope is focused and approved.
- [ ] No unrelated files are included.
- [ ] No secrets or sensitive data are included.
- [ ] The diff has been reviewed locally.
- [ ] Relevant tests and checks pass.
- [ ] Authorization and customer-data exposure are reviewed.
- [ ] Database migrations and RLS are verified when affected.
- [ ] Arabic RTL and mobile behavior are verified when affected.
- [ ] Accessibility is verified when affected.
- [ ] Documentation is updated.
- [ ] Deployment and rollback impact are described.
- [ ] The preserved Claude branch remains unchanged.

---

## 40. Merge Checklist

Before merge, confirm:

- [ ] Required reviewers approved the current material diff.
- [ ] Required checks passed.
- [ ] Review conversations are resolved or explicitly accepted.
- [ ] No unresolved critical defect remains.
- [ ] Migration and deployment order are safe.
- [ ] Rollback or recovery is understood.
- [ ] Owner approval exists where required.
- [ ] The target branch is correct.
- [ ] The final title and description are accurate.

---

## 41. Post-merge Verification

After merge:

- Confirm the expected target commit.
- Confirm branch protection remains intact.
- Verify preview or deployment status when applicable.
- Run or observe required smoke checks.
- Confirm database migration state when affected.
- Monitor relevant errors and critical workflows.
- Remove the working branch when safe and no longer needed.
- Record follow-up work without expanding the completed change silently.

---

## 42. Audit and Traceability

Git and GitHub history should allow a future reviewer to determine:

- What changed
- Why it changed
- Who authored and approved it
- Which checks were performed
- What release included it
- Whether data, security, or migration was affected
- How it can be reverted or corrected

Do not place sensitive operational evidence in public or broadly accessible PR discussion.

---

## 43. Prohibited Actions

- Modifying, deleting, renaming, rebasing, or force-pushing the preserved Claude branch
- Force-pushing shared or protected branches
- Committing directly to a production branch without authorization
- Automatic merge without explicit authorization
- Changing the default branch without owner approval
- Destructive reset or history rewrite on shared work
- Silently discarding user changes
- Staging unrelated files
- Committing secrets or production data
- Editing applied production migrations
- Bypassing required checks
- Describing unrun tests as passed
- Combining unrelated changes to avoid review
- Deploying documentation-phase work to production
- Deleting release tags or moving published tags
- Using Git history as an operational file store

---

## 44. Exceptions

An exception requires:

- The rule being excepted
- Reason and urgency
- Scope
- Risk
- Mitigation
- Approver
- Duration or cleanup plan

An emergency exception must be reviewed after the incident. Temporary exceptions must be removed or renewed explicitly.

No exception may silently weaken the preserved-branch rule, expose secrets, or erase required history.

---

## 45. Definition of Done for Git Delivery

A Git-delivered change is complete when:

- It is on the correct branch.
- Its scope is coherent.
- Commits are clear and intentional.
- No unrelated or sensitive files are included.
- Relevant checks are completed and reported accurately.
- Review and approval requirements are satisfied.
- Documentation is current.
- Merge or push targeted the correct remote branch.
- The preserved Claude branch remains unchanged.
- Deployment, rollback, or follow-up is documented where relevant.

A local edit or unpushed commit is not a completed GitHub delivery.

---

## 46. Governance

This workflow is maintained as an approved project policy.

Explicit owner approval is required for:

- Changing branch roles
- Modifying the preserved reference policy
- Changing the default branch
- Weakening branch protection
- Allowing automatic merge or deployment
- Changing merge authority
- Rewriting shared history
- Deleting release history

Routine improvements may be made through a reviewed document revision when they preserve these protections.

---

## 47. Approval Status

**Status:** Active
**Version:** 1.0
**Approved On:** 2026-07-21
**Approved By:** Kawalis China (Owner)

This document has been explicitly approved by the project owner and is now **Active**.

It serves as the official Git and GitHub workflow for KC Platform V2.

All contributors, tools, and agents must follow this workflow unless a newer approved version supersedes it.

### Acceptance Criteria

This document is active because it:

- Protects the preserved Claude branch.
- Defines the role of `kc-platform-v2`.
- Defines branch, commit, PR, review, merge, release, and rollback rules.
- Prevents unrelated staging, secret exposure, and destructive history changes.
- Separates merge from deployment authority.
- Covers database, security, documentation, hotfix, and automation workflows.
- Defines checklists and a Git delivery Definition of Done.

---

## Related Documents

- `KC-V2-001 — PLATFORM_BLUEPRINT.md`
- `KC-V2-002 — ARCHITECTURE.md`
- `KC-V2-003 — DATA_STRATEGY.md`
- `KC-V2-004 — BRAND_GUIDELINES.md`
- `KC-V2-005 — DESIGN_SYSTEM.md`
- `KC-V2-006 — DEVELOPMENT_RULES.md`
