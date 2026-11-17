# Sardaar JI Dhaba

A premium, warm website for Sardaar JI Dhaba with menu discovery, location pages, brand storytelling, and franchise enquiries.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the local API for Vite development (port 5001)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm run deploy:pages` — deploy the built site and root-level Pages Functions to Cloudflare Pages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/sardaar-ji-dhaba/src/App.tsx` — routed website shell and page compositions
- `artifacts/sardaar-ji-dhaba/src/data/content.ts` — editable brand, menu, location, story, and blog content
- `artifacts/sardaar-ji-dhaba/src/index.css` — visual theme, typography, texture, motion, and responsive rules
- `artifacts/sardaar-ji-dhaba/src/pages/not-found.tsx` — standalone 404 state

## Architecture decisions

- Content is kept separate from presentation so real restaurant photos, addresses, hours, menu data, story milestones, and franchise details can be added later without restructuring the UI.
- Enquiry forms POST to `/api/inquiries` and are stored directly in MongoDB for the admin dashboard.
- Admin and lead storage uses MongoDB via `MONGODB_URI` and `MONGODB_DATABASE`; configure `ADMIN_USERNAME` and a scrypt-derived `ADMIN_PASSWORD_HASH` from `artifacts/api-server/.env.example`.
- `/admin` and all enquiry forms use same-origin Cloudflare Pages Functions under `functions/api/`; no always-on API service or frontend `VITE_API_URL` is needed. Keep the local Express API for Vite development.
- Configure the Cloudflare Pages project with build command `pnpm run build` and output directory `artifacts/sardaar-ji-dhaba/dist/public`. If the Cloudflare deployment setup requires a deploy command, use `pnpm run deploy:pages` (or `pnpm exec wrangler pages deploy artifacts/sardaar-ji-dhaba/dist/public --project-name sardaar-ji-dhaba-website`), never `wrangler deploy`; the latter is for Workers and fails for this Pages project. Set `MONGODB_URI`, `MONGODB_DATABASE`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD_HASH` as Pages Function secrets/environment variables in both Production and Preview as appropriate. Do not configure these as frontend build variables.
- Remove the old `VITE_API_URL` variable from Cloudflare Pages; frontend requests now use same-origin `/api/...` Function routes.
- Direct Atlas connections from Workers require the Atlas network access rule `0.0.0.0/0` because Cloudflare TCP egress IPs are not a fixed published range. This broadens network reachability; use a newly rotated database password, a least-privilege Atlas database user, and TLS. Rate-limit `/api/admin/login` with a Cloudflare security rule. Rotate any credentials previously shared in chat.
- For local Pages Functions testing, copy `.dev.vars.example` to `.dev.vars`, fill it with local-only secrets, run `pnpm run build`, then run `pnpm exec wrangler pages dev artifacts/sardaar-ji-dhaba/dist/public`. `.dev.vars` is gitignored.
- Unknown business facts are deliberately surfaced as editable placeholders rather than fabricated claims, addresses, prices, timings, awards, ratings, or reviews.
- The visual direction uses an editorial roadside-luxe treatment: warm paper and terracotta surfaces, deep dhaba green, mustard accents, and display typography with readable utility text.

## Product

- Responsive public website for Sardaar JI Dhaba, established 2018, serving Noida and Prayagraj.
- Routes for home, about, success story, menu, locations and location detail, franchise and franchise application, blog and dish pages, contact, legal pages, and 404.
- Working client-side navigation, menu search/filtering, phone and WhatsApp actions, location CTAs, social links, contact/enquiry success states, and accessible mobile navigation.

## User preferences

The build brief prioritizes dhaba authenticity, premium usability, local SEO foundations, mobile-first UX, and truthful editable placeholders until the brand supplies final content.

## Gotchas

- Vite build checks require `PORT` and `BASE_PATH`; the managed web workflow injects these automatically.
- Replace the clearly marked placeholder media, content, addresses, timings, and map/social URLs before launch.
- Form submissions are persisted as leads in MongoDB. Rotate any credentials previously shared in chat before launch.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
