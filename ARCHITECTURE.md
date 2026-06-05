# Technical Architecture

## 1. Database Schema

Freelancer OS uses Supabase (PostgreSQL) with Row Level Security (RLS) to ensure data isolation.

### Key Migration Tables:

* **Profiles (`002_create_profiles.sql`)**: Handles user identity and business branding.
* **Projects (`001_create_projects.sql`)**: Central registry for all engagements. Features a user-ID foreign key constraint to enforce ownership.
* **Time & Invoices (`004_create_time_and_invoices.sql`)**: Relational tables linked to Projects and Profiles. This migration enforces data integrity via standard PostgreSQL constraint patterns.

## 2. Authentication & Security

The application leverages **Next.js Server Actions** for all authenticated operations.

* **Middleware**: Located in `/utils/supabase/middleware.ts`, this acts as the gatekeeper, ensuring unauthenticated requests are redirected to `/login`.
* **Server Actions**: By performing database writes inside server-side functions (e.g., `/app/login/actions.ts`), we ensure that sensitive client-side credentials are never exposed, and Row Level Security prevents users from accessing data belonging to other accounts.

## 3. UI Component System

The project is built on **Shadcn UI**, which utilizes Radix UI primitives.

* **Layout Pattern**: We utilize a mobile-first `flex-col` to `md:flex-row` pattern for the Dashboard, ensuring responsive scaling.
* **Forms**: Standardized via `/components/ui/input.tsx` and `/components/ui/button.tsx` to maintain design consistency across the Projects and Time modules.

## 4. CI/CD Workflow

The pipeline is managed via GitHub Actions:

1. **Trigger**: Pushes to `main` or `master`.
2. **Environment Ingestion**: A dummy `.env` injection script creates a mock runtime environment for the headless browser.
3. **Validation**: Playwright boots a temporary server and runs the E2E test suite to verify UI interactions and database connectivity.

---
