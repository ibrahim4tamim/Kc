-- KC Platform V2 Sprint 2B: RFQ operational workspace foundation only.
begin;

do $$ begin create type public.rfq_status as enum ('draft','submitted','under_review','sourcing','awaiting_customer','approved','cancelled','completed','archived'); exception when duplicate_object then null; end $$;
do $$ begin create type public.rfq_priority as enum ('low','normal','high','urgent'); exception when duplicate_object then null; end $$;
do $$ begin create type public.rfq_item_status as enum ('draft','ready_for_sourcing','sourcing','awaiting_information','shortlisted','selected','cancelled','completed','archived'); exception when duplicate_object then null; end $$;
do $$ begin create type public.rfq_attachment_owner_type as enum ('rfq','rfq_item'); exception when duplicate_object then null; end $$;
do $$ begin create type public.rfq_visibility as enum ('internal','customer'); exception when duplicate_object then null; end $$;
do $$ begin create type public.rfq_activity_event_type as enum ('rfq_created','rfq_submitted','rfq_status_changed','rfq_updated','rfq_item_created','rfq_item_updated','rfq_item_status_changed','attachment_added','attachment_archived'); exception when duplicate_object then null; end $$;

-- Supports a composite foreign key that proves a contact belongs to both the
-- selected customer and organization; it does not alter prior customer data.
create unique index if not exists customer_contacts_id_customer_organization_idx on public.customer_contacts (id, customer_id, organization_id);

create or replace function public.generate_rfq_public_reference()
returns text language sql volatile set search_path = public as $$
  select 'KC-RFQ-' || to_char(timezone('utc', now()), 'YYYY') || '-' || upper(substr(encode(gen_random_bytes(5), 'hex'), 1, 8));
$$;

create table public.rfqs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  customer_id uuid not null,
  primary_contact_id uuid,
  public_reference text not null default public.generate_rfq_public_reference() unique check (public_reference ~ '^KC-RFQ-[0-9]{4}-[A-Z0-9]{8}$'),
  title text not null check (char_length(trim(title)) between 1 and 180),
  description text check (description is null or char_length(description) <= 4000),
  status public.rfq_status not null default 'draft',
  priority public.rfq_priority not null default 'normal',
  source text check (source is null or char_length(trim(source)) <= 100),
  preferred_currency text check (preferred_currency is null or preferred_currency ~ '^[A-Z]{3}$'),
  destination_country_code text check (destination_country_code is null or destination_country_code ~ '^[A-Z]{2}$'),
  destination_city text check (destination_city is null or char_length(trim(destination_city)) <= 120),
  target_date date,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  submitted_at timestamptz,
  closed_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, organization_id),
  foreign key (customer_id, organization_id) references public.customers(id, organization_id) on delete restrict,
  foreign key (primary_contact_id, customer_id, organization_id) references public.customer_contacts(id, customer_id, organization_id) on delete restrict,
  check ((status = 'archived') = (archived_at is not null))
);

create table public.rfq_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  rfq_id uuid not null,
  item_number integer not null check (item_number > 0),
  product_name text not null check (char_length(trim(product_name)) between 1 and 240),
  description text check (description is null or char_length(description) <= 4000),
  specifications text check (specifications is null or char_length(specifications) <= 8000),
  requested_quantity numeric(18,3) not null check (requested_quantity > 0),
  unit text not null check (char_length(trim(unit)) between 1 and 40),
  target_unit_price numeric(18,3) check (target_unit_price is null or target_unit_price >= 0),
  target_currency text check (target_currency is null or target_currency ~ '^[A-Z]{3}$'),
  target_moq numeric(18,3) check (target_moq is null or target_moq > 0),
  target_lead_time_days integer check (target_lead_time_days is null or target_lead_time_days >= 0),
  customization_required boolean not null default false,
  branding_required boolean not null default false,
  packaging_required boolean not null default false,
  sample_required boolean not null default false,
  status public.rfq_item_status not null default 'draft',
  priority public.rfq_priority not null default 'normal',
  customer_notes text check (customer_notes is null or char_length(customer_notes) <= 4000),
  internal_notes text check (internal_notes is null or char_length(internal_notes) <= 4000),
  created_by uuid references public.profiles(id) on delete set null,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (rfq_id, item_number),
  unique (id, rfq_id, organization_id),
  foreign key (rfq_id, organization_id) references public.rfqs(id, organization_id) on delete restrict,
  check ((status = 'archived') = (archived_at is not null))
);

create table public.rfq_attachments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  owner_type public.rfq_attachment_owner_type not null,
  owner_id uuid not null,
  storage_bucket text not null check (storage_bucket ~ '^[a-z0-9][a-z0-9-]{0,62}$'),
  storage_path text not null check (char_length(storage_path) between 1 and 1024 and storage_path !~ '^/'),
  original_filename text not null check (char_length(trim(original_filename)) between 1 and 255),
  content_type text not null check (char_length(trim(content_type)) between 1 and 160),
  file_size bigint not null check (file_size > 0 and file_size <= 104857600),
  visibility public.rfq_visibility not null default 'internal',
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  archived_at timestamptz,
  unique (storage_bucket, storage_path)
);

create or replace function public.assert_rfq_attachment_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.owner_type = 'rfq' and not exists (select 1 from public.rfqs where id = new.owner_id and organization_id = new.organization_id) then
    raise exception 'Attachment RFQ owner is not in the organization';
  end if;
  if new.owner_type = 'rfq_item' and not exists (select 1 from public.rfq_items where id = new.owner_id and organization_id = new.organization_id) then
    raise exception 'Attachment RFQ Item owner is not in the organization';
  end if;
  return new;
end;
$$;
create trigger rfq_attachments_validate_owner before insert or update of owner_type, owner_id, organization_id on public.rfq_attachments for each row execute procedure public.assert_rfq_attachment_owner();

create table public.rfq_activity_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  rfq_id uuid not null,
  rfq_item_id uuid,
  event_type public.rfq_activity_event_type not null,
  title text not null check (char_length(trim(title)) between 1 and 240),
  description text check (description is null or char_length(description) <= 4000),
  visibility public.rfq_visibility not null default 'internal',
  actor_user_id uuid references public.profiles(id) on delete set null,
  metadata jsonb check (metadata is null or octet_length(metadata::text) <= 8192),
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  foreign key (rfq_id, organization_id) references public.rfqs(id, organization_id) on delete restrict,
  foreign key (rfq_item_id, rfq_id, organization_id) references public.rfq_items(id, rfq_id, organization_id) on delete restrict
);

create index rfqs_organization_active_idx on public.rfqs (organization_id, status) where archived_at is null;
create index rfqs_customer_active_idx on public.rfqs (customer_id, created_at desc) where archived_at is null;
create index rfq_items_rfq_active_idx on public.rfq_items (rfq_id, item_number) where archived_at is null;
create index rfq_attachments_owner_active_idx on public.rfq_attachments (owner_type, owner_id) where archived_at is null;
create index rfq_activity_events_rfq_occurred_idx on public.rfq_activity_events (rfq_id, occurred_at desc);

drop trigger if exists rfqs_set_updated_at on public.rfqs;
create trigger rfqs_set_updated_at before update on public.rfqs for each row execute procedure public.set_updated_at();
drop trigger if exists rfq_items_set_updated_at on public.rfq_items;
create trigger rfq_items_set_updated_at before update on public.rfq_items for each row execute procedure public.set_updated_at();

create or replace function public.is_rfq_manager(target_organization_id uuid) returns boolean language sql stable security definer set search_path = public as $$
  select public.has_active_organization_role(target_organization_id, array['owner','admin','operations']::public.app_role[]);
$$;
create or replace function public.is_rfq_reader(target_organization_id uuid) returns boolean language sql stable security definer set search_path = public as $$
  select public.has_active_organization_role(target_organization_id, array['owner','admin','operations','purchasing','inspection','finance']::public.app_role[]);
$$;

-- Customer read paths are security-definer projections; direct table access is staff-only.
create or replace function public.get_my_rfq_workspaces()
returns table (id uuid, public_reference text, title text, description text, status public.rfq_status, priority public.rfq_priority, preferred_currency text, destination_country_code text, destination_city text, target_date date, submitted_at timestamptz, closed_at timestamptz, created_at timestamptz)
language sql stable security definer set search_path = public, auth as $$
  select r.id, r.public_reference, r.title, r.description, r.status, r.priority, r.preferred_currency, r.destination_country_code, r.destination_city, r.target_date, r.submitted_at, r.closed_at, r.created_at
  from public.rfqs r join public.customers c on c.id = r.customer_id and c.organization_id = r.organization_id
  join public.organization_memberships m on m.organization_id = r.organization_id and m.user_id = auth.uid() and m.role = 'customer' and m.status = 'active'
  where c.profile_id = auth.uid() and r.archived_at is null and c.archived_at is null;
$$;
create or replace function public.get_my_rfq_items(target_rfq_id uuid)
returns table (id uuid, item_number integer, product_name text, description text, specifications text, requested_quantity numeric, unit text, target_unit_price numeric, target_currency text, target_moq numeric, target_lead_time_days integer, customization_required boolean, branding_required boolean, packaging_required boolean, sample_required boolean, status public.rfq_item_status, priority public.rfq_priority, customer_notes text, created_at timestamptz)
language sql stable security definer set search_path = public, auth as $$
  select i.id, i.item_number, i.product_name, i.description, i.specifications, i.requested_quantity, i.unit, i.target_unit_price, i.target_currency, i.target_moq, i.target_lead_time_days, i.customization_required, i.branding_required, i.packaging_required, i.sample_required, i.status, i.priority, i.customer_notes, i.created_at
  from public.rfq_items i join public.rfqs r on r.id = i.rfq_id and r.organization_id = i.organization_id join public.customers c on c.id = r.customer_id and c.organization_id = r.organization_id
  join public.organization_memberships m on m.organization_id = r.organization_id and m.user_id = auth.uid() and m.role = 'customer' and m.status = 'active'
  where i.rfq_id = target_rfq_id and i.archived_at is null and r.archived_at is null and c.profile_id = auth.uid();
$$;
create or replace function public.get_my_rfq_attachments(target_rfq_id uuid)
returns table (id uuid, owner_type public.rfq_attachment_owner_type, owner_id uuid, original_filename text, content_type text, file_size bigint, created_at timestamptz)
language sql stable security definer set search_path = public, auth as $$
  select a.id, a.owner_type, a.owner_id, a.original_filename, a.content_type, a.file_size, a.created_at from public.rfq_attachments a join public.rfqs r on (a.owner_type = 'rfq' and a.owner_id = r.id) or (a.owner_type = 'rfq_item' and exists (select 1 from public.rfq_items i where i.id = a.owner_id and i.rfq_id = r.id)) join public.customers c on c.id = r.customer_id and c.organization_id = r.organization_id join public.organization_memberships m on m.organization_id = r.organization_id and m.user_id = auth.uid() and m.role = 'customer' and m.status = 'active' where r.id = target_rfq_id and a.visibility = 'customer' and a.archived_at is null and c.profile_id = auth.uid();
$$;
create or replace function public.get_my_rfq_activity(target_rfq_id uuid)
returns table (id uuid, rfq_item_id uuid, event_type public.rfq_activity_event_type, title text, description text, occurred_at timestamptz)
language sql stable security definer set search_path = public, auth as $$
  select e.id, e.rfq_item_id, e.event_type, e.title, e.description, e.occurred_at from public.rfq_activity_events e join public.rfqs r on r.id = e.rfq_id and r.organization_id = e.organization_id join public.customers c on c.id = r.customer_id and c.organization_id = r.organization_id join public.organization_memberships m on m.organization_id = r.organization_id and m.user_id = auth.uid() and m.role = 'customer' and m.status = 'active' where e.rfq_id = target_rfq_id and e.visibility = 'customer' and c.profile_id = auth.uid();
$$;

alter table public.rfqs enable row level security;
alter table public.rfq_items enable row level security;
alter table public.rfq_attachments enable row level security;
alter table public.rfq_activity_events enable row level security;
revoke all on public.rfqs, public.rfq_items, public.rfq_attachments, public.rfq_activity_events from anon, authenticated;
grant select, insert on public.rfqs, public.rfq_items, public.rfq_attachments, public.rfq_activity_events to authenticated;
grant update (title,description,status,priority,source,preferred_currency,destination_country_code,destination_city,target_date,assigned_to,submitted_at,closed_at,archived_at) on public.rfqs to authenticated;
grant update (product_name,description,specifications,requested_quantity,unit,target_unit_price,target_currency,target_moq,target_lead_time_days,customization_required,branding_required,packaging_required,sample_required,status,priority,customer_notes,internal_notes,archived_at) on public.rfq_items to authenticated;
grant update (visibility,archived_at) on public.rfq_attachments to authenticated;
revoke execute on function public.generate_rfq_public_reference(), public.assert_rfq_attachment_owner(), public.is_rfq_manager(uuid), public.is_rfq_reader(uuid), public.get_my_rfq_workspaces(), public.get_my_rfq_items(uuid), public.get_my_rfq_attachments(uuid), public.get_my_rfq_activity(uuid) from public, anon;
grant execute on function public.get_my_rfq_workspaces(), public.get_my_rfq_items(uuid), public.get_my_rfq_attachments(uuid), public.get_my_rfq_activity(uuid) to authenticated;

create policy "staff read organization rfqs" on public.rfqs for select to authenticated using (public.is_rfq_reader(organization_id));
create policy "managers create organization rfqs" on public.rfqs for insert to authenticated with check (public.is_rfq_manager(organization_id) and created_by = auth.uid());
create policy "managers update organization rfqs" on public.rfqs for update to authenticated using (public.is_rfq_manager(organization_id)) with check (public.is_rfq_manager(organization_id));
create policy "staff read organization rfq items" on public.rfq_items for select to authenticated using (public.is_rfq_reader(organization_id));
create policy "managers create organization rfq items" on public.rfq_items for insert to authenticated with check (public.is_rfq_manager(organization_id) and created_by = auth.uid());
create policy "managers update organization rfq items" on public.rfq_items for update to authenticated using (public.is_rfq_manager(organization_id)) with check (public.is_rfq_manager(organization_id));
create policy "staff read organization rfq attachments" on public.rfq_attachments for select to authenticated using (public.is_rfq_reader(organization_id));
create policy "managers create organization rfq attachments" on public.rfq_attachments for insert to authenticated with check (public.is_rfq_manager(organization_id) and uploaded_by = auth.uid());
create policy "managers update organization rfq attachments" on public.rfq_attachments for update to authenticated using (public.is_rfq_manager(organization_id)) with check (public.is_rfq_manager(organization_id));
create policy "staff read organization rfq activity" on public.rfq_activity_events for select to authenticated using (public.is_rfq_reader(organization_id));
create policy "managers append organization rfq activity" on public.rfq_activity_events for insert to authenticated with check (public.is_rfq_manager(organization_id) and (actor_user_id is null or actor_user_id = auth.uid()));

comment on table public.rfqs is 'V2 operational workspace only; legacy Notion RFQs remain unchanged until a separately approved migration.';
comment on table public.rfq_items is 'Requested-product context for an RFQ; no supplier or product master-data relationship in Sprint 2B.';
comment on table public.rfq_attachments is 'Metadata only. Storage objects and policies are intentionally deferred.';
comment on table public.rfq_activity_events is 'Append-only practical activity timeline. Ordinary clients have no update or delete grant.';
commit;
