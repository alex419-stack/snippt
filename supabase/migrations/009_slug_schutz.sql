-- ============================================================
-- Migration 009 — Slug-Schutz (KNOWN_ISSUES #2)
-- Sichert die öffentliche Friseur-Adresse (slug) auf DB-Ebene ab:
--   1. Format-Regel (nur a-z, 0-9, Bindestrich; 2–32 Zeichen; nicht am Rand "-")
--   2. Sperrliste reservierter Pfade (kollidieren sonst mit echten Routen)
--   3. Auto-Trigger robuster: erzeugt nie einen ungültigen/kollidierenden slug
--
-- Bisher wurde nur client-seitig im Registrierungsformular geprüft. Wer das
-- Formular umgeht (direkter API-Zugriff), konnte z.B. "demo" oder "login" als
-- Adresse anlegen und damit echte App-Routen überlagern.
--
-- Additiv & idempotent (drop ... if exists / create or replace).
-- Bestehende Test-Slugs ("test-url", "testurl") bleiben gültig.
-- ============================================================

-- ============================================================
-- 1. Reservierte Slugs als zentrale, wiederverwendbare Funktion
-- Hält die Sperrliste an EINER Stelle (auch vom Trigger genutzt).
-- ============================================================
create or replace function public.is_slug_reserved(p_slug text)
returns boolean
language sql
immutable
as $$
  select lower(p_slug) = any (array[
    'login','register','auth','dashboard','demo','api','admin','settings',
    'profile','help','about','contact','pricing','terms','privacy','imprint',
    'manifest','icon','apple-icon','favicon','robots','sitemap','sw',
    'service-worker','_next','static','public','app','snippt'
  ]);
$$;

-- ============================================================
-- 2. CHECK-Constraints auf friseur.slug
-- ============================================================
alter table public.friseur drop constraint if exists friseur_slug_format;
alter table public.friseur
  add constraint friseur_slug_format
  check (slug ~ '^[a-z0-9][a-z0-9-]{0,30}[a-z0-9]$');

alter table public.friseur drop constraint if exists friseur_slug_not_reserved;
alter table public.friseur
  add constraint friseur_slug_not_reserved
  check (not public.is_slug_reserved(slug));

-- ============================================================
-- 3. Auth-Trigger robuster machen
-- Säubert den gewünschten/abgeleiteten slug und vergibt bei Kollision oder
-- reserviertem/ungültigem Wert automatisch einen eindeutigen Fallback.
-- Verhindert, dass die CHECK-Constraints den signUp mit kryptischem
-- Datenbankfehler abbrechen lassen.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name         text;
  v_base         text;
  v_slug         text;
  v_email_prefix text;
begin
  v_email_prefix := split_part(new.email, '@', 1);

  v_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    v_email_prefix
  );

  -- Wunsch-Slug aus Metadaten, sonst aus E-Mail-Präfix ableiten
  v_base := coalesce(
    nullif(trim(new.raw_user_meta_data->>'slug'), ''),
    v_email_prefix
  );

  -- Säubern: kleinschreiben, nur a-z/0-9/-, Mehrfach- und Rand-Bindestriche weg
  v_base := lower(v_base);
  v_base := regexp_replace(v_base, '[^a-z0-9-]', '-', 'g');
  v_base := regexp_replace(v_base, '-+', '-', 'g');
  v_base := trim(both '-' from v_base);

  -- Mindestlänge absichern
  if length(v_base) < 2 then
    v_base := 'friseur';
  end if;
  -- Maximallänge begrenzen (Platz für Suffix lassen)
  v_base := left(v_base, 24);

  v_slug := v_base;

  -- Kollision mit reserviertem oder bereits vergebenem slug -> eindeutiger Suffix
  if public.is_slug_reserved(v_slug)
     or exists (select 1 from public.friseur where slug = v_slug) then
    v_slug := v_base || '-' || substr(md5(new.id::text), 1, 5);
  end if;

  insert into public.friseur (user_id, name, slug)
  values (new.id, v_name, v_slug);

  return new;
end;
$$;

-- ============================================================
-- VERIFIKATION (nach dem Anwenden manuell — NICHT Teil der Migration)
-- ------------------------------------------------------------
-- a) INSERT friseur mit slug 'demo'  -> abgelehnt (friseur_slug_not_reserved)
-- b) INSERT friseur mit slug '-x-'   -> abgelehnt (friseur_slug_format)
-- c) Registrierung über Formular mit freier, gültiger Adresse -> friseur-Zeile da
-- d) Bestehende Slugs test-url / testurl weiterhin vorhanden (keine Verletzung)
-- ============================================================
