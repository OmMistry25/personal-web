# Vercel Deployment Migration

## Status

Repository configuration prepared on August 14, 2026. The Vercel project has not yet been created or published.

This migration replaces the disconnected Bolt-to-Netlify publishing path with Git-based Vercel deployments. It does not remove, disable, or modify the existing Netlify project.

## Current Production State

The existing `ommistry.netlify.app` project is not connected to GitHub. Netlify identifies its source as Bolt, reports no linked repository or production branch, and still serves a production deploy published on June 22, 2025.

The current GitHub `main` branch therefore does not deploy to that site. Netlify remains available as a rollback reference while Vercel is configured and verified.

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

The Vercel project must use:

| Setting | Required value |
| --- | --- |
| Git repository | `OmMistry25/personal-web` |
| Production branch | `main` |
| Root directory | Repository root |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js version | `22.x` |

Node 22 is required because Vercel no longer supports Node 18 for new deployments. The repository builds successfully under the local Node 22 runtime.

## Environment Preconditions

The following variable names must be configured directly in Vercel for both Preview and Production before deployment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Their values must not be written to Git, copied into documentation, displayed in review output, or transferred through chat. Deployment stops if either name is absent.

## Expected Behavior

Vercel will create preview deployments for non-production branches and production deployments from `main`. The generated Vercel URL will be separate from `ommistry.netlify.app`; the Netlify subdomain cannot be transferred to Vercel.

The deployed application should reproduce the existing public appearance and content order while including all code merged through Migration Step 6. No visual, content, route, Supabase, or authentication behavior change is intended.

## Deployment Verification

Before accepting the Vercel deployment:

1. Confirm the build uses Node 22, Vite, `npm run build`, and `dist`.
2. Confirm both required variable names exist in Preview and Production without reading their values.
3. Verify the root page and every public collection route.
4. Verify direct deep links for Writing and Work detail routes.
5. Verify Projects, Writing, Work, About, Now, and Contact preserve their production order and content.
6. Verify the About video singleton renders successfully.
7. Verify `/admin` redirects to the existing login page without testing credentials.
8. Verify the deployed bundle contains the deterministic Step 6 ordering queries.
9. Verify the browser console and network contain no application failures.
10. Verify the configured security headers on the generated Vercel URL.

## Security and Data Impact

This migration grants Vercel access to build the GitHub repository and requires the two existing public-client Supabase variables. It does not change Supabase Auth, users, RLS, grants, storage, Edge Functions, schema, or data.

The repository contains no Vercel token, Supabase value, project credential, or generated environment file.

## Rollback

The existing Netlify deployment remains enabled and unchanged. If the Vercel build or verification fails, do not present the Vercel URL as the replacement production site.

After a successful Vercel deployment, Vercel deployment history can restore a prior immutable deployment. Deleting or disabling the Netlify project requires separate approval and is not part of this migration.

## Stop Conditions

Stop before deployment if:

- either required environment-variable name is absent
- GitHub authorization requires unexpected repository access
- the build does not use the approved settings
- Node 22 verification fails
- SPA deep links fail
- public content, order, or appearance differs from the production reference
- authentication, Supabase, data, dependency, or application changes become necessary
