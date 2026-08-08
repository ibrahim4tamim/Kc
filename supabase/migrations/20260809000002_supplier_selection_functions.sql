begin;

create or replace function public.record_supplier_selection(
  target_organization_id uuid, target_rfq_id uuid, target_rfq_item_id uuid,
  target_supplier_candidate_id uuid, target_supplier_id uuid, target_quotation_id uuid,
  target_selection_reason text, target_fewer_than_three_justification text,
  allow_replacement boolean
)
returns setof public.supplier_selections language plpgsql security definer set search_path=public,auth as $$
declare
  eligible_count integer;
  had_active boolean;
  created_selection public.supplier_selections;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not public.has_active_organization_role(target_organization_id, array['owner','admin','operations','purchasing']::public.app_role[]) then raise exception 'Supplier selection management role required'; end if;
  if char_length(trim(coalesce(target_selection_reason,''))) = 0 then raise exception 'Selection reason is required'; end if;
  if not exists (select 1 from public.rfq_items i where i.id=target_rfq_item_id and i.organization_id=target_organization_id and i.rfq_id=target_rfq_id and i.archived_at is null) then raise exception 'RFQ item is not an organization-scoped match'; end if;
  if not exists (select 1 from public.supplier_candidates c where c.id=target_supplier_candidate_id and c.organization_id=target_organization_id and c.rfq_item_id=target_rfq_item_id and c.supplier_id=target_supplier_id and c.archived_at is null) then raise exception 'Supplier candidate is not an organization-scoped match'; end if;
  if not exists (select 1 from public.quotations q where q.id=target_quotation_id and q.organization_id=target_organization_id and q.rfq_id=target_rfq_id and q.rfq_item_id=target_rfq_item_id and q.supplier_candidate_id=target_supplier_candidate_id and q.supplier_id=target_supplier_id and q.archived_at is null and q.status in ('received','under_review','accepted') and not exists (select 1 from public.quotations newer where newer.organization_id=q.organization_id and newer.supplier_candidate_id=q.supplier_candidate_id and newer.version_number>q.version_number and newer.archived_at is null)) then raise exception 'Quotation is not the current eligible offer for this supplier candidate'; end if;
  perform pg_advisory_xact_lock(hashtext(target_organization_id::text || ':' || target_rfq_item_id::text));
  select count(*) into eligible_count from public.quotations q where q.organization_id=target_organization_id and q.rfq_item_id=target_rfq_item_id and q.archived_at is null and q.status in ('received','under_review','accepted') and not exists (select 1 from public.quotations newer where newer.organization_id=q.organization_id and newer.supplier_candidate_id=q.supplier_candidate_id and newer.version_number>q.version_number and newer.archived_at is null);
  if eligible_count < 3 and char_length(trim(coalesce(target_fewer_than_three_justification,''))) = 0 then raise exception 'A fewer-than-three quotation justification is required'; end if;
  select exists(select 1 from public.supplier_selections s where s.organization_id=target_organization_id and s.rfq_item_id=target_rfq_item_id and s.status='active') into had_active;
  if had_active and not allow_replacement then raise exception 'An active supplier selection already exists'; end if;
  if had_active then update public.supplier_selections set status='superseded',superseded_at=now() where organization_id=target_organization_id and rfq_item_id=target_rfq_item_id and status='active'; end if;
  insert into public.supplier_selections(organization_id,rfq_id,rfq_item_id,supplier_candidate_id,supplier_id,quotation_id,selected_by_profile_id,selection_reason,fewer_than_three_justification)
  values(target_organization_id,target_rfq_id,target_rfq_item_id,target_supplier_candidate_id,target_supplier_id,target_quotation_id,auth.uid(),trim(target_selection_reason),nullif(trim(coalesce(target_fewer_than_three_justification,'')),'')) returning * into created_selection;
  insert into public.rfq_activity_events(organization_id,rfq_id,rfq_item_id,event_type,title,visibility,actor_user_id,metadata)
  values(target_organization_id,target_rfq_id,target_rfq_item_id,case when had_active then 'supplier_selection_changed'::public.rfq_activity_event_type else 'supplier_selected'::public.rfq_activity_event_type end,case when had_active then 'Supplier selection changed' else 'Supplier selected' end,'internal',auth.uid(),jsonb_build_object('selection_id',created_selection.id,'quotation_id',target_quotation_id,'quotation_count',eligible_count));
  return next created_selection;
end;
$$;

create or replace function public.cancel_supplier_selection(target_organization_id uuid, target_selection_id uuid, target_reason text)
returns setof public.supplier_selections language plpgsql security definer set search_path=public,auth as $$
declare cancelled_selection public.supplier_selections;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not public.has_active_organization_role(target_organization_id, array['owner','admin','operations','purchasing']::public.app_role[]) then raise exception 'Supplier selection management role required'; end if;
  if char_length(trim(coalesce(target_reason,''))) = 0 then raise exception 'Cancellation reason is required'; end if;
  update public.supplier_selections set status='cancelled',cancelled_at=now() where id=target_selection_id and organization_id=target_organization_id and status='active' returning * into cancelled_selection;
  if cancelled_selection.id is null then raise exception 'Active supplier selection was not found'; end if;
  insert into public.rfq_activity_events(organization_id,rfq_id,rfq_item_id,event_type,title,description,visibility,actor_user_id,metadata)
  values(cancelled_selection.organization_id,cancelled_selection.rfq_id,cancelled_selection.rfq_item_id,'supplier_selection_cancelled','Supplier selection cancelled',trim(target_reason),'internal',auth.uid(),jsonb_build_object('selection_id',cancelled_selection.id));
  return next cancelled_selection;
end;
$$;

revoke all on function public.record_supplier_selection(uuid,uuid,uuid,uuid,uuid,uuid,text,text,boolean), public.cancel_supplier_selection(uuid,uuid,text) from public,anon;
grant execute on function public.record_supplier_selection(uuid,uuid,uuid,uuid,uuid,uuid,text,text,boolean), public.cancel_supplier_selection(uuid,uuid,text) to authenticated;

commit;
