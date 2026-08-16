# personal-web

Personal website and content-management interface built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Production

- Current Git-based deployment: <https://personal-web-eta-eight.vercel.app/>
- Historical migration baseline and rollback reference: <https://ommistry.netlify.app/>

Vercel deploys the production branch from GitHub. The Netlify project remains online and unchanged; it is not connected to the current GitHub deployment workflow.

## Requirements

- Node.js 22.x
- npm and the committed `package-lock.json`
- Access to the existing Supabase project's browser-safe connection values

Do not use a Supabase secret key or `service_role` key in this client-rendered application.

## Local setup

1. Install the locked dependency tree:

   ```sh
   npm ci
   ```

2. Create an untracked `.env.local` file containing:

   ```text
   VITE_SUPABASE_URL=<project-url>
   VITE_SUPABASE_ANON_KEY=<browser-safe-anon-or-publishable-key>
   ```

   Keep the values out of Git, documentation, logs, screenshots, and chat.

3. Start the development server:

   ```sh
   npm run dev
   ```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production bundle in `dist` |
| `npm run preview` | Preview the production bundle locally |
| `npm run lint` | Run ESLint across the repository |
| `npm exec tsc -- --noEmit` | Run TypeScript checking without emitting files |
| `npm run test:e2e:smoke` | Run the public smoke tests |
| `npm run test:e2e:failure` | Run public failure-state tests |
| `npm run test:e2e:visual` | Run visual-parity tests |

The end-to-end commands require both Supabase environment variables. Their environment guard exits before browser startup when either name is absent.

## Public routes

- `/`
- `/projects`
- `/writing` and `/writing/:slug`
- `/work` and `/work/:id`
- `/about`
- `/now`
- `/contact`

The administrative interface begins at `/admin`. Authentication, authorization, users, and credentials are outside ordinary content and presentation changes and require separate approval.

## Deployment workflow

1. Create a `codex/*` branch from current `main`.
2. Make and verify one approved, independently reviewable change.
3. Push the branch and open a draft pull request.
4. Review the Vercel preview deployment when the change affects public behavior.
5. Merge only after review. A merge to `main` triggers the Vercel production deployment.
6. Verify the production deployment before considering the change complete.

The Vercel project uses Node 22, the Vite framework preset, `npm run build`, and `dist`. It requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in both Preview and Production.

## Project documentation

- [Agent instructions](AGENTS.md)
- [Operating rules](RULES.md)
- [Engineering standards](ENGINEERING_STANDARDS.md)
- [Migration audit](docs/migration/initial-audit.md)
- [Administrator security audit](docs/migration/admin-security-audit.md)
- [Administrator authorization hardening](docs/migration/administrator-authorization.md)
- [Supabase Auth configuration hardening](docs/migration/auth-configuration-hardening.md)
- [Lint baseline cleanup](docs/migration/lint-baseline-cleanup.md)
- [Confirmed dead-code removal](docs/migration/confirmed-dead-code-removal.md)
- [Production reference](docs/migration/production-reference.md)
- [Vercel deployment record](docs/migration/vercel-deployment.md)
