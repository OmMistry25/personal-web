# Live Supabase State Audit

## Purpose

This document records the read-only Migration Step 3 inspection of the live Supabase project used by the production website. It compares live database metadata with the schema derived from the repository migrations before any database work begins.

The inspection was performed on 2026-08-14 from starting commit `7047cc6bfd38dd33a194cd0e191d4893d7df42b2` on branch `codex/audit-live-supabase-state`.

## Safety boundary

The live project was inspected through the connected Supabase integration using metadata operations and SQL `SELECT` statements only.

The inspection did not:

- execute a migration
- create, alter, or drop a database object
- insert, update, or delete data
- inspect or modify Auth users or credentials
- change RLS policies
- invoke or deploy an Edge Function
- upload, download, reorganize, or delete storage objects
- change project, hosting, or environment configuration
- print or commit a Supabase URL, key, password, or access token

The installed local Supabase CLI was not used after its project-list request returned `Unauthorized`. The CLI's generated local version-check cache was removed, leaving the repository clean before documentation began.

## Project identification

The connected account exposes one active project named `me`. Three independent facts identify it as the production website project:

1. Its creation date matches the first repository migration date.
2. Its migration ledger contains all 11 repository migration identifiers.
3. Its project reference matches the Supabase host embedded in the production website bundle. The host and client key were compared without being printed.

The project identity is therefore considered production-verified for this audit.

## Repository migration inventory

The repository contains 11 migrations in chronological order:

| Version | Name | Repository-derived effect |
| --- | --- | --- |
| `20250425002101` | `proud_boat` | Creates six public content tables, enables RLS, and creates public-read and authenticated-write policies. |
| `20250425002814` | `divine_shore` | Replaces the six authenticated-management policies. |
| `20250425021146` | `cool_limit` | Conditionally adds `sort_order` to `now_items` and `contact_methods`; both columns already exist in the initial migration. |
| `20250428030748` | `black_sound` | Adds and backfills `notes.sort_order`. |
| `20250504174254` | `spring_ember` | Creates the first `about_video` table using a `url` column. |
| `20250504225145` | `calm_poetry` | Repeats the `about_video` table definition and replaces its policies. |
| `20250504230054` | `quiet_frog` | Recreates a partial model of Supabase-managed storage tables, creates the `videos` bucket, and adds two storage policies. |
| `20250504232334` | `cool_leaf` | Repeats the preceding storage migration and replaces the same two policies. |
| `20250504233040` | `pink_flower` | Updates the `videos` bucket limits and adds two more storage policies without removing the previous pair. |
| `20250510181300` | `gentle_castle` | Drops and recreates `about_video` with `video_id`, destroying any rows then present. |
| `20250510181702` | `wooden_queen` | Immediately repeats the destructive `about_video` drop and recreation. |

### Migration-ledger comparison

The live migration ledger contains the same 11 version and name pairs in the same order. No repository migration is absent from the live ledger, and no additional application migration appears in the live ledger.

The available migration listing does not expose stored SQL hashes. This verifies identifier and order parity, not byte-for-byte SQL identity.

Existing migrations must remain immutable. The duplicated and destructive statements are historical findings, not authorization to rewrite migration history.

## Repository-derived public schema

Applying the repository migrations in order produces these public tables:

| Table | Final columns beyond timestamps | Constraints beyond primary key | Ordering field |
| --- | --- | --- | --- |
| `projects` | `title`, `description`, `tags`, `url`, `featured`, `year`, `achievements` | None | None; application orders by `created_at DESC` |
| `notes` | `title`, `slug`, `date`, `reading_time`, `excerpt`, `tags`, `content`, `sort_order` | Unique `slug` | `sort_order`, default `0` |
| `work_experience` | `company`, `role`, `period`, `description`, `achievements`, `technologies` | None | None; application orders by `created_at DESC` |
| `about_items` | `title`, `sort_order` | None | `sort_order` |
| `now_items` | `activity`, `sort_order` | None | `sort_order` |
| `contact_methods` | `label`, `value`, `type`, `sort_order` | `type` limited to `email`, `social`, or `other` | `sort_order` |
| `about_video` | `video_id` | None | None; application selects one unspecified row |

All tables use UUID primary keys and `created_at` and `updated_at` timestamp columns. The migrations do not create triggers that automatically change `updated_at`.

## Live public schema comparison

The seven expected public tables are present. Their inspected columns, data types, nullability, defaults, primary keys, unique constraint, and check constraint match the repository-derived final state.

Specific confirmations:

- RLS is enabled on all seven public tables.
- `notes.slug` has the expected unique constraint and unique index.
- `contact_methods.type` has the expected three-value check constraint.
- `notes.sort_order` exists with default `0`.
- `projects` and `work_experience` do not have `sort_order` columns.
- `about_video` contains `video_id` and does not contain the earlier `url` column.
- No application-defined public functions exist.
- No triggers exist on the seven public tables.
- No indexes exist beyond primary-key indexes and the `notes.slug` unique index.

The public schema matches the repository-derived state for every inspected object.

## Live RLS policies

Each public table has exactly two permissive policies:

- public `SELECT` access with `USING (true)`
- `ALL` access when `auth.role()` is `authenticated`, with matching `USING` and `WITH CHECK` expressions

This matches the final repository-derived policy state.

It also confirms the existing authorization weakness recorded in the initial audit: any authenticated Supabase user is authorized for every write operation on every public content table. Authentication is therefore functioning as authorization. Step 3 did not inspect Auth users or signup settings and did not modify the policies.

Any correction requires a separately approved authentication and authorization change. It must not be included opportunistically in a data-boundary refactor.

## Live aggregate data observations

Only aggregate counts and duplicate-order checks were queried. No content values were returned.

| Object | Live row count |
| --- | ---: |
| `about_items` | 1 |
| `about_video` | 1 |
| `contact_methods` | 1 |
| `notes` | 10 |
| `now_items` | 4 |
| `projects` | 8 |
| `work_experience` | 8 |
| `videos` storage objects | 0 |

The live `about_video` table contains exactly one row.

No duplicate `sort_order` groups exist in:

- `about_items`
- `contact_methods`
- `notes`
- `now_items`

This observation does not add a database uniqueness guarantee. None of those tables has a unique constraint on `sort_order`, so future duplicates remain possible.

`projects` and `work_experience` cannot be checked for duplicate `sort_order` values because neither table has that field. Their public pages currently order by `created_at DESC`, and production order remains the required reference for any future ordering migration.

## Storage state

The public `videos` bucket exists with the repository-configured state:

- public access enabled
- 400 MB file-size limit
- allowed MIME types limited to MP4, QuickTime, and M4V

The bucket currently contains zero objects. This establishes current state only. It does not prove that the bucket was never used historically or that no external client depends on its existence.

Four policies exist on `storage.objects` for the bucket:

1. `Give public access to videos`
2. `Videos are publicly accessible`
3. `Allow authenticated uploads to videos bucket`
4. `Authenticated users can upload videos`

The two read policies are functionally duplicative. The two insert policies overlap, but use different role declarations and checks. This is the live result predicted by the repository migrations.

The live `storage` schema contains Supabase-managed columns and tables not described by the repository's partial hand-written storage table definitions. This is expected platform-managed evolution, but it makes the two repository migrations that attempt to define `storage.buckets` and `storage.objects` unsafe templates for future work. Future storage changes must use new, narrowly scoped migrations and must not attempt to recreate Supabase-managed storage tables.

No storage policy or bucket setting was changed.

## Edge Function observation

The `setup-admin` Edge Function is deployed, active, at version 1, and configured to verify JWTs.

Repository presence alone had not established deployment. This read-only metadata check resolves that question. The deployed source was not invoked, authentication credentials were not tested, and deployed-source parity was not established.

## Resolved and unresolved live-state questions

### Resolved

- The connected project is the project referenced by the production bundle.
- All 11 repository migration identifiers appear in the live ledger in order.
- The inspected public schema matches the repository-derived final schema.
- RLS is enabled on all seven public tables.
- Live public and authenticated policies match repository-derived behavior.
- `setup-admin` is deployed and active.
- `about_video` contains exactly one row.
- No current duplicate `sort_order` groups exist in the four tables that use that field.
- The `videos` bucket exists and currently contains zero objects.

### Still unverified

- Whether migration SQL stored or executed live was byte-for-byte identical to repository files
- Whether the fixed bootstrap account exists or its credentials changed
- Whether additional Auth users exist
- Whether external signups are disabled
- Whether the deployed Edge Function source exactly matches the repository source
- Whether the `videos` bucket had historical objects or has external clients
- Netlify dashboard configuration and deployed commit identity

Authentication and Netlify remain frozen. These questions must be verified only before an approved change to their corresponding systems.

## Material risks for later steps

1. Every authenticated user currently receives full write access to every public content table.
2. The migration history includes two destructive `about_video` rebuilds and must not be replayed casually against data-bearing environments.
3. The repository contains duplicated storage migrations that model Supabase-managed tables incompletely.
4. The live storage policy set contains overlapping policies created by those migrations.
5. Ordered tables do not enforce unique `sort_order` values.
6. Projects and work records rely on creation timestamps rather than explicit content order.
7. `about_video` has no singleton constraint even though the application reads only one row.

These are findings only. Step 3 does not authorize fixing them.

## Step 3 conclusion

The live public schema and migration identifiers are sufficiently aligned with the repository to support behavior-preserving application data-boundary work. The comparison also confirms that migration history is not a safe source to rewrite or replay without a forward-only plan.

The next proposed migration step is to introduce typed, behavior-preserving data-access boundaries for the existing public reads while leaving schema, policies, Auth, storage, content, ordering, UI, and successful runtime behavior unchanged.
