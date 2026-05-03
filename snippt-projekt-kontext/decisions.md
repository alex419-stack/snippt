# Decisions — Snippt
Stand: 03.05.2026 | Branch: m0-mockup

---

## Technische Entscheidungen (getroffen)

Quelle: CLAUDE.md, Code, Migrationen

| # | Entscheidung | Ergebnis | Warum |
|---|-------------|---------|-------|
| 1 | Framework | Next.js 14 App Router + TypeScript | SSR + API in einem, Supabase-kompatibel |
| 2 | Datenbank | Supabase (PostgreSQL + RLS) | Kein eigener Backend-Server, Auth inklusive |
| 3 | Hosting | Vercel | Zero-Config für Next.js |
| 4 | E-Mail | Resend.com | Magic-Link + Bestätigungen, günstig |
| 5 | Kalender-Integration | iCal-Export RFC 5545 (einseitig) | Statt Google Calendar Sync — weniger Aufwand, kein API-Key nötig |
| 6 | Zahlungen | Klassische Rechnung im MVP | Stripe Connect erst nach Pilot — vermeidet Compliance-Aufwand |
| 7 | Mobile/Desktop | Salonchef Desktop, Friseur + Endkunde Mobile-First | Spiegelt tatsächliche Nutzung wider |
| 8 | Endkunden-Account | Soft-Account / Progressiv (Magic-Link beim 2. Termin) | Reduktion Registrierungshürde für Erstbucher |
| 9 | Sprache | Nur Deutsch, kein i18n | MVP-Fokus, Zielgruppe DACH |
| 10 | Recht | IT-Recht-Generator (e-recht24.de) für AGB/DSE/Impressum | Günstig, ausreichend für Pilot-Phase |
| 11 | Schema-Management | SQL-Migrationsdateien (`supabase/migrations/`) | Kein Supabase-Dashboard für Schema-Änderungen — Reproducibility |
| 12 | Auth-Trigger | SECURITY DEFINER Postgres-Function | Verhindert RLS-Race-Condition bei Registrierung |
| 13 | Build-Tool | Claude Code Max 5x (€92/Mo) | Pro-Limit am 02.05. getroffen — Max 5x öffnet Sub-Agent-Headroom |
| 14 | Pilot-Strategie | Hi-Fi-Code-Mockup → Pilot-Commit → MVP-Code | Erst zeigen, dann bauen — kein Figma |

---

## Produktentscheidungen (getroffen)

| # | Entscheidung | Ergebnis | Warum |
|---|-------------|---------|-------|
| 1 | Zielgruppe | Long-Tail-Barbershops (15–22€-Schnitte) | Kein Konkurrent dort registriert (Pivot 02.05.2026) |
| 2 | Pricing | €7/Friseur/Mo Pilot-Preis | Discount-Preis für unbeackerten Markt — finale Strategie nach M9 |
| 3 | Personalbranding | Jeder Friseur ist eigene Marke | Differenzierung: Endkunde bucht "Tim", nicht "den Salon" |
| 4 | Walk-In | Live-Status auf Tagesebene + Express-Buchung | Kernproblem der Zielgruppe: viele Walk-Ins, kein System |
| 5 | Naming | Snippt (nach Chairly verworfen) | Chairly: belegte Domains + Markenkonflikt. Snippt: sauber (DPMA + TMview EU geprüft, 30.04.2026) |
| 6 | Anti-Toxizitäts-Maßnahmen | Nur Positiv-Hervorhebung, kein öffentliches Negativ-Ranking | Wettbewerbs-Matrix darf Friseure nicht gegeneinander ausspielen |
| 7 | Salonchef-Veto | Salonchef kann Vergleichs-Sichten deaktivieren | Schutz vor toxischer Nutzung der Wettbewerbs-Daten |

---

## Was bewusst NICHT gebaut wird (und warum)

Aus CLAUDE.md, explizit als "Nicht im MVP":

| Nicht-Feature | Begründung |
|--------------|-----------|
| Online-Zahlung | Stripe Connect erst nach Pilot — Compliance + Aufwand zu hoch jetzt |
| Bewertungen durch Endkunden pflegen | Zu komplex, kein klarer MVP-Wert |
| In-App-Chat | Aufwand nicht gerechtfertigt vor Pilot-Beweis |
| WhatsApp-Erinnerungen | API-Integration-Aufwand zu hoch |
| Loyalty-Programme / Rabattcodes | Kein MVP-Scope |
| Mehrsprachigkeit / i18n | Nur DACH, nur Deutsch |
| Salon-Wechsel-Logik | Zu komplex, kein Pilot-Relevanz |
| Google Calendar Sync | iCal-Export stattdessen (einseitig, kein API-Key) |
| "Keine Provision" als USP | Shore, studiolution, Planity, Booksy alle provisionsfrei → kein Differenzierungsmerkmal |

---

## Was noch ungeklärt ist (braucht Entscheidung)

### Business
1. **Finale Preisstrategie post-M9:** Lifetime / Volume-Rabatt / Stufenplan / Anhebung auf Marktpreis — erst nach Pilot-Daten entscheidbar
2. **Domain-Sicherung:** snippt.de + snippt.app (~€25/Jahr) — noch nicht gesichert
3. **Plan-B-Salon:** Noch kein Backup-Pilot-Salonchef identifiziert
4. **Anwalt-Review Zeitpunkt:** Nach Pilot (€300–800) — wann genau?

### Technisch
1. **RLS INSERT-Policy `termin`:** `WITH CHECK (true)` — anonyme Inserts ohne Validierung möglich. Fix: Rate-Limiting + schärfere Policy. Kein konkreter Zeitplan.
2. **E-Mail-Bestätigung produktiv:** Lokal deaktiviert. Für Produktion: eigene API-Route mit Service-Role Key oder andere Lösung nötig.
3. **salon-Tabelle Write-Policy:** Kein UI-Write möglich aktuell. Fix in M2 geplant, aber noch kein konkreter Ansatz.
4. **Multi-Tenant-Shape M1:** Refactoring geplant bis 20.05.2026 — Architektur noch nicht ausdetailliert.

---

## Quellen
- `CLAUDE.md` (Kern-Entscheidungen, Tabelle mit 13 Einträgen)
- `KNOWN_ISSUES.md` (technische Schwächen)
- `supabase/migrations/` (Trigger-Entscheidung)
- `lib/mockData.ts` (Demo-Daten-Entscheidung)
- `app/register/page.tsx` (Slug-Blacklist)
