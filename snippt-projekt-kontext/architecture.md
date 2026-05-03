# Architecture — Snippt
Stand: 03.05.2026 | Branch: m0-mockup

---

## Stack

| Tool / Framework | Version | Warum diese Wahl (aus CLAUDE.md / Code) |
|-----------------|---------|----------------------------------------|
| Next.js (App Router) | 14.2.35 | SSR, Routing, API Routes in einem — Standard für Supabase-Projekte |
| React | 18 | Basis für Next.js |
| TypeScript | 5 | Type Safety — in allen Dateien aktiv, strict mode an |
| Tailwind CSS | 3.4.1 | Utility-First, schnell für Solo-Entwicklung |
| shadcn/ui | 4.6.0 | Vorgefertigte Komponenten als Basis, vollständig anpassbar |
| Supabase | JS 2.105.1 / SSR 0.10.2 | PostgreSQL + Auth + RLS — kein separater Backend-Server nötig |
| Vercel | — | Hosting, Zero-Config-Deploy für Next.js |
| Resend.com | — | E-Mail (Magic-Link, Bestätigungen) — konfiguriert, noch nicht im Code |
| Geist Font | 1.7.0 | Vercel-Font, passt zum Premium-Stil |
| Lucide React | 1.12.0 | Icon-Library |

---

## Datenbankschema

### Tabelle: `public.salon`

| Feld | Typ | Constraint | Beschreibung |
|------|-----|-----------|-------------|
| id | uuid | PK, auto | Primärschlüssel |
| name | text | NOT NULL | Salon-Name (z.B. "Mein Friseur") |
| created_at | timestamptz | DEFAULT now() | Erstellungsdatum |

RLS: Enabled — nur SELECT-Policy (kein UI-Write im MVP)

---

### Tabelle: `public.friseur`

| Feld | Typ | Constraint | Beschreibung |
|------|-----|-----------|-------------|
| id | uuid | PK, auto | Primärschlüssel |
| user_id | uuid | FK → auth.users, NOT NULL, CASCADE | Verknüpfung zum Auth-User |
| name | text | NOT NULL | Friseur-Name |
| slug | text | NOT NULL, UNIQUE | URL-Segment (z.B. "marco-lehmann") |
| foto_url | text | nullable | Link zu Profilfoto |
| bio | text | nullable | Kurze Biografie |
| telefon | text | nullable | Kontaktnummer |
| salon_id | uuid | FK → salon, nullable, SET NULL | Salon-Zugehörigkeit |
| created_at | timestamptz | DEFAULT now() | Erstellungsdatum |

Indizes: `slug`, `user_id`
RLS: Öffentlich lesbar (SELECT alle), schreiben nur wenn `auth.uid() = user_id`

---

### Tabelle: `public.kunde`

| Feld | Typ | Constraint | Beschreibung |
|------|-----|-----------|-------------|
| id | uuid | PK, auto | Primärschlüssel |
| friseur_id | uuid | FK → friseur, NOT NULL, CASCADE | Zugehöriger Friseur |
| name | text | NOT NULL | Kundenname |
| telefon | text | nullable | Kontaktnummer |
| notizen | text | nullable | Friseur-Notizen (z.B. "Mag kürzer am Hals") |
| fotos | text[] | DEFAULT '{}' | Array von Foto-URLs |
| created_at | timestamptz | DEFAULT now() | Erstellungsdatum |

Indizes: `friseur_id`
RLS: Friseur sieht und verwaltet nur eigene Kunden

---

### Tabelle: `public.termin`

| Feld | Typ | Constraint | Beschreibung |
|------|-----|-----------|-------------|
| id | uuid | PK, auto | Primärschlüssel |
| friseur_id | uuid | FK → friseur, NOT NULL, CASCADE | Zugehöriger Friseur |
| kunde_id | uuid | FK → kunde, nullable, SET NULL | Gebuchter Kunde (null = Walk-In) |
| datum | timestamptz | NOT NULL | Termin-Zeitpunkt (ISO-8601) |
| dauer_min | int | NOT NULL, DEFAULT 60 | Dauer in Minuten |
| status | text | CHECK (4 Werte), DEFAULT 'ausstehend' | ausstehend / bestaetigt / abgesagt / abgeschlossen |
| notiz | text | nullable | Termin-Notiz |
| created_at | timestamptz | DEFAULT now() | Erstellungsdatum |

Indizes: `friseur_id`, `datum`
RLS: Friseur sieht/verwaltet eigene Termine; INSERT mit `WITH CHECK (true)` — **bekannte Sicherheitslücke** (KNOWN_ISSUES.md #3)

---

### Beziehungen

```
auth.users
    └──(1:1)──► friseur  ◄──(n:1)── salon
                   │
                   ├──(1:n)──► kunde
                   │              │
                   └──(1:n)──► termin ◄──(n:1)── kunde
```

| FK | ON DELETE |
|----|-----------|
| friseur.user_id → auth.users | CASCADE — Friseur-Datensatz löschen wenn User gelöscht |
| friseur.salon_id → salon | SET NULL — Friseur bleibt ohne Salon-Zuordnung |
| kunde.friseur_id → friseur | CASCADE — Kunden löschen wenn Friseur gelöscht |
| termin.friseur_id → friseur | CASCADE — Termine löschen wenn Friseur gelöscht |
| termin.kunde_id → kunde | SET NULL — Termin bleibt, Kundenzuordnung wird null |

---

### Auth-Trigger (Migration 002)

Funktion `handle_new_user()` läuft nach jedem INSERT in `auth.users`:
1. Extrahiert Email-Prefix (vor @)
2. Setzt `name` aus Metadata oder Email-Prefix als Fallback
3. Setzt `slug` aus Metadata oder generiert aus Email-Prefix (nur a-z, 0-9, -)
4. Legt `friseur`-Datensatz automatisch an
5. Läuft mit SECURITY DEFINER (umgeht RLS)

---

## Ordnerstruktur

```
snippt/
├── app/                    # Next.js App Router — alle Seiten und Routes
│   ├── layout.tsx          # Root-Layout: Geist-Font, globale Metadaten
│   ├── globals.css         # Tailwind-Import + Premium-Theme CSS-Variablen
│   ├── page.tsx            # / Landing Page
│   ├── login/              # /login
│   ├── register/           # /register
│   ├── dashboard/          # /dashboard (protected, Friseur-Bereich)
│   ├── auth/callback/      # /auth/callback (Supabase OAuth)
│   ├── [slug]/             # /[slug] öffentliche Buchungsseite (dynamic route)
│   └── demo/               # /demo/* Hi-Fi Mockup für Pitch (keine echte API)
│       ├── _components/    # Shared Demo-Komponenten (PlaceholderScreen)
│       ├── salonchef/      # /demo/salonchef + private Sub-Komponenten
│       └── kunde/          # /demo/kunde/walkin + /demo/kunde/buchen
│
├── components/ui/          # shadcn/ui Komponenten (10 Stück, unverändert)
│
├── lib/                    # Shared Utilities
│   ├── mockData.ts         # Hardcoded Demo-Daten (1 Salon, 3 Friseure, 18 Kunden, 50 Termine)
│   ├── utils.ts            # cn() Utility (clsx + tailwind-merge)
│   └── supabase/
│       ├── client.ts       # Browser-Supabase-Client
│       └── server.ts       # Server-Supabase-Client (mit Cookie-Handling)
│
├── supabase/migrations/    # SQL-Migrationen (Schema + Trigger)
│   ├── 001_initial_schema.sql
│   └── 002_auth_trigger.sql
│
├── middleware.ts           # Auth-Guard: /dashboard protected, /login redirect
├── tailwind.config.ts      # Tailwind + Premium-Palette (bone/ink/gold/coal)
├── next.config.mjs         # Minimal — keine Erweiterungen
├── tsconfig.json           # TypeScript strict mode, @/* path alias
│
├── CLAUDE.md               # Projekt-Kontext, Roadmap, Entscheidungen
├── KNOWN_ISSUES.md         # 4 dokumentierte Bugs/Schwächen
└── BACKLOG.md              # 4 kleine Tech-Debts
```

---

## Externe Services

| Service | Zweck | Status |
|---------|-------|--------|
| Supabase | PostgreSQL, Auth, RLS, Storage | Aktiv (Projekt: pcsinlbhcdfvctaritwy) |
| Vercel | Hosting + Deployments | Geplant (noch nicht deployed) |
| Resend.com | E-Mail (Magic-Link, Terminbestätigungen) | Konfiguriert, Account noch nicht angelegt |
| Pravatar.cc | Avatar-Placeholder-Bilder in Mockdaten | Nur in Mockdaten |

---

## Quellen
- `package.json`
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_auth_trigger.sql`
- `middleware.ts`
- `lib/supabase/client.ts`, `server.ts`
- `tailwind.config.ts`
- `app/globals.css`
- `next.config.mjs`
- `tsconfig.json`
- `CLAUDE.md`
