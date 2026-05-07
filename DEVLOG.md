# Devlog

## Day 1 — 2026-05-07
**Hours worked:** 3

**What I did:**
- Set up the Next.js 15 App Router project with TypeScript and Tailwind.
- Added core UI components, landing page, and audit form.
- Implemented React Hook Form + Zod validation and draft auto-save with Zustand.
- Added Prisma schema and API routes for creating and fetching audits.

**What I learned:**
- Avoid using React Hook Form field array IDs as SSR DOM IDs.
- Share Zod schemas between frontend and API for consistent validation.

**Blockers:**
- Audit recommendation logic is not built yet.
- Authentication, lead capture persistence, and share page wiring are still pending.

**Plan:**
- Build the recommendation engine.
- Connect the results page to saved audit data.
- Add persistence for leads and share flows.
