# React Router Security Upgrade

## Status

Completed and verified on August 17, 2026.

This maintenance step upgrades the application's declarative routing runtime
from React Router 6.30.0 to 7.18.2. It removes the three routing-related package
findings present in the dependency audit while preserving the existing routes,
redirects, transitions, visual presentation, and administrator boundary.

## Scope

The implementation changes only:

- `react-router-dom` in `package.json`
- the corresponding React Router dependency subtree in `package-lock.json`
- this maintenance record

No application source change was required. Existing imports from
`react-router-dom` remain in place because the version 7 package is the
documented compatibility re-export for version 6 applications.

## Dependency change

| Package | Before | After |
| --- | --- | --- |
| `react-router-dom` | 6.30.0 | 7.18.2 |
| `react-router` | 6.30.0 | 7.18.2 |
| `@remix-run/router` | 1.23.0 | Removed |

The manifest range changed from `^6.22.3` to `^7.18.2`. The lockfile adds only
the `cookie` and `set-cookie-parser` dependencies required by React Router 7,
removes `@remix-run/router`, and updates the two approved Router packages.

React 18.3.1, React DOM 18.3.1, Node 22, Supabase, Vite, PostCSS, Tailwind,
TypeScript, ESLint, Playwright, and all other direct dependencies remain
unchanged.

## Security result

The read-only npm audit changed as follows:

| Audit scope | Before | After |
| --- | ---: | ---: |
| Complete dependency tree | 23 findings | 20 findings |
| `npm audit --omit=dev` | 14 findings | 11 findings |

The following packages no longer appear in either audit result:

- `react-router-dom`
- `react-router`
- `@remix-run/router`

The remaining findings belong to the separately scoped Supabase-client and
build/tooling dependency groups. No `npm audit fix`, forced install, override,
or unrelated upgrade was used.

## Local verification

The implementation used Node `v22.22.0` and npm `10.9.4`.

| Check | Result |
| --- | --- |
| `npm ci` | Passed; 305 packages installed from the updated lockfile |
| `npm ls react-router-dom react-router @remix-run/router --all` | Passed; Router packages resolve to 7.18.2 and `@remix-run/router` is absent |
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
No new build warning or error was introduced. The Router chunk increased from
20.85 kB to 37.66 kB before gzip and from 7.69 kB to 13.65 kB after gzip. This
is the expected version 7 compatibility/runtime cost and does not alter route
behavior.

## Vercel preview verification

Vercel built commit `16e7db1ffb0782de429869633678969be9c8c94f` from branch
`codex/upgrade-react-router-security` and reported the preview as `Ready`.

Read-only browser verification established:

- the homepage rendered and its internal Writing link navigated correctly
- browser back and forward navigation returned between the homepage and Writing
- Projects rendered all eight records in the accepted order
- Writing rendered all ten records in the accepted order
- a representative Writing detail route rendered directly
- Work rendered all eight records in the accepted order
- a representative Work detail route rendered directly
- About rendered its existing YouTube iframe and copy
- Now rendered all four records in the accepted order
- Contact rendered its existing email link
- an unknown deep link returned the application shell and intentional empty
  catch-all route
- `/admin` redirected to `/admin/login` in the unauthenticated preview session
- the login page rendered without testing credentials
- the desktop homepage matched the current Vercel production deployment

No content write, credential test, authenticated mutation, Supabase operation,
deployment promotion, or production configuration change was performed.

The available browser surface does not expose viewport resizing. Responsive
screenshots were therefore not re-captured in this pass. No source, style,
Tailwind, font, asset, or layout file changed, and the committed tablet/mobile
parity baselines remain unchanged. Any future visual source change must run the
full responsive visual suite with the required local environment configured.

## Behavior and visual impact

No intentional behavior or visual change.

The public route map, administrator route map, SPA rewrite, direct-link
behavior, navigation, content, ordering, loading states, failure states,
animations, and presentation are unchanged.

## Data, authentication, and infrastructure impact

This step does not change:

- Supabase schema, migrations, RLS, grants, data, Storage, or Edge Functions
- Auth users, claims, credentials, sessions, providers, or configuration
- Vercel or Netlify configuration, environment values, domains, or production
  deployment source
- Node, npm, build commands, or output directories

## Rollback

Before merge, close the pull request or revert the branch commit.

After merge, revert the Router dependency commit through a new pull request.
The committed lockfile will restore React Router 6.30.0 and
`@remix-run/router` 1.23.0. Verify the restored Vercel deployment and public
routes. No database, Auth, content, or infrastructure rollback is required.

## Remaining dependency work

The next dependency-maintenance unit should address the Supabase client and its
`auth-js` and `ws` paths. It requires its own implementation brief, exact
version pin, provenance verification, Auth/session checks, public data checks,
and administrator-boundary verification.
