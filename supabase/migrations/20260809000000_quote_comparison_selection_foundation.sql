begin;

do $$ begin
  create type public.supplier_selection_status as enum ('active','superseded','cancelled','archived');
exception when duplicate_object then null;
end $$;

create table public.supplier_selections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  rfq_id uuid not null,
  rfq_item_id uuid not null,
  supplier_candidate_id uuid not null,
  supplier_id uuid not null,
  quotation_id uuid not null,
  selected_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  selected_at timestamptz not null default now(),
  selection_reason text not null check (char_length(trim(selection_reason)) between 1 and 4000),
  fewer_than_three_justification text check (fewer_than_three_justification is null or char_length(trim(fewer_than_three_justification)) between 1 and 4000),
  status public.supplier_selection_status not null default 'active',
  superseded_at timestamptz,
  cancelled_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, organization_id),
  foreign key (rfq_item_id, organization_id) references public.rfq_items(id, organization_id),
  foreign key (supplier_candidate_id, organization_id) references public.supplier_candidates(id, organization_id),
  foreign key (supplier_id, organization_id) references public.suppliers(id, organization_id),
  foreign key (quotation_id, organization_id) references public.quotations(id, organization_id),
  check ((status = 'superseded') = (superseded_at is not null)),
  check ((status = 'cancelled') = (cancelled_at is not null)),
  check ((status = 'archived') = (archived_at is not null))
);

create unique index supplier_selections_one_active_per_item
  on public.supplier_selections (organization_id, rfq_item_id) where status = 'active';
create index supplier_selections_item_history_idx on public.supplier_selections (organization_id, rfq_item_id, selected_at desc);
create trigger supplier_selections_updated before update on public.supplier_selections for each row execute procedure public.set_updated_at();

create or replace function public.is_supplier_selection_manager(org uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select public.has_active_organization_role(org, array['owner','admin','operations','purchasing']::public.app_role[])
$$;
create or replace function public.is_supplier_selection_reader(org uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select public.has_active_organization_role(org, array['owner','admin','operations','purchasing','inspection','finance']::public.app_role[])
$$;

alter table public.supplier_selections enable row level security;
revoke all on public.supplier_selections from anon, authenticated;
grant select on public.supplier_selections to authenticated;
create policy "supplier selection read" on public.supplier_selections for select to authenticated using (public.is_supplier_selection_reader(organization_id));

commit;
