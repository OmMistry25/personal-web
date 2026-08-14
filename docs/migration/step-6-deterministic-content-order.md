# Migration Step 6: Deterministic Content Order

## Status

Implemented on August 14, 2026.

This step makes every collection query deterministic and adds explicit ordering controls for Projects and Work Experience. The database backfill preserves the production order that existed immediately before the migration, so public content, copy, routes, and visuals remain unchanged.

## Database Migration

Migration `20260814165936_deterministic_content_order.sql` performs the following additive changes:

- Adds required integer `sort_order` columns with a default of `0` to `projects` and `work_experience`.
- Backfills both tables with zero-based values derived from the prior production order: `created_at` descending, then `id` ascending.
- Adds `(sort_order, id)` indexes to `projects`, `work_experience`, `notes`, `about_items`, `now_items`, and `contact_methods`.
- Adds a unique constant-expression index to `about_video`, enforcing a maximum of one row without changing its existing row.

No existing column, row, table, policy, grant, function, bucket, object, user, or authentication setting is removed or modified outside the 16 ordering backfill values.

## Query Contract

All ordered collection reads now sort by `sort_order` ascending and then `id` ascending. This applies to public reads and their corresponding admin list reads.

| Content | Primary order | Deterministic tie-breaker |
| --- | --- | --- |
| Projects | `sort_order` ascending | `id` ascending |
| Work Experience | `sort_order` ascending | `id` ascending |
| Writing | `sort_order` ascending | `id` ascending |
| About items | `sort_order` ascending | `id` ascending |
| Now items | `sort_order` ascending | `id` ascending |
| Contact methods | `sort_order` ascending | `id` ascending |

The About video read now uses `.maybeSingle()` and returns either one video object or `null`. The database singleton index guarantees that a multiple-row result cannot be introduced after this migration. The existing admin save behavior still replaces the current row by deleting it and inserting the submitted video ID.

The historical `src/lib/database.ts` module remains unchanged and unused.

## Admin Behavior

Projects and Work Experience now display their order and provide accessible move-up and move-down controls. A move swaps the `sort_order` values of the selected record and its adjacent record, then reloads the deterministically ordered list.

New Projects and Work Experience records receive a `sort_order` one less than the current minimum, preserving the existing new-item-first presentation. Editing an existing record preserves its order.

Writing retains its existing ordering and move behavior. About, Now, and Contact retain their existing numeric order fields. Their list queries only gain the `id` tie-breaker.

## Live Data Verification

The live precondition gate passed immediately before the migration:

- Projects: 8 rows and 8 distinct `created_at` values
- Work Experience: 8 rows and 8 distinct `created_at` values
- About video: exactly 1 row
- Existing ordered collections: no duplicate ordering values in the current production data
- New `sort_order` columns: absent before migration

After migration, Projects and Work Experience each contain 8 distinct `sort_order` values spanning `0` through `7`. All seven expected indexes exist, both new columns are required integers with a default of `0`, and the About video still contains exactly one row.

The order fingerprints for all six collections are unchanged from the immediate pre-migration values. This verifies that the migration did not reorder production content.

## Generated Types

`src/types/database.generated.ts` was regenerated from the connected live schema after the migration. The manual Project and Work Experience application interfaces also include required numeric `sort_order` fields.

The generated file was checked for the project reference, Supabase URLs, secret-key markers, service-role markers, and JWT-shaped values before commit. No credential or environment value is stored in the repository.

## Security and Infrastructure Impact

This step does not change Supabase Auth, users, RLS policies, grants, Edge Functions, storage, Netlify configuration, runtime versions, dependencies, or deployment behavior.

The post-migration security advisor findings match the pre-migration baseline. The performance advisor additionally reports the newly created indexes as unused, which is expected immediately after creation. Existing authentication and RLS advisor findings remain frozen and were not modified.

## Verification

- Live migration ledger contains `20260814165936_deterministic_content_order`.
- Live schema, backfill ranges, indexes, singleton count, and content-order fingerprints passed read-only verification.
- Generated database types match the post-migration live schema.
- TypeScript checking passed.
- The production build passed.
- Full repository lint reports 7 errors and 1 warning, improving the recorded 8-error and 1-warning baseline by removing one stale import. Every remaining finding predates Step 6, and no Step 6 behavior introduced a lint finding.
- `git diff --check` passed.

The smoke and visual Playwright commands were invoked, but the repository environment guard stopped both before browser startup because `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are absent from the local process. No environment file was created, and no connector-provided value was displayed, written, or committed. Runtime interaction and screenshot parity remain unverified in this local execution.

## Rollback

Application rollback is to revert the Step 6 commit, restoring the prior `created_at` ordering for Projects and Work and the prior collection queries. The additive database fields and indexes can remain safely in place while the application is rolled back.

If a database rollback is explicitly approved, first confirm no post-migration admin reordering must be retained. Then remove `about_video_singleton_idx`, the six `(sort_order, id)` indexes, and the two `sort_order` columns in a new forward migration. Dropping the columns discards any ordering changes made after Step 6 and must not be performed without that verification and approval.
