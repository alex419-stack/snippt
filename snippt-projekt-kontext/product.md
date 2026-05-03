# Product — Snippt
Stand: 03.05.2026 | Branch: m0-mockup

---

## Was Snippt konkret macht (Nutzerperspektive)

Snippt ist eine Buchungs-App für Barbershops mit günstigen Schnitten (15–22€). Sie löst ein konkretes Problem dieser Betriebe: Laufkundschaft kommt rein, zahlt, geht — und kehrt nicht mehr zurück, weil keine Verbindung aufgebaut wird.

**Drei Akteure:**

| Akteur | Rolle | Kernnutzen |
|--------|-------|-----------|
| Salonchef | Käufer (zahlt €7/Friseur/Mo) | Überblick über alle Friseure, Auslastung, Stammkunden-Entwicklung |
| Friseur | Nutzer (arbeitet täglich damit) | Eigenes Profil + Buchungsseite, Stammkunden aufbauen, Walk-Ins verwalten |
| Endkunde | Nutzer (bucht Termine) | Seinen Stamm-Friseur wiederfinden und online buchen |

**Kernpitch:** "Dein Friseur Tim hat Donnerstag 15 Uhr frei." — Endkunde bucht beim konkreten Friseur, nicht beim Salon anonym. Laufkundschaft wird zu Stammkundschaft.

---

## Features die existieren

### Öffentlich zugänglich
- **Landing Page** (`/`): Einstieg mit "Jetzt starten" und "Anmelden"
- **Registrierung** (`/register`): Friseur legt Konto an (Name, Slug, Email, Passwort) — Slug wird automatisch aus Name generiert
- **Login** (`/login`): Friseur meldet sich an
- **Öffentliche Friseur-Profilseite** (`/[slug]`): Zeigt Friseur-Avatar, Name, Bio — Buchungs-Button deaktiviert ("kommt bald")

### Für eingeloggte Friseure
- **Dashboard** (`/dashboard`): Zeigt Begrüßung, eigene Buchungs-URL — nur Stub, keine echten Daten

### Demo / Pitch
- **Demo-Hub** (`/demo`): Übersicht aller 4 Demo-Screens mit Beschreibung
- **Salonchef-Dashboard** (`/demo/salonchef`): Vollständiger Hi-Fi Mockup mit:
  - 4 KPIs: Termine heute, Umsatz Woche, Auslastung (%), Walk-In-Quote (%)
  - Wettbewerbs-Matrix: Auslastung, Stammkunden-Anteil, Walk-In-Score, 30-Tage-Trend pro Friseur — Gold-Badge für Spitzenreiter
  - Walk-In-Heatmap: 7 × 11 Stunden-Slots (wann kommen Walk-Ins?)
  - Aktivitäts-Feed: Buchungen, Walk-Ins, Stammkunden-Erkennungen, Meilensteine

---

## Features die geplant sind

Laut CLAUDE.md Roadmap und Placeholder-Screens:

| Feature | Meilenstein | Deadline | Screen |
|---------|-------------|----------|--------|
| Friseur-Tagesansicht Mobile | M0 Phase 2 | 13.05.2026 | `/demo/friseur` |
| Walk-In Live-Status + Express-Buchung Mobile | M0 Phase 3 / M6 | 22.07.2026 | `/demo/kunde/walkin` |
| Endkunden-Buchungs-Flow Mobile (Soft-Account) | M0 Phase 4 / M5 | 08.07.2026 | `/demo/kunde/buchen` |
| Friseur-Profilseite Endkundensicht | M0 Phase 5 (empfohlen) | 13.05.2026 | — |
| Multi-Tenant-Refactoring (Salon als Mandant) | M1 | 20.05.2026 | — |
| Premium-Design-System vollständig | M2 | 03.06.2026 | — |
| Salonchef-Dashboard real (echte Daten) | M3 | 17.06.2026 | — |
| Friseur-Login + iCal-Export | M4 | 24.06.2026 | — |
| Kunden-Buchungs-Flow Soft-Account | M5 | 08.07.2026 | — |
| Walk-In Live-Status real | M6 | 22.07.2026 | — |
| Pilot-Onboarding | M7 | 29.07.2026 | — |
| Pilot Live-Phase (3 Wochen) | M8 | 19.08.2026 | — |
| Erfolgsbewertung + Go/No-Go | M9 | 26.08.2026 | — |

---

## Bekannte Einschränkungen

### Technische Einschränkungen (Stand heute)
- Buchung funktioniert noch nicht — Button auf Friseur-Profilseite ist deaktiviert
- Dashboard zeigt keine echten Daten — nur Platzhalter
- Multi-Tenant noch nicht implementiert — jeder Friseur ist aktuell unabhängig, kein Salon-Verbund
- E-Mail-Bestätigung lokal deaktiviert (RLS-Race-Condition, KNOWN_ISSUES.md #1)

### Bewusste Nicht-Features (aus CLAUDE.md)
Diese Features werden **nicht** im MVP gebaut:

| Nicht-Feature | Grund (aus CLAUDE.md) |
|--------------|----------------------|
| Online-Zahlung | Stripe Connect erst nach Pilot |
| Bewertungen durch Endkunden pflegen | Zu komplex, kein MVP-Wert |
| In-App-Chat | Zu komplex |
| WhatsApp-Erinnerungen | Integration-Aufwand zu hoch |
| Loyalty-Programme / Rabattcodes | Kein MVP-Scope |
| Mehrsprachigkeit / i18n | Nur Deutsch (CLAUDE.md: "Nur Deutsch, kein i18n") |
| Salon-Wechsel-Logik | Zu komplex für MVP |
| Google Calendar Sync | iCal-Export (RFC 5545) stattdessen — einseitig |

---

## Quellen
- `app/` (alle Seiten)
- `app/demo/salonchef/` + Sub-Komponenten
- `lib/mockData.ts`
- `CLAUDE.md` (Roadmap, Nicht-Features)
- `KNOWN_ISSUES.md`
- `app/[slug]/page.tsx`
- `app/dashboard/page.tsx`
