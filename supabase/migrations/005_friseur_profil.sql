-- ============================================================
-- Migration 005 — Friseur-Profilfelder (Personalbranding)
-- Additiv: ergänzt das Friseur-Profil um Felder für die öffentliche Kunden-Seite.
-- ============================================================
alter table public.friseur
  add column if not exists rolle         text,  -- kurze Tätigkeit/Tagline, z.B. "Fades & Classic Cuts"
  add column if not exists spezialitaeten text, -- kommagetrennt, z.B. "Fade, Bart, Classic Cut"
  add column if not exists instagram     text;  -- Instagram-Handle ohne @, z.B. "mehmet.cuts"
