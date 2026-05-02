# Snippt — Projekt-Kontext

> Globale Präferenzen siehe `/home/parallels/.claude/CLAUDE.md` (Sprache, Ton, Planungsphasen, Pros/Cons-Pflicht).
> Diese Datei ergänzt projektspezifische Informationen.

---

## Projekt-Identität

- **App-Name:** Snippt
- **Domains (zu sichern):** snippt.de, snippt.app
- **Markenrechts-Check:** ✅ erledigt (30.04.2026) — DPMA + TMview EU sauber
- **Repository:** GitHub `alex419-stack/snippt` (umbenannt 30.04.2026)
- **Lokales Verzeichnis:** `/home/parallels/Desktop/snippt` (umbenannt 30.04.2026)
- **Vorheriger Arbeitsname:** Chairly (verworfen — Domains belegt, Markenkonflikt-Risiko)

---

## Vision

Premium-Buchungs-App für Salons mit mehreren Friseuren. Kern-USP: Stammkunden landen verlässlich bei IHREM Friseur, nicht beim ersten verfügbaren Kollegen. Walk-In und Vorab-Buchung gleichberechtigt.

**Wert für die drei Akteure:**

| Akteur | Rolle | Mehrwert |
|--------|-------|----------|
| Salonbesitzer | Käufer | Auslastung pro Friseur, Stammkundenanteil, Walk-In-Pattern → Salon-Steuerung |
| Friseur | Nutzer | Stammkunden bleiben bei ihm → mehr Verdienst (Provisionsbasis) |
| Endkunde | Nutzer | Keine Anrufe, sieht seinen Friseur in Echtzeit, bucht spontan oder vorab |

**Marktlücke gegen Treatwell/Booksy/Fresha:** Friseur-priorisierte UX (statt Salon-als-Einheit) + Walk-In-Live-Status + Performance-Dashboard für Salonchef.

---

## Aktueller Status (29.04.2026)

- Planung abgeschlossen (Stress-Test + Phase 1 + Phase 2 v3)
- M0 (Hi-Fi-Figma-Mockup) startet als nächstes
- Bestehender Code aus Friseur-First-Vision (Single-Tenant) — wird in M1 auf Multi-Tenant refactored
- Pilot-Salon: "Mein Friseur"-Salon, ohne Commit. Plan-B: 2. Salon im Hinterkopf (Name TBD)

---

## Stack & Architektur

| Bereich | Technologie |
|---------|-------------|
| Frontend/Backend | Next.js 14 App Router + TypeScript |
| Datenbank/Auth | Supabase (PostgreSQL + RLS) |
| Hosting | Vercel |
| UI | Tailwind v3 + shadcn/ui (Custom-Theme) |
| E-Mail | Resend.com (Magic-Link, Bestätigungen) |
| Kalender | iCal-Export RFC 5545 (einseitig) |
| Payment im MVP | Klassische Rechnung (Stripe Connect später) |
| Sprache | Nur Deutsch, kein i18n |

---

## Datenmodell (Multi-Tenant, ab M1)

```
salon (auth.users: salon_admin)
 └── friseur (auth.users: friseur — vom Salon angelegt, optional eingeloggt)
       └── termin (verbindet friseur + kunde + zeitslot)
             └── kunde (auth.users: endkunde — Soft-Account, optional)
```

**Pragmatik "Wem gehört der Kunde":** Kunde hat eigenen Account, Beziehung Kunde↔Friseur entsteht über Termin-Historie (zuletzt besuchter Friseur = sein Friseur). Salon-Wechsel nicht im MVP behandelt.

---

## Kern-Entscheidungen (final)

| # | Thema | Entscheidung | Begründung |
|---|-------|--------------|-----------|
| 1 | Geschäftsmodell | 12€/Monat pro Friseur im Salon | Skaliert fair mit Salongröße |
| 2 | Walk-In | Live-Status auf Tagesebene + Express-Buchung | 80% Wert bei 20% Aufwand |
| 3 | Kalender | iCal-Export einseitig | Universell, kostenlos, robust |
| 4 | Endkunden-Account | Soft-Account / Progressiv | Niedrige Hürde, Magic-Link beim 2. Termin |
| 5 | Pilot-Strategie | Hi-Fi-Mockup → Commit → MVP | Risiko-Reduktion vor 100h+ Bauzeit |
| 6 | E-Mail-Provider | Resend.com | Bessere Deliverability als Supabase Default |
| 7 | Sprachen | Nur Deutsch | DACH-Fokus, kein i18n-Overhead |
| 8 | Mobile/Desktop | Salonchef Desktop, Friseur+Kunde Mobile-First | Nutzungsrealität |
| 9 | Logo | Wortmarken-Style Geist Font in M2 | Pro-Logo erst nach Pilot-Erfolg |
| 10 | Recht | IT-Recht-Generator (e-recht24.de) für AGB/DSE/Impressum | MVP-tauglich, anwaltlicher Review nach Pilot |

**Bewusst nicht im MVP:** Online-Zahlung, Bewertungen, In-App-Chat, WhatsApp-Erinnerung, Loyalty/Rabattcodes, Mehrsprachigkeit, Salon-Wechsel-Logik.

---

## Premium-Design-System (Dark Barbershop)

| Rolle | Hex |
|-------|-----|
| Hintergrund | `#F8F7F4` (Off-White) |
| Primär | `#0F0F0F` (Tiefschwarz) |
| Akzent | `#C9A84C` (Warmgold) |
| Text | `#1C1C1E` (Dunkelgrau) |

**Typografie:** Geist Font (bereits via `next/font/google` eingebunden).

**Anspruch:** Premium ist MVP-Requirement, nicht Kür. Bei Zeitdruck werden Features verschoben — niemals Design-Qualität reduziert.

**Referenz-Inspiration:** Cal.com, Linear, Stripe Dashboard, Things3.

---

## Roadmap v3 (Stand 29.04.2026)

| # | Meilenstein | Bis wann |
|---|-------------|----------|
| M0 | Hi-Fi-Figma-Mockup + Pilot-Commit (Stop-Point) | 13.05.2026 |
| M1 | Multi-Tenant-Refactoring (Datenmodell + RLS) | 20.05.2026 |
| M2 | Premium-Design-System im Code | 03.06.2026 |
| M3 | Salonchef-Dashboard | 17.06.2026 |
| M4 | Friseur-Login + iCal-Export | 24.06.2026 |
| M5 | Kunden-Buchungs-Flow Soft-Account | 08.07.2026 |
| M6 | Walk-In Live-Status + Express-Buchung | 22.07.2026 |
| M7 | Pilot-Onboarding | 29.07.2026 |
| M8 | Pilot Live-Phase (3 Wochen) | 19.08.2026 |
| M9 | Erfolgsbewertung + Go/No-Go | 26.08.2026 |

**Erfolgskriterien M9:**

- Buchungen über App ≥30% aller Termine im Pilot
- Walk-In-Anteil ≥10% aller App-Buchungen
- Soft-Account-Adoption ≥40% der wiederkehrenden Kunden
- Salonchef sagt "Ja" zu 12€/Friseur/Monat
- ≥60% der Pilot-Friseure sagen "weiternutzen"

**Kill-Switch:** 3+ Kriterien unter Schwelle → Plan stoppen oder Vision-Pivot.

---

## Pre-M0 Tasks (vor Mockup-Start)

- [x] Markenrechts-Check `snippt`: DPMA Register + TMview EU (erledigt 30.04.2026)
- [ ] Domains `snippt.de` + `snippt.app` sichern (~25€/Jahr zusammen)
- [ ] Resend.com Account anlegen (kostenlos)
- [ ] Figma-Account anlegen (kostenlos)

---

## Known Issues

Aus Single-Tenant-Phase, werden in M1 großteils obsolet:

1. ✅ Race-Condition Registrierung — gefixt via DB-Trigger (Migration 002)
2. ✅ Slug-Blacklist — gefixt im Registrierungsformular
3. RLS Termin-Inserts ohne friseur_id-Prüfung — wird in M1 durch Multi-Tenant-RLS ersetzt
4. salon-Tabelle aktuell nur READ — wird in M1 zu zentraler Entität mit Salon-Admin-CRUD

Details: `KNOWN_ISSUES.md` im Projektverzeichnis.

---

## Konventionen für Claude in diesem Projekt

- **Sprache:** Outputs und Code-Kommentare auf Deutsch
- **Datenmodell-Änderungen:** Immer als SQL-Migration in `supabase/migrations/` — nicht direkt im Supabase Dashboard
- **UI-Änderungen:** Premium-Design-Palette einhalten, Geist Font, keine Behörden-Optik
- **Bei größeren Features:** Phase 1 (Strategischer Überblick) → Phase 2 (Aktionsplan) → erst dann Code (siehe globale CLAUDE.md)
- **Subagenten gezielt nutzen:**
  - `vision-manager-lead` bei strategischen Pivots oder Sparring
  - `code-reviewer` nach jedem signifikanten Code-Change
  - `researcher` bei externer Recherche (DSGVO, APIs, Markt)
- **Build-Disziplin:** `npm run build` muss grün bleiben nach jedem Meilenstein
- **Manuelle UI-Tests:** Pro Meilenstein dokumentiert abschließen, nicht batchen
- **Nicht ohne Plan bauen:** Wenn ein Code-Change >30 Min Aufwand → erst Plan mit Alex abstimmen

---

## Querverweise

- Alter MVP-Plan (Single-Tenant, **veraltet**, archivieren in M0): `/home/parallels/Desktop/friseur-app-mvp-plan.md`
- Auto-Memory: `/home/parallels/.claude/projects/-home-parallels-Desktop/memory/project_snippt.md`
- Known Issues: `KNOWN_ISSUES.md`
- Backlog: `BACKLOG.md`
- Globale CLAUDE.md: `/home/parallels/.claude/CLAUDE.md`
