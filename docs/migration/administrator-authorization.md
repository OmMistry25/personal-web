# Administrator Authorization Hardening

## Status

Implemented on August 15, 2026.

The production Supabase project now distinguishes authentication from administrator authorization. Public reads remain available, while content mutations and video uploads require a protected administrator claim.

## Authorization model

The sole intended administrator has this protected Auth application-metadata claim:

```json
{
  "role": "admin"
}
```

The claim is stored in `app_metadata`, not user-editable `user_metadata`. Database and Storage policies evaluate the protected claim from `auth.jwt()`.

The browser also reads the same claim to decide whether to render administrator routes. This client-side check improves the user experience, but RLS remains the enforcement boundary.

## Application changes

- `AuthContext` validates the initial user with `getUser()` and derives `isAdmin` from protected application metadata.
- `ProtectedRoute` uses the shared Auth context and requires both an authenticated user and the administrator claim.
- The login form starts empty and uses generic failure feedback.
- An authenticated account without the administrator claim is signed out and denied administrator access.
- The public setup control and fixed bootstrap values were removed.

## Database migration

Migration `20260815050633_administrator_authorization.sql` changed authorization for:

- `projects`
- `notes`
- `work_experience`
- `about_items`
- `about_video`
- `now_items`
- `contact_methods`

Each table retains its existing public `SELECT` policy. The previous authenticated `ALL` policy was replaced with separate `INSERT`, `UPDATE`, and `DELETE` policies that require `app_metadata.role = 'admin'`.

The `anon` role now has only `SELECT` grants. The `authenticated` role has `SELECT`, `INSERT`, `UPDATE`, and `DELETE` grants, with RLS determining whether each write is authorized. Unnecessary `REFERENCES`, `TRIGGER`, and `TRUNCATE` grants were removed from both roles.

## Storage

The two duplicate public video-read policies were replaced with one public `SELECT` policy. The two authenticated video-upload policies were replaced with one `INSERT` policy requiring:

- the `videos` bucket
- the existing 400 MB maximum object size
- an authenticated JWT with the protected administrator claim

No bucket, object, object path, or public-read behavior was changed.

## Bootstrap function

The `setup-admin` Edge Function was replaced with an inert implementation.

- The function remains deployed with `verify_jwt = true`.
- It no longer initializes a service-role client.
- It no longer lists, creates, or modifies Auth users.
- It contains no fixed bootstrap identity or password.
- Authorized requests receive `410 Gone` with a generic disabled response.

Keeping the inert endpoint for this step provides an explicit decommissioned state and deployment audit trail.

## Production verification

The following checks completed successfully:

- Exactly one Auth user has the administrator claim and no conflicting role claim exists.
- Seven public-read policies remain in place.
- Twenty-one command-specific content-write policies require the protected claim.
- No content policy uses `ALL` or the deprecated `auth.role()` predicate.
- The video bucket has one public-read policy and one administrator-upload policy.
- Anonymous table grants are limited to seven `SELECT` grants.
- Authenticated table grants are limited to the four required operations on each table.
- A transaction-wrapped administrator probe updated one representative row and rolled back.
- The same probe without the administrator claim updated zero rows.
- A transaction-wrapped anonymous read succeeded.
- All seven content-table row counts remained unchanged after migration and verification.
- The deployed Edge Function source matches the inert repository source.
- An authorized function request returned `410 Gone`.

## Unchanged and unverified configuration

This step did not change:

- external email-signup configuration
- anonymous-signin configuration
- OTP expiration
- leaked-password protection
- database runtime version
- Vercel or Netlify settings

Current security advisors still report the separately scoped OTP-expiration, leaked-password-protection, and Postgres-version warnings documented in `admin-security-audit.md`.

The administrator must refresh the browser session after the metadata change. Signing out and signing back in obtains a JWT containing the new protected claim.

## Rollback

Reverting only the client commit does not remove backend authorization. Database policies and the administrator claim continue protecting content.

Do not remove the administrator claim while any policy depends on it. Do not restore the public bootstrap implementation or the previous unrestricted authenticated-user policies without a separate explicit security decision.

If a corrective database change is required, create a new forward migration. Do not rewrite the applied migration.
