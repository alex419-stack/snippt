-- Erweiterungen
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABELLEN
-- ============================================================

create table public.salon (
  id        uuid primary key default uuid_generate_v4(),
  name      text not null,
  created_at timestamptz default now()
);

create table public.friseur (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  name       text not null,
  slug       text not null unique,
  foto_url   text,
  bio        text,
  telefon    text,
  salon_id   uuid references public.salon(id) on delete set null,
  created_at timestamptz default now()
);

create table public.kunde (
  id         uuid primary key default uuid_generate_v4(),
  friseur_id uuid references public.friseur(id) on delete cascade not null,
  name       text not null,
  telefon    text,
  notizen    text,
  fotos      text[] default '{}',
  created_at timestamptz default now()
);

create table public.termin (
  id         uuid primary key default uuid_generate_v4(),
  friseur_id uuid references public.friseur(id) on delete cascade not null,
  kunde_id   uuid references public.kunde(id) on delete set null,
  datum      timestamptz not null,
  dauer_min  int not null default 60,
  status     text not null default 'ausstehend' check (status in ('ausstehend', 'bestaetigt', 'abgesagt', 'abgeschlossen')),
  notiz      text,
  created_at timestamptz default now()
);

-- ============================================================
-- INDIZES
-- ============================================================

create index on public.friseur(slug);
create index on public.friseur(user_id);
create index on public.termin(friseur_id);
create index on public.termin(datum);
create index on public.kunde(friseur_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.salon   enable row level security;
alter table public.friseur enable row level security;
alter table public.kunde   enable row level security;
alter table public.termin  enable row level security;

-- friseur: öffentliche Leserechte (für /[slug] Buchungsseite)
create policy "Friseur öffentlich lesbar"
  on public.friseur for select
  using (true);

-- friseur: nur eigene Zeile bearbeiten
create policy "Friseur bearbeitet nur eigenes Profil"
  on public.friseur for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- termin: Friseur sieht nur eigene Termine
create policy "Friseur sieht eigene Termine"
  on public.termin for select
  using (
    friseur_id in (
      select id from public.friseur where user_id = auth.uid()
    )
  );

create policy "Friseur verwaltet eigene Termine"
  on public.termin for all
  using (
    friseur_id in (
      select id from public.friseur where user_id = auth.uid()
    )
  )
  with check (
    friseur_id in (
      select id from public.friseur where user_id = auth.uid()
    )
  );

-- Öffentliches Buchen: anonyme Nutzer dürfen Termine anlegen
create policy "Öffentliches Buchen erlaubt"
  on public.termin for insert
  with check (true);

-- kunde: Friseur sieht/verwaltet nur eigene Kunden
create policy "Friseur sieht eigene Kunden"
  on public.kunde for select
  using (
    friseur_id in (
      select id from public.friseur where user_id = auth.uid()
    )
  );

create policy "Friseur verwaltet eigene Kunden"
  on public.kunde for all
  using (
    friseur_id in (
      select id from public.friseur where user_id = auth.uid()
    )
  )
  with check (
    friseur_id in (
      select id from public.friseur where user_id = auth.uid()
    )
  );

-- salon: nur lesbar (keine Bearbeitung im MVP)
create policy "Salon lesbar"
  on public.salon for select
  using (true);
