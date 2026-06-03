-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  client_name text not null,
  status text not null default 'planning' check (status in ('planning', 'active', 'completed', 'on_hold')),
  created_at timestamptz not null default now()
);

create index if not exists projects_user_id_idx on public.projects (user_id);

alter table public.projects enable row level security;

create policy "Users can view own projects"
  on public.projects
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on public.projects
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects
  for delete
  to authenticated
  using (auth.uid() = user_id);
