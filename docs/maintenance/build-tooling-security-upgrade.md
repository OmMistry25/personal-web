# Build and Lint Toolchain Security Upgrade

## Status

Implementation and local verification completed on August 17, 2026. Vercel
preview verification is the final publication gate for this maintenance step.

This maintenance step upgrades the smallest compatible build and lint
dependency set that removes all npm audit findings. Application source,
configuration, public behavior, content, Supabase access, and hosting settings
remain unchanged.

## Scope

The implementation changes only:

- the exact Vite version in `package.json`
- the corresponding build and lint dependency paths in `package-lock.json`
- this maintenance record

No file under `src/` changed. The Vite, ESLint, PostCSS, Tailwind, TypeScript,
Vercel, Netlify, and Supabase configuration files remain unchanged.

## Direct toolchain changes

| Package | Before | After |
| --- | --- | --- |
| Vite | 5.4.8 | 6.4.3 |
| `@vitejs/plugin-react` | 4.3.2 | 4.7.0 |
| ESLint | 9.12.0 | 9.39.5 |
| `@eslint/js` | 9.12.0 | 9.39.5 |
| TypeScript-ESLint | 8.8.1 | 8.67.0 |
| PostCSS | 8.4.47 | 8.5.26 |

Vite is exact-pinned to `6.4.3`. The other direct packages retain their existing
compatible manifest ranges and resolve to the listed versions through the
committed lockfile.

The implementation deliberately does not upgrade to Vite 7 or 8, ESLint 10,
Tailwind 4, TypeScript 7, React 19, or another unrelated major version.

## Important transitive changes

| Package | Before | After |
| --- | --- | --- |
| esbuild | 0.21.5 | 0.25.12 |
| Rollup | 4.24.0 | 4.62.4 |
| Babel core/helpers | 7.25.7 | 7.29.7 |
| `@eslint/plugin-kit` | 0.2.0 | 0.4.1 |
| ajv | 6.12.6 | 6.15.0 |
| `cross-spawn` | 7.0.3 | 7.0.6 |
| flatted | 3.3.1 | 3.4.4 |
| glob | 10.4.5 | 10.5.0 |
| `js-yaml` | 4.1.0 | 4.3.1 |
| nanoid | 3.3.7 | 3.3.18 |
| picomatch | 2.3.1 | 2.3.2 |
| yaml | 2.5.1 | 2.9.0 |

The lockfile also resolves patched minimatch and brace-expansion versions for
their separate major-version paths. The larger lockfile diff includes optional
platform packages published by esbuild and Rollup; it does not add an
application dependency.

## Security result

| Audit scope | Before | After |
| --- | ---: | ---: |
| Complete dependency tree | 17 findings | 0 findings |
| `npm audit --omit=dev` | 8 findings | 0 findings |

The removed findings covered Vite, esbuild, Rollup, PostCSS, Babel, ESLint,
YAML parsers, and several glob or process utilities. No `npm audit fix`, forced
install, legacy peer bypass, dependency override, prerelease package, Git
dependency, or unrelated major upgrade was used.

`npm audit signatures` passed for the clean installation:

- 304 installed packages have verified registry signatures
- 62 installed packages have verified provenance attestations

## Compatibility decisions

The first isolated resolution updated ESLint while retaining
TypeScript-ESLint 8.8.1. That combination caused the
`@typescript-eslint/no-unused-expressions` rule to fail during initialization.
Resolving TypeScript-ESLint 8.67.0 within the existing major restored
compatibility with ESLint 9.39.5. The real branch reproduces that corrected
resolution and passes lint without a rule or configuration change.

Vite 6 supports the repository's Node 22 runtime. This application does not use
the experimental Vite Runtime API, custom resolve conditions, Sass, library
mode, SSR, TypeScript PostCSS configuration, or the other migration-sensitive
features identified by the Vite 5-to-6 migration guide.

## Local verification

The implementation used Node `v22.22.0` and npm `10.9.4`.

| Check | Result |
| --- | --- |
| `npm ci` | Passed; 304 packages installed from the updated lockfile |
| `npm audit` | Passed; zero findings |
| `npm audit --omit=dev` | Passed; zero findings |
| `npm audit signatures` | Passed; all 304 packages have verified registry signatures |
| `npm run lint` | Passed with ESLint 9.39.5 |
| `npm exec tsc -- --noEmit` | Passed |
| `npm run build` | Passed with Vite 6.4.3 |
| loopback Vite development server | Started on `127.0.0.1` and returned the application shell |
| `npm run test:e2e:smoke` | Stopped at the intentional environment guard |
| `npm run test:e2e:failure` | Stopped at the intentional environment guard |
| `npm run test:e2e:visual` | Stopped at the intentional environment guard |

The local environment does not contain `VITE_SUPABASE_URL` or
`VITE_SUPABASE_ANON_KEY`. The end-to-end guard exited before browser startup;
no value was requested, read, displayed, or changed.

## Build-output comparison

| Asset group | Before gzip | After gzip |
| --- | ---: | ---: |
| Application | 10.20 kB | 10.23 kB |
| Router and React runtime | 59.07 kB across router and vendor chunks | 59.32 kB in the router chunk |
| Supabase | 31.20 kB | 31.48 kB |
| Motion | 38.14 kB | 38.17 kB |
| CSS | 5.83 kB | 5.82 kB |

Total compressed JavaScript increased by approximately 0.6 kB, below the
approved 10 percent stop threshold. Vite 6 and Rollup place React in the router
chunk. They also emit a zero-byte `vendor` artifact, but `dist/index.html` does
not reference it, so it creates no browser request. Every referenced generated
asset exists.

The build retains the existing Browserslist/caniuse-lite age notice. Clean
installation also reports that `glob@10.5.0` is deprecated because glob 11 is
current. The resolved glob version has no npm audit finding. Removing that
notice would require a broader Tailwind dependency change or an override and is
outside this step.

## Vercel preview verification

Pending branch publication. The preview must be `Ready` and pass the approved
public-data, routing, administrator-boundary, console, and responsive parity
checks before handoff.

## Behavior and visual impact

No intentional behavior or visual change.

The application source, public route map, administrator route map, Supabase
queries, deterministic ordering, loading and failure states, content,
animations, typography, layout, and responsive rules are unchanged.

## Data, authentication, and infrastructure impact

This step does not change:

- Supabase schema, migrations, RLS, grants, data, Storage, or Edge Functions
- Auth users, claims, credentials, sessions, providers, or configuration
- Vercel or Netlify configuration, environment values, domains, or production
  deployment source
- Node, npm, build command, publish directory, or SPA rewrite configuration

No content write, credential test, authenticated mutation, production
deployment promotion, or external configuration change was performed.

## Rollback

Before merge, close the pull request.

After merge, revert this maintenance step through a new pull request. The
committed manifest and lockfile restore Vite 5.4.8 and the previous build and
lint dependency tree. Verify the restored Vercel deployment, public routes, and
administrator login boundary. No database, Auth, content, or infrastructure
rollback is required.
