begin;

alter type public.rfq_activity_event_type add value if not exists 'quote_comparison_reviewed';
alter type public.rfq_activity_event_type add value if not exists 'supplier_selected';
alter type public.rfq_activity_event_type add value if not exists 'supplier_selection_changed';
alter type public.rfq_activity_event_type add value if not exists 'supplier_selection_cancelled';

commit;
