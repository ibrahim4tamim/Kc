-- This migration intentionally precedes the request/response tables. PostgreSQL
-- must commit new enum values before later migrations use those values in SQL.
alter type public.rfq_attachment_owner_type add value if not exists 'supplier_response';
alter type public.rfq_activity_event_type add value if not exists 'supplier_request_created';
alter type public.rfq_activity_event_type add value if not exists 'supplier_request_sent';
alter type public.rfq_activity_event_type add value if not exists 'supplier_response_received';
alter type public.rfq_activity_event_type add value if not exists 'supplier_request_completed';
alter type public.rfq_activity_event_type add value if not exists 'supplier_request_cancelled';
