-- ============================================================
-- Migration 004 — Öffentliche Kundenaktionen via kontrollierte RPC-Funktionen
-- (SECURITY DEFINER, eng begrenzt). So braucht die Kundenseite keinen direkten
-- Tabellen-Schreibzugriff und keinen Service-Role-Key — der Eintrag entsteht nur
-- über diese geprüften Funktionen.
-- ============================================================

-- Kunde stellt sich bei einem Friseur (per slug) an. Idempotent je besucher_token:
-- wer schon in der aktiven Reihe steht, wird nicht doppelt eingereiht.
create or replace function public.anstellen(
  p_slug    text,
  p_name    text,
  p_telefon text,
  p_token   text
) returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_friseur_id uuid;
  v_eintrag_id uuid;
  v_position   int;
begin
  select id into v_friseur_id from public.friseur where slug = p_slug;
  if v_friseur_id is null then
    raise exception 'Friseur nicht gefunden';
  end if;

  select id into v_eintrag_id
  from public.warteschlange
  where friseur_id = v_friseur_id
    and besucher_token = p_token
    and status in ('wartend','unterwegs','da','aufgerufen')
  limit 1;

  if v_eintrag_id is null then
    insert into public.warteschlange (friseur_id, besucher_token, gast_name, gast_telefon, status)
    values (v_friseur_id, p_token, nullif(trim(p_name), ''), nullif(trim(p_telefon), ''), 'wartend')
    returning id into v_eintrag_id;
  end if;

  select count(*) + 1 into v_position
  from public.warteschlange w
  where w.friseur_id = v_friseur_id
    and w.status in ('wartend','unterwegs','da','aufgerufen')
    and w.eingereiht_at < (select eingereiht_at from public.warteschlange where id = v_eintrag_id);

  return json_build_object('eintrag_id', v_eintrag_id, 'position', v_position);
end;
$$;

revoke all on function public.anstellen(text, text, text, text) from public;
grant execute on function public.anstellen(text, text, text, text) to anon, authenticated;

-- Status für die Anzeige auf der öffentlichen Profilseite: wie viele warten +
-- grobe Wartezeit (Anzahl × Standard-Schnittdauer des Friseurs).
create or replace function public.warteschlange_status(p_slug text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_friseur_id uuid;
  v_slot       int;
  v_total      int;
begin
  select id, coalesce(slot_minuten, 30) into v_friseur_id, v_slot
  from public.friseur where slug = p_slug;

  if v_friseur_id is null then
    return json_build_object('gefunden', false);
  end if;

  select count(*) into v_total
  from public.warteschlange
  where friseur_id = v_friseur_id
    and status in ('wartend','unterwegs','da','aufgerufen');

  return json_build_object(
    'gefunden', true,
    'wartende', v_total,
    'wartezeit_min', v_total * v_slot
  );
end;
$$;

revoke all on function public.warteschlange_status(text) from public;
grant execute on function public.warteschlange_status(text) to anon, authenticated;
