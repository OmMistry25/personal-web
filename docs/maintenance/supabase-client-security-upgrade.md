# Supabase Client Security Upgrade

## Status

Completed and verified on August 17, 2026.

This maintenance step upgrades the browser Supabase client from 2.49.4 to
2.50.0. It removes the identified `@supabase/auth-js`, `@supabase/supabase-js`,
and `ws` audit findings while preserving the existing public data boundary,
authentication flow, administrator authorization, and content-management
operations.

## Scope

The implementation changes only:

- the exact `@supabase/supabase-js` version in `package.json`
- the corresponding Supabase dependency subtree in `package-lock.json`
- this maintenance record

No application source change was required. The existing `createClient`, public
PostgREST queries, session restoration, user verification, password sign-in,
auth-state subscription, sign-out, and admin CRUD call sites compile without a
compatibility change.

## Dependency change

| Package | Before | After |
| --- | --- | --- |
| `@supabase/supabase-js` | 2.49.4 | 2.50.0 |
| `@supabase/auth-js` | 2.69.1 | 2.70.0 |
| `@supabase/realtime-js` | 2.11.2 | 2.11.10 |
| `@types/phoenix` | 1.6.6 | 1.6.7 |
| `ws` | 8.18.1 | 8.21.3 |

The top-level Supabase dependency is exact-pinned to `2.50.0`. The lockfile
changes only the approved Supabase dependency path and its Phoenix and WebSocket
support packages. Supabase functions, node-fetch, PostgREST, and storage package
versions remain unchanged. No unrelated top-level dependency changed.

The application does not create Supabase Realtime channels or subscribe to
Realtime database changes. `@supabase/realtime-js` and `ws` remain transitive
dependencies of the browser client.

## Package integrity and security result

`npm audit signatures` passed for the clean installation:

- 305 installed packages have verified registry signatures
- 21 installed packages have verified provenance attestations
- the resolved packages point to the npm registry and their expected upstream
  repositories
- the changed package metadata contains no install, preinstall, or postinstall
  lifecycle script

The read-only npm audit changed as follows:

| Audit scope | Before | After |
| --- | ---: | ---: |
| Complete dependency tree | 20 findings | 17 findings |
| `npm audit --omit=dev` | 11 findings | 8 findings |

The following packages no longer appear in either audit result:

- `@supabase/auth-js`
- `@supabase/supabase-js`
- `ws`

The remaining findings belong to separately scoped build and tooling dependency
paths. No `npm audit fix`, forced install, override, prerelease package, Git
dependency, or unrelated upgrade was used.

## Local verification

The implementation used Node `v22.22.0` and npm `10.9.4`.

| Check | Result |
| --- | --- |
| `npm ci` | Passed; 305 packages installed from the updated lockfile |
| `npm audit signatures` | Passed; all 305 packages have verified registry signatures |
| `npm ls @supabase/supabase-js @supabase/auth-js @supabase/realtime-js ws --all` | Passed; resolved versions match the approved dependency tree |
| `npm run lint` | Passed |
| `npm exec tsc -- --noEmit` | Passed |
| `npm run build` | Passed with Vite 5.4.8 |
| `npm run test:e2e:smoke` | Stopped at the intentional environment guard |
| `npm run test:e2e:failure` | Stopped at the intentional environment guard |
| `npm run test:e2e:visual` | Stopped at the intentional environment guard |

The local environment does not contain `VITE_SUPABASE_URL` or
`VITE_SUPABASE_ANON_KEY`. The end-to-end guard exited before browser startup;
no value was requested, read, displayed, or changed.

The production build emitted the existing Browserslist/caniuse-lite age notice.
No new build warning or error was introduced. The Supabase chunk is 114.44 kB
before gzip and 31.20 kB after gzip in this build.

## Vercel preview verification

Vercel built commit `994962ad0a175f468551755f44725e4efd6ba7fc` from branch
`codex/upgrade-supabase-client-security` and reported the preview as `Ready`.

Read-only browser verification established:

- the homepage rendered the accepted copy and navigation
- Projects rendered all eight records in the accepted order
- Writing rendered all ten records in the accepted order
- a representative Writing detail route rendered directly
- Work rendered all eight records in the accepted order
- a representative Work detail route rendered directly
- About rendered its existing YouTube iframe and copy
- Now rendered all four records in the accepted order
- Contact rendered its existing email link
- `/admin` redirected to `/admin/login` in the unauthenticated preview session
- the login page rendered without testing credentials
- no browser console error was observed during the checked routes
- at a fixed 1280 by 800 viewport, the homepage content and layout matched the
  current Vercel production deployment; the preview-only Vercel toolbar overlay
  was excluded from the application comparison

Authenticated preview verification may require the repository owner to sign in
manually because credentials and browser session tokens are intentionally not
read, requested, transferred between domains, or stored by this maintenance
step. No admin content write is required or authorized.

No credential test, authenticated mutation, Supabase operation, deployment
promotion, or production configuration change was performed.

## Behavior and visual impact

No intentional behavior or visual change.

The public data queries, deterministic ordering, route map, loading and failure
states, administrator boundary, login flow, session handling, CMS operations,
animations, and presentation are unchanged.

## Data, authentication, and infrastructure impact

This step does not change:

- Supabase schema, migrations, RLS, grants, data, Storage, or Edge Functions
- Auth users, claims, credentials, sessions, providers, or configuration
- Vercel or Netlify configuration, environment values, domains, or production
  deployment source
- Node, npm, build commands, or output directories

No Supabase API mutation, admin content write, credential test, deployment
promotion, or production configuration change was performed.

## Rollback

Before merge, close the pull request.

After merge, revert this maintenance step through a new pull request. The
committed manifest and lockfile will restore Supabase 2.49.4, auth-js 2.69.1,
Realtime 2.11.2, and ws 8.18.1. Verify the restored Vercel deployment, public
data, and administrator login boundary. No database, Auth, content, or
infrastructure rollback is required.

## Remaining dependency work

The remaining audit findings belong to build and development tooling. They must
be evaluated as a separate dependency-maintenance unit with its own approved
implementation brief and compatibility verification.
