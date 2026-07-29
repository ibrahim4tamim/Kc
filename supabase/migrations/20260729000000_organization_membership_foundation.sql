-- KC Platform V2 Foundation Sprint 1B
-- Additive identity tenancy foundation. Review and apply only to a non-production
-- Supabase project before any production migration is considered.

begin;

do $$
begin
  create type public.organization_status as enum ('active', 'archived');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.membership_status as enum ('active', 'invited', 'suspended');
exception when duplicate_object then null;
end $$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 160),
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  status public.organization_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  status public.membership_status not null default 'invited',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists organization_memberships_active_user_idx
  on public.organization_memberships (user_id, organization_id)
  where status = 'active';

create index if not exists organization_memberships_active_organization_idx
  on public.organization_memberships (organization_id, role)
  where status = 'active';

drop trigger if exists organizations_set_updated_at on public.organizations;
create trigger organizations_set_updated_at
before update on public.organizations
for each row execute procedure public.set_updated_at();

drop trigger if exists organization_memberships_set_updated_at on public.organization_memberships;
create trigger organization_memberships_set_updated_at
before update on public.organization_memberships
for each row execute procedure public.set_updated_at();

-- Sprint 1A issued a legacy customer role at authentication time. Profiles remain
-- automatic, but membership creation now requires the controlled bootstrap or a
-- future privileged invitation flow. user_roles is retained for rollback evidence
-- only and is no longer readable or authoritative.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.is_active_organization_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    where membership.organization_id = target_organization_id
      and membership.user_id = auth.uid()
      and membership.status = 'active'
  );
$$;

create or replace function public.has_active_organization_role(
  target_organization_id uuid,
  allowed_roles public.app_role[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    where membership.organization_id = target_organization_id
      and membership.user_id = auth.uid()
      and membership.status = 'active'
      and membership.role = any (allowed_roles)
  );
$$;

-- This function is intentionally not executable by application roles. It is only
-- invoked by a privileged database operator through the reviewed companion script.
create or replace function public.bootstrap_initial_owner(
  target_user_id uuid,
  target_organization_name text,
  target_organization_slug text
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  new_organization_id uuid;
  normalized_slug text := lower(trim(target_organization_slug));
begin
  if normalized_slug is null
    or target_organization_slug <> normalized_slug
    or normalized_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'Organization slug must be lowercase kebab-case';
  end if;

  if char_length(trim(target_organization_name)) not between 1 and 160 then
    raise exception 'Organization name must contain between 1 and 160 characters';
  end if;

  if not exists (select 1 from auth.users where id = target_user_id) then
    raise exception 'Target auth user does not exist';
  end if;

  insert into public.profiles (id) values (target_user_id)
  on conflict (id) do nothing;

  select organization.id into new_organization_id
  from public.organizations
  where organization.slug = normalized_slug;

  if new_organization_id is null then
    insert into public.organizations (name, slug, status)
    values (trim(target_organization_name), normalized_slug, 'active')
    returning id into new_organization_id;
  end if;

  if exists (
    select 1 from public.organization_memberships
    where organization_memberships.organization_id = new_organization_id
      and organization_memberships.role = 'owner'
      and organization_memberships.status = 'active'
  ) then
    raise exception 'Organization already has an active owner';
  end if;

  if exists (
    select 1 from public.organization_memberships
    where organization_memberships.organization_id = new_organization_id
      and organization_memberships.user_id = target_user_id
  ) then
    raise exception 'Target user already has a membership in this organization';
  end if;

  insert into public.organization_memberships (organization_id, user_id, role, status)
  values (new_organization_id, target_user_id, 'owner', 'active');

  return new_organization_id;
end;
$$;

alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;

revoke all on public.organizations from anon, authenticated;
revoke all on public.organization_memberships from anon, authenticated;
revoke all on public.user_roles from anon, authenticated;
revoke execute on function public.is_active_organization_member(uuid) from public, anon;
revoke execute on function public.has_active_organization_role(uuid, public.app_role[]) from public, anon;
revoke execute on function public.bootstrap_initial_owner(uuid, text, text) from public, anon, authenticated;

grant select on public.organizations to authenticated;
grant select on public.organization_memberships to authenticated;
grant execute on function public.is_active_organization_member(uuid) to authenticated;
grant execute on function public.has_active_organization_role(uuid, public.app_role[]) to authenticated;

drop policy if exists "users read own role" on public.user_roles;

drop policy if exists "members read their organization" on public.organizations;
create policy "members read their organization"
on public.organizations for select
to authenticated
using (public.is_active_organization_member(id));

drop policy if exists "members read own membership or identity admins read organization memberships" on public.organization_memberships;
create policy "members read own membership or identity admins read organization memberships"
on public.organization_memberships for select
to authenticated
using (
  user_id = auth.uid()
  or public.has_active_organization_role(organization_id, array['owner', 'admin']::public.app_role[])
);

comment on table public.organizations is
  'KC Platform tenancy boundary. Creation and lifecycle changes require privileged operations.';
comment on table public.organization_memberships is
  'Authoritative organization-scoped role assignment. Direct client mutation is prohibited.';
comment on table public.user_roles is
  'Deprecated Sprint 1A compatibility record. Retained non-destructively; organization_memberships is authoritative.';

commit;
