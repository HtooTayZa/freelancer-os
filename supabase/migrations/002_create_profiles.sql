-- Run after 001_create_projects.sql (or if projects.user_id already references profiles).
-- Fixes: projects_user_id_fkey — auth user exists but public.profiles row is missing.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Backfill profiles for users who signed up before this migration
insert into public.profiles (id, email)
select id, coalesce(email, id::text || '@placeholder.local')
from auth.users
on conflict (id) do update set email = coalesce(excluded.email, public.profiles.email);

-- Callable from the app (bypasses RLS) to create a profile for the current user
create or replace function public.ensure_user_profile()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return;
  end if;

  insert into public.profiles (id, email)
  select u.id, coalesce(u.email, u.id::text || '@placeholder.local')
  from auth.users u
  where u.id = auth.uid()
  on conflict (id) do update
  set email = coalesce(excluded.email, public.profiles.email);
end;
$$;

grant execute on function public.ensure_user_profile() to authenticated;
