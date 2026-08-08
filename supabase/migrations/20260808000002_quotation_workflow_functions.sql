begin;

create or replace function public.assert_rfq_attachment_owner()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.owner_type='rfq' and not exists(select 1 from public.rfqs where id=new.owner_id and organization_id=new.organization_id) then raise exception 'Attachment RFQ owner is not in organization'; end if;
  if new.owner_type='rfq_item' and not exists(select 1 from public.rfq_items where id=new.owner_id and organization_id=new.organization_id) then raise exception 'Attachment item owner is not in organization'; end if;
  if new.owner_type='supplier_response' and not exists(select 1 from public.supplier_responses where id=new.owner_id and organization_id=new.organization_id) then raise exception 'Attachment response owner is not in organization'; end if;
  if new.owner_type='quotation' and not exists(select 1 from public.quotations where id=new.owner_id and organization_id=new.organization_id and archived_at is null) then raise exception 'Attachment quotation owner is not in organization'; end if;
  return new;
end;
$$;

create or replace function public.create_quotation_revision(
  target_organization_id uuid, target_rfq_id uuid, target_rfq_item_id uuid,
  target_supplier_id uuid, target_supplier_candidate_id uuid, target_quotation_reference text,
  target_status public.quotation_status, target_currency text, target_quotation_date date,
  target_valid_until date, target_payment_terms text, target_incoterm text,
  target_lead_time_days integer, target_moq numeric, target_supplier_notes text,
  target_internal_notes text, target_supplier_request_id uuid, target_supplier_response_id uuid
)
returns setof public.quotations language plpgsql security definer set search_path=public,auth as $$
declare
  next_version integer;
  prior_count integer;
  created_quote public.quotations;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not public.has_active_organization_role(target_organization_id, array['owner','admin','operations','purchasing']::public.app_role[]) then raise exception 'Quotation management role required'; end if;
  if target_status in ('archived','superseded') then raise exception 'A new quotation cannot start archived or superseded'; end if;
  if target_valid_until is not null and target_valid_until < target_quotation_date then raise exception 'Quotation validity date precedes quotation date'; end if;
  if not exists (select 1 from public.supplier_candidates c where c.id=target_supplier_candidate_id and c.organization_id=target_organization_id and c.rfq_item_id=target_rfq_item_id and c.supplier_id=target_supplier_id and c.archived_at is null) then raise exception 'Supplier candidate is not an active organization-scoped match'; end if;
  if not exists (select 1 from public.rfq_items i where i.id=target_rfq_item_id and i.organization_id=target_organization_id and i.rfq_id=target_rfq_id and i.archived_at is null) then raise exception 'RFQ item is not an organization-scoped match'; end if;
  if target_supplier_request_id is not null and not exists(select 1 from public.supplier_requests r where r.id=target_supplier_request_id and r.organization_id=target_organization_id and r.supplier_candidate_id=target_supplier_candidate_id and r.archived_at is null) then raise exception 'Supplier request is not linked to candidate'; end if;
  if target_supplier_response_id is not null and not exists(select 1 from public.supplier_responses r where r.id=target_supplier_response_id and r.organization_id=target_organization_id and (target_supplier_request_id is null or r.supplier_request_id=target_supplier_request_id) and r.archived_at is null) then raise exception 'Supplier response is not linked to request'; end if;
  perform pg_advisory_xact_lock(hashtext(target_supplier_candidate_id::text));
  select count(*), coalesce(max(version_number),0)+1 into prior_count,next_version from public.quotations where supplier_candidate_id=target_supplier_candidate_id and organization_id=target_organization_id;
  update public.quotations set status='superseded' where supplier_candidate_id=target_supplier_candidate_id and organization_id=target_organization_id and archived_at is null and status in ('draft','received','under_review');
  insert into public.quotations(organization_id,rfq_id,rfq_item_id,supplier_id,supplier_candidate_id,supplier_request_id,supplier_response_id,quotation_reference,version_number,status,currency,quotation_date,valid_until,payment_terms,incoterm,lead_time_days,moq,supplier_notes,internal_notes)
  values(target_organization_id,target_rfq_id,target_rfq_item_id,target_supplier_id,target_supplier_candidate_id,target_supplier_request_id,target_supplier_response_id,target_quotation_reference,next_version,target_status,target_currency,target_quotation_date,target_valid_until,target_payment_terms,target_incoterm,target_lead_time_days,target_moq,target_supplier_notes,target_internal_notes)
  returning * into created_quote;
  insert into public.rfq_activity_events(organization_id,rfq_id,rfq_item_id,event_type,title,visibility,actor_user_id,metadata)
  values(target_organization_id,target_rfq_id,target_rfq_item_id,case when prior_count=0 then 'quotation_received'::public.rfq_activity_event_type else 'quotation_revised'::public.rfq_activity_event_type end,case when prior_count=0 then 'Quotation received' else 'Quotation revised' end,'internal',auth.uid(),jsonb_build_object('quotation_id',created_quote.id,'version_number',next_version));
  return next created_quote;
end;
$$;

create or replace function public.append_quotation_status_activity()
returns trigger language plpgsql security definer set search_path=public,auth as $$
begin
  if new.status is distinct from old.status and new.status not in ('superseded') then
    insert into public.rfq_activity_events(organization_id,rfq_id,rfq_item_id,event_type,title,visibility,actor_user_id,metadata)
    values(new.organization_id,new.rfq_id,new.rfq_item_id,'quotation_status_changed','Quotation status changed','internal',auth.uid(),jsonb_build_object('quotation_id',new.id,'status',new.status));
  end if;
  return new;
end;
$$;
create or replace function public.assert_quotation_mutation()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.organization_id is distinct from old.organization_id or new.rfq_id is distinct from old.rfq_id or new.rfq_item_id is distinct from old.rfq_item_id or new.supplier_id is distinct from old.supplier_id or new.supplier_candidate_id is distinct from old.supplier_candidate_id or new.version_number is distinct from old.version_number then raise exception 'Quotation identity and version are immutable'; end if;
  if old.status in ('accepted','rejected','archived') and new is distinct from old then raise exception 'A decided or archived quotation is immutable'; end if;
  if new.status = 'superseded' and old.status not in ('draft','received','under_review') then raise exception 'Only an active quotation can be superseded'; end if;
  if new.status = 'accepted' and old.status not in ('received','under_review') then raise exception 'Quotation must be received or under review before acceptance'; end if;
  if new.status = 'rejected' and old.status not in ('draft','received','under_review') then raise exception 'Only an active quotation can be rejected'; end if;
  if new.status = 'under_review' and old.status not in ('draft','received') then raise exception 'Quotation must be active before review'; end if;
  if new.status = 'received' and old.status <> 'draft' then raise exception 'Only draft quotations can be received'; end if;
  if new.status = 'archived' and new.archived_at is null then raise exception 'Archived quotation requires archived timestamp'; end if;
  return new;
end;
$$;
create trigger quotations_validate_mutation before update on public.quotations for each row execute procedure public.assert_quotation_mutation();

create or replace function public.assert_quotation_item_owner()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if not exists(select 1 from public.quotations q where q.id=new.quotation_id and q.organization_id=new.organization_id and q.rfq_item_id=new.rfq_item_id and q.archived_at is null and q.status not in ('accepted','rejected','superseded')) then raise exception 'Quotation item must belong to an editable organization-scoped quotation'; end if;
  return new;
end;
$$;
create trigger quotation_items_validate_owner before insert or update on public.quotation_items for each row execute procedure public.assert_quotation_item_owner();
create trigger quotation_status_activity_after_update after update of status on public.quotations for each row execute procedure public.append_quotation_status_activity();

revoke all on function public.create_quotation_revision(uuid,uuid,uuid,uuid,uuid,text,public.quotation_status,text,date,date,text,text,integer,numeric,text,text,uuid,uuid) from public,anon;
grant execute on function public.create_quotation_revision(uuid,uuid,uuid,uuid,uuid,text,public.quotation_status,text,date,date,text,text,integer,numeric,text,text,uuid,uuid) to authenticated;

commit;
