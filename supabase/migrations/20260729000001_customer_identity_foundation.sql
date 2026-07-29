-- KC Platform V2 Foundation Sprint 1C
-- Customer memberships are created only after Supabase confirms the user's email.

begin;

create or replace function public.handle_verified_customer()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  platform_organization_id uuid;
begin
  if new.email_confirmed_at is null then
    return new;
  end if;

  insert into public.profiles (id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;

  select id into platform_organization_id
  from public.organizations
  where slug = 'kawalis-china'
    and status = 'active';

  -- The owner bootstrap creates this organization first. A missing platform
  -- organization deliberately grants no membership rather than guessing a tenant.
  if platform_organization_id is null then
    return new;
  end if;

  -- A conflict is deliberately left unchanged: this can never overwrite a staff
  -- membership, reactivate a suspended membership, or assign an internal role.
  insert into public.organization_memberships (organization_id, user_id, role, status)
  values (platform_organization_id, new.id, 'customer', 'active')
  on conflict (organization_id, user_id) do nothing;

  return new;
end;
$$;

revoke execute on function public.handle_verified_customer() from public, anon, authenticated;

drop trigger if exists on_customer_email_verified on auth.users;
create trigger on_customer_email_verified
after insert or update of email_confirmed_at on auth.users
for each row execute procedure public.handle_verified_customer();

comment on function public.handle_verified_customer() is
  'Creates an idempotent customer membership only after verified Supabase Auth email; existing memberships are never changed.';

commit;
