# Production Parity Testing

## Purpose

This test baseline detects accidental route, structure, and visual changes while the application moves away from Bolt. Production at https://ommistry.netlify.app/ remains the visual and behavioral source of truth.

The workflow separates one-time production capture from normal local tests:

```text
Production reference capture
        -> explicit manual command only
        -> committed reference screenshots

Local application
        -> normal smoke and visual tests
        -> comparison against committed references
```

Normal test commands never access production.

## Representative dynamic routes

The baseline pins exactly two current records:

- Writing: `/writing/be-delusional`
- Work: `/work/4524a5f3-5dcb-4103-9163-0c840875d98a`

They were selected because both were present on production during the initial audit, render their respective detail-page structures, and provide stable deterministic paths without duplicating substantial CMS content in the test suite. If either record is intentionally removed or renamed in the CMS, update the baseline deliberately rather than dynamically selecting another record.

## Coverage

Smoke and visual tests cover:

- `/`
- `/about`
- `/projects`
- `/writing`
- the pinned writing detail route
- `/work`
- the pinned work detail route
- `/now`
- `/contact`
- `/admin/login`

Routing smoke tests also record:

- `/admin` redirects an unauthenticated browser to `/admin/login`
- `/admin/dashboard` redirects an unauthenticated browser to `/admin/login`
- an unknown route preserves the current behavior of an attached, empty, non-visible `<main>` element at the requested URL

The unknown-route assertion is a parity record, not an endorsement or a request to add a 404 page.

## Viewports and rendering controls

Both production capture and local comparison use Playwright Chromium with device scale factor 1:

| Project | Viewport |
| --- | --- |
| Mobile | 390 x 844 |
| Tablet | 768 x 1024 |
| Desktop | 1440 x 900 |

Tests wait for route-specific structure, `document.fonts.ready`, and 1.8 seconds for application-controlled entry transitions to settle. Application animations are not globally disabled. Screenshots use the full rendered page, hide only the text caret, and allow a maximum differing-pixel ratio of 0.001 to accommodate minimal browser rasterization variance without concealing layout drift.

### About video exception

The About page's external YouTube iframe pixels are masked in both production capture and local comparison because YouTube can change them independently. Only the iframe's rendered pixels are masked. Its dimensions, position, container, surrounding spacing, and all application-controlled layout remain part of the comparison.

## Commands

Install the pinned Chromium browser after `npm ci`:

```bash
npx playwright install chromium
```

Run local smoke and visual tests together:

```bash
npm run test:e2e
```

Run only local structural smoke tests:

```bash
npm run test:e2e:smoke
```

Run only local visual comparisons:

```bash
npm run test:e2e:visual
```

These local commands require `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. If either is absent, the command stops before launching the application and reports names only. Tests do not hardcode credentials, replace Supabase with fixtures, or modify application data access.

## Explicit production capture

The production capture command performs read-only GET navigation and screenshots. It does not log in, submit forms, invoke setup-admin intentionally, mutate CMS data, upload files, or call write endpoints intentionally.

Initial capture, when no references exist:

```bash
npm run test:e2e:capture-production
```

Existing references are immutable by default. The command fails rather than overwriting them. An intentional future update requires both the explicit production command and an explicit update flag:

```bash
UPDATE_PRODUCTION_REFERENCES=1 npm run test:e2e:capture-production
```

Never run production capture implicitly, in normal parity commands, in CI, or on a recurring schedule.

## Artifacts

Committed artifacts:

- `tests/e2e/references/<viewport>/*.png`

Ignored generated artifacts:

- `playwright-report/`
- `blob-report/`
- `test-results/`
- local Playwright browser caches
- temporary screenshots and comparison output

Visual failures report differences and retain generated diagnostic output under ignored paths. They never regenerate committed production references.

## Current limitations

- CMS-backed local pages cannot be verified unless the two Vite environment variables are available.
- The committed references protect the content present at capture time. Intentional CMS changes require deliberate baseline review.
- The external video pixels are excluded, but its application-controlled layout remains protected.
- Browser and font rasterization can differ across operating systems. The baseline initially uses the smallest configured tolerance and should be weakened only with documented evidence.
- These tests do not authenticate, exercise admin mutations, inspect Supabase live state, or verify Netlify dashboard configuration.

## Step 2 baseline results

Recorded on 2026-08-14 from starting commit `93bdf43a152bb87c8828b4a5b5f5b4b8b508a55e` on branch `test/production-parity-baseline`:

- Playwright `1.61.1` is pinned as a development dependency because it supports the repository's frozen Node 18 deployment runtime. The initially resolved latest release required Node 20 and was not retained.
- Chromium-only production capture passed for all 10 selected routes at all three viewports: 30 screenshots and 30 passing capture tests.
- Production admin-root redirect, protected-route redirect, and unknown-route observations passed at all three viewports: 9 passing observations.
- No uncaught page errors or `console.error` messages were observed during the 30 production screenshot captures.
- The production reference set contains 30 PNG files totaling 1,397,845 bytes, approximately 1.4 MB.
- The reference-overwrite guard was verified: capture without `UPDATE_PRODUCTION_REFERENCES=1` refused to replace an existing image.
- Local `test:e2e`, `test:e2e:smoke`, and `test:e2e:visual` execution stopped before browser or application startup because `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` were unavailable.
- Because local Supabase-backed rendering was blocked, no production-versus-local pixel result is claimed.
- The production build passed with the existing outdated Browserslist data warning.
- Lint retained the pre-Step-2 baseline of 8 errors and 1 warning in existing application and Supabase files. The added Step 2 tooling and tests introduced no lint findings.
- Production capture emitted a runner-level warning that `NO_COLOR` was ignored because `FORCE_COLOR` was set. This was not an application console error.
- Unknown routes were production-verified to retain the requested URL and render one attached, empty, non-visible `<main>` element.
