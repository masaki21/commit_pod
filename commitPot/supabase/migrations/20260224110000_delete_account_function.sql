create or replace function public.delete_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  delete from public.plans where user_id = v_uid;
  delete from public.profiles where user_id = v_uid;
  delete from auth.identities where user_id = v_uid;
  delete from auth.users where id = v_uid;
end;
$$;

revoke all on function public.delete_account() from public;
grant execute on function public.delete_account() to authenticated;
