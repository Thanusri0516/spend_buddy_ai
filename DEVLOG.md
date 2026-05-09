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

## Day 2 — 2026-05-08
**Hours worked:** 4

### What I did
- Added audit persistence and database-driven results flow.
- Integrated Groq AI recommendations endpoint.
- Fixed Next.js 15 async params handling.
- Refactored dashboard data fetching and helper utilities.

### What I learned
- Groq models change frequently.
- Next.js 15 requires async route params.
- Server fetches need absolute URLs.

### Blockers
- None.

### Plan
- Build AI summaries and pricing calculations.
- Improve recommendation logic and error handling.

## Day 3 — 2026-05-09
**Hours worked:** 2

### What I did
- Built AI-generated audit summary flow.
- Implemented pricing calculations and savings engine.
- Added recommendation logic based on plans, team size, and use cases.
- Improved recommendation quality and error handling.

### What I learned
- Rule-based calculations are more reliable for financial recommendations.
- AI works best for summaries and explanation layers.
- Use-case-aware recommendations improve audit accuracy.

### Blockers
- None.

### Plan
- Build shareable audit pages.
- Add lead capture persistence.
- Improve dashboard UI and recommendation cards.
