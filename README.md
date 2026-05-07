# SpendBuddy AI

A production-minded Next.js app for helping startups audit AI software spend across tools such as ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, and OpenAI API usage.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Zustand
- React Hook Form + Zod
- Supabase
- Resend
- Vitest
- Vercel

## Getting Started

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example` before wiring backend integrations.

## Scripts

- `npm run dev` starts the local app.
- `npm run build` creates a production build.
- `npm run typecheck` checks TypeScript.
- `npm run lint` runs Next.js linting.
- `npm run prisma:generate` generates Prisma Client.
- `npm run prisma:migrate` creates and applies local database migrations.
- `npm test` runs Vitest.

## Day 1 Scope

This foundation includes the landing page, layout primitives, multi-tool audit form,
persisted client state, frontend-only results dashboard, public redacted report page,
shared types, environment contract, and CI skeleton.

Backend route handlers and Prisma persistence architecture are in place. Email delivery,
authentication, spend intelligence, and pricing recommendations are intentionally not implemented yet.

## Frontend Routes

- `/` polished SaaS landing page
- `/audit/new` multi-section spend input form
- `/results` local audit dashboard preview
- `/audit/demo` public redacted share page
- `/privacy` and `/terms` placeholder legal pages

## Architecture

- `src/app` contains App Router routes and server layouts.
- `src/components` contains reusable UI, layout, and motion primitives.
- `src/features` contains product features such as landing and audit workflows.
- `src/config` contains static tool and option configuration.
- `src/store` contains Zustand stores with localStorage persistence.
- `src/types` contains shared domain types.
- `src/schemas` contains shared Zod contracts for frontend and route handlers.
- `src/server` contains Prisma-backed repository logic for route handlers.
- `src/lib` contains general utilities and environment parsing.
- `prisma` contains the Supabase Postgres data model.
