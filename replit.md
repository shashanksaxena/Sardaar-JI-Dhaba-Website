# Sardaar JI Dhaba

A premium, warm website for Sardaar JI Dhaba with menu discovery, location pages, brand storytelling, and franchise enquiries.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
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
- The first release is a client-side presentation build; enquiry forms provide clear success states while server-side delivery can be connected once the email provider and operational details are confirmed.
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
- Form submission is currently a client-side success-state experience; secure server-side email delivery still needs provider configuration.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
