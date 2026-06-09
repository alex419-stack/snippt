-- ============================================================
-- Migration 008 — Stempelkarte wirklich nutzbar machen
-- Beim Anstellen wird ein Kunde (Soft-Account per Geräte-Token) angelegt/erkannt
-- und mit dem Warteschlangen-Eintrag verknüpft. So kann beim Abschließen
-- (fertigNaechster) automatisch ein Stempel vergeben werden.
-- Zusätzlich: Funktion für den eigenen Stempelstand (Kunden-Seite).
-- ============================================================

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
  v_kunde_id   uuid;
  v_eintrag_id uuid;
  v_position   int;
begin
  select id into v_friseur_id from public.friseur where slug = p_slug;
  if v_friseur_id is null then
    raise exception 'Friseur nicht gefunden';
  end if;

  -- Kunde per Token finden oder anlegen (Soft-Account, Wiedererkennung)
  if p_token is not null and length(p_token) > 0 then
    select id into v_kunde_id from public.kunde
    where friseur_id = v_friseur_id and besucher_token = p_token;

    if v_kunde_id is null then
      insert into public.kunde (friseur_id, name, telefon, besucher_token, letzter_besuch_at)
      values (v_friseur_id, coalesce(nullif(trim(p_name), ''), 'Gast'),
              nullif(trim(p_telefon), ''), p_token, now())
      returning id into v_kunde_id;
    else
      update public.kunde set
        letzter_besuch_at = now(),
        name    = coalesce(nullif(trim(p_name), ''), name),
        telefon = coalesce(nullif(trim(p_telefon), ''), telefon)
      where id = v_kunde_id;
    end if;
  end if;

  -- Schon in der aktiven Reihe? Dann nicht doppelt einreihen.
  select id into v_eintrag_id
  from public.warteschlange
  where friseur_id = v_friseur_id
    and besucher_token = p_token
    and status in ('wartend','unterwegs','da','aufgerufen')
  limit 1;

  if v_eintrag_id is null then
    insert into public.warteschlange (friseur_id, kunde_id, besucher_token, gast_name, gast_telefon, status)
    values (v_friseur_id, v_kunde_id, p_token, nullif(trim(p_name), ''), nullif(trim(p_telefon), ''), 'wartend')
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

-- Eigener Stempelstand (nicht eingelöste Stempel) für die Kunden-Seite
create or replace function public.mein_stempelstand(p_slug text, p_token text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_friseur_id uuid;
  v_ziel       int;
  v_belohnung  text;
  v_kunde_id   uuid;
  v_anzahl     int := 0;
begin
  select id, stempel_anzahl, stempel_belohnung
    into v_friseur_id, v_ziel, v_belohnung
  from public.friseur where slug = p_slug;
  if v_friseur_id is null then
    return json_build_object('gefunden', false);
  end if;

  if p_token is not null and length(p_token) > 0 then
    select id into v_kunde_id from public.kunde
    where friseur_id = v_friseur_id and besucher_token = p_token;
    if v_kunde_id is not null then
      select count(*) into v_anzahl from public.stempel
      where kunde_id = v_kunde_id and eingeloest_at is null;
    end if;
  end if;

  return json_build_object('gefunden', true, 'stempel', v_anzahl,
                           'ziel', coalesce(v_ziel, 10), 'belohnung', coalesce(v_belohnung, '1 Schnitt gratis'));
end;
$$;
revoke all on function public.mein_stempelstand(text, text) from public;
grant execute on function public.mein_stempelstand(text, text) to anon, authenticated;
