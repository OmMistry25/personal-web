# Repository Rules

These rules define product, architecture, security, and change-management constraints for this repository.

They apply to humans and coding agents.

## 1. Product Principle

This website is intentionally minimal.

Its simplicity, whitespace, typography, content hierarchy, and restrained interaction model are product decisions, not missing features.

Do not interpret minimalism as unfinished design.

Do not add complexity merely because the implementation supports it.

Materially scoped work must follow the implementation-brief and approval workflow in `AGENTS.md`. Once a plan or specific step is approved, execute that approved scope without requiring the user to supply or restate another brief. Seek additional approval only for a material scope change.

## 2. Current Migration Objective

The immediate objective is to make the existing website independently maintainable without Bolt.new while preserving the current public experience.

Until this migration is explicitly declared complete, prioritize:

1. behavioral parity
2. visual parity
3. data integrity
4. security
5. maintainability
6. developer experience

New visual features are out of scope unless explicitly requested.

## 3. Public Website Is the Reference

During migration, the existing production website is the behavioral and visual reference.

The repository implementation and production site may occasionally disagree. When they do:

- identify the discrepancy
- do not silently choose a new behavior
- preserve production behavior unless instructed otherwise

For public-facing refactors, compare the affected page against the reference before considering the task complete.

## 4. Visual Preservation

Without explicit authorization, do not change:

- font family
- font weight
- font size
- line height
- letter spacing
- text color
- background color
- opacity
- spacing
- alignment
- element positioning
- viewport placement
- wrapping behavior
- responsive breakpoints
- hover behavior
- page transitions
- content hierarchy
- content order

Do not introduce:

- cards
- shadows
- gradients
- borders
- decorative backgrounds
- additional navigation
- loading animations
- custom cursors
- parallax
- GSAP effects
- new Framer Motion effects
- visual embellishment

unless explicitly requested.

## 5. Content Preservation

Do not rewrite public content during engineering work.

Preserve:

- titles
- descriptions
- article text
- company names
- role names
- dates
- project names
- URLs
- contact information
- ordering

Content migration must preserve meaning and formatting.

If source content appears incorrect, report it instead of silently correcting it.

## 6. CMS Principle

Content that changes over time should eventually be manageable without editing source code.

The CMS should support the relevant operations for each content type:

- create
- edit
- delete
- publish or unpublish
- reorder where ordering is meaningful

The public website must remain independent of the admin UI's visual implementation.

CMS improvements must not alter the public presentation unless explicitly requested.

## 7. Content Ordering

Ordering is product data.

Do not rely on:

- database insertion order
- UUID order
- implicit object ordering
- `created_at` unless chronological ordering is explicitly intended

Ordered collections must use an explicit ordering mechanism such as `sort_order`.

Ordering operations must produce deterministic public results.

## 8. Authentication

The public website requires no authentication.

Administrative functionality must require authentication.

Authentication alone does not imply authorization.

Only explicitly authorized administrators may mutate site content.

Do not implement policies where every authenticated Supabase user automatically receives administrative write access.

Authorization must be enforced by the backend/database, not only by hiding controls in the frontend.

## 9. Supabase Security

Row Level Security must remain enabled for exposed application tables unless a documented architecture explicitly requires otherwise.

Public users may receive only the permissions required by the public website.

Administrative writes must be authorized through RLS or another server-enforced mechanism.

Never expose:

- service-role keys
- database passwords
- private API credentials
- administrative secrets

through Vite client environment variables or browser code.

`VITE_*` variables must be treated as publicly observable.

## 10. Database Migrations

Database changes must use migrations.

Never modify an already-applied migration to represent a new production change.

Create a new migration instead.

Migrations must be:

- deterministic
- reviewable
- narrowly scoped
- safe for existing data

Before destructive schema changes, determine how existing production data will be preserved.

Schema changes that rename, delete, or transform persisted fields require an explicit migration plan.

## 11. Data Integrity

Do not destroy or overwrite existing content as part of cleanup.

When changing schemas or content models:

1. identify existing data
2. define the destination representation
3. migrate the data
4. verify migration results
5. only then remove obsolete structures

Prefer reversible changes when practical.

## 12. Architecture

Do not rewrite working architecture solely to adopt a newer framework or fashionable pattern.

Architectural changes require a concrete benefit such as:

- security
- correctness
- maintainability
- performance
- required functionality

The benefit must justify migration cost and regression risk.

Vite, React, React Router, Tailwind, Framer Motion, and Supabase are valid technologies for this project unless a specific limitation requires replacement.

## 13. Dependencies

Do not add a dependency when the required behavior is trivial to implement safely with existing tools.

Before adding a dependency:

- verify existing dependencies cannot reasonably solve the problem
- consider bundle impact
- consider maintenance status
- consider security implications
- explain why it is needed

Remove a dependency only after verifying it is unused.

Do not perform dependency upgrades unrelated to the current task.

## 14. Refactoring

Refactoring must be behavior-preserving unless behavior change is explicitly part of the task.

Refactor when it materially improves:

- clarity
- duplication
- testability
- maintainability
- separation of concerns

Do not refactor unrelated areas opportunistically.

Large refactors should be decomposed into reviewable steps.

## 15. Error Handling

Do not silently swallow errors.

For user-facing failures:

- fail safely
- avoid leaking internal implementation details
- provide useful feedback where appropriate

For administrative operations:

- surface failed writes
- do not report success before persistence succeeds
- preserve user input when practical after recoverable failures

For developer-facing errors:

- provide enough context to diagnose the failing operation
- never log secrets

## 16. Accessibility

Behavior-preserving work must not regress accessibility.

New interactive functionality must support:

- semantic HTML
- keyboard access
- visible focus behavior
- appropriate labels
- appropriate ARIA only where semantic HTML is insufficient

Do not remove accessibility behavior to achieve visual parity.

## 17. Responsive Behavior

Desktop correctness alone is insufficient.

When changing public UI, verify affected behavior at representative:

- mobile
- tablet
- desktop

viewport sizes.

Do not introduce new breakpoints without a concrete reason.

## 18. Performance

Preserve the lightweight nature of the website.

Avoid unnecessary:

- JavaScript
- client-side state
- network requests
- large dependencies
- image payloads
- re-renders
- animation work

Performance optimization must not alter intentional visual behavior without authorization.

## 19. Scope Discipline

Every task has a defined scope.

While working, agents may discover unrelated issues.

Unless those issues:

- block the requested work
- create an immediate security risk
- create an immediate data-integrity risk

record or report them instead of fixing them opportunistically.

One request must not become an uncontrolled repository cleanup.

## 20. Destructive Actions

Explicit authorization is required before:

- deleting production data
- resetting Supabase
- dropping tables
- deleting storage buckets
- removing production environment variables
- changing DNS
- replacing production deployment
- force-pushing
- rewriting shared Git history

When a safer reversible alternative exists, prefer it.

## 21. External Changes

Local implementation authorization does not automatically authorize external state changes.

Do not independently:

- deploy to production
- modify Supabase production data
- change authentication settings
- change DNS
- merge pull requests
- delete branches
- alter hosting configuration

unless the task explicitly authorizes that action.

## 22. Definition of Done

A change is complete only when:

- requested scope is satisfied
- relevant existing behavior is preserved
- applicable checks pass
- affected UI has been manually or automatically verified where relevant
- security implications have been considered
- data/migration implications have been considered
- no secrets were introduced
- the final diff contains no unrelated changes
- documentation reflects material architectural changes

If something could not be verified, state that explicitly.
