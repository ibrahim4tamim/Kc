begin;
alter type public.rfq_attachment_owner_type add value if not exists 'purchase_order';
alter type public.rfq_activity_event_type add value if not exists 'purchase_order_created';
alter type public.rfq_activity_event_type add value if not exists 'purchase_order_approved';
alter type public.rfq_activity_event_type add value if not exists 'purchase_order_issued';
alter type public.rfq_activity_event_type add value if not exists 'purchase_order_revised';
alter type public.rfq_activity_event_type add value if not exists 'purchase_order_cancelled';
commit;
