# Administrator Authentication and Authorization Audit

## Status

Completed read-only on August 14, 2026.

No login was attempted. No credential was tested or displayed. No Auth user, session, provider, project setting, RLS policy, grant, Edge Function, storage object, schema object, or production row was created, changed, or removed.

## Executive conclusion

The application authenticates users but does not independently authorize administrators.

The route guard accepts any Supabase session. The live database then gives every authenticated user full write access to all seven public content tables. The deployed bootstrap Edge Function uses service-role privileges but performs no administrator identity or role check inside the handler.

The live project currently contains exactly one confirmed email user and no additional users. This reduces the number of currently known principals, but it does not correct the authorization model. The single user has no administrator marker in protected app metadata, so the system has no existing claim that can distinguish an administrator from another authenticated user.

Authentication and authorization remain frozen. The findings below require a separately approved implementation plan before remediation.

## Scope and evidence

The audit inspected:

- `src/contexts/AuthContext.tsx`
- `src/components/ProtectedRoute.tsx`
- `src/pages/admin/Login.tsx`
- all six admin content editors under `src/pages/admin/`
- `supabase/functions/setup-admin/index.ts`
- repository migrations that define public-table and video-storage policies
- live aggregate Auth metadata without user identities
- live RLS policies, table grants, and RLS enablement
- live Edge Function metadata and a redacted source-parity comparison
- live Supabase security advisors
- the public production bundle for client-key format markers only
- current Supabase documentation and breaking-change notices

Database query results were limited to aggregate counts and system metadata. No content values, emails, user IDs, JWTs, API-key values, passwords, or session records were returned.

## Current authorization flow

```text
/admin
  -> ProtectedRoute checks whether any local Supabase session exists
  -> Dashboard renders every content editor
  -> editors issue direct browser-to-Supabase writes
  -> live RLS accepts any JWT whose database role is authenticated
```

There is no administrator role, allowlist, ownership check, or application-specific authorization predicate in this path.

The bootstrap path is separate:

```text
public /admin/login setup button
  -> browser sends the public client credential as Authorization
  -> active setup-admin Edge Function
  -> function creates a Supabase service-role client
  -> function creates its fixed bootstrap user only when Auth has zero users
```

The platform JWT check is an authentication gate, not an administrator authorization decision. The function handler does not validate a user identity, role, claim, or out-of-band setup secret.

## Repository findings

### Session-only route protection

`ProtectedRoute.tsx` calls `getSession()` and renders the admin dashboard whenever `session.user` exists. It does not verify a protected claim or database-backed administrator membership.

`AuthContext.tsx` implements a second copy of the same session subscription and lookup. The route guard does not use that shared context, creating two client-side sources of authentication state.

Client-side routing is not the final security boundary. A caller can issue Supabase requests without rendering the dashboard, so authorization must be enforced by database and storage policies.

### Direct administrative write surface

Every editor writes directly from the browser with the signed-in user's access token:

| Editor | Resource | Operations |
| --- | --- | --- |
| Projects | `projects` | Select, insert, update, delete, reorder |
| Writing | `notes` | Select, insert, update, delete, reorder |
| Work | `work_experience` | Select, insert, update, delete, reorder |
| About | `about_items`, `about_video` | Select, insert, update, delete |
| Now | `now_items` | Select, insert, update, delete |
| Contact | `contact_methods` | Select, insert, update, delete |

This design can be secure only when RLS distinguishes authorized administrators from other authenticated users. The current policies do not make that distinction.

### Public bootstrap behavior

The login page contains a public setup control and prepopulates a fixed bootstrap email and password. The Edge Function contains the same fixed values. This audit intentionally does not reproduce those values.

The function lists Auth users with service-role privileges. If the project has zero users, it creates and confirms the fixed bootstrap account. If at least one user exists, it returns success without creating another account.

The handler allows cross-origin requests, does not restrict callers to a specific administrator identity, and does not implement a one-time secret or explicit decommissioned state.

## Live-state findings

### Auth aggregates

| Observation | Result |
| --- | ---: |
| Total Auth users | 1 |
| Confirmed users | 1 |
| Additional users | 0 |
| Anonymous users currently present | 0 |
| Currently banned users | 0 |
| Users with an authorization marker in protected app metadata | 0 |
| Users with an authorization-like marker in user-editable metadata | 0 |
| Observed identity provider | Email |

The aggregate proves that only one user currently exists. It does not establish whether that user is the fixed bootstrap identity or whether its password has been changed.

External email signup and anonymous-signin configuration remain unverified. The unauthenticated public settings endpoint returned `401`, and confirming these settings would require extracting and repurposing the browser API key or obtaining additional management access. The audit stopped at that credential boundary.

### RLS and grants

RLS is enabled on all seven public content tables and on `storage.objects`.

Each content table has:

- a public `SELECT` policy with `USING (true)`
- a permissive `ALL` policy whose `USING` and `WITH CHECK` expressions require only `auth.role() = 'authenticated'`

The live policy behavior matches the repository migrations. Every authenticated user can insert, update, and delete every row in every content table. No policy checks `auth.uid()`, protected app metadata, ownership, or an administrator table.

Both `anon` and `authenticated` have broad table grants. RLS blocks ordinary anonymous writes today, but these grants provide little defense in depth if a policy is weakened or bypassed by a future database function.

The video bucket has two overlapping public-read policies and two overlapping authenticated-insert policies. Any authenticated user can upload an allowed video object. Storage authorization is not administrator-specific.

The policies use the deprecated `auth.role()` pattern. Supabase currently recommends targeting roles with the policy `TO` clause and adding an application-specific authorization predicate. Anonymous Supabase users also receive the database `authenticated` role, so `TO authenticated` alone would still not establish administrator authorization.

### Deployed bootstrap function

`setup-admin` is deployed, active, version 1, and configured with `verify_jwt = true`.

A redacted byte-for-byte comparison confirmed that the deployed source exactly matches `supabase/functions/setup-admin/index.ts`. The function was not invoked.

The production client bundle contains a legacy JWT-shaped browser key and contains no secret-key or service-role marker. The repository sends that browser credential in the function's `Authorization` header. This establishes that platform JWT verification is the only configured gateway check in the current flow; the handler still performs no administrator authorization check.

### Security advisors

The live security advisors report:

1. Auth email OTP expiry exceeds the recommended one-hour maximum.
2. leaked-password protection is disabled.
3. the current Postgres release has security patches available.

The first two are Auth configuration risks. The Postgres upgrade is a separate platform-maintenance change. Advisor remediation references:

- <https://supabase.com/docs/guides/platform/going-into-prod#security>
- <https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection>
- <https://supabase.com/docs/guides/platform/upgrading>

## Risk assessment

| ID | Severity | Finding | Impact |
| --- | --- | --- | --- |
| A1 | High, potentially critical | Fixed bootstrap credentials are shipped in the public client and function source | If the live account still uses those values, an unauthenticated visitor can obtain full content administration access. Credential status was not tested. |
| A2 | High | Authentication is the only database authorization condition | Any additional, anonymous, or compromised authenticated account can modify or delete all public content. |
| A3 | High | The active bootstrap function uses service-role privileges without administrator authorization | When Auth contains zero users, a caller accepted by the gateway can recreate the known bootstrap account. The function remains a privileged public attack surface after initial setup. |
| A4 | Medium | Route protection checks only for a client session | The UI cannot distinguish an administrator from another authenticated user and provides no independent authorization signal. |
| A5 | Medium | Public tables and storage retain broad grants and deprecated role predicates | The system has weak defense in depth and future anonymous-auth behavior can widen write access unexpectedly. |
| A6 | Medium | OTP lifetime and leaked-password protections do not meet current advisor guidance | Account takeover resistance is weaker than the current recommended configuration. |
| A7 | Medium, separate scope | The database release has security patches available | The project is missing platform security fixes until an approved upgrade is completed. |

## Resolved and unresolved questions

### Resolved

- Exactly one Auth user exists; no additional Auth users currently exist.
- The existing user is confirmed and uses the email provider.
- No current user has an administrator authorization marker in app metadata.
- RLS and grants match the previously documented authenticated-user write model.
- `setup-admin` is active and verifies JWTs at the gateway.
- The deployed Edge Function source exactly matches the repository.
- The production browser bundle contains a legacy browser JWT and no secret/service-role marker.

### Still unverified

- Whether the sole Auth user is the bootstrap identity
- Whether the bootstrap password has been changed
- Whether external email signup is disabled
- Whether anonymous sign-in is disabled
- Whether any active session is already compromised
- Whether `setup-admin` has been invoked outside the original setup event
- Whether another external client depends on the current Auth or storage behavior

## Remediation options

No option below is authorized by this audit.

### Option A: protected app-metadata administrator claim

Add a protected administrator claim to the intended user's `app_metadata`, then require that claim in every content-write and storage-write policy. Update the route guard to use the same claim for user experience while retaining RLS as the enforcement boundary.

This is the recommended minimal model for the current single-administrator site. Supabase documents `raw_app_meta_data` as suitable for authorization because users cannot edit it themselves. JWT claims can be stale until the session is refreshed, so the implementation and rollback plans must account for claim propagation and session revocation.

Reference: <https://supabase.com/docs/guides/database/postgres/row-level-security#helper-functions>

### Option B: private administrator membership table

Create administrator membership in a non-exposed schema and reference it through a narrowly scoped authorization function. This avoids embedding the full authorization source in the JWT but adds schema and function complexity.

Any `SECURITY DEFINER` function would require an explicit `auth.uid()` check, a fixed `search_path`, placement outside exposed schemas, and restricted `EXECUTE` grants. It must not be added merely to bypass RLS errors.

### Required work common to either option

1. Verify external and anonymous signup configuration through approved management access.
2. Identify the intended administrator without displaying the identity in repository output.
3. Remove fixed credential defaults and the public setup control from the login page.
4. Decommission `setup-admin`, or replace it with an explicitly authorized, time-limited bootstrap mechanism.
5. Apply a forward-only migration replacing every authenticated-role write policy with administrator-specific policies.
6. Restrict video uploads to administrators and reconcile the duplicated storage policies.
7. Update the route guard to consume the selected authorization signal.
8. Enable leaked-password protection and reduce OTP expiry in separately approved Auth configuration changes.
9. Test anonymous, unauthenticated, authenticated non-admin, and administrator access with controlled accounts before production rollout.
10. Preserve public reads and all successful public content behavior.

Supabase distinguishes authentication from authorization and recommends RLS for enforcing per-user access:

- <https://supabase.com/docs/guides/auth>
- <https://supabase.com/docs/guides/database/postgres/row-level-security>
- <https://supabase.com/docs/guides/functions/auth>

## Implementation approval boundaries

A remediation step requires explicit approval because it would modify frozen systems. Its implementation brief must identify each intended change to:

- the sole Auth user's protected metadata
- live Auth signup and password-security configuration
- public-table RLS policies and grants
- storage policies and grants
- the deployed `setup-admin` function
- the login and route-guard application code
- controlled authorization tests and test users

The brief must include a lockout-safe sequence. Administrator access must be verified before restrictive policies are activated, and rollback must not restore public fixed credentials or the unrestricted authenticated-user policies without an explicit security decision.

## Verification record

- Repository auth, route, bootstrap, and admin mutation paths traced.
- Live Auth user state inspected only through aggregates.
- Live RLS, grants, storage policies, RLS enablement, Edge Function metadata, and security advisors inspected read-only.
- Deployed and repository Edge Function sources compared without displaying their contents.
- Production client credential classified by format without displaying its value.
- Current Supabase Auth, RLS, Edge Function, and API-key documentation reviewed.
- No authentication or function invocation performed.
- No production mutation performed.

## Rollback

This audit adds documentation only. Revert its commit to remove the record. No application, Auth, database, function, storage, or deployment rollback is required.
