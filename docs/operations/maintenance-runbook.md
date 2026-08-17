# Maintenance Runbook

## Purpose

Use this runbook for routine development, content administration, deployment
verification, and incident triage after the Bolt migration. It does not grant
permission to change production infrastructure, data, authentication, or other
frozen systems.

## Quick reference

| Item | Location |
| --- | --- |
| Source repository | <https://github.com/OmMistry25/personal-web> |
| Production | <https://personal-web-eta-eight.vercel.app/> |
| Administrator login | <https://personal-web-eta-eight.vercel.app/admin/login> |
| Historical reference | <https://ommistry.netlify.app/> |
| Migration closeout | [`../migration/closeout.md`](../migration/closeout.md) |
| Production deployment record | [`../migration/vercel-deployment.md`](../migration/vercel-deployment.md) |
| Database readiness record | [`../migration/postgres-upgrade-readiness.md`](../migration/postgres-upgrade-readiness.md) |

Never put credentials, tokens, Supabase values, backup contents, or private user
information in Git, issue or pull-request text, terminal output, screenshots,
documentation, or chat.

## Local setup

Requirements:

- Node.js 22.x
- npm and the committed `package-lock.json`
- the existing browser-safe Supabase URL and anon/publishable key, obtained
  through an approved private channel

Setup:

```sh
git clone https://github.com/OmMistry25/personal-web.git
cd personal-web
npm ci
```

Create an untracked `.env.local` with only these browser-safe names:

```text
VITE_SUPABASE_URL=<project-url>
VITE_SUPABASE_ANON_KEY=<browser-safe-anon-or-publishable-key>
```

Do not use a Supabase secret key or `service_role` key in the client. Start the
site with `npm run dev`.

## Routine code-change workflow

1. Pull current `main` and confirm the worktree is clean.
2. Draft the required implementation brief, or a concise plan for a genuinely
   low-risk localized change, and obtain approval.
3. Create one `codex/*` branch for the approved unit of work.
4. Preserve unrelated user changes and the existing public experience.
5. Run the applicable verification commands.
6. Commit with a Conventional Commit message, push, and open a draft PR.
7. Inspect the Vercel preview when behavior, visuals, routing, content reads, or
   deployment output might change.
8. The user reviews and merges the PR.
9. Confirm the `main` production deployment is ready and sourced from the merge
   commit; then perform the relevant production smoke checks.

Do not combine dependency upgrades, cleanup, database work, security changes,
or product features with an unrelated fix.

## Verification matrix

### Required for every code change

```sh
npm run lint
npm exec tsc -- --noEmit
npm run build
git diff --check
```

### Required when public behavior or data reads can change

```sh
npm run test:e2e:smoke
npm run test:e2e:failure
```

Confirm the homepage, every affected collection route, representative detail
routes, direct deep links, and unknown-route SPA behavior.

### Required when visuals can change

```sh
npm run test:e2e:visual
```

Review the desktop, tablet, and mobile references. Treat intentional baseline
updates as visual changes requiring explicit approval.

### Required when administrator behavior can change

Verify with controlled accounts and an approved security test plan:

- unauthenticated users cannot enter protected routes
- authenticated non-administrators cannot enter or mutate content
- the protected administrator can reach the dashboard
- database RLS, rather than the route alone, denies unauthorized writes

Do not create accounts, change claims, change credentials, or test destructive
writes without explicit approval.

## Content administration

The administrator interface manages Projects, Writing, Work, About, Now, and
Contact.

1. Open `/admin/login` and sign in with the existing administrator account.
2. Select the content section and make the smallest intended change.
3. Save once; do not retry repeatedly if the result is uncertain.
4. Open the matching public route and verify text, link, media, and ordering.
5. If the public result is wrong, preserve evidence without including private
   values and follow the content-incident procedure below.

Homepage and site-level copy are intentionally code-controlled. Draft and
publication controls do not exist. Adding either capability is product work,
not routine administration.

## Deployment workflow

Vercel is connected to `OmMistry25/personal-web`. Production tracks `main`;
other branches receive preview deployments.

After a merge:

1. Open the Vercel deployment list.
2. Confirm the newest Production deployment is `Ready`, references `main`, and
   links to the expected Git commit.
3. Check `/`, `/projects`, `/writing`, `/work`, `/about`, `/now`, and `/contact`.
4. Open one Writing and one Work detail URL directly.
5. Confirm the About video and an unknown-route SPA fallback.
6. Check browser console health when the available browser tooling supports it.
7. When administrator code changed, complete the approved administrator checks.

Do not edit Vercel environment values, domains, Git integration, framework,
runtime, build command, or output directory as part of routine verification.

## Incident procedures

### Failed Vercel deployment

1. Do not merge more changes or edit production settings to experiment.
2. Record the failing Git commit, build phase, and sanitized error.
3. Confirm whether the last known-good Production deployment remains available.
4. If immediate recovery is necessary, an authorized project owner may restore
   the prior immutable Vercel deployment.
5. Diagnose and fix the cause through a separately reviewed branch and PR.
6. Re-run the full affected verification matrix before promoting the fix.

### Public route or visual regression

1. Compare the affected Vercel route with the historical Netlify reference and
   committed parity references.
2. Determine whether the source commit, data response, or hosting layer changed.
3. Avoid editing production content unless the incident is confirmed to be a
   content error and that edit is explicitly authorized.
4. Restore or fix through the smallest approved path, then verify all related
   routes and viewports.

### Incorrect or missing content

1. Confirm whether the administrator interface and public page show the same
   state.
2. Capture only non-sensitive identifiers and sanitized errors.
3. Do not issue direct SQL or bypass RLS for convenience.
4. Correct an ordinary content mistake through the administrator interface if
   the owner authorizes it.
5. Treat schema, ordering, RLS, or data-recovery work as a separate database
   change with its own backup and rollback plan.

### Administrator login failure

1. Confirm the Vercel deployment and public routes are healthy.
2. Check for an expired browser session and retry the normal login once.
3. Do not display, guess, reset, or rotate credentials.
4. Do not invoke or redeploy `setup-admin`; its implementation is intentionally
   inert.
5. Diagnose Auth, claim, session, and RLS state read-only first. Any mutation to
   users, claims, credentials, providers, or policy requires explicit approval.

### Supabase or database incident

1. Preserve the current application deployment and stop content writes.
2. Check project health and sanitized platform logs read-only.
3. Do not change schema, policies, extensions, roles, Auth, Storage, functions,
   or data during diagnosis.
4. Follow the database readiness record before any upgrade, extension removal,
   backup, or restore operation.
5. Escalate with a bounded implementation brief and an explicit recovery plan.

## Recurring maintenance

### Monthly or before a release

- run `npm audit` and `npm audit --omit=dev` as read-only inventories
- review direct and transitive advisories without running automatic fixes
- confirm Node 22 and the locked install still build cleanly
- review Vercel Production health and source-commit linkage
- run the public smoke suite and the relevant parity checks
- review Supabase security and performance advisors read-only

Each dependency-upgrade batch must be its own approved change with compatibility
research, lockfile review, tests, preview verification, and rollback through Git.

### Before database maintenance

- re-audit current live schema, ledger, roles, extensions, Storage, and Auth
  aggregates
- create an independently stored logical backup
- restore-test that backup in an isolated nonproduction database
- compare schema, row counts, and deterministic fingerprints
- confirm the maintenance window and the current Supabase upgrade target

The Free-plan database currently lacks a scheduled platform backup. The
Postgres upgrade and `pgjwt` removal remain blocked until the documented backup
prerequisite is satisfied.

## Frozen systems and stop conditions

Stop and obtain a new or amended approval if work would:

- change public behavior, appearance, content, or ordering outside the brief
- add or upgrade a dependency
- change runtime, build, deployment, domain, or environment configuration
- modify production data, schema, RLS, grants, migrations, Storage, or Edge
  Functions
- modify authentication, authorization, users, claims, sessions, or credentials
- delete Netlify or remove a recovery path
- require a materially different technical approach
- expose a secret or private user data

Minor implementation details needed to complete an already approved scope do
not require a new approval cycle.

## Recovery references

- The Vercel deployment history contains immutable prior deployments.
- Netlify remains a historical comparison and rollback reference, not an active
  Git deployment target.
- Git history is the rollback boundary for repository-only changes.
- Supabase recovery requires the approved, restore-tested backup process; Git
  does not back up live database data, Auth users, or Storage objects.

Deleting Netlify, changing custom domains, or declaring Vercel the only recovery
path requires a separate infrastructure brief and explicit approval.
