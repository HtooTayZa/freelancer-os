# Supabase setup

Run these SQL files **in order** in the Supabase Dashboard → SQL Editor:

1. `migrations/001_create_projects.sql` — projects table and RLS
2. `migrations/002_create_profiles.sql` — profiles table, trigger, and backfill (skip if you already have profiles)
3. `migrations/003_fix_projects_user_fk.sql` — required if project create fails with `projects_user_id_fkey`
4. `migrations/004_create_time_and_invoices.sql` — time tracking and invoices tables

For a fresh project, run all four in order. If `002` fails because objects already exist, skip to the migrations you still need.
