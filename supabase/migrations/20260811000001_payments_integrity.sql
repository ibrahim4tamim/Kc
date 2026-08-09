begin;
alter type public.rfq_attachment_owner_type add value if not exists 'payment_record';
alter type public.rfq_activity_event_type add value if not exists 'payment_schedule_created';alter type public.rfq_activity_event_type add value if not exists 'payment_recorded';alter type public.rfq_activity_event_type add value if not exists 'payment_partially_completed';alter type public.rfq_activity_event_type add value if not exists 'payment_completed';
create or replace function public.assert_payment_record() returns trigger language plpgsql security definer set search_path=public as $$begin
 if not exists(select 1 from public.purchase_orders p where p.id=new.purchase_order_id and p.organization_id=new.organization_id and p.supplier_id=new.supplier_id and p.currency=new.currency and p.status in ('approved','issued','acknowledged') and p.archived_at is null) then raise exception 'Payment must match an eligible PO supplier and currency'; end if;
 if new.payment_schedule_id is not null and not exists(select 1 from public.payment_schedules s where s.id=new.payment_schedule_id and s.organization_id=new.organization_id and s.purchase_order_id=new.purchase_order_id and s.currency=new.currency and s.archived_at is null) then raise exception 'Payment schedule is inconsistent'; end if; return new;end;$$;
create trigger payment_records_validate before insert or update on public.payment_records for each row execute procedure public.assert_payment_record();
create or replace function public.assert_payment_schedule() returns trigger language plpgsql security definer set search_path=public as $$begin
 if not exists(select 1 from public.purchase_orders p where p.id=new.purchase_order_id and p.organization_id=new.organization_id and p.currency=new.currency and p.status in ('approved','issued','acknowledged') and p.archived_at is null) then raise exception 'Payment schedule must match an eligible PO and currency'; end if;
 return new;
end;$$;
create trigger payment_schedules_validate before insert or update on public.payment_schedules for each row execute procedure public.assert_payment_schedule();
create or replace function public.assert_rfq_attachment_owner() returns trigger language plpgsql security definer set search_path=public as $$ begin
 if new.owner_type='rfq' and not exists(select 1 from public.rfqs where id=new.owner_id and organization_id=new.organization_id) then raise exception 'Attachment RFQ owner is not in organization'; end if;
 if new.owner_type='rfq_item' and not exists(select 1 from public.rfq_items where id=new.owner_id and organization_id=new.organization_id) then raise exception 'Attachment item owner is not in organization'; end if;
 if new.owner_type='supplier_response' and not exists(select 1 from public.supplier_responses where id=new.owner_id and organization_id=new.organization_id) then raise exception 'Attachment response owner is not in organization'; end if;
 if new.owner_type='quotation' and not exists(select 1 from public.quotations where id=new.owner_id and organization_id=new.organization_id and archived_at is null) then raise exception 'Attachment quotation owner is not in organization'; end if;
 if new.owner_type='purchase_order' and not exists(select 1 from public.purchase_orders where id=new.owner_id and organization_id=new.organization_id and archived_at is null) then raise exception 'Attachment purchase order owner is not in organization'; end if;
 if new.owner_type='payment_record' and not exists(select 1 from public.payment_records where id=new.owner_id and organization_id=new.organization_id and archived_at is null) then raise exception 'Attachment payment record owner is not in organization'; end if;
 return new;
end; $$;
commit;
