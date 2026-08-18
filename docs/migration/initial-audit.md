# Initial Repository Audit

## Status and evidence labels

This audit is a historical baseline completed before implementation began.

- **Repository-verified** means the finding was established from files committed at starting commit `e3d254ea3b2b1d440a31bb398f2e73180dbec60f`.
- **Production-verified** means the public behavior was observed at https://ommistry.netlify.app/ or in the supplied production screen recording.
- **Unverified live state** means the repository suggests a condition, but the corresponding Netlify or Supabase state was not inspected.

No Supabase, Netlify, authentication, production data, or production configuration was changed or tested during the audit.

## 1. Executive summary

**Repository-verified:** The application is a client-rendered React 18 and TypeScript single-page application built with Vite, React Router, Tailwind CSS, Framer Motion, and Supabase. Netlify is configured to build `dist` and provide an SPA fallback.

**Repository-verified:** Bolt is not a runtime dependency. Its repository footprint is limited to `.bolt` metadata and the README badge. The application code and build do not import Bolt.

**Repository-verified:** The CMS has CRUD interfaces for projects, writing, work, about, now, and contact. Writing has move controls; about, now, and contact expose numeric ordering. Projects and work rely on `created_at`. No publication or draft state exists. Home and site-level copy remain hardcoded.

**Production-verified:** The route structure, public layouts, content queries, transitions, current content, and current content order agree with the inspected repository implementation. The supplied recording establishes the desktop visual reference.

A rewrite is not necessary. The main risks are authorization, destructive or duplicated migration history, incomplete ordering, fragmented direct data access, weak failure reporting, and the absence of tests and operational documentation. Authentication, RLS, Edge Functions, storage, and Netlify configuration are frozen during the initial migration.

## 2. Architecture map

```text
Browser
  -> Netlify static hosting and SPA fallback
  -> src/main.tsx
     -> BrowserRouter
     -> AuthProvider
     -> src/App.tsx
        -> public page routes
           -> direct Supabase browser queries
        -> ProtectedRoute
           -> Dashboard and admin editors
              -> direct Supabase browser CRUD

Supabase
  -> Postgres application tables with RLS
  -> Auth sessions
  -> setup-admin Edge Function in repository
  -> public videos storage bucket in migration history
```

### Repository-verified architecture

- Entry point: `src/main.tsx`
- Top-level routes and page transition coordination: `src/App.tsx`
- Layout wrapper: `src/components/Layout.tsx`
- Authentication state: `src/contexts/AuthContext.tsx`
- Route guard: `src/components/ProtectedRoute.tsx`
- Public pages: `src/pages/`
- Admin pages: `src/pages/admin/`
- Supabase client: `src/lib/supabase.ts`
- Unused data helper module: `src/lib/database.ts`
- Empty, unused local data files: `src/data/`
- Global styling: `src/index.css`, `tailwind.config.js`, and Google-hosted Inter in `index.html`
- Public assets: favicon and Netlify redirect file under `public/`
- Build configuration: `vite.config.ts`, TypeScript configs, PostCSS, Tailwind, and ESLint
- Deployment configuration: `netlify.toml`

No custom hooks or general utility directory exists. `Navbar`, `Footer`, `PageTitle`, and `DraggableCard` exist but are not mounted by the application.

## 3. Route inventory

| Route | Component | Data source | Access |
| --- | --- | --- | --- |
| `/` | `Home` | Hardcoded JSX | Public |
| `/about` | `About` | `about_items`, `about_video` | Public |
| `/projects` | `Projects` | `projects` | Public |
| `/writing` | `Writing` | `notes` | Public |
| `/writing/:slug` | `Note` | `notes`, selected by slug | Public |
| `/work` | `Work` | `work_experience` | Public |
| `/work/:id` | `WorkDetail` | `work_experience`, selected by UUID | Public |
| `/now` | `Now` | `now_items` | Public |
| `/contact` | `Contact` | `contact_methods` | Public |
| `/admin/login` | `Login` | Supabase Auth and repository Edge Function URL | Public |
| `/admin` | Redirect | Redirects to `/admin/dashboard` | Redirect precedes guard |
| `/admin/dashboard` | `Dashboard` | Hardcoded overview | Authenticated session |
| `/admin/projects` | `ProjectsAdmin` | `projects` | Authenticated session |
| `/admin/writing` | `WritingAdmin` | `notes` | Authenticated session |
| `/admin/work` | `WorkAdmin` | `work_experience` | Authenticated session |
| `/admin/about` | `AboutAdmin` | `about_items`, `about_video` | Authenticated session |
| `/admin/now` | `NowAdmin` | `now_items` | Authenticated session |
| `/admin/contact` | `ContactAdmin` | `contact_methods` | Authenticated session |

There is no public or nested admin catch-all page.

## 4. Content source map

| Public content | Origin | CMS controlled | Ordering |
| --- | --- | --- | --- |
| Document title and favicon | `index.html`, `public/favicon.svg` | No | Not applicable |
| Home tagline, links, labels | `Home.tsx` | No | Fixed JSX order |
| About text | `about_items` | Yes | `sort_order ASC` |
| About YouTube video | `about_video.video_id` | Yes | First row from unordered `LIMIT 1` |
| Project titles and URLs | `projects` | Yes | `created_at DESC` |
| Writing list and details | `notes` | Yes | `sort_order ASC`; detail by slug |
| Work list and details | `work_experience` | Yes | `created_at DESC`; detail by UUID |
| Now activities | `now_items` | Yes | `sort_order ASC` |
| Contact methods | `contact_methods` | Yes | `sort_order ASC` |
| Loading and error copy | Page components | No | Not applicable |

Several project, writing, and work fields are managed but are not displayed in their public list views. The home page and site-level copy are not currently CMS controlled. This is not a migration defect requiring immediate expansion of CMS scope.

## 5. Effective migration-derived Supabase schema

This section is **repository-verified** and **unverified live state**. It describes the result implied by applying repository migrations chronologically, not the confirmed production schema.

| Table | Columns and principal constraints | Ordering/publication |
| --- | --- | --- |
| `projects` | UUID PK; title, description, URL, year required; text arrays; featured boolean; timestamps | No explicit order; no publication state |
| `notes` | UUID PK; unique slug; date stored as text; reading time; excerpt, tags, content; timestamps; `sort_order` | Explicit order; no publication state |
| `work_experience` | UUID PK; company, role, period, description; achievements and technologies arrays; timestamps | No explicit order; no publication state |
| `about_items` | UUID PK; title; `sort_order`; timestamps | Explicit order; no publication state |
| `now_items` | UUID PK; activity; `sort_order`; timestamps | Explicit order; no publication state |
| `contact_methods` | UUID PK; label, value, constrained type; `sort_order`; timestamps | Explicit order; no publication state |
| `about_video` | UUID PK; `video_id`; timestamps | No single-row constraint or deterministic selection |

No relationships exist among application tables. The only non-primary uniqueness requirement is `notes.slug`. There is no trigger to update `updated_at`.

Repository migrations enable RLS and public reads on all application tables. Their final repository-derived policies allow every authenticated Supabase user to mutate all application tables. This is not proof of live policy state.

Migration history also describes a public `videos` bucket with video MIME restrictions and authenticated uploads. The frontend does not use this bucket. Existing storage must be treated as potentially in use.

The history contains duplicate storage migrations and two later migrations that drop and recreate `about_video`. Applied migrations must not be rewritten. Live migration and schema state must be verified before future database work.

## 6. CMS capability matrix

| Content | Create | Edit | Delete | Order | Publish | Public DB driven |
| --- | --- | --- | --- | --- | --- | --- |
| Projects | Yes | Yes | Yes | No; `created_at` only | No | Yes |
| Writing | Yes | Yes | Yes | Move controls | No | Yes |
| Work | Yes | Yes | Yes | No; `created_at` only | No | Yes |
| About items | Yes | Yes | Yes | Numeric field | No | Yes |
| About video | Replace | Replace | Implicit replacement | No | No | Yes |
| Now | Yes | Yes | Yes | Numeric field | No | Yes |
| Contact | Yes | Yes | Yes | Numeric field | No | Yes |

Projects and work do not support deliberate ordering. Explicit-order tables allow duplicate values and do not define tie-breakers. Writing swaps order using two independent updates. About video replacement deletes all existing rows before insertion. Most failed operations are logged only to the console. Draft and publication controls are not part of the current migration requirement.

## 7. Bolt dependency inventory

| Classification | Artifact | Finding |
| --- | --- | --- |
| Runtime required | None | Application and build code do not depend on Bolt |
| Development only | `.bolt/config.json` | Original template identifier |
| Development only | `.bolt/prompt` | Bolt generation guidance |
| Development only | README Bolt badge | Link to original Bolt workspace |
| Unverified | External Bolt project | May contain state not represented in Git |
| Removal candidate | `.bolt/` and badge | Do not remove without explicit approval and parity verification |

## 8. Code-quality findings

### Critical

**Observed, repository-verified:** The `setup-admin` Edge Function can create `admin@example.com` with a fixed password, and the public login page displays those defaults and offers a setup button.

**Production-verified:** The public production login UI displays the setup control and fixed defaults. The Edge Function was not invoked, so its deployment and behavior remain unverified.

**Impact:** If deployed and no Auth user exists, an unauthenticated visitor could know the bootstrap credentials.

**Recommendation:** Authentication is frozen. Verify live state only under separate authorization before changing Auth or the function.

### High

**Observed:** Repository-derived RLS grants all authenticated users write access. **Impact:** Any authenticated account could modify CMS data if live policies match. **Recommendation:** Defer until separately authorized live policy inspection.

**Observed:** Migration history duplicates storage setup and destructively recreates `about_video`. **Impact:** Replays may diverge or lose data. **Recommendation:** Verify the live ledger and use forward migrations only.

### Medium

- Direct Supabase access is repeated across public and admin components while the helper module is unused and stale.
- Ordering is incomplete or nondeterministic for projects, work, duplicate explicit-order values, and `about_video`.
- Public read failures usually become empty content after a console error.
- Most admin write failures lack visible feedback.
- Handwritten frontend types omit generated fields and do not derive from the database schema.
- There are no automated tests or visual-parity checks.

### Low

- Several components, data files, and `src/lib/database.ts` appear unused.
- `@use-gesture/react` appears unused.
- `AuthProvider` and `ProtectedRoute` duplicate session tracking.
- Some form labels and parsing behavior disagree.

These are findings, not authorization to clean up or refactor them.

## 9. Build and tooling findings at audit time

- Scripts existed for development, lint, build, and preview.
- No type-check script existed.
- No test script or test files existed.
- `node_modules` was absent.
- Under the audit's read-only constraint, dependencies were not installed.
- `npm run lint` could not start because `eslint` was unavailable.
- `npm run build` could not start because `vite` was unavailable.
- Netlify configuration selected Node 18, `npm run build`, and `dist`.
- Required browser variable names were `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- No `.env.example` or environment documentation existed.

Migration Step 1 records the first lockfile-driven install and verification results separately in `baseline-verification.md`.

## 10. Visual-parity-sensitive areas

- `src/index.css`
- `tailwind.config.js`
- `index.html` font loading
- `src/pages/Home.tsx`
- all public list pages and their embedded responsive classes
- `Note.tsx` and `WorkDetail.tsx`
- `PageTransition.tsx`
- route keys and `AnimatePresence` in `App.tsx`
- repeated fixed home and back controls
- Supabase query ordering
- loading behavior

**Production-verified:** At the inspected desktop viewport, production used a centered 42rem container, 48px light home heading, 72px light home navigation, pale inactive labels that darken on hover, full-viewport compositions, centered content rows, transitions, and circular home/back controls. The recording was 2874 by 1550 pixels at 60 fps and 44.35 seconds.

## 11. Migration gaps

1. Governance was not versioned before Migration Step 1.
2. README documentation was Bolt-only.
3. Local setup and operational procedures were undocumented.
4. A clean install and build baseline had not been established.
5. No type-check script exists.
6. No tests or parity baselines exist.
7. The deployed Git commit and deployment source are unverified.
8. Live Supabase schema and migration state are unverified.
9. Migration history contains duplicated and destructive operations.
10. Data access is fragmented.
11. Ordering is incomplete or nondeterministic.
12. CMS failure handling is incomplete.
13. Site-level content is not CMS managed, but expanding it is deferred.
14. Unused and Bolt artifacts require approval before removal.
15. Administrator authorization is not distinct from authentication in repository-derived policy behavior.

## 12. Recommended conservative migration sequence

1. Version governance, the audit, production reference, and reproducible verification baseline.
2. Capture and automate production-parity references without changing behavior.
3. Inspect live Supabase schema and migration state read-only before database work.
4. Introduce typed, behavior-preserving data boundaries after parity protection exists.
5. Standardize failure handling without changing successful public states.
6. Add deterministic ordering through forward migrations only after live order and data inspection.
7. Consider additional CMS scope only as separately approved work.
8. Remove confirmed dead or Bolt-only artifacts only after explicit approval and parity verification.
9. Prove independent preview deployment before altering production deployment.

Authentication, authentication-related RLS, Edge Functions, storage, and Netlify configuration remain frozen unless separately authorized.

## 13. Live-state questions and operating constraints

### Production-verified

- Production reference: https://ommistry.netlify.app/
- Production is the visual, behavioral, content, and ordering source of truth.
- Public routes, content, representative writing/work details, SPA direct navigation, and desktop visual behavior were observed.
- The production admin login UI exposes the setup button and fixed default credentials.

### Unverified live state

- Whether GitHub `main` is the deployed commit
- Whether Netlify connects through GitHub, Bolt, or manual configuration
- npm version used in production
- Local and Netlify environment variable presence
- Applied Supabase migration ledger
- Exact live Supabase schema and RLS policies
- Deployment and behavior of `setup-admin`
- Bootstrap account existence or changed credentials
- Additional Auth users and external signup settings
- Historical or external use of the `videos` bucket
- `about_video` production row count
- Duplicate `sort_order` values
- Netlify dashboard redirects, variables, plugins, domains, and headers

### Binding operating constraints

- Do not block repository work on live-state questions unrelated to the current change.
- Verify the corresponding live system before modifying it.
- Preserve production order exactly for projects and work.
- Do not invent behavior for `featured`.
- Do not delete apparent artifacts without approval.
- Do not add publication controls or broaden CMS scope during the initial migration.
- Do not change authentication, users, RLS, Edge Functions, storage, or Netlify configuration.
- Do not display or modify secret values.
