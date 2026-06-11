-- ============================================================
-- Migration 010 — "Bin da" per QR-Scan im Laden
-- Kern-Mechanik gegen Vordrängeln (Spec 2026-06-09): Der Status "da" darf
-- NUR vor Ort gesetzt werden, nicht von zu Hause. Umgesetzt über einen
-- geheimen Code pro Friseur, der physisch im Laden auf dem QR-Schild steht.
-- Wer den Code hat (= wer den QR im Laden scannt), kann sich auf "da" setzen.
--
-- Additiv & idempotent.
-- ============================================================

-- ============================================================
-- 1. FRISEUR: geheimer Check-in-Code
-- Volatiler Default -> jeder bestehende und neue Friseur bekommt einen
-- eigenen, zufälligen Code (10 Zeichen aus einer UUID).
-- ============================================================
alter table public.friseur
  add column if not exists checkin_code text not null
  default substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);

-- ============================================================
-- 2. RPC einchecken() — setzt "da" nur bei gültigem Code
-- Schon in der Reihe  -> Status auf "da".
-- Noch nicht da        -> als Walk-In direkt mit Status "da" einreihen.
-- ============================================================
create or replace function public.einchecken(
  p_slug  text,
  p_token text,
  p_code  text,
  p_name  text default null
) returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_friseur_id uuid;
  v_code       text;
  v_kunde_id   uuid;
  v_eintrag_id uuid;
  v_position   int;
begin
  select id, checkin_code into v_friseur_id, v_code
  from public.friseur where slug = p_slug;
  if v_friseur_id is null then
    return json_build_object('ok', false, 'grund', 'friseur_unbekannt');
  end if;

  -- Geheim-Code muss stimmen (nur per QR im Laden verfügbar)
  if v_code is null or p_code is null or p_code <> v_code then
    return json_build_object('ok', false, 'grund', 'code_ungueltig');
  end if;

  if p_token is null or length(p_token) = 0 then
    return json_build_object('ok', false, 'grund', 'kein_token');
  end if;

  -- Kunde finden/anlegen (Soft-Account per Geräte-Token)
  select id into v_kunde_id from public.kunde
  where friseur_id = v_friseur_id and besucher_token = p_token;
  if v_kunde_id is null then
    insert into public.kunde (friseur_id, name, besucher_token, letzter_besuch_at)
    values (v_friseur_id, coalesce(nullif(trim(p_name), ''), 'Gast'), p_token, now())
    returning id into v_kunde_id;
  else
    update public.kunde set
      letzter_besuch_at = now(),
      name = coalesce(nullif(trim(p_name), ''), name)
    where id = v_kunde_id;
  end if;

  -- Aktiven Eintrag dieses Geräts finden
  select id into v_eintrag_id
  from public.warteschlange
  where friseur_id = v_friseur_id
    and besucher_token = p_token
    and status in ('wartend','unterwegs','da','aufgerufen')
  limit 1;

  if v_eintrag_id is null then
    -- Noch nicht in der Reihe -> direkt als "da" einreihen (Walk-In)
    insert into public.warteschlange (friseur_id, kunde_id, besucher_token, gast_name, status)
    values (v_friseur_id, v_kunde_id, p_token, nullif(trim(p_name), ''), 'da')
    returning id into v_eintrag_id;
  else
    -- Schon in der Reihe -> auf "da" setzen und Kunde verknüpfen
    update public.warteschlange
    set status = 'da', kunde_id = coalesce(kunde_id, v_kunde_id)
    where id = v_eintrag_id
      and status in ('wartend','unterwegs','aufgerufen');
  end if;

  select count(*) + 1 into v_position
  from public.warteschlange w
  where w.friseur_id = v_friseur_id
    and w.status in ('wartend','unterwegs','da','aufgerufen')
    and w.eingereiht_at < (select eingereiht_at from public.warteschlange where id = v_eintrag_id);

  return json_build_object('ok', true, 'eintrag_id', v_eintrag_id, 'position', v_position);
end;
$$;
revoke all on function public.einchecken(text, text, text, text) from public;
grant execute on function public.einchecken(text, text, text, text) to anon, authenticated;

-- ============================================================
-- VERIFIKATION (nach dem Anwenden manuell)
-- ------------------------------------------------------------
-- a) Jeder friseur hat einen checkin_code (10 Zeichen, nicht NULL).
-- b) einchecken(slug, token, FALSCHER_code) -> {ok:false, grund:'code_ungueltig'}.
-- c) einchecken(slug, token, richtiger_code) -> {ok:true, position:n}; Eintrag-Status='da'.
-- ============================================================
