# Confirmed Dead-Code Removal

## Status

Implemented on August 15, 2026.

This step removes source files and one dependency that were documented as unused during the initial audit and reconfirmed as unreferenced immediately before removal.

## Removed source files

- `src/components/DraggableCard.tsx`
- `src/components/Footer.tsx`
- `src/components/Navbar.tsx`
- `src/components/PageTitle.tsx`
- `src/data/notes.ts`
- `src/data/projects.ts`
- `src/data/work.ts`
- `src/lib/database.ts`

The four components were not mounted or imported. The three empty data modules had no consumers. The historical database helper had no consumers and contained query behavior that did not match the current typed public-data boundary.

Reference searches covered source, routes, tests, scripts, configuration, static imports, dynamic imports, and tooling patterns. Remaining mentions are historical migration documentation only.

## Dependency removal

`@use-gesture/react` was removed from `package.json` and `package-lock.json`. Its exclusive transitive package, `@use-gesture/core`, was removed from the lockfile.

No other declared dependency, version, or lockfile entry changed. An `npm ci --dry-run --ignore-scripts` check accepted the resulting package metadata and reported the two gesture packages for removal.

## Production asset comparison

A clean production build was captured before source removal and compared with a clean build afterward.

- All emitted JavaScript bytes are identical.
- The primary JavaScript filename changed because Vite includes related asset hashes in its output naming, but a byte comparison passed.
- No CSS rule was added.
- Tailwind removed only rules generated from class names that existed exclusively in the deleted, unmounted files.
- The generated CSS decreased from 35.58 KB to 33.68 KB, and from 6.20 KB to 5.83 KB compressed.
- `index.html` changed only in its generated JavaScript and CSS asset filenames.
- All other emitted asset hashes are unchanged.

The original implementation brief treated any fingerprint change as a stop condition. Work paused when the Tailwind CSS fingerprint changed. The user explicitly approved the narrower acceptance criterion after the comparison proved identical JavaScript bytes, no added CSS rules, and removal limited to unused generated CSS.

## Verification

The following checks passed:

- candidate reference searches
- full `npm run lint` with zero errors and zero warnings
- `npm exec tsc -- --noEmit`
- pre-removal and post-removal `npm run build`
- JavaScript byte comparison
- generated CSS rule-set comparison
- lockfile diff inspection
- `npm ci --dry-run --ignore-scripts`
- `git diff --check`

The smoke, failure-state, and visual end-to-end commands were invoked. Their environment guard stopped each command before browser startup because `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not present in the local process environment. No environment value was read, displayed, written, or changed.

## Behavior, visual, security, and data impact

- Mounted components, routes, content, and application logic are unchanged.
- The generated stylesheet no longer includes selectors used only by the deleted files.
- Public and administrator behavior and visuals are expected to remain unchanged.
- Authentication and administrator authorization are unchanged.
- Supabase Auth, database schema, RLS, Storage, Edge Functions, and production data are unchanged.
- Runtime versions, environment variables, Vercel, and Netlify are unchanged.

## Rollback

Revert the repository commit for this step and reinstall dependencies from the restored lockfile. No external-system, database, data, authentication, or deployment rollback is required.
