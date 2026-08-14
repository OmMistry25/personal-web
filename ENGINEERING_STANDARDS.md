# Engineering Standards

These standards apply to code, documentation, branches, commits, pull requests, database migrations, comments, logs, tests, and user-facing copy.

## 1. Engineering Principles

Prefer, in order:

1. correctness
2. security and data integrity
3. simplicity
4. maintainability
5. consistency with the existing codebase
6. performance
7. abstraction

Do not optimize for cleverness.

Use the simplest implementation that completely satisfies the requirement.

## 2. Change Workflow

For every implementation task:

### Inspect

Before editing:

- read the relevant files
- trace important dependencies and callers
- inspect related types
- inspect related database schema when applicable
- inspect existing tests when applicable
- understand current behavior

Do not modify unfamiliar code based solely on filenames or assumptions.

### Plan

Follow the implementation-brief and approval workflow defined in `AGENTS.md`. The agent is responsible for drafting a required brief when the user has not supplied one. An approved detailed plan is sufficient authorization for its stated scope and must not be followed by a redundant approval cycle.

For non-trivial changes, determine:

- current behavior
- desired behavior
- files expected to change
- data implications
- security implications
- verification approach

Keep the plan proportional to the task.

### Implement

Make the smallest complete change.

Do not combine unrelated cleanup with implementation.

### Validate

Run applicable checks.

At minimum, use the project's available equivalents of:

```text
lint
type checking
tests
production build
```

For UI changes, also verify the affected interface.

For database changes, inspect and validate the migration.

### Review

Before finishing:

- inspect `git diff`
- check for unintended files
- check for accidental formatting churn
- check for debug code
- check for secrets
- check for unrelated changes
- verify the implementation matches the requested scope

### Report

Summarize:

- what changed
- important implementation decisions
- validation performed
- remaining risks or unverified behavior

Do not claim checks passed unless they were actually executed successfully.

### Branch, Commit, and Pull Request Workflow

Every material implementation step must be completed on its own branch and concluded with a pull request.

#### One Step, One Branch, One Pull Request

For each approved migration step or other materially scoped change:

1. Start from the latest approved base branch.
2. Create a new branch using the repository branch naming standards.
3. Implement only the approved scope for that step.
4. Make cohesive Conventional Commits.
5. Run all applicable verification required by these standards and the implementation brief.
6. Review the complete diff before publishing.
7. Push the branch.
8. Open a pull request.
9. Stop after creating the pull request unless the user explicitly instructs the agent to continue.

Do not begin the next migration step in the same branch or pull request.

#### Pull Request Requirements

A material step is not considered complete until its pull request has been created.

Every pull request must include:

- problem and scope
- non-goals
- implementation summary
- files and systems affected
- verification evidence
- visual or behavioral impact
- security and data impact
- migration impact
- known limitations
- rollback instructions
- follow-up work

Where relevant, include screenshots, test results, or other parity evidence.

#### Approval Boundary

Creating the pull request is part of an already approved implementation step and does not require separate user approval.

Once the user approves an implementation brief, or directly authorizes a sufficiently defined small change under `AGENTS.md`, the agent is authorized to:

- create the step branch
- make the approved changes
- create the required commits
- run approved verification
- push the step branch
- create the pull request

Do not ask separately for permission to commit, push, or create the pull request unless the user explicitly restricted one of those actions.

#### Merging

Creating a pull request does not authorize merging it.

The agent must not:

- merge the pull request
- squash and merge
- rebase and merge
- delete the branch after merge

unless the user explicitly authorizes the action.

The pull request is the review checkpoint between migration steps.

#### Next-Step Isolation

Do not begin the next implementation step while the current step is awaiting review unless the user explicitly instructs otherwise.

After creating the pull request:

1. Report the pull request.
2. Summarize verification results.
3. Surface any unresolved risks or review items.
4. Propose exactly one next step when appropriate.
5. Wait for further instruction.

#### Exceptions

A separate pull request is not required for:

- read-only investigation
- planning
- audits that produce no repository changes
- discussion
- commands that do not alter tracked repository state

If an audit or documentation step creates or modifies tracked repository files, use the normal branch and pull request workflow.

#### Scope Discipline

Do not bundle opportunistic cleanup into a step's pull request.

If unrelated problems are discovered:

- document them
- leave them unchanged
- propose them as separate future work when appropriate

Each pull request should be independently understandable, reviewable, testable, and reversible.

## 3. Writing

Use concise, direct language.

Do not use:

- em dashes
- emojis
- promotional language
- unnecessary commentary
- vague claims

State behavior, constraints, assumptions, and failures precisely.

Use established project terminology consistently.

Comments should explain why something non-obvious exists, not narrate straightforward code.

## 4. TypeScript

Prefer strict, explicit types at system boundaries.

Avoid:

```ts
any
```

unless unavoidable and documented.

Prefer:

- typed component props
- typed database models
- narrow union types
- explicit null handling
- type-safe utility functions

Do not use type assertions merely to silence compiler errors.

Fix the underlying type mismatch when practical.

Avoid duplicating types that represent the same domain entity.

## 5. React

Components should have a clear responsibility.

Prefer:

- small composable components
- data passed through explicit props
- derived values over duplicated state
- local state when state is local
- semantic HTML

Avoid:

- unnecessary global state
- effects for values that can be derived during rendering
- premature memoization
- large components mixing data access, mutation logic, and presentation without reason

Preserve existing behavior during refactors.

## 6. Data Access

Keep database access predictable and centralized where practical.

Public presentation components should not need to understand database implementation details.

Separate where reasonable:

```text
data access
domain transformation
presentation
```

Handle:

- loading
- empty results
- errors

explicitly where they can occur.

Do not duplicate Supabase query logic unnecessarily across components.

## 7. Supabase

Client-side code may use only credentials designed for public clients.

Administrative authorization must not depend solely on frontend route protection.

All privileged data mutations require backend-enforced authorization.

When modifying RLS:

- state who should be able to SELECT
- state who should be able to INSERT
- state who should be able to UPDATE
- state who should be able to DELETE
- verify the policy matches those requirements

Do not disable RLS to fix permission problems.

## 8. Database Design

Use stable primary keys.

Use explicit foreign keys where relationships exist.

Use constraints when the database can enforce an invariant reliably.

Use timestamps consistently.

Ordered content must have explicit ordering fields.

Published content should have explicit publication state when drafts are supported.

Avoid encoding structured domain data into free-form strings when that structure is needed by application behavior.

Do not over-normalize a small CMS without a concrete need.

## 9. Database Migrations

Use a new migration for every schema or policy change.

Migration filenames must follow the repository's established Supabase convention.

A migration must represent one cohesive schema change where practical.

Before committing a migration, review:

- existing-data compatibility
- nullability
- defaults
- indexes
- constraints
- RLS
- rollback implications

Never place credentials or environment-specific secrets in migrations.

## 10. Authentication and Authorization

Treat authentication and authorization as separate concerns.

Authentication answers:

> Who is this user?

Authorization answers:

> Is this user allowed to perform this operation?

Administrative routes must check authentication.

Administrative data operations must additionally be protected by backend authorization.

Never assume that hiding an admin link provides security.

## 11. Secrets and Environment Variables

Never commit:

- API secrets
- service-role keys
- database passwords
- private tokens
- authentication credentials

Keep local secrets in ignored environment files.

Document required variable names using an example environment file containing placeholders only.

Remember that Vite exposes `VITE_*` variables to browser code.

Only public-safe values may use that prefix.

## 12. CSS and Styling

Preserve the existing design system unless the task explicitly changes it.

Prefer existing:

- spacing patterns
- typography values
- breakpoints
- utility conventions
- color values

Do not replace working styles solely for stylistic consistency.

Avoid arbitrary one-off values when an established project value already expresses the intended design.

For visual-parity work, matching the reference takes precedence over abstract style-system purity.

## 13. Animation

Existing animation behavior must remain unchanged during migration unless explicitly requested.

Do not introduce animation as part of:

- cleanup
- refactoring
- CMS work
- dependency work
- migration work

When animation work is later authorized:

- respect `prefers-reduced-motion`
- animate transform and opacity where practical
- avoid layout thrashing
- avoid blocking interaction
- keep animation separate from content/data logic
- verify mobile behavior and performance

Do not use animation to conceal slow loading or broken state transitions.

## 14. Accessibility

Use native semantic elements before ARIA.

Interactive elements must be keyboard accessible.

Buttons perform actions.

Links navigate.

Inputs require associated labels.

Images require appropriate alternative text unless decorative.

Do not remove focus indicators without providing an accessible replacement.

New motion must respect reduced-motion preferences.

## 15. Error Handling

Errors must not disappear silently.

Avoid empty catch blocks.

When catching an error:

- handle it
- transform it
- display appropriate feedback
- or log useful diagnostic context

Do not expose:

- credentials
- tokens
- database internals
- stack traces

to public
