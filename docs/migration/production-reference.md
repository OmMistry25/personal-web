# Production Reference

## Reference site

https://ommistry.netlify.app/

The current production website is the source of truth during the migration for:

- visual appearance
- typography
- spacing
- layout
- responsive behavior
- navigation behavior
- existing animation behavior
- content
- content ordering
- public behavior

Repository code, migrations, and configuration must not be assumed to match production perfectly until the corresponding live state has been verified.

Production infrastructure has not been fully verified against this repository. In particular, the Netlify deployment source and dashboard configuration, deployed commit, live Supabase schema and migration ledger, authentication configuration, Edge Function deployment state, and storage usage remain unverified.

This reference records the migration baseline. It does not authorize scraping, changing, redeploying, or reproducing production.
