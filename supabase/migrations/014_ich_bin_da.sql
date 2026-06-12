-- ============================================================
-- Migration 014 — „Ich bin da" + Entfernen des alten Geheim-Code-Checkins
-- ------------------------------------------------------------
-- Modell-Klarstellung 2026-06-12: Der QR ist die dauerhafte Eintrittstür zum
-- Friseur (ein Scan, dann gespeichert). Es gibt KEIN zweites Scannen mit
-- Geheim-Code. „Angekommen" meldet man per einfachem Schalter:
--   - Friseur per Dashboard-Tipp (Server-Action, kein DB-Neuland)
--   - Kunde per RPC ich_bin_da auf seiner Friseur-Seite
--
-- Entfernt zugleich die Pre-Pivot-Altlast: RPC einchecken + Spalte checkin_code.
-- (011/012 erwähnen beides nur in Kommentaren, kein echter SQL-Bezug.)
-- ============================================================

-- 1. Kunde meldet sich selbst als „da". Eng begrenzt, anon-fähig (wie anstellen).
--    Rührt 'aufgerufen'/'fertig' NICHT an (Aufruf-Ablauf bleibt intakt).
create or replace function public.ich_bin_da(p_slug text, p_token text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_friseur_id uuid;
  v_id         uuid;
begin
  select id into v_friseur_id from public.friseur where slug = p_slug;
  if v_friseur_id is null then
    return json_build_object('gefunden', false);
  end if;

  if p_token is null or length(p_token) = 0 then
    return json_build_object('gefunden', false);
  end if;

  select id into v_id
  from public.warteschlange
  where friseur_id = v_friseur_id
    and besucher_token = p_token
    and status in ('wartend','unterwegs','da')
  order by eingereiht_at desc
  limit 1;

  if v_id is null then
    return json_build_object('gefunden', false);
  end if;

  update public.warteschlange set status = 'da' where id = v_id;
  return json_build_object('gefunden', true, 'status', 'da');
end;
$$;

revoke all on function public.ich_bin_da(text, text) from public;
grant execute on function public.ich_bin_da(text, text) to anon, authenticated;

-- 2. Alten Geheim-Code-Checkin entfernen
drop function if exists public.einchecken(text, text, text, text);
alter table public.friseur drop column if exists checkin_code;
