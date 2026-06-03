-- Run in Supabase SQL Editor if project create fails with projects_user_id_fkey.
-- Points projects.user_id at auth.users so logged-in users can insert without a profiles row.

alter table public.projects drop constraint if exists projects_user_id_fkey;

alter table public.projects
  add constraint projects_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete cascade;
