-- KC Platform V2 Foundation Sprint 1A
-- Local, non-destructive foundation only. Do not run against production without
-- an approved migration plan and environment-specific review.

begin;

do $$
begin
  create type public.app_role as enum (
    'owner',
    'admin',
    'operations',
    'purchasing',
    'inspection',
    'finance',
    'customer'
  );
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 160),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'full_name', ''));

  insert into public.user_roles (user_id, role)
  values (new.id, 'customer');

  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public;
revoke execute on function public.handle_new_auth_user() from public;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists user_roles_set_updated_at on public.user_roles;
create trigger user_roles_set_updated_at
before update on public.user_roles
for each row execute procedure public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

revoke all on public.profiles from anon, authenticated;
revoke all on public.user_roles from anon, authenticated;

grant usage on schema public to authenticated;
grant select (id, display_name, created_at, updated_at) on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;
grant select (user_id, role, created_at, updated_at) on public.user_roles to authenticated;

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "users update own display name" on public.profiles;
create policy "users update own display name"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "users read own role" on public.user_roles;
create policy "users read own role"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);

comment on table public.profiles is
  'Application-facing profile data. Authentication identity remains in auth.users.';
comment on table public.user_roles is
  'RBAC assignment. New users receive customer through a security-definer trigger; direct client mutation is not granted.';

commit;
