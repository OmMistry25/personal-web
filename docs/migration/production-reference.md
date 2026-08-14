# Production Reference

## Current production deployment

The current Git-based production deployment is:

<https://personal-web-eta-eight.vercel.app/>

Vercel deploys `OmMistry25/personal-web` from the `main` branch. The first accepted production deployment was verified on August 14, 2026, from commit `3958bc3aafdd22e553518e94a6c0b98479c10381`.

Use the Vercel deployment as the source of truth for changes merged after the migration closeout.

## Historical migration baseline

The visual and behavioral baseline used throughout the migration remains:

<https://ommistry.netlify.app/>

The Netlify project is a disconnected Bolt deployment published on June 22, 2025. It is not connected to the current GitHub `main` branch. It remains online and unchanged as a comparison and rollback reference.

The Netlify baseline remains authoritative when determining whether a migration change unintentionally altered:

- visual appearance
- typography
- spacing and layout
- responsive behavior
- navigation and animation behavior
- public content
- content ordering
- successful public states

## Verified Vercel parity

The accepted Vercel deployment was verified against Netlify for:

- the homepage at a matched desktop viewport
- Projects, Writing, Work, About, Now, and Contact content and ordering
- direct Writing and Work detail navigation
- the About video
- the `/admin` redirect to the existing login page without testing credentials
- SPA fallback behavior
- browser console health
- existing security headers
- the existing fingerprinted-asset cache behavior

The Vercel deployment includes all repository changes merged through Migration Step 6 and the deployment closeout housekeeping change.

## Remaining frozen or separately scoped systems

Production deployment verification does not authorize changes to:

- Supabase Auth users or signup settings
- authentication or administrator authorization behavior
- RLS policies or grants
- Edge Functions
- storage buckets or objects
- production content or schema outside an approved migration
- the Netlify project
- custom domains

Live-state questions for any of these systems must be verified before an approved change to that system. Environment-variable values must not be copied into Git, documentation, logs, screenshots, or chat.

## Reference use

This document records deployment evidence and parity expectations. It does not authorize scraping, authentication testing, infrastructure removal, content changes, or redesign.
