# Repository History Recovery

## Status

Recovery and Vercel preview verification completed on August 18, 2026.
Production and the GitHub `main` branch remain unchanged until the recovery
pull request is reviewed and merged.

## Incident summary

The GitHub `main` branch was unexpectedly replaced after pull request 21 was
closed. The replacement history did not share an ancestor with the surviving
migration history, so GitHub could not reopen the pull request.

The last verified pre-incident `main` commit was:

- `63a6393909bf972a65e79691dacc76330bcd6c86`

The unexpected replacement root was:

- `2122beaca676b42bdc3b08336166813d030a61ca`

The verified migration and build-tooling state survived at:

- `32d1aa9ce4e75333480eedfc953268117cae067b`

## Observed timeline

GitHub recorded the following activity on August 18, 2026 between 04:18:38 and
04:18:56 UTC:

1. an `init` commit added `.keep` on top of the verified history
2. a force-push replaced that history with a new `init` root
3. a GitHub `web-flow` commit named `Start repository` added the earlier Bolt
   snapshot
4. a second force-push replaced it with the final unexpected root

GitHub attributed the pushes to the repository owner's account. No GitHub
Actions workflow ran during the incident. Public repository metadata does not
identify which credential, OAuth application, GitHub App, or local process
initiated the pushes. The included `.bolt` metadata is consistent with a
repository-initialization or synchronization flow, but it does not prove the
responsible integration.

## Containment

The unexpected root was preserved before recovery at:

- `codex/backup-unexpected-main-20260818`

The original pull request 21 branch also remains available at:

- `codex/upgrade-build-tooling-security`

Account security logs, installed GitHub Apps, authorized OAuth applications,
and personal access tokens should be reviewed separately. This recovery does
not revoke or modify account credentials or external integrations.

## Recovery method

The recovery avoids a force-push and does not rewrite either surviving history.

The branch `codex/recover-main-and-tooling` starts from the unexpected `main`
root and connects it to the verified pull request 21 history using a merge
commit. Before that merge was committed, the staged tree hash was compared with
the verified tree at `32d1aa9`.

Both tree hashes were exactly:

- `4446b2170ca24859e2ca35420c96a5bd435ab0bb`

This proves the recovery commit restores the exact previously verified file
state rather than reconstructing the migration changes manually. This incident
record is the only tracked addition after that equality check.

## Verification

The recovered state used Node `v22.22.0` and npm `10.9.4`.

| Check | Result |
| --- | --- |
| recovered tree versus `32d1aa9` | Exact tree-hash match |
| `npm ci` | Passed; 304 packages installed from the lockfile |
| `npm audit` | Passed; zero findings |
| `npm audit --omit=dev` | Passed; zero findings |
| `npm audit signatures` | Passed; 304 signatures and 62 attestations verified |
| `npm run lint` | Passed |
| `npm exec tsc -- --noEmit` | Passed |
| `npm run build` | Passed with Vite 6.4.3 |

The clean installation retains the documented `glob@10.5.0` deprecation
notice. The production build retains the documented Browserslist age notice
and zero-byte unreferenced vendor artifact. Neither warning is a new recovery
finding.

## Vercel preview verification

Vercel deployment `D2XoaFcdmAvPybySXebH4QF8Cta9` for recovery commit
`aa18401` reached `Ready` at:

- `https://personal-web-git-codex-recover-main-e8699a-ommistry25s-projects.vercel.app`

The preview passed the publication gate:

- the home page and all six public sections loaded with production content,
  links, and deterministic ordering
- Projects presented all eight production entries in the same order after its
  Supabase request completed
- Writing presented all ten production entries in the same order
- Work presented all eight production entries in the same order
- representative Writing and Work detail routes matched production
- the About heading and single YouTube embed URL matched production
- Contact retained the production email link
- a direct unknown-route request returned the application shell, confirming the
  SPA fallback
- `/admin` redirected to `/admin/login` and exposed only empty email and
  password inputs plus the sign-in control; no credential or authenticated
  operation was exercised
- no browser console error was recorded; the deliberate unknown-route check
  produced the expected React Router no-match warning
- home and representative Writing-detail geometry, document dimensions, and
  typography matched production exactly at `390x844`, `768x1024`, and
  `1280x800`

The Vercel toolbar appeared only on the preview and was excluded from the
application comparison.

## Impact

The recovery does not modify Supabase data, schema, RLS, Auth, Storage, or Edge
Functions. It does not modify Vercel or Netlify settings, environment values,
domains, or deployment configuration outside the already reviewed repository
state.

No intentional public behavior, content, routing, administrator behavior,
visual design, or responsive behavior changes are introduced. Vercel preview
parity remains a publication gate before handoff.

## Rollback

Before merge, close the recovery pull request. The GitHub `main` branch remains
at the preserved unexpected root.

After merge, revert the recovery merge through a new pull request. The backup
branch preserves the pre-recovery root for comparison. No database, Auth,
content, or infrastructure rollback is required.
