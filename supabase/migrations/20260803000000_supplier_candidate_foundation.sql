-- KC Platform V2 Sprint 2D: supplier candidates only; no quotation or communication workflow.
begin;
do $$ begin create type public.supplier_candidate_status as enum ('proposed','contacted','responding','quoted','shortlisted','rejected','selected','archived'); exception when duplicate_object then null; end $$;
create table public.supplier_candidates (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete restrict, rfq_item_id uuid not null, supplier_id uuid not null, candidate_status public.supplier_candidate_status not null default 'proposed', assigned_to_profile_id uuid references public.profiles(id) on delete set null, internal_notes text check(internal_notes is null or char_length(internal_notes)<=4000), archived_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 foreign key(rfq_item_id,organization_id) references public.rfq_items(id,organization_id) on delete restrict, foreign key(supplier_id,organization_id) references public.suppliers(id,organization_id) on delete restrict, check((candidate_status='archived')=(archived_at is not null))
);
create unique index supplier_candidates_active_unique_idx on public.supplier_candidates(organization_id,rfq_item_id,supplier_id) where archived_at is null;
create index supplier_candidates_item_active_idx on public.supplier_candidates(rfq_item_id) where archived_at is null;
create trigger supplier_candidates_set_updated_at before update on public.supplier_candidates for each row execute procedure public.set_updated_at();
create or replace function public.is_supplier_candidate_manager(org uuid) returns boolean language sql stable security definer set search_path=public as $$select public.has_active_organization_role(org,array['owner','admin','operations','purchasing']::public.app_role[])$$;
create or replace function public.is_supplier_candidate_reader(org uuid) returns boolean language sql stable security definer set search_path=public as $$select public.has_active_organization_role(org,array['owner','admin','operations','purchasing','inspection','finance']::public.app_role[])$$;
alter table public.supplier_candidates enable row level security;
revoke all on public.supplier_candidates from anon,authenticated; grant select,insert,update on public.supplier_candidates to authenticated;
create policy "candidate read" on public.supplier_candidates for select to authenticated using(public.is_supplier_candidate_reader(organization_id));
create policy "candidate insert" on public.supplier_candidates for insert to authenticated with check(public.is_supplier_candidate_manager(organization_id));
create policy "candidate update" on public.supplier_candidates for update to authenticated using(public.is_supplier_candidate_manager(organization_id)) with check(public.is_supplier_candidate_manager(organization_id));
comment on table public.supplier_candidates is 'One supplier considered for one RFQ Item; not a quotation, supplier request, communication, or evaluation.';
commit;
