# Bolt Migration Closeout

## Status

Completed and independently verified on August 17, 2026.

The website is maintainable without Bolt. GitHub is the source repository,
Vercel builds and deploys `main`, Supabase provides the existing data and
administrator services, and the repository contains the setup, verification,
deployment, governance, and maintenance documentation required for future
work.

This closeout does not assert that all maintenance debt has been eliminated.
The deferred work register below separates completed migration work from
future changes that require their own implementation briefs and approval.

## Final architecture

```text
GitHub: OmMistry25/personal-web
  -> Vercel Git integration
     -> Preview deployments for non-production branches
     -> Production deployment from main
        -> React 18 + TypeScript + Vite single-page application
           -> public routes and content views
           -> protected administrator interface
              -> Supabase browser client

Supabase
  -> Postgres content tables with row-level security
  -> Auth sessions and protected administrator claim
  -> public video storage policy surface
  -> inert setup-admin Edge Function retained as deployment history

Historical reference
  -> disconnected Netlify/Bolt deployment at ommistry.netlify.app
```

Bolt is not a runtime, build, content-management, deployment, or recovery
dependency. Its confirmed repository-only artifacts were removed in the
approved dead-code cleanup. No external Bolt state is required to develop,
verify, publish, or operate the current application.

## Environment ownership

| Surface | Current role | Source or owner |
| --- | --- | --- |
| GitHub `main` | Canonical source branch | `OmMistry25/personal-web` |
| Vercel Production | Current public deployment | GitHub `main` |
| Vercel Preview | Pull-request and branch verification | Non-production Git branches |
| Supabase | Content database, Auth, RLS, Storage, and Edge Function | Existing production project |
| Netlify | Historical visual/behavioral comparison and rollback reference | Disconnected Bolt deployment |
| Local development | Development and verification | Locked npm tree plus untracked browser-safe environment values |

The current production URL is <https://personal-web-eta-eight.vercel.app/>.
The historical reference remains <https://ommistry.netlify.app/>. Netlify is
not part of the current Git deployment workflow and must not be removed without
a separately approved infrastructure decision.

## Final operating workflows

### Code changes

1. Start from current `main` and create one `codex/*` branch for one approved
   unit of work.
2. Follow `AGENTS.md`, `RULES.md`, and `ENGINEERING_STANDARDS.md`.
3. Verify the change locally and review the Vercel preview when public behavior
   could be affected.
4. Open a draft pull request. The user reviews and merges it.
5. Confirm the resulting `main` production deployment before declaring the
   change complete.

### Content changes

1. Sign in through `/admin/login` with the existing administrator account.
2. Use the matching administrator section for Projects, Writing, Work, About,
   Now, or Contact.
3. Make only the intended content change, then confirm it on the public route.
4. Do not share credentials or browser-safe environment values in Git,
   documentation, logs, screenshots, or chat.

### Local verification

Use the committed lockfile and Node 22:

```sh
npm ci
npm run lint
npm exec tsc -- --noEmit
npm run build
npm run test:e2e:smoke
npm run test:e2e:visual
```

The end-to-end commands require `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY`. Their guard exits before browser startup when either
name is absent.

## Original migration-gap disposition

| # | Initial gap | Closeout disposition |
| ---: | --- | --- |
| 1 | Governance was not versioned | Resolved: repository governance and approval rules are versioned. |
| 2 | README was Bolt-only | Resolved: README documents the independent stack and workflows. |
| 3 | Setup and operations were undocumented | Resolved: README, migration records, and the maintenance runbook cover them. |
| 4 | No clean install/build baseline | Resolved: the locked install and production build have been repeatedly verified. |
| 5 | No type-check command | Resolved operationally: `npm exec tsc -- --noEmit` is documented and passing. A separate package script is not required for migration parity. |
| 6 | No tests or parity baseline | Resolved: public smoke, failure-state, and visual-parity suites and references are committed. |
| 7 | Deployment source and commit were unverified | Resolved: Vercel is connected to GitHub, Production tracks `main`, and deployments expose their source commit. |
| 8 | Live Supabase state was unverified | Resolved for the audited state: schema, ledger, policies, Auth aggregates, Storage, and the Edge Function were inspected and documented. Recheck before future live changes. |
| 9 | Migration history was duplicated/destructive | Contained: applied migrations remain immutable; subsequent database work used forward-only migrations. Historical statements remain as audit evidence. |
| 10 | Public data access was fragmented | Resolved: typed public data boundaries centralize the existing reads. |
| 11 | Ordering was incomplete or nondeterministic | Resolved: forward migration and deterministic query tie-breakers preserve live order. |
| 12 | Public failure handling was incomplete | Resolved: public failure states are standardized and covered by tests. |
| 13 | Site-level content was not CMS managed | Deferred by design: optional CMS expansion is a separate product feature, not a migration requirement. |
| 14 | Unused and Bolt artifacts needed review | Resolved: only confirmed dead artifacts were removed after approval and parity verification. |
| 15 | Authentication was not administrator authorization | Resolved: protected app metadata, backend RLS, storage policy, and route behavior distinguish the administrator. |

## Closeout verification evidence

### Repository checks

The closeout branch was verified with Node `v22.22.0` and npm `10.9.4`:

| Check | Result |
| --- | --- |
| `npm ci` | Passed; 304 packages installed from the committed lockfile |
| `npm run lint` | Passed |
| `npm exec tsc -- --noEmit` | Passed |
| `npm run build` | Passed with Vite 5.4.8 |
| Tracked lockfile change after install | None |
| Local Supabase environment names | Both absent; values were not requested, read, or changed |
| Local public smoke suite | Stopped at the intentional environment guard |
| Local visual suite | Stopped at the intentional environment guard |

The build emitted only the existing Browserslist/caniuse-lite age notice. The
missing local environment names are an environment limitation, not a product
failure; the guard behaved as designed.

### Production checks

Read-only browser verification established:

- Vercel is connected to `OmMistry25/personal-web`.
- the Vercel Production environment tracks `main`.
- the latest production deployment was ready from commit
  `2b1d25011067544950b458e38829a718905ee47a` on `main`.
- the homepage and Projects, Writing, Work, About, Now, and Contact routes
  rendered the expected current content and order.
- representative Writing and Work detail routes rendered directly.
- the About YouTube embed rendered.
- an unknown deep link returned the application shell and the intentional
  empty catch-all route, confirming the SPA rewrite.
- an existing authenticated administrator session reached the dashboard and
  its read-only navigation without changing data.
- the historical Netlify homepage remained online with the expected route
  structure.

A fresh unauthenticated administrator redirect was not repeated because the
available browser session was authenticated and logging the user out would
have changed session state. That boundary remains covered by the committed
route behavior and earlier production verification. No content write,
credential test, Auth change, database mutation, storage operation, Edge
Function invocation, deployment, or hosting configuration change was made.

The previous accepted production verification recorded a clean browser console.
The closeout browser interface did not expose a console-message collection
method, so the console was not independently re-collected in this pass.

## Dependency audit

The closeout used `npm audit` as a read-only inventory. No package, version, or
lockfile was changed.

| Dependency scope | Total | Low | Moderate | High | Critical |
| --- | ---: | ---: | ---: | ---: | ---: |
| Complete tree | 23 | 4 | 4 | 15 | 0 |
| Production tree | 14 | 2 | 1 | 11 | 0 |

Direct production packages reported in affected paths include
`@supabase/supabase-js`, `react-router-dom`, and `postcss`; other findings are
transitive. This is the highest-priority deferred maintenance item. Automated
or opportunistic fixes are prohibited because upgrades can alter behavior and
must be planned, tested, and reviewed as a separate change.

## Deferred maintenance register

| Priority | Deferred work | Reason and approval boundary | Trigger |
| --- | --- | --- | --- |
| High | Dependency security upgrades | Requires an implementation brief, compatibility review, lockfile changes, complete tests, and preview parity verification | Begin as the next maintenance step |
| High | Postgres upgrade and `pgjwt` removal | Blocked on a fresh independently stored, restore-tested logical backup; changes production database state | Resume only through the documented database readiness plan |
| Medium | Supabase leaked-password protection | The available control is plan-dependent and changes Auth security configuration | Revisit if plan capabilities or risk requirements change |
| Low | Additional CMS control for homepage/site copy | Product expansion, not parity or maintenance | Start only when explicitly requested as a feature |
| Low | Netlify retirement or custom-domain migration | Destructive hosting/infrastructure change with rollback implications | Start only after the Vercel deployment is accepted as the sole recovery path |
| Low | Remove the inert `setup-admin` deployment artifact | The implementation is inert, but undeploying changes production Edge Function state and audit history | Consider during a separately approved Supabase cleanup |

## Frozen boundaries after closeout

Unless a new approved brief explicitly includes the affected system, do not:

- change public appearance, behavior, content, or ordering
- change dependencies, Node, npm, build, or deployment settings
- change Supabase Auth users, claims, credentials, sessions, providers, or
  signup configuration
- change RLS, grants, schema, migrations, production data, Storage, or Edge
  Functions
- expose or rotate environment values
- delete or reconfigure Netlify, Vercel, domains, or Git integrations
- expand CMS scope or redesign the site
- rewrite applied migration history

## Rollback

This closeout is documentation-only. Revert its Git commit to remove the new
records and README links. The application, data, Auth, and hosting environments
require no rollback because they were not modified.

For a future application regression, use the last known-good immutable Vercel
deployment while investigating through a new branch and pull request. Keep the
Netlify reference available until its separate retirement decision is approved.

## Completion statement

The Bolt migration is closed. The repository can be cloned, installed, run,
verified, reviewed, deployed, administered, and maintained through documented
GitHub, Vercel, npm, and Supabase workflows without Bolt. Future work begins as
ordinary, separately approved maintenance or product development.
