# Visitor analytics

The homepage includes a lazy-loaded COBE 3D globe. `/visitors/` provides period
filters, regional totals and a daily chart. It uses the separately hosted Sites
Worker API at `https://jianshu-visitor-analytics.selectwhale8.chatgpt.site`.

## Private records

Use **Owner sign-in** on `/visitors/`. The statistics service's `/admin/` route
uses the platform's ChatGPT sign-in and authorizes the verified owner email on
every request to `/api/records`. The admin view reuses the published visitors
page. Private data is never embedded in the GitHub repository or built HTML.
There is no password or administrative bearer token in the public frontend.

The private list supports IP summaries (count, first visit, latest visit),
individual page visits, search, 50-row pagination and Beijing/local/UTC time.
The public API returns aggregate counts, daily totals and coarse map points.

## Counting

- A visible page navigation on the production hostname sends one event. Astro
  client-side navigation is included; prefetches and local previews do not count.
- IP and timestamps come from the edge/server, never from the event payload.
- Event UUIDs are unique in the database, so retrying an event does not duplicate
  it. Reloading a page is a new page view. Unique IPs are distinct network
  addresses within the selected period, not necessarily different people.
- Known bots/previews are ignored; collection is limited to 30 stored events
  per IP per minute. Browser extensions can block collection.
- The collector accepts the production origin only. This is a browser abuse
  control, not proof of a human visitor; non-browser clients can spoof Origin.
- Location uses the edge's approximate geolocation when available, otherwise a
  server-side HTTPS request to IPWHOIS (`ipwho.is`) with the network IP address.
  Successful lookups reuse existing visit locations for seven days; failures
  pause retries for an hour per running service instance. Lookup failures never
  discard visits or invent a location. The public map
  rounds coordinates to whole degrees. Unknown locations remain in counts.
  The globe displays the 64 most visited map regions; counts and lists include
  all records in the selected period.
- The 24-hour/7/30/90-day filters are rolling periods. Charts group by UTC day;
  all-time charts show at most the most recent year. Counts remain all-time.
- Page paths exclude query strings and fragments; only the referrer's hostname
  is saved. Raw user-agent strings and browser identifiers are not stored.
- Historical visits from before activation cannot be recovered by this feature.

## Backend maintenance

The separate service is in the sibling workspace `visitor-analytics-service/`.
Its Sites source repository holds the Worker, schema migration, SQL integration
tests and portable build script. `.openai/hosting.json` declares D1 binding `DB`.
Source changes must be packaged and deployed with the Sites workflow. The
platform applies the schema migration before deployment. Preserve the service
project ID, database and access configuration on updates.

The public service intentionally allows anonymous collection and aggregate
reads. `/admin/` and `/api/records` always require the owner identity supplied by
the platform. Never move access checks into client JavaScript, make record
endpoints public, or put IP data in build artifacts.

## Validation

`pnpm verify` checks existing content, links, TypeScript and builds. Run
`pnpm test:browser` for desktop/mobile coverage including public/private analytics
interfaces, filters, empty search and recovery after a failed refresh. The
service's `node --test tests/*.test.mjs` runs collection, deduplication, privacy,
authorization, search, pagination and rate-limit checks against real SQLite.
