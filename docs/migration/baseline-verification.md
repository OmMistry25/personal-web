# Migration Baseline Verification

## Baseline identity

| Field | Value |
| --- | --- |
| Date | 2026-08-14 |
| Starting commit | `e3d254ea3b2b1d440a31bb398f2e73180dbec60f` |
| Migration branch | `chore/codex-migration-baseline` |
| Node version | `v22.22.0` |
| npm version | `10.9.4` |
| Repository-configured Netlify Node version | `18` |

The local verification runtime differs from the Node 18 runtime selected in `netlify.toml`. Runtime versions were not changed during this step.

## Installation

Command:

```text
npm ci
```

Final exit status: `0`

Result:

- 302 packages installed from the existing lockfile.
- 303 packages audited.
- 65 packages reported funding metadata.
- npm reported 23 vulnerabilities: 4 low, 4 moderate, and 15 high.
- No audit fix or dependency update was run.
- `package.json` and `package-lock.json` were not intentionally changed.

The first sandboxed execution exited `1` after waiting without output. npm reported `Exit handler never called!` and could not write logs under the user npm directory. The same command succeeded when granted the filesystem and registry access required by npm. This was an execution-environment limitation, not a lockfile change.

## Lint

Command:

```text
npm run lint
```

Exit status: `1`

Result: 9 existing findings, consisting of 8 errors and 1 warning.

| File | Finding |
| --- | --- |
| `src/components/DraggableCard.tsx` | Unused `useMotionValue` import |
| `src/contexts/AuthContext.tsx` | Fast Refresh warning for non-component export |
| `src/pages/admin/AboutAdmin.tsx` | Two explicit `any` errors |
| `src/pages/admin/Login.tsx` | Unused `data` and one explicit `any` error |
| `src/pages/admin/ProjectsAdmin.tsx` | Unused `PlusCircle` import |
| `src/pages/admin/WritingAdmin.tsx` | One explicit `any` error |
| `supabase/functions/setup-admin/index.ts` | Unused `data` variable |

No lint finding was fixed during this baseline step.

## Production build

Command:

```text
npm run build
```

Exit status: `0`

Result:

- Vite `5.4.8` completed the production build.
- 1,928 modules were transformed.
- Output was written to the ignored `dist/` directory.
- The build warned that `caniuse-lite` is outdated and suggested updating the Browserslist database.
- No suggested update was run.

Emitted assets:

| Asset | Size | Gzip |
| --- | ---: | ---: |
| `dist/index.html` | 1.05 kB | 0.49 kB |
| `dist/assets/index-tK-tW54P.css` | 35.54 kB | 6.20 kB |
| `dist/assets/browser-DDgNITT5.js` | 0.30 kB | 0.24 kB |
| `dist/assets/router-BCLxrHZ6.js` | 20.85 kB | 7.69 kB |
| `dist/assets/index-D5NZcW8Y.js` | 60.64 kB | 9.64 kB |
| `dist/assets/supabase-cqpCAp1W.js` | 108.82 kB | 29.72 kB |
| `dist/assets/motion-DE3iwGrg.js` | 115.30 kB | 38.14 kB |
| `dist/assets/vendor-BPcwhftq.js` | 141.85 kB | 45.56 kB |

The emitted CSS asset filename matches the CSS asset observed on the production site during the audit. This is useful parity evidence but does not prove that the deployed JavaScript came from the starting Git commit.

## Type checking

No type-check script exists in `package.json`. No standalone type-check command was added or run during this task.

## Environment and Supabase

Required browser environment variable names:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Both variables were unavailable in the local command process. No root `.env*` file was present.

No values were printed, created, or modified. No fake credentials were introduced.

Local Supabase connectivity was not tested. Static linting and production build validation did not require live Supabase connectivity.

The repository Edge Function also expects Supabase-managed server variables named `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Their values and live availability were not inspected.

## Known baseline failures

- `npm run lint` exits `1` with 8 errors and 1 warning.
- No type-check script exists.
- Local Supabase-backed runtime behavior cannot be verified without the two Vite variables.
- The current local Node version is 22 while Netlify configuration selects Node 18.

## Known baseline warnings

- npm audit reports 23 vulnerabilities: 4 low, 4 moderate, and 15 high.
- Browserslist reports an outdated `caniuse-lite` dataset during build.
- ESLint reports one React Fast Refresh warning.

## Verification limitations

- Live Supabase schema, migrations, policies, data, authentication, Edge Functions, and storage were not inspected.
- Netlify dashboard configuration and deployed commit were not inspected.
- No local authenticated or CMS workflow was exercised.
- No automated test suite exists.
- No type-check script exists.
- The local verification did not run under the repository-configured Node 18 runtime.
