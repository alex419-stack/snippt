# Project Status — Snippt
Stand: 03.05.2026 | Branch: m0-mockup

---

## Was aktuell gebaut und funktionsfähig ist

### Auth & Onboarding
- Registrierung (`/register`): Name, Slug (automatisch generiert + validiert), Email, Passwort
- Login (`/login`): Email + Passwort
- OAuth Callback (`/auth/callback`): Supabase Code-Exchange
- Middleware: schützt `/dashboard` (redirect zu /login wenn nicht eingeloggt), leitet eingeloggte User von /login und /register weg

### Datenbank
- Schema vollständig: `salon`, `friseur`, `kunde`, `termin` mit RLS
- Auth-Trigger: legt automatisch `friseur`-Datensatz bei Registrierung an (name + slug aus Metadata oder Email-Prefix)
- 2 Migrationen deployed: 001 (Schema), 002 (Trigger)

### Demo / Hi-Fi Mockup
- `/demo` — Hub mit 4 Kacheln (Salonchef, Friseur, Walk-In, Buchen)
- `/demo/salonchef` — Vollständiges Hi-Fi Salonchef-Dashboard mit:
  - 4 KPI-Tiles (Termine heute, Umsatz Woche, Auslastung, Walk-In-Quote) mit Trend-Icons
  - Wettbewerbs-Matrix (Auslastung, Stammkunden, Walk-In-Score, Trend pro Friseur)
  - Walk-In-Heatmap (7 Tage × 11 Stunden-Slots, HSL-Farben)
  - Aktivitäts-Feed (7 hardcoded Events)
- Mockdaten: 1 Salon, 3 Friseure (Marco/Sophie/Jonas), 18 Kunden, 50 Termine (Mo 27.04.–Sa 02.05.2026)
- Premium-Design-System aktiv: Off-White `#F8F7F4`, Tiefschwarz `#0F0F0F`, Warmgold `#C9A84C`, Geist Font

### Stub-Seiten (gebaut, aber nicht ausgearbeitet)
- `/dashboard` — zeigt nur Greeting + Buchungs-URL + 3 leere KPI-Platzhalter
- `/[slug]` — öffentliche Buchungsseite mit deaktiviertem "kommt bald"-Button

---

## Was in Arbeit ist

- Phase 1 des M0-Mockups ist laut letztem Commit (`dafa657`) WIP: Salonchef-Dashboard mit Wettbewerbs-Matrix fertiggestellt
- Demo-Screens für Phase 2–4 sind Placeholder (`/demo/friseur`, `/demo/kunde/walkin`, `/demo/kunde/buchen`)

---

## Was noch offen / ungeklärt ist

### Offene Demo-Screens (laut Placeholder-Texten)
- Phase 2: Friseur-Tagesansicht Mobile (`/demo/friseur`)
- Phase 3: Walk-In Live-Status Mobile (`/demo/kunde/walkin`)
- Phase 4: Endkunden-Buchungs-Flow Mobile (`/demo/kunde/buchen`)
- Phase 5 (empfohlen): Friseur-Profilseite Endkundensicht

### Technische Offenposten
- RLS-Sicherheitslücke: `termin` INSERT-Policy hat `WITH CHECK (true)` — anonyme Inserts ohne Validierung möglich
- `salon`-Tabelle: nur SELECT-Policy — kein UI-Write möglich
- E-Mail-Bestätigung: lokal deaktiviert wegen RLS-Race-Condition (Fix: noch nicht implementiert)
- Slug-Längen-Validierung fehlt (Min. 3 Zeichen)
- `.env.local.example` fehlt

### Noch nicht begonnen
- M1: Multi-Tenant-Refactoring (Deadline: 20.05.2026)
- Resend.com Integration (Account noch nicht angelegt)
- Domain-Sicherung snippt.de + snippt.app (~25€/Jahr — offen)

---

## Letzte 3 relevante Entscheidungen

1. **Pivot: Zielgruppe → Long-Tail-Barbershops (02.05.2026)**
   Nicht mehr Mittel-/Premium-Salons, sondern 15-22€-Schnitte, türkische Barbershops, Quartiersfriseure. Begründung: Keine Konkurrenz dort registriert — echter unbeackerter Markt.

2. **Pivot: Pricing → €7/Friseur/Monat (02.05.2026)**
   Statt Korridor oder Value-Based-Pricing ein konkreter Pilot-Preis. Finale Preisstrategie nach M9-Bewertung offen.

3. **Pivot: Build-Tool → Claude Code Max 5x (02.05.2026)**
   Pro-Limit wurde real getroffen. Max 5x (€92/Mo) öffnet Sub-Agent-Headroom. Downgrade auf Pro (€18) nach M9 möglich wenn Bedarf gering.

---

## Quellen
- `app/` (alle Seiten und Komponenten)
- `supabase/migrations/` (001, 002)
- `lib/mockData.ts`
- `middleware.ts`
- `CLAUDE.md`
- `KNOWN_ISSUES.md`
- `BACKLOG.md`
- `git log --oneline` (m0-mockup Branch)
