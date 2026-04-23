-- Seasonbase HQ schema additions
-- Assumes you already have a waitlist_signups table.
-- If your existing waitlist table has a different name, change the app queries accordingly.

create extension if not exists pgcrypto;

create table if not exists public.employers (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  destination_focus text,
  source text,
  status text not null default 'lead',
  notes text,
  next_step text,
  next_step_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references public.employers(id) on delete set null,
  meeting_date date not null,
  meeting_type text not null default 'call',
  summary text,
  outcome text,
  next_step text,
  next_step_date date,
  status_after text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

 drop trigger if exists employers_set_updated_at on public.employers;
 create trigger employers_set_updated_at
 before update on public.employers
 for each row
 execute function public.set_updated_at();

alter table public.employers enable row level security;
alter table public.meetings enable row level security;

-- Replace this email with your own admin email before running.
-- For an internal one-user dashboard, these policies keep things simple.
create policy "admin full access employers"
on public.employers
for all
using ((select auth.jwt()->>'email') = 'YOUR_ADMIN_EMAIL')
with check ((select auth.jwt()->>'email') = 'YOUR_ADMIN_EMAIL');

create policy "admin full access meetings"
on public.meetings
for all
using ((select auth.jwt()->>'email') = 'YOUR_ADMIN_EMAIL')
with check ((select auth.jwt()->>'email') = 'YOUR_ADMIN_EMAIL');

-- Optional but recommended for the waitlist table too, if you haven't already configured it.
-- Example:
-- alter table public.waitlist_signups enable row level security;
-- create policy "admin read waitlist"
-- on public.waitlist_signups
-- for select
-- using ((select auth.jwt()->>'email') = 'YOUR_ADMIN_EMAIL');
