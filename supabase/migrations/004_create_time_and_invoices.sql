-- Time entries and invoices (run after 001–003)

create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  date date not null,
  duration_hours numeric(8, 2) not null check (duration_hours > 0),
  description text,
  created_at timestamptz not null default now()
);

create index if not exists time_entries_user_id_idx on public.time_entries (user_id);
create index if not exists time_entries_project_id_idx on public.time_entries (project_id);

alter table public.time_entries enable row level security;

create policy "Users can view own time entries"
  on public.time_entries for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own time entries"
  on public.time_entries for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own time entries"
  on public.time_entries for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own time entries"
  on public.time_entries for delete to authenticated
  using (auth.uid() = user_id);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid')),
  issue_date date not null,
  due_date date not null,
  created_at timestamptz not null default now()
);

create index if not exists invoices_user_id_idx on public.invoices (user_id);
create index if not exists invoices_project_id_idx on public.invoices (project_id);

alter table public.invoices enable row level security;

create policy "Users can view own invoices"
  on public.invoices for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own invoices"
  on public.invoices for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own invoices"
  on public.invoices for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own invoices"
  on public.invoices for delete to authenticated
  using (auth.uid() = user_id);
