-- ============================================================
-- Migration 007 — Termin-Modus (Variante A: Friseur arbeitet ENTWEDER
-- mit Warteschlange ODER mit festen Terminen).
-- Nutzt die bestehende termin-Tabelle wieder.
-- ============================================================

alter table public.friseur
  add column if not exists modus text not null default 'warteschlange'
    check (modus in ('warteschlange', 'termine')),
  add column if not exists oeffnet   time,   -- z.B. 09:00; NULL => Default im App-Code (09:00)
  add column if not exists schliesst time;   -- z.B. 18:00; NULL => Default im App-Code (18:00)

alter table public.termin
  add column if not exists gast_name      text,
  add column if not exists gast_telefon   text,
  add column if not exists besucher_token text;

create index if not exists termin_friseur_datum_idx on public.termin(friseur_id, datum);

-- Belegte Start-Zeiten eines Tages (nur Zeiten, keine Kundendaten) — für freie Slots
create or replace function public.gebuchte_zeiten(p_slug text, p_tag date)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_friseur_id uuid;
  v_zeiten json;
begin
  select id into v_friseur_id from public.friseur where slug = p_slug;
  if v_friseur_id is null then
    return json_build_array();
  end if;

  select coalesce(json_agg(datum order by datum), '[]'::json) into v_zeiten
  from public.termin
  where friseur_id = v_friseur_id
    and status <> 'abgesagt'
    and datum::date = p_tag;

  return v_zeiten;
end;
$$;
revoke all on function public.gebuchte_zeiten(text, date) from public;
grant execute on function public.gebuchte_zeiten(text, date) to anon, authenticated;

-- Termin buchen (anon, kontrolliert) — nur wenn der Slot noch frei ist
create or replace function public.termin_buchen(
  p_slug    text,
  p_datum   timestamptz,
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
  v_dauer      int;
  v_termin_id  uuid;
begin
  select id, coalesce(slot_minuten, 30) into v_friseur_id, v_dauer
  from public.friseur where slug = p_slug;
  if v_friseur_id is null then
    raise exception 'Friseur nicht gefunden';
  end if;

  if exists (
    select 1 from public.termin
    where friseur_id = v_friseur_id and datum = p_datum and status <> 'abgesagt'
  ) then
    return json_build_object('ok', false, 'grund', 'belegt');
  end if;

  insert into public.termin (friseur_id, datum, dauer_min, status, gast_name, gast_telefon, besucher_token)
  values (v_friseur_id, p_datum, v_dauer, 'bestaetigt',
          nullif(trim(p_name), ''), nullif(trim(p_telefon), ''), p_token)
  returning id into v_termin_id;

  return json_build_object('ok', true, 'termin_id', v_termin_id);
end;
$$;
revoke all on function public.termin_buchen(text, timestamptz, text, text, text) from public;
grant execute on function public.termin_buchen(text, timestamptz, text, text, text) to anon, authenticated;
