-- Trigger-Funktion: läuft mit Superuser-Rechten (SECURITY DEFINER),
-- damit RLS den Insert nicht blockiert bevor die Session vollständig etabliert ist.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_slug text;
  v_email_prefix text;
begin
  v_email_prefix := split_part(new.email, '@', 1);

  v_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    v_email_prefix
  );

  v_slug := coalesce(
    nullif(trim(new.raw_user_meta_data->>'slug'), ''),
    lower(regexp_replace(v_email_prefix, '[^a-z0-9-]', '-', 'g'))
  );

  insert into public.friseur (user_id, name, slug)
  values (new.id, v_name, v_slug);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
