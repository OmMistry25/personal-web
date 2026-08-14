# Vercel Deployment Migration

## Status

Completed and verified on August 14, 2026.

The production deployment is available at <https://personal-web-eta-eight.vercel.app/>. It was built from GitHub `main` commit `3958bc3aafdd22e553518e94a6c0b98479c10381` and reached Vercel's `READY` state.

This migration replaces the disconnected Bolt-to-Netlify publishing path with Git-based Vercel deployments. It does not remove, disable, or modify the existing Netlify project.

## Current Production State

The existing `ommistry.netlify.app` project is not connected to GitHub. Netlify identifies its source as Bolt, reports no linked repository or production branch, and still serves a production deploy published on June 22, 2025.

The current GitHub `main` branch does not deploy to Netlify. Netlify remains available as a rollback and historical comparison reference.

The Vercel project `personal-web` is connected to `OmMistry25/personal-web`, uses `main` as its production branch, and creates production deployments from merged commits.

## Repository Configuration

The root `vercel.json` declares:

- Vite as the framework
- `npm run build` as the build command
- `dist` as the output directory
- a catch-all rewrite to `/index.html` for React Router deep links
- the existing site-wide security headers
- the existing `/static/*` immutable-cache rule

The existing `netlify.toml` remains unchanged for historical reference and rollback. No dependency, lockfile, application, content, Supabase, or authentication change is included.

## Required Vercel Project Settings

The Vercel project was verified with:

| Setting | Required value |
| --- | --- |
| Git repository | `OmMistry25/personal-web` |
| Production branch | `main` |
| Root directory | Repository root |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js version | `22.x` |

The repository and production deployment build successfully with Node 22.

## Environment Preconditions

The following variable names are configured as encrypted values in both Preview and Production:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Their values were not read during deployment verification. They must not be written to Git, copied into documentation, displayed in review output, or transferred through chat. Deployment must stop if either name is absent from a future project or environment.

## Expected Behavior

Vercel creates preview deployments for non-production branches and production deployments from `main`. The generated Vercel URL is separate from `ommistry.netlify.app`.

The deployed application should reproduce the existing public appearance and content order while including all code merged through Migration Step 6. No visual, content, route, Supabase, or authentication behavior change is intended.

## Deployment Verification

The accepted production deployment passed the following checks:

| Check | Result |
| --- | --- |
| Git source | `OmMistry25/personal-web`, branch `main`, commit `3958bc3aafdd22e553518e94a6c0b98479c10381` |
| Build settings | Node 22, Vite, `npm run build`, `dist` |
| Required environment names | Present and encrypted for Preview and Production; values not read |
| Public routes | Root and all public collection routes rendered successfully |
| Direct SPA navigation | Representative Writing and Work detail URLs returned HTML and rendered their records |
| Public parity | Projects, Writing, Work, About, Now, and Contact matched Netlify content and order |
| About video | Existing singleton rendered successfully |
| Admin boundary | `/admin` redirected to `/admin/login`; credentials were not tested |
| Step 6 behavior | Deployment source commit contains the deterministic queries and live ordering matched the baseline |
| Browser health | No browser console warnings or errors were observed during route verification |
| Security headers | `X-Frame-Options`, `X-XSS-Protection`, `X-Content-Type-Options`, and `Referrer-Policy` matched the configured values |
| Visual parity | Homepage matched Netlify at a normalized 1280-pixel desktop viewport |

The legacy immutable-cache rule targets `/static/*`, while Vite emits fingerprinted files under `/assets/*`. Both the accepted Vercel deployment and the Netlify baseline serve those `/assets/*` files with revalidation, so this is not a migration regression. Changing the cache policy is separate performance work.

## Security and Data Impact

This migration grants Vercel access to build the GitHub repository and uses the two existing public-client Supabase variables. It does not change Supabase Auth, users, RLS, grants, storage, Edge Functions, schema, or data.

The repository contains no Vercel token, Supabase value, project credential, or generated environment file.

## Rollback

The existing Netlify deployment remains enabled and unchanged. If a future Vercel production build or parity verification fails, keep the last verified Vercel deployment or Netlify reference available while the failure is investigated.

Vercel deployment history can restore a prior immutable deployment. Deleting or disabling the Netlify project requires separate approval and is not part of this migration.

## Stop Conditions

Stop a future deployment or infrastructure change if:

- either required environment-variable name is absent
- GitHub authorization requires unexpected repository access
- the build does not use the approved settings
- Node 22 verification fails
- SPA deep links fail
- public content, order, or appearance differs from the production reference
- authentication, Supabase, data, dependency, or application changes become necessary
