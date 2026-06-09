-- ============================================================
-- Migration 003 — Warteschlange + Stempelkarte (Snippt MVP v1)
-- Pivot 2026-06-09: Einzel-Friseur. Reihenfolge statt Uhrzeiten.
-- Ersetzt fachlich das Termin-Modell durch eine Warteschlange und
-- ergänzt die digitale Stempelkarte.
--
-- ACHTUNG: Noch NICHT auf die Live-DB angewendet. Anwendung erst nach
-- ausdrücklicher Freigabe. Verifikations-Hinweise stehen am Dateiende.
-- Additiv & idempotent (if not exists / if exists), damit gefahrlos anwendbar.
-- ============================================================

-- ============================================================
-- 1. FRISEUR: Stempelkarten-Konfig + Default-Schnittdauer
-- ============================================================
alter table public.friseur
  add column if not exists stempel_anzahl    int,                       -- z.B. 10; NULL = keine Stempelkarte aktiv
  add column if not exists stempel_belohnung text,                      -- Freitext, z.B. "1 Schnitt gratis"
  add column if not exists slot_minuten      int not null default 30;   -- Default-Schnittdauer für Wartezeit-Schätzung

-- ============================================================
-- 2. KUNDE: Soft-Account (Wiedererkennung ohne Login)
-- ============================================================
alter table public.kunde
  add column if not exists besucher_token    text,                      -- pro Gerät, Wiedererkennung ohne Login
  add column if not exists letzter_besuch_at timestamptz;

-- Ein Gerät = ein Kunde je Friseur (derselbe Gast bei zwei Friseuren = zwei Kundensätze).
create unique index if not exists kunde_friseur_token_key
  on public.kunde(friseur_id, besucher_token) where besucher_token is not null;

-- ============================================================
-- 3. WARTESCHLANGE (ersetzt fachlich public.termin)
-- ============================================================
create table if not exists public.warteschlange (
  id             uuid primary key default uuid_generate_v4(),
  friseur_id     uuid references public.friseur(id) on delete cascade not null,
  kunde_id       uuid references public.kunde(id) on delete set null,    -- NULL = noch anonymer Walk-In
  besucher_token text,                                                   -- Eigenen Eintrag wiederfinden (anon, ohne Login)
  gast_name      text,                                                   -- Snapshot für (noch) anonyme Einträge
  gast_telefon   text,                                                   -- Snapshot; Identität + SMS-Ping
  status         text not null default 'wartend'
                 check (status in ('wartend','unterwegs','da','aufgerufen','fertig','abgesprungen')),
  eingereiht_at  timestamptz not null default now(),                     -- bestimmt die Reihenfolge
  aufgerufen_at  timestamptz,
  fertig_at      timestamptz,
  created_at     timestamptz default now()
);

create index if not exists warteschlange_friseur_status_idx
  on public.warteschlange(friseur_id, status);
create index if not exists warteschlange_reihenfolge_idx
  on public.warteschlange(friseur_id, eingereiht_at);
create index if not exists warteschlange_token_idx
  on public.warteschlange(besucher_token) where besucher_token is not null;

-- ============================================================
-- 4. STEMPEL (digitale Stempelkarte)
-- ============================================================
create table if not exists public.stempel (
  id            uuid primary key default uuid_generate_v4(),
  kunde_id      uuid references public.kunde(id) on delete cascade not null,
  friseur_id    uuid references public.friseur(id) on delete cascade not null,
  vergeben_at   timestamptz not null default now(),
  eingeloest_at timestamptz                                              -- gesetzt, wenn als Belohnung eingelöst
);

create index if not exists stempel_kunde_idx   on public.stempel(kunde_id);
create index if not exists stempel_friseur_idx on public.stempel(friseur_id);

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- Kundenseitige Schreib-/Lesezugriffe laufen über serverseitige API-Routen
-- mit Service-Role-Key (kontrolliert validiert). Daher KEINE offene
-- anonyme Insert-Policy (vermeidet die alte Lücke termin WITH CHECK (true)).
-- ============================================================
alter table public.warteschlange enable row level security;
alter table public.stempel       enable row level security;

create policy "Friseur sieht eigene Warteschlange"
  on public.warteschlange for select
  using (friseur_id in (select id from public.friseur where user_id = auth.uid()));

create policy "Friseur verwaltet eigene Warteschlange"
  on public.warteschlange for all
  using      (friseur_id in (select id from public.friseur where user_id = auth.uid()))
  with check (friseur_id in (select id from public.friseur where user_id = auth.uid()));

create policy "Friseur sieht eigene Stempel"
  on public.stempel for select
  using (friseur_id in (select id from public.friseur where user_id = auth.uid()));

create policy "Friseur verwaltet eigene Stempel"
  on public.stempel for all
  using      (friseur_id in (select id from public.friseur where user_id = auth.uid()))
  with check (friseur_id in (select id from public.friseur where user_id = auth.uid()));

-- ============================================================
-- 6. ALTLAST schließen: offene Termin-Insert-Policy entfernen (KNOWN_ISSUES #3)
-- public.termin bleibt vorerst bestehen (deprecated, ungenutzt) und wird in einer
-- späteren Migration entfernt, sobald sicher keine Daten/Abhängigkeiten bestehen.
-- ============================================================
drop policy if exists "Öffentliches Buchen erlaubt" on public.termin;

-- ============================================================
-- VERIFIKATION (nach dem Anwenden manuell ausführen — NICHT Teil der Migration)
-- ------------------------------------------------------------
-- a) Als Friseur A eingeloggt: SELECT auf warteschlange/stempel -> nur eigene Zeilen.
-- b) Als Friseur B eingeloggt: sieht NICHT die Zeilen von A.
-- c) Anonym (kein JWT): SELECT/INSERT auf warteschlange/stempel -> verboten/0 Zeilen.
-- d) public.termin: kein anonymer INSERT mehr möglich (Policy entfernt).
-- e) friseur.slot_minuten = 30 als Default vorhanden; stempel_anzahl/_belohnung NULL-fähig.
-- ============================================================
