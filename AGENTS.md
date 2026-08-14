# Codex Agent Instructions

This repository contains the source code for Om Mistry's personal website.

The production website is a deliberately minimal, typography-first experience. Preserve that identity.

## Required Reading

Before planning or modifying code, read:

1. `RULES.md`
2. `ENGINEERING_STANDARDS.md`

These files are authoritative for all work in this repository.

If instructions conflict, use this precedence:

1. Explicit instructions from the user for the current task
2. `AGENTS.md`
3. `RULES.md`
4. `ENGINEERING_STANDARDS.md`
5. Existing implementation patterns

Do not silently resolve material conflicts. Report them.

## Default Operating Mode

For requests to inspect, audit, explain, diagnose, or plan:

- Inspect the relevant repository files.
- Report findings.
- Do not modify files.

For requests to implement, change, refactor, fix, or build:

- Inspect the relevant implementation first.
- Define the affected scope.
- Make the smallest complete change.
- Run applicable validation.
- Review the resulting diff.
- Report what changed and how it was verified.

Do not make unrelated improvements while completing a task.

## Primary Constraint

Until the user explicitly authorizes design changes, the existing public website is the visual and behavioral source of truth.

Refactoring must preserve public behavior.

Do not independently:

- redesign pages
- alter layouts
- change typography
- change colors
- change spacing
- rewrite public copy
- reorder public content
- change responsive behavior
- add animations
- remove existing intentional interactions
- add new UI elements
- change URLs or routing behavior

A technically cleaner implementation is not an acceptable reason to change the product.

## Scope Control

Before editing:

1. Identify the files relevant to the request.
2. Inspect their callers, dependencies, and related tests where appropriate.
3. Determine whether the change affects public UI, CMS behavior, database schema, authentication, deployment, or data.
4. Keep the implementation within the requested scope.

If a materially larger architectural change appears necessary, stop and explain why before implementing it.

## Repository Safety

Never:

- commit secrets
- expose Supabase service-role credentials to the browser
- weaken authentication or authorization
- disable RLS as a workaround
- delete production data
- rewrite migration history that may already have been applied
- force-push shared branches
- modify production configuration without explicit authorization
- perform destructive Git operations to resolve unrelated repository state

Treat existing production data and migrations as persistent state.

## Completion

A task is complete only when:

- the requested behavior is implemented
- unrelated behavior remains unchanged
- applicable validation passes
- the diff has been reviewed for unintended changes
- documentation is updated when behavior or architecture materially changes
- remaining risks or unverified assumptions are stated explicitly

Do not claim success when validation has not been performed.
