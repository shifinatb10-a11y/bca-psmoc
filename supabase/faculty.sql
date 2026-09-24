-- Faculty directory setup for bca-psmoc
-- Run this in Supabase SQL Editor.
-- This script creates the public.faculty table, RLS policies, and faculty storage policies.

create extension if not exists pgcrypto;

create table if not exists public.faculty (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  photo_url text,
  created_at timestamptz not null default now()
);

alter table public.faculty enable row level security;

-- Public visitors can read faculty cards.
drop policy if exists "Public can read faculty" on public.faculty;
create policy "Public can read faculty"
on public.faculty
for select
to anon, authenticated
using (true);

-- Only super admins can insert/update/delete faculty rows.
drop policy if exists "Super admins can insert faculty" on public.faculty;
create policy "Super admins can insert faculty"
on public.faculty
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'super'
  )
);

drop policy if exists "Super admins can update faculty" on public.faculty;
create policy "Super admins can update faculty"
on public.faculty
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'super'
  )
)
with check (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'super'
  )
);

drop policy if exists "Super admins can delete faculty" on public.faculty;
create policy "Super admins can delete faculty"
on public.faculty
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'super'
  )
);

-- Storage bucket + policies for faculty photos.
-- If you already use a different bucket for faculty photos, adjust FACULTY_BUCKET in js/config.js instead.
insert into storage.buckets (id, name, public)
values ('faculty', 'faculty', true)
on conflict (id) do update set public = excluded.public;

-- Public read access for faculty photos.
drop policy if exists "Public can read faculty photos" on storage.objects;
create policy "Public can read faculty photos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'faculty');

-- Super admin write access for faculty photos.
drop policy if exists "Super admins can upload faculty photos" on storage.objects;
create policy "Super admins can upload faculty photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'faculty'
  and exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'super'
  )
);

drop policy if exists "Super admins can update faculty photos" on storage.objects;
create policy "Super admins can update faculty photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'faculty'
  and exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'super'
  )
)
with check (
  bucket_id = 'faculty'
  and exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'super'
  )
);

drop policy if exists "Super admins can delete faculty photos" on storage.objects;
create policy "Super admins can delete faculty photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'faculty'
  and exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'super'
  )
);

-- Seed sample faculty (safe to rerun: removes old sample rows first by name).
delete from public.faculty
where name in ('Anupama T', 'Shabna M', 'Jinshiya');

insert into public.faculty (name, role, photo_url)
values
  ('Anupama T', 'Head of Department', null),
  ('Shabna M', 'Assistant Professor', null),
  ('Jinshiya', 'Assistant Professor', null);

-- Ensure test@admin.com has super role in admin_users.
-- Run after the user exists in Supabase Authentication -> Users.
insert into public.admin_users (user_id, role)
select u.id, 'super'
from auth.users u
where lower(u.email) = 'test@admin.com'
on conflict (user_id) do update set role = excluded.role;
