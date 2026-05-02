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

Premium-Buchungs-App für **Long-Tail-Barbershops** (15-22€-Schnitte, türkische Barbershops, Quartiersfriseure, Migration-Salons) — eine Klasse Salons, die in keinem etablierten Buchungs-Tool (Fresha/Booksy/Planity/Shore/studiolution) registriert ist und heute von Walk-In + Telefon + Notizbuch lebt.

Kern-USP: Stammkunden landen verlässlich bei IHREM Friseur, nicht beim ersten verfügbaren Kollegen. Walk-In und Vorab-Buchung gleichberechtigt. **Personalbranding pro Friseur**: jeder Friseur ist seine eigene Marke innerhalb der App, nicht ein austauschbarer Stuhl. **Conversion-Mechanik**: Snippt verwandelt Laufkundschaft systematisch in Stammkundschaft.

**Zielgruppen-Refokus 02.05.2026:** Premium-Werkzeug zum Discount-Preis (€7/Friseur/Mo) für unterversorgten Markt — direkter Konkurrent ist nicht Fresha, sondern „Telefon + Notizbuch".

**Wert für die drei Akteure:**

| Akteur | Rolle | Mehrwert |
|--------|-------|----------|
| Salonbesitzer | Käufer | Auslastung pro Friseur, Stammkundenanteil, Walk-In-Pattern, Wettbewerbs-Matrix → Salon-Steuerung mit weniger Mikromanagement |
| Friseur | Nutzer | Stammkunden bleiben bei ihm + sichtbarer Brand-Aufbau → mehr Verdienst, App-Bindung, Verhandlungsposition |
| Endkunde | Nutzer | Keine Anrufe, sieht SEINEN Friseur in Echtzeit, bucht spontan oder vorab, Wiedererkennbarkeit |

**Marktlücke gegen Treatwell/Booksy/Fresha/Planity/Shore/studiolution:** Friseur-priorisierte UX als Systemlogik (statt Salon-als-Einheit) + Personalbranding-Layer + Walk-In-Live-Status + Performance-Dashboard mit Wettbewerbs-Matrix für Salonchef.

### USP-Karte (Stand 02.05.2026, nach Researcher-Analyse)

| USP | Status | Pitch-Verwendung |
|---|---|---|
| Premium-Design (Cal.com/Stripe-Niveau) | **Killer-USP, jetzt mit Spannungsbonus** zum €7-Preis | hervorheben („Stripe-Niveau zum Schnitt-Preis") |
| Friseur-priorisierte Systemlogik (Personalbranding + Stammkunden-Erkennung) | **Killer-USP** — strukturelle Differenzierung | hervorheben |
| **Laufkundschaft → Stammkundschaft als Conversion-Mechanik** | **Killer-USP für Long-Tail** (NEU 02.05.2026) | im Pitch zentral als Aufmacher |
| Performance-Dashboard mit Wettbewerbs-Layer pro Friseur | starker Differenzierer | hervorheben |
| Walk-In Live-Status (Echtzeit pro Friseur) | starker Differenzierer | als Verstärker — passt perfekt zur Walk-In-getriebenen Zielgruppe |
| Premium-UX zum Discount-Preis | **NEU als Pitch-Asset** | zentrales Verkaufsargument |
| DSGVO/DE-Stack | solide, kontextabhängig | situativ |
| ~~Keine Provision~~ | **gestrichen** — Shore/studiolution/Planity/Booksy alle provisionsfrei = Erwartungsniveau | NICHT erwähnen |

**Pitch-Storyline (NEU 02.05.2026):** „Eure Laufkundschaft kommt rein, schneidet, geht — und ihr seht sie nie wieder. Snippt verwandelt sie in Stammkundschaft, mit Premium-UX zum Schnitt-Preis." Aufmacher = Friseur-Profilseite Endkundensicht. Pricing-Reveal („€7/Friseur/Mo = ein Schnitt pro Friseur und Monat") **erst nach** dem Wow-Moment.

---

## Aktueller Status (02.05.2026)

- M0 Phase 0 (Code-Mockup-Fundament) ✅ committet (`6cefc17`)
- Chairly→Snippt Rebrand ✅ committet (`1cd6980`)
- Phase 0 Nachzug Personalbranding ✅ committet (`cb00ff7`)
- **Pivot 30.04.2026:** Mockup wird als Next.js-Code im Repo gebaut (Branch `m0-mockup`), nicht in Figma — Alex kann den Stack bereits, Lernkurve in Code geringer
- **Pivot 02.05.2026 (drei strukturelle Entscheidungen):**
  - Build-Tool: Pro €18 → **Max 5x €92/Mo** (Pro-Limit real getroffen)
  - Pricing: Korridor €15-45 → **€7/Friseur/Mo Pilot-Preis** als Fixzahl
  - Zielgruppe: Mittel-/Premium-Salons → **Long-Tail-Barbershops** (15-22€-Schnitte)
- USP-Schärfung 02.05.2026: Personalbranding + Conversion-Mechanik als zusätzliche Killer-USPs, „keine Provision" gestrichen
- Bestehender Code aus Friseur-First-Vision (Single-Tenant) — wird in M1 auf Multi-Tenant refactored, nicht weiter ausbauen
- Pilot-Salon: "Mein Friseur"-Salon, ohne Commit. Plan-B-Salon: noch zu identifizieren

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
| 1 | Geschäftsmodell | **€7/Friseur/Monat Launch-Pilot-Preis** (Pivot 02.05.2026 — Long-Tail-Strategie). Finale Strategie (Lifetime/Volume/Stufenplan) nach M9-Erfolgsbewertung | No-Brainer-Niveau für Long-Tail-Barbershops mit dünner Marge |
| 2 | Walk-In | Live-Status auf Tagesebene + Express-Buchung | 80% Wert bei 20% Aufwand |
| 3 | Kalender | iCal-Export einseitig | Universell, kostenlos, robust |
| 4 | Endkunden-Account | Soft-Account / Progressiv | Niedrige Hürde, Magic-Link beim 2. Termin |
| 5 | Pilot-Strategie | Hi-Fi-**Code**-Mockup → Pilot-Commit → MVP-Code (Pivot 30.04.2026: Code statt Figma) | Risiko-Reduktion + Stack-Vertrautheit |
| 6 | E-Mail-Provider | Resend.com | Bessere Deliverability als Supabase Default |
| 7 | Sprachen | Nur Deutsch | DACH-Fokus, kein i18n-Overhead |
| 8 | Mobile/Desktop | Salonchef Desktop, Friseur+Kunde Mobile-First | Nutzungsrealität |
| 9 | Personalbranding | Friseur-als-Marke + natürlicher (positiv-gerahmter) Wettbewerb | Strategie-Pivot 02.05.2026 — Salonchef sieht Wettbewerbs-Matrix, Friseur sieht „Mein Brand"-Karte |
| 10 | Build-Tool | **Claude Max 5x ($100/€92 Mo)** — Pivot 02.05.2026 (Pro-Limit am 02.05. real getroffen) | Sub-Agent-Headroom verfügbar, Reviewer-als-Dritter aber sparsam; Eskalation auf Max 20x nur in kritischen Wochen |
| 13 | Zielgruppe | **Long-Tail-Barbershops mit 15-22€-Schnitten** (Pivot 02.05.2026) | Konkurrenz dort nicht registriert — unbeackerter Markt; Pilot-Salon „Mein Friseur" passt |
| 11 | Logo | Wortmarken-Style Geist Font in M2 | Pro-Logo erst nach Pilot-Erfolg |
| 12 | Recht | IT-Recht-Generator (e-recht24.de) für AGB/DSE/Impressum | MVP-tauglich, anwaltlicher Review nach Pilot |

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

## Roadmap v3 (Stand 02.05.2026)

| # | Meilenstein | Bis wann | Status |
|---|-------------|----------|--------|
| M0 | Hi-Fi-**Code**-Mockup + Pilot-Commit (Stop-Point) | 13.05.2026 | Phase 0 ✅ + Nachzug ✅, Phase 1 läuft |
| M1 | Multi-Tenant-Refactoring (Datenmodell + RLS) | 20.05.2026 | offen |
| M2 | Premium-Design-System im Code | 03.06.2026 | offen |
| M3 | Salonchef-Dashboard (echt) | 17.06.2026 | offen |
| M4 | Friseur-Login + iCal-Export | 24.06.2026 | offen |
| M5 | Kunden-Buchungs-Flow Soft-Account | 08.07.2026 | offen |
| M6 | Walk-In Live-Status + Express-Buchung | 22.07.2026 | offen |
| M7 | Pilot-Onboarding | 29.07.2026 | offen |
| M8 | Pilot Live-Phase (3 Wochen) | 19.08.2026 | offen |
| M9 | Erfolgsbewertung + Go/No-Go | 26.08.2026 | offen |

### M0 Killer-Screens (4 Pflicht + 1 empfohlen)

1. Salonchef-Dashboard Desktop (mit Wettbewerbs-Matrix)
2. Friseur-Tagesansicht Mobile (mit „Mein Brand"-Karte)
3. Walk-In Live-Status Mobile (mit Trust-Signalen pro Friseur)
4. Endkunden-Buchungs-Flow Mobile (Stammkunden-Hero als Step 0)
5. **(empfohlen)** Friseur-Profilseite Endkundensicht — zeigt Personalbranding-USP am stärksten

**Erfolgskriterien M9:**

- Buchungen über App ≥30% aller Termine im Pilot
- Walk-In-Anteil ≥10% aller App-Buchungen
- Soft-Account-Adoption ≥40% der wiederkehrenden Kunden
- Salonchef sagt "Ja" zu €7/Friseur/Mo Pilot-Preis
- ≥60% der Pilot-Friseure sagen "weiternutzen"

**Kill-Switch:** 3+ Kriterien unter Schwelle → Plan stoppen oder Vision-Pivot.

---

## Pre-M0 Tasks (offen)

- [x] Markenrechts-Check `snippt`: DPMA Register + TMview EU (erledigt 30.04.2026)
- [ ] Domains `snippt.de` + `snippt.app` sichern (~25€/Jahr zusammen)
- [ ] Resend.com Account anlegen (kostenlos)
- [ ] Plan-B-Salon identifizieren (für den Fall, dass Pilot-Salonchef Nein sagt)
- ~~Figma-Account anlegen~~ — entfällt durch Code-Mockup-Pivot

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
- **Subagenten gezielt nutzen** (Max-5x-Headroom, aber kein Freibrief):
  - `vision-manager-lead` bei strategischen Pivots oder Sparring
  - `code-reviewer` nach jedem signifikanten Code-Change (nicht für Mockup-UI)
  - `researcher` bei externer Recherche (DSGVO, APIs, Markt)
  - Researcher + Coder parallel ist mit Max 5x okay; Reviewer-als-Dritter sparsam einsetzen
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
