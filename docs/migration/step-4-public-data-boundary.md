# Migration Step 4: Typed Public Data Boundary

## Status

Implemented on August 14, 2026.

This step centralizes public Supabase reads and derives their TypeScript models from the live database schema. It does not change public behavior, Supabase state, admin behavior, authentication, storage, or deployment configuration.

## Architecture

`src/types/database.generated.ts` contains types generated from the connected live Supabase schema. The generated output includes all seven expected public tables and contains no project reference, URL, or credential.

`src/lib/public-data.ts` is the read-only boundary used by public pages. It reuses the existing Supabase client and gives that client the generated `Database` type inside the boundary. It does not create a second client.

The existing `src/lib/supabase.ts` export remains unchanged for authentication and admin consumers. The historical `src/lib/database.ts` module also remains unchanged and unused because its read ordering does not consistently match current public behavior.

## Preserved Query Contract

| Public content | Query behavior |
| --- | --- |
| Projects | Select all rows from `projects`, ordered by `created_at` descending |
| Writing index | Select all rows from `notes`, ordered by `sort_order` ascending |
| Writing detail | Select one `notes` row whose `slug` matches the route parameter |
| Work index | Select all rows from `work_experience`, ordered by `created_at` descending |
| Work detail | Select one `work_experience` row whose `id` matches the route parameter |
| About items | Select all rows from `about_items`, ordered by `sort_order` ascending |
| About video | Select `video_id` from `about_video` with a limit of one row |
| Now | Select all rows from `now_items`, ordered by `sort_order` ascending |
| Contact | Select all rows from `contact_methods`, ordered by `sort_order` ascending |

The pages continue to own loading state, error logging, empty results, not-found states, route rendering, and formatting. Existing error messages and query sequencing remain unchanged.

## Affected Public Pages

- `src/pages/About.tsx`
- `src/pages/Contact.tsx`
- `src/pages/Note.tsx`
- `src/pages/Now.tsx`
- `src/pages/Projects.tsx`
- `src/pages/Work.tsx`
- `src/pages/WorkDetail.tsx`
- `src/pages/Writing.tsx`

Admin pages, authentication code, migrations, RLS policies, Edge Functions, storage, content, and Netlify configuration are not changed.

## Data and Security Impact

This step performs no database writes and requires no migration or rollback of Supabase state. The only live operations used during implementation were schema type generation and a read-only verification query.

The generated types were checked for URLs, the project reference, service-role markers, secret-key markers, and JWT-shaped credentials before being added to the repository.

## Verification

- Targeted ESLint passed for every changed TypeScript and TSX file.
- The production build passed.
- The full repository lint result remains at the recorded baseline of 8 errors and 1 warning. No Step 4 file produced a lint finding.
- TypeScript checking remains at the recorded baseline of 16 errors. No Step 4 file produced a TypeScript diagnostic.
- A read-only live query confirmed all seven tables remain readable and that the fields used for ordering or about-video selection contain no null values.
- Static inspection confirmed the eight public pages no longer import or query the Supabase client directly.
- Static inspection confirmed admin and authentication consumers remain on the existing client and were not modified.
- `git diff --check` passed.

The local Playwright smoke and visual commands were invoked, but their environment guard stopped both commands before any browser tests started because `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are absent from the local process environment. No environment file was created, and connector-provided values were not displayed, written, or committed. Runtime and screenshot parity therefore remain unverified in this local execution.

## Rollback

Revert the Step 4 commit to restore direct Supabase reads in the public pages. No database, authentication, storage, or deployment rollback is required.
