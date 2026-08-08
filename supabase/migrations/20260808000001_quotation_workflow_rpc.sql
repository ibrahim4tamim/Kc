begin;

alter type public.rfq_attachment_owner_type add value if not exists 'quotation';
alter type public.rfq_activity_event_type add value if not exists 'quotation_received';
alter type public.rfq_activity_event_type add value if not exists 'quotation_revised';
alter type public.rfq_activity_event_type add value if not exists 'quotation_status_changed';

commit;
