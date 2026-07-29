-- KC Platform V2 owner bootstrap (privileged operator only)
-- This script must be run once in a reviewed non-production environment first.
-- It requires a database-admin connection; normal authenticated/anonymous clients
-- cannot execute public.bootstrap_initial_owner.

begin;

select public.bootstrap_initial_owner(
  :'target_user_id'::uuid,
  :'organization_name'::text,
  :'organization_slug'::text
);

commit;
