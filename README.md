# Freelancer OS

A Next.js dashboard for managing freelance projects, built with Supabase Auth and shadcn/ui.

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

## Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and fill in your Supabase credentials:

   ```bash
   cp .env.example .env.local
   ```

   Get `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase → Project Settings → API.

3. Run the database migrations in order (see [supabase/README.md](supabase/README.md)).

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000), sign up or log in, and create a project under **Projects**.

## Project structure

- `app/` — pages, server actions, and API routes (e.g. invoice PDFs)
- `components/ui/` — shadcn/ui components
- `lib/` — shared utilities
- `supabase/migrations/` — SQL schema for Supabase (run in order; see `supabase/README.md`)
- `utils/supabase/` — Supabase server client and session middleware

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint
