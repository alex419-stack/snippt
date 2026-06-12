-- ============================================================
-- Migration 013 — Eigene Position in der Reihe (Kunden-Seite)
-- Liefert dem (anonymen) Kunden seinen eigenen Stand: Status + Platz in der
-- Reihe. Nötig, weil die RLS einem nicht eingeloggten Kunden das direkte Lesen
-- der warteschlange-Zeile verbietet. Wie die übrigen Kundenaktionen als eng
-- begrenzte SECURITY-DEFINER-Funktion, nur über slug + Geräte-Token.
--
-- `dran` = true, sobald der Friseur den Kunden aufgerufen hat (Status
-- 'aufgerufen'). Darüber löst die Kundenseite den „Du bist dran!"-Vollbild aus.
--
-- Additiv & idempotent (create or replace). Keine Datenänderung.
-- ============================================================

create or replace function public.meine_position(p_slug text, p_token text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_friseur_id  uuid;
  v_id          uuid;
  v_status      text;
  v_eingereiht  timestamptz;
  v_position    int;
begin
  select id into v_friseur_id from public.friseur where slug = p_slug;
  if v_friseur_id is null then
    return json_build_object('gefunden', false);
  end if;

  if p_token is null or length(p_token) = 0 then
    return json_build_object('gefunden', false);
  end if;

  -- Aktiven Eintrag dieses Geräts finden (jüngster, falls mehrere Altlasten).
  select id, status, eingereiht_at
    into v_id, v_status, v_eingereiht
  from public.warteschlange
  where friseur_id = v_friseur_id
    and besucher_token = p_token
    and status in ('wartend','unterwegs','da','aufgerufen')
  order by eingereiht_at desc
  limit 1;

  if v_id is null then
    return json_build_object('gefunden', false);
  end if;

  -- Platz = Anzahl der früher Eingereihten + 1.
  select count(*) + 1 into v_position
  from public.warteschlange w
  where w.friseur_id = v_friseur_id
    and w.status in ('wartend','unterwegs','da','aufgerufen')
    and w.eingereiht_at < v_eingereiht;

  return json_build_object(
    'gefunden',  true,
    'status',    v_status,
    'position',  v_position,
    'dran',      v_status = 'aufgerufen'
  );
end;
$$;

revoke all on function public.meine_position(text, text) from public;
grant execute on function public.meine_position(text, text) to anon, authenticated;
