# Supabase Auth Configuration Hardening

## Status

Implemented on August 15, 2026.

The production Supabase Auth configuration now prevents public account creation and limits email OTP and magic-link validity to one hour. Existing email/password sign-in remains enabled and the two existing confirmed accounts were not modified.

## Objective

Close the free-tier Auth configuration findings identified by the administrator security audit while preserving the working administrator login, the intentional non-administrator account, and all public website behavior.

## Configuration changes

| Control | Before | After |
| --- | --- | --- |
| Allow new users to sign up | Enabled | Disabled |
| Allow anonymous sign-ins | Disabled | Disabled |
| Email provider | Enabled | Enabled |
| Email OTP expiration | 86,400 seconds | 3,600 seconds |
| Prevent use of leaked passwords | Disabled | Disabled; unavailable on the Free plan |

The global signup control was disabled. This blocks new email signups without disabling the email provider or password login for existing users.

Anonymous sign-ins were already disabled and remained unchanged. No authentication provider, email-confirmation behavior, password requirement, or account credential was changed.

## Production verification

The Supabase dashboard was reloaded after both saves to confirm that:

- new-user signup remained disabled
- anonymous sign-ins remained disabled
- the email provider remained enabled
- email OTP expiration remained `3600` seconds
- the previous OTP-expiration advisor warning was cleared

Aggregate Auth verification after the change reported:

| Observation | Result |
| --- | ---: |
| Total Auth users | 2 |
| Confirmed users | 2 |
| Anonymous users | 0 |
| Users with the administrator claim | 1 |

No user identities, credentials, sessions, or tokens were displayed or changed.

## Deferred controls

Leaked-password protection is available only on the Supabase Pro plan and above. The project is currently on the Free plan, so this control was not enabled and no subscription change was attempted.

The security advisor continues to report:

- leaked-password protection is disabled
- the current Postgres release has security patches available

The Postgres warning is outside this Auth configuration step. Both remaining findings require separately approved work.

## Behavior and security impact

- Existing confirmed users can continue signing in with email and password.
- New public accounts cannot be created through Supabase Auth.
- Anonymous Auth sessions cannot be created.
- New email OTPs and magic links expire after one hour instead of 24 hours.
- Database RLS remains the authorization boundary and still requires the protected administrator claim for content writes.
- Public content reads and the production website presentation are unchanged.

## Non-goals and unchanged systems

This step did not:

- create, delete, ban, invite, or edit an Auth user
- change a password, credential, administrator claim, or session
- disable existing email/password login
- enable or configure MFA
- change email templates or SMTP
- modify database schema, RLS, Storage, or Edge Functions
- change Vercel, Netlify, environment variables, or deployment behavior
- purchase or upgrade a Supabase subscription

## Rollback

Rollback is a Supabase dashboard configuration change, not a repository migration.

If a separately approved rollback is necessary, restore only the affected control to its recorded previous value. Re-enabling public signup would reopen account creation and must be treated as a security-sensitive behavior change. Increasing OTP expiration would restore the advisor warning and weaken the validity window for emailed authentication links and codes.

Do not alter users, credentials, sessions, providers, or administrator metadata as part of a configuration rollback.
