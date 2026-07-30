-- KC Platform V2 Sprint 2A: customer and contact foundation only.
begin;

do $$ begin create type public.customer_type as enum ('individual', 'company'); exception when duplicate_object then null; end $$;
do $$ begin create type public.customer_status as enum ('lead', 'active', 'inactive', 'archived'); exception when duplicate_object then null; end $$;
do $$ begin create type public.customer_contact_status as enum ('active', 'inactive', 'archived'); exception when duplicate_object then null; end $$;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  profile_id uuid unique references public.profiles(id) on delete set null,
  customer_type public.customer_type not null,
  display_name text not null check (char_length(trim(display_name)) between 1 and 160),
  legal_name text check (legal_name is null or char_length(trim(legal_name)) between 1 and 220),
  status public.customer_status not null default 'lead',
  preferred_language text check (preferred_language is null or preferred_language ~ '^[a-z]{2,3}(-[A-Z]{2})?$'),
  preferred_currency text check (preferred_currency is null or preferred_currency ~ '^[A-Z]{3}$'),
  country_code text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  city text check (city is null or char_length(trim(city)) <= 120),
  website text check (website is null or char_length(trim(website)) <= 2048),
  tax_number text check (tax_number is null or char_length(trim(tax_number)) <= 120),
  commercial_registration_number text check (commercial_registration_number is null or char_length(trim(commercial_registration_number)) <= 120),
  notes text check (notes is null or char_length(notes) <= 4000),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  unique (id, organization_id),
  check ((status = 'archived') = (archived_at is not null))
);

create table if not exists public.customer_contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  customer_id uuid not null,
  full_name text not null check (char_length(trim(full_name)) between 1 and 160),
  job_title text check (job_title is null or char_length(trim(job_title)) <= 160),
  email text check (email is null or char_length(trim(email)) <= 320),
  phone text check (phone is null or char_length(trim(phone)) <= 40),
  whatsapp text check (whatsapp is null or char_length(trim(whatsapp)) <= 40),
  is_primary boolean not null default false,
  status public.customer_contact_status not null default 'active',
  preferred_language text check (preferred_language is null or preferred_language ~ '^[a-z]{2,3}(-[A-Z]{2})?$'),
  notes text check (notes is null or char_length(notes) <= 4000),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  foreign key (customer_id, organization_id) references public.customers(id, organization_id) on delete restrict,
  check (nullif(trim(email), '') is not null or nullif(trim(phone), '') is not null or nullif(trim(whatsapp), '') is not null),
  check ((status = 'archived') = (archived_at is not null))
);

create unique index if not exists customer_contacts_one_primary_per_customer_idx
  on public.customer_contacts (customer_id) where is_primary and archived_at is null;
create index if not exists customers_organization_status_idx on public.customers (organization_id, status) where archived_at is null;
create index if not exists customer_contacts_customer_active_idx on public.customer_contacts (customer_id) where archived_at is null;

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at before update on public.customers for each row execute procedure public.set_updated_at();
drop trigger if exists customer_contacts_set_updated_at on public.customer_contacts;
create trigger customer_contacts_set_updated_at before update on public.customer_contacts for each row execute procedure public.set_updated_at();

create or replace function public.is_customer_data_manager(target_organization_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_active_organization_role(target_organization_id, array['owner','admin','operations']::public.app_role[]);
$$;

create or replace function public.is_customer_data_reader(target_organization_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_active_organization_role(target_organization_id, array['owner','admin','operations','purchasing','inspection','finance']::public.app_role[]);
$$;

-- Explicit staff-only linking: a customer cannot claim a customer row, and a
-- profile must hold an active customer membership in the same organization.
create or replace function public.link_customer_profile(target_customer_id uuid, target_profile_id uuid)
returns void language plpgsql security definer set search_path = public, auth as $$
declare target_organization_id uuid;
begin
  select organization_id into target_organization_id from public.customers where id = target_customer_id and archived_at is null;
  if target_organization_id is null or not public.is_customer_data_manager(target_organization_id) then raise exception 'Customer link is not authorized'; end if;
  if not exists (select 1 from public.organization_memberships where organization_id = target_organization_id and user_id = target_profile_id and role = 'customer' and status = 'active') then raise exception 'Profile is not an active customer member of this organization'; end if;
  if exists (select 1 from public.customers where profile_id = target_profile_id and id <> target_customer_id) then raise exception 'Profile is already linked to another customer'; end if;
  update public.customers set profile_id = target_profile_id where id = target_customer_id and profile_id is null;
  if not found then raise exception 'Customer is already linked'; end if;
end;
$$;

create or replace function public.set_primary_customer_contact(target_customer_id uuid, target_contact_id uuid)
returns void language plpgsql security definer set search_path = public, auth as $$
declare target_organization_id uuid;
begin
  select organization_id into target_organization_id from public.customers where id = target_customer_id and archived_at is null;
  if target_organization_id is null or not public.is_customer_data_manager(target_organization_id) then raise exception 'Primary contact update is not authorized'; end if;
  if not exists (select 1 from public.customer_contacts where id = target_contact_id and customer_id = target_customer_id and organization_id = target_organization_id and status = 'active' and archived_at is null) then raise exception 'Contact is not an active contact for this customer'; end if;
  update public.customer_contacts set is_primary = false where customer_id = target_customer_id and is_primary;
  update public.customer_contacts set is_primary = true where id = target_contact_id;
end;
$$;

create or replace function public.get_my_customer()
returns table (id uuid, organization_id uuid, customer_type public.customer_type, display_name text, legal_name text, preferred_language text, preferred_currency text, country_code text, city text, website text)
language sql stable security definer set search_path = public, auth as $$
  select c.id, c.organization_id, c.customer_type, c.display_name, c.legal_name, c.preferred_language, c.preferred_currency, c.country_code, c.city, c.website
  from public.customers c
  join public.organization_memberships m on m.organization_id = c.organization_id and m.user_id = auth.uid() and m.role = 'customer' and m.status = 'active'
  where c.profile_id = auth.uid() and c.archived_at is null and c.status <> 'archived';
$$;

create or replace function public.get_my_customer_contacts()
returns table (id uuid, customer_id uuid, full_name text, job_title text, email text, phone text, whatsapp text, is_primary boolean, preferred_language text)
language sql stable security definer set search_path = public, auth as $$
  select cc.id, cc.customer_id, cc.full_name, cc.job_title, cc.email, cc.phone, cc.whatsapp, cc.is_primary, cc.preferred_language
  from public.customer_contacts cc
  join public.customers c on c.id = cc.customer_id and c.organization_id = cc.organization_id
  join public.organization_memberships m on m.organization_id = c.organization_id and m.user_id = auth.uid() and m.role = 'customer' and m.status = 'active'
  where c.profile_id = auth.uid() and c.archived_at is null and c.status <> 'archived' and cc.archived_at is null and cc.status = 'active';
$$;

alter table public.customers enable row level security;
alter table public.customer_contacts enable row level security;
revoke all on public.customers, public.customer_contacts from anon, authenticated;
grant select, insert on public.customers, public.customer_contacts to authenticated;
grant update (customer_type, display_name, legal_name, status, preferred_language, preferred_currency, country_code, city, website, tax_number, commercial_registration_number, notes, archived_at) on public.customers to authenticated;
grant update (full_name, job_title, email, phone, whatsapp, status, preferred_language, notes, archived_at) on public.customer_contacts to authenticated;
revoke execute on function public.is_customer_data_manager(uuid), public.is_customer_data_reader(uuid), public.link_customer_profile(uuid, uuid), public.set_primary_customer_contact(uuid, uuid), public.get_my_customer(), public.get_my_customer_contacts() from public, anon;
grant execute on function public.is_customer_data_manager(uuid), public.is_customer_data_reader(uuid), public.link_customer_profile(uuid, uuid), public.set_primary_customer_contact(uuid, uuid), public.get_my_customer(), public.get_my_customer_contacts() to authenticated;

create policy "staff read organization customers" on public.customers for select to authenticated using (public.is_customer_data_reader(organization_id));
create policy "managers create organization customers" on public.customers for insert to authenticated with check (public.is_customer_data_manager(organization_id) and created_by = auth.uid());
create policy "managers update organization customers" on public.customers for update to authenticated using (public.is_customer_data_manager(organization_id)) with check (public.is_customer_data_manager(organization_id));
create policy "staff read organization customer contacts" on public.customer_contacts for select to authenticated using (public.is_customer_data_reader(organization_id));
create policy "managers create organization customer contacts" on public.customer_contacts for insert to authenticated with check (public.is_customer_data_manager(organization_id) and created_by = auth.uid());
create policy "managers update organization customer contacts" on public.customer_contacts for update to authenticated using (public.is_customer_data_manager(organization_id)) with check (public.is_customer_data_manager(organization_id));

comment on table public.customers is 'Authoritative organization-scoped customer party model. Account linking is explicit and protected.';
comment on table public.customer_contacts is 'Organization-consistent customer contacts; direct deletion is not granted.';
commit;
