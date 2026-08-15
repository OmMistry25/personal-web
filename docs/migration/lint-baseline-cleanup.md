# Lint Baseline Cleanup

## Status

Implemented on August 15, 2026.

The repository now passes its full ESLint and TypeScript checks without errors or warnings. This cleanup changes no application behavior, visual presentation, content, data, authentication rules, or infrastructure.

## Previous baseline

Immediately before this step:

- TypeScript checking passed.
- ESLint reported four errors and one warning.
- The errors were one unused Framer Motion import and three explicit `any` catch variables.
- The warning was caused by exporting the shared `useAuth` hook from the same module as the `AuthProvider` component.

## Changes

### Unused import

The unused `useMotionValue` import was removed from `DraggableCard.tsx`. The card's existing spring and transform behavior is unchanged.

### Error handling

The three explicit `any` catch variables in the About and Writing admin editors now use `unknown`.

Error messages are read only after confirming that the caught value is an `Error` with a non-empty message. Existing fallback messages remain unchanged for all other thrown values.

### Auth module boundary

The shared Auth context and `useAuth` hook now live in `src/contexts/auth-context.ts`. `AuthContext.tsx` exports only the `AuthProvider` component and retains the existing session lookup, state subscription, administrator derivation, sign-in, sign-out, loading, and child-rendering behavior.

The route guard, login page, and admin dashboard import the hook from the new non-component module. This satisfies the React Fast Refresh rule without disabling or suppressing it.

## Verification

The following checks passed:

- targeted ESLint for all eight affected source files
- full `npm run lint` with zero errors and zero warnings
- `npm exec tsc -- --noEmit`
- `npm run build`
- `git diff --check`

The smoke, failure-state, and visual end-to-end commands were invoked. Their environment guard stopped each command before browser startup because `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not present in the local process environment. No environment value was read, displayed, written, or changed.

## Behavior, security, and data impact

- Public and administrator visuals are unchanged.
- Authentication and administrator authorization behavior are unchanged.
- Supabase Auth, database schema, RLS, Storage, Edge Functions, and production data are unchanged.
- Dependencies, runtime versions, environment variables, Vercel, and Netlify are unchanged.

## Rollback

Revert the repository commit for this step. No external-system, database, data, authentication, or deployment rollback is required.
