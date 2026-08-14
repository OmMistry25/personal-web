# Migration Step 5: Public Read Failure Handling

## Status

Implemented on August 14, 2026.

This step gives Supabase-backed public pages an explicit, consistent read-failure state. Successful content, successful empty results, loading states, ordering, routes, and production-reference visuals remain unchanged.

## Failure Contract

Collection pages now distinguish a failed request from a successful empty result. A failed request renders the shared public error state, while an empty successful response continues to render the existing empty page composition.

Writing and work detail lookups now use Supabase `.maybeSingle()`. A zero-row result preserves the existing `Note not found` or `Experience not found` copy. A Supabase, permission, server, or network error renders the shared public error state instead of claiming the record is missing.

About items remain the primary About-page read. If that read fails, the page renders the shared error state. The video remains supplemental: if About items load but the video read fails, the items remain visible without the video, matching the previous partial-success behavior.

## Shared Error State

`src/components/PublicDataError.tsx` displays the generic message `Unable to load this page.` with `role="alert"`. It reuses the existing white background, neutral typography, page transition, Home icon, and circular navigation control.

The public message does not include Supabase codes, database details, table names, URLs, stack traces, or credentials. Existing contextual console logging retains the full error object for diagnosis.

## Scope

The affected public consumers are:

- About
- Contact
- Note
- Now
- Projects
- Work
- Work Detail
- Writing

Admin reads and writes, authentication, authorization, RLS, migrations, Edge Functions, storage, content, ordering, generated database types, and deployment configuration are unchanged.

## Automated Coverage

`tests/e2e/failure/public-data-errors.spec.ts` defines 33 Playwright cases across the configured mobile, tablet, and desktop projects:

- A controlled REST read failure for each of the eight public data routes
- Preserved writing-detail not-found behavior
- Preserved work-detail not-found behavior
- Preserved About items when only the video read fails

The controlled failures intercept browser requests only. They do not modify application code, Supabase, production data, or production reference screenshots.

## Verification

- Targeted ESLint passed for every changed TypeScript and TSX file.
- Playwright discovered all 33 focused cases successfully with `--list`.
- The production build passed.
- Full repository lint remains at the recorded baseline of 8 errors and 1 warning. No Step 5 file produced a lint finding.
- TypeScript checking remains at the recorded baseline of 16 errors. No Step 5 file produced a TypeScript diagnostic.
- A read-only live query confirmed that both pinned detail records still exist and both deterministic missing-record identifiers return zero rows.
- `git diff --check` passed.

The focused failure, smoke, and visual commands were invoked, but the repository environment guard stopped all three before browser startup because `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are absent from the local process. No environment file was created, and no connector-provided value was displayed, written, or committed. Runtime failure-state and screenshot parity remain unverified in this local execution.

## Data, Security, and Migration Impact

This step performs no database writes and requires no migration. It does not modify Supabase configuration, RLS, Auth, storage, or Edge Functions.

## Rollback

Revert the Step 5 commit. No database, authentication, storage, or deployment rollback is required.
