-- ============================================================
-- Migration 011 — Live-Aktualisierung der Warteschlange
-- Schaltet die Tabelle public.warteschlange für Supabase Realtime frei,
-- damit das Friseur-Dashboard Änderungen sofort sieht (anstellen, einchecken,
-- aufrufen, fertig) statt erst beim nächsten Auto-Refresh.
-- RLS bleibt aktiv: gestreamt werden nur Zeilen, die der eingeloggte Friseur
-- ohnehin sehen darf.
--
-- Idempotent: fügt die Tabelle nur hinzu, wenn sie noch nicht in der
-- Realtime-Publication ist.
-- ============================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'warteschlange'
  ) then
    alter publication supabase_realtime add table public.warteschlange;
  end if;
end $$;
