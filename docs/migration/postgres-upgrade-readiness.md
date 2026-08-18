# Postgres Upgrade Readiness Audit

## Status

Completed read-only on August 16, 2026.

No upgrade, restart, pause, restore, backup, extension, role, password, schema,
data, Auth, Storage, Edge Function, hosting, environment, or billing change was
made. The upgrade remains unauthorized.

## Executive conclusion

The project is not ready to begin the Postgres upgrade yet.

Supabase reports that a newer Postgres version is available, but the dashboard
explicitly blocks the upgrade until the unsupported `pgjwt` extension is
removed. The project is also on the Free plan, which does not provide scheduled
platform backups. An independently created and verified logical backup is
therefore a required safety prerequisite before either removing `pgjwt` or
starting an upgrade.

The remaining database characteristics are favorable: the database is 13 MB,
there are no custom login roles, logical replication slots, subscriptions,
`pg_cron` jobs, or application-owned `reg*` columns, and the inspected public
schema is small. These findings reduce known upgrade risk but do not authorize
or guarantee a successful upgrade.

The dashboard did not expose the exact target Postgres release or an upgrade
time estimate while the prerequisite remained unresolved. Both must be
captured immediately before a separately approved upgrade.

## Scope and evidence

The audit used:

- live Supabase database metadata and aggregate-only `SELECT` queries
- the Supabase security advisor
- read-only inspection of Project Settings and Database Backups in the dashboard
- the repository migration history and application schema
- current Supabase upgrade, backup, and `pgjwt` documentation

No application content, Auth identity, credential, API key, token, password, or
private configuration value was displayed or recorded.

Primary references:

- <https://supabase.com/docs/guides/platform/upgrading>
- <https://supabase.com/docs/guides/platform/backups>
- <https://supabase.com/docs/guides/database/extensions/pgjwt>

## Current platform state

| Observation | Result |
| --- | --- |
| Project health | Active and healthy |
| Plan | Free |
| Region | East US (Ohio) |
| Postgres service version | `15.8.1.105` |
| Database server version | PostgreSQL `15.8` |
| Database size | 13 MB (`13,972,271` bytes) |
| Observed active connections | 6 |
| Upgrade advisor | Current Postgres release has security patches available |
| Dashboard eligibility | Blocked by installed `pgjwt` |
| Exact target version | Not displayed while blocked |
| Dashboard upgrade estimate | Not displayed while blocked |
| Scheduled platform backups | Not included on the current Free plan |

The dashboard's Service Versions section reports that a newer Postgres version
is available and identifies one blocking issue: remove the unsupported
`pgjwt` extension. The warning is consistent with Supabase's documented
Postgres 15 to 17 prerequisite, but the audit does not infer an exact target
release that the dashboard did not display.

## Extension readiness

| Installed extension | Version | Upgrade observation |
| --- | --- | --- |
| `pg_stat_statements` | `1.10` | No audit finding |
| `pgcrypto` | `1.3` | No audit finding |
| `pgjwt` | `0.2.0` | Dashboard blocker; deprecated on Postgres 17 |
| `plpgsql` | `1.0` | Core procedural language |
| `supabase_vault` | `0.3.1` | Recheck its post-upgrade version |
| `uuid-ossp` | `1.1` | No audit finding |

Supabase documents `plcoffee`, `plls`, `plv8`, `timescaledb`, and `pgjwt` as
deprecated for Postgres 17. Only `pgjwt` is installed. Neither `pg_graphql` nor
`pg_cron` is installed.

No dependency from a public application object to `pgjwt` was found. Supabase
also states that projects on Postgres 15 or earlier do not need `pgjwt` for the
platform's JWT handling and that it is generally safe to disable when the
application is not explicitly using it. This evidence supports a future,
separately approved removal step. It is not proof that every external database
client has been inspected, and the extension was not disabled during this
audit.

## Upgrade prerequisite checks

### Replication

| Check | Result |
| --- | ---: |
| Logical replication slots | 0 |
| Active logical replication slots | 0 |
| Subscriptions | 0 |
| Publications | 1 |
| Tables in `supabase_realtime` publication | 1 |
| Realtime subscriptions | 0 |

The sole publication is the Supabase-managed `supabase_realtime` publication.
It is configured for insert, update, delete, and truncate events. No
user-created logical replication slot or subscription requires removal based
on the observed state.

### Scheduled database work

`pg_cron` is not installed. Neither `cron.job` nor `cron.job_run_details`
exists, and no cron jobs or history require cleanup.

### Login roles and password format

Nine login-capable roles exist, all of which match the expected
Supabase-managed role set. No nonstandard or custom login role was found, and
no login role uses an MD5 password hash.

Supabase documents that it migrates managed role passwords during an upgrade
but not custom role passwords. The current result removes that known custom
role task. Roles must be queried again immediately before the upgrade because
the result is time-sensitive.

### Upgrade-sensitive `reg*` data types

No application-owned or `public` column uses a `reg*` type. Two such columns
exist only in the Supabase-managed `realtime.subscription` table:

- `claims_role regrole`
- `entity regclass`

These must not be altered by application migrations. If the Supabase upgrade
precheck later flags them, stop and obtain platform-specific guidance rather
than modifying the managed `realtime` schema.

### Public schema baseline

The live public application surface contains:

- 7 tables
- RLS enabled on all 7 tables
- 28 policies
- 0 public functions
- 0 public triggers
- 13 live migration ledger entries

The first observed migration version is `20250425002101`; the latest is
`20260815050633`.

## Pre-upgrade validation baseline

The following counts and fingerprints provide a content-integrity comparison
point. The fingerprints are deterministic MD5 digests of each table's
aggregate ordered row representation. They are verification aids, not backups,
and do not reveal row values.

| Table | Rows | Baseline fingerprint |
| --- | ---: | --- |
| `about_items` | 1 | `54da7e1138fd4aa40fbe6a04e0a4508d` |
| `about_video` | 1 | `201c0b187549f3e387443fbfa701a108` |
| `contact_methods` | 1 | `7fac28d90ade49a7f9669de42d73e66c` |
| `notes` | 10 | `b57be70b11da87b770520154002815dd` |
| `now_items` | 4 | `8edaccd9b3937ab9154ffef64984e8b0` |
| `projects` | 8 | `2d485eb6aee8511b85dcadb58985b8a5` |
| `work_experience` | 8 | `126ef684b840ed475fce54b2d2846aff` |

Related service aggregates at audit time:

| Surface | Baseline |
| --- | ---: |
| Auth users | 2 |
| Confirmed Auth users | 2 |
| Anonymous Auth users | 0 |
| Users with the administrator claim | 1 |
| Storage buckets | 1 |
| Storage objects | 0 |
| Active Edge Functions | 1 |

The active Edge Function is `setup-admin`, version 3, with platform JWT
verification enabled. These aggregates are not a substitute for functional
Auth, Storage, or Edge Function testing after the upgrade.

## Backup and rollback readiness

The dashboard states that Free Plan projects do not include project backups.
No scheduled backup is available to use as the pre-upgrade recovery point.
Supabase recommends that Free projects regularly export their data with the
Supabase CLI and maintain off-site backups.

Before any extension removal or upgrade, a separately approved step must:

1. create a fresh logical backup using an authorized database connection
2. include roles, schema, and table data using Supabase's documented dump flow
3. store the backup outside the production project and outside tracked source
4. verify the backup files are nonempty and contain the expected object classes
5. perform a restore rehearsal into an isolated, nonproduction database
6. compare schema, row counts, and fingerprints against the production baseline
7. define who can access the backup and how it will be securely removed later

Database backups do not contain Storage object contents. The observed bucket
currently contains zero objects, but that count must be checked again and any
objects must be backed up separately before an upgrade.

Supabase documents that an in-place upgrade failure brings the original
database back online. That platform behavior is useful protection, but it is
not a complete rollback plan for a successfully completed upgrade or for the
preceding `pgjwt` removal. The independent, restore-tested logical backup is
the required recovery boundary.

## Downtime and application impact

Supabase takes the project offline while it provisions the new instance, copies
and upgrades the data, validates the result, takes a base backup, and restores
service. The public site and admin interface depend on Supabase for content and
authentication, so both should be treated as unavailable or degraded for the
entire maintenance window.

Supabase publishes an approximate data-transfer rate of 100 MB/s for the
default disk. At 13 MB, raw data copy time is not the dominant concern and
would be below one second under that idealized rate. This calculation is not a
downtime estimate. Provisioning, `pg_upgrade`, service migrations, validation,
the post-upgrade base backup, and application checks add platform-dependent
time. The dashboard's current estimate must be recorded immediately before the
approved operation, and the maintenance window must include additional time
for application verification or rollback.

## Proposed future execution sequence

No item in this sequence is authorized by this audit.

1. Re-run all time-sensitive readiness queries and security advisors.
2. Confirm the exact offered target version, upgrade method, dashboard estimate,
   service release notes, and maintenance window.
3. Create and restore-test an independent logical backup.
4. Verify that no repository code, database object, or known external client
   calls `pgjwt` functions.
5. Remove `pgjwt` in its own approved, forward-only change.
6. Verify public reads, administrator login and authorization, content writes,
   RLS, Storage, Realtime, and the Edge Function after extension removal.
7. Confirm that the dashboard reports no remaining prerequisite warning.
8. Announce the maintenance window and freeze content mutations.
9. Capture final row counts, fingerprints, schema metadata, Auth aggregates,
   Storage inventory, function metadata, roles, slots, and advisor results.
10. Trigger the approved dashboard upgrade once.
11. Wait for Supabase to finish before making any other infrastructure change.
12. Run the post-upgrade verification checklist below.
13. Reopen writes only after the full verification passes.

## Post-upgrade verification checklist

- Supabase reports the project active and healthy.
- Postgres and related service versions match the approved target.
- Security advisors no longer report the vulnerable Postgres release.
- All 13 expected migration ledger entries remain present.
- The seven public tables, columns, constraints, indexes, RLS enablement, and 28
  policies remain intact.
- Row counts and fingerprints match the final pre-upgrade snapshot.
- Public home, projects, writing, work, about, now, and contact routes load the
  expected content and order.
- Administrator login, authorization, dashboard reads, and one controlled
  reversible content-write flow succeed.
- Anonymous and authenticated nonadministrator writes remain denied.
- Realtime publication state is intact and emits expected events if used.
- The Storage bucket and object inventory match the final pre-upgrade snapshot.
- `setup-admin` remains active only if its continued deployment is intended.
- Installed extension versions are recorded and no deprecated extension remains.
- Application, Postgres, Auth, Storage, Realtime, and Edge Function logs show no
  new material errors or slow-query regression.
- The Vercel production site passes its smoke and parity checks.

## Stop conditions for a future upgrade

Stop before making a production change if any of the following is true:

- a current, independently stored, restore-tested backup is unavailable
- the exact target version or dashboard upgrade estimate is unknown
- `pgjwt` or another unsupported extension remains installed
- a dependency on `pgjwt` is found and has no approved replacement
- a custom role, MD5 password, replication slot, subscription, cron workload,
  read replica, or application-owned `reg*` type appears
- the final baseline differs unexpectedly from this audit
- the dashboard reports another prerequisite or materially different method
- Supabase release notes identify an unplanned breaking change
- the maintenance window and application validation owner are not confirmed
- the action requires a plan purchase or another unapproved infrastructure change
- production behavior, data, authentication, authorization, or deployment would
  change outside the approved implementation brief

## Audit verification record

- Current Postgres and related service versions inspected read-only.
- Security advisors inspected read-only.
- Database size, extensions, replication, cron, roles, `reg*` columns, schema,
  migrations, content aggregates, and fingerprints queried with `SELECT` only.
- Auth, Storage, and Edge Function state inspected through aggregate metadata.
- Project Settings inspected without using restart, pause, transfer, delete,
  manage-extension, upgrade, or billing controls.
- Database Backups inspected without creating, restoring, or downloading a backup.
- Current Supabase upgrade, backup, and `pgjwt` guidance reviewed.
- No production mutation performed.

## Rollback

This audit changes documentation only. Revert its commit to remove the record.
No application, database, Auth, Storage, Edge Function, hosting, or deployment
rollback is required.
