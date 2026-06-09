# Snippt MVP — Sub-Goal-Roadmap (v1)

> **Für agentische Worker:** Dies ist die **Etappen-Übersicht** (Sub-Goals). Jede Etappe bekommt zu ihrem Start einen eigenen, kleinteiligen Bauplan (TDD, Schritt-für-Schritt) unter `docs/superpowers/plans/`. Die UI-Etappen (3–6) werden erst detailliert/gebaut, **nachdem das Design steht** (Sub-Goal 2).

**Ziel:** Eine schlanke, installierbare Web-App, mit der ein einzelner Friseur seine Kunden über eine Live-Warteschlange (ohne Uhrzeiten) hält und über eine digitale Stempelkarte bindet.

**Architektur:** Aufbau auf dem bestehenden Repo (Next.js 14 App Router, TypeScript, Tailwind + shadcn/ui, Supabase Postgres+Auth+RLS, Vercel). Das vorhandene Einzel-Friseur-Schema bleibt Basis; kein Multi-Tenant. Zentrales Objekt wird der **Warteschlangen-Eintrag** (Reihenfolge + Zustand), nicht der „Termin".

**Tech-Stack-Ergänzungen:** PWA (Manifest + Service Worker), Supabase Realtime (Live-Warteschlange), SMS-Anbieter für den Ping (Auswahl offen — siehe Sub-Goal 5).

**Quelle/Spec:** `docs/superpowers/specs/2026-06-09-snippt-mvp-design.md`

---

## Reihenfolge & Abhängigkeiten

```
SG0 Aufräumen  →  SG1 Datenmodell  →  SG2 DESIGN (Gate)  →  SG3 Friseur-Warteschlange
                                                          →  SG4 Kunde: Profil + Anstellen
                                                          →  SG5 Benachrichtigungen
                                                          →  SG6 Stempelkarte
                                                          →  SG7 Pilot-Härtung
```

- **SG0 + SG1** sind design-unabhängig (kein Bildschirm-Aussehen) → könnten sofort starten.
- **SG2 (Design) ist das Gate:** SG3–SG6 (alles mit sichtbarer Oberfläche) starten erst, wenn das Design freigegeben ist.

---

## Sub-Goal 0 — Aufräumen & Pivot-Anpassung

**Ziel:** Repo auf den neuen Stand bringen, blockierende Altlasten beseitigen.

**Umfang:**
- Projekt-Kontext-Doku (`snippt-projekt-kontext/`, `CLAUDE.md`) auf den Einzel-Friseur-Pivot aktualisieren; alte Salon-/Multi-Tenant-Roadmap als veraltet markieren.
- `.env.local.example` anlegen (Supabase-URL, Keys; später SMS-Keys).
- Bekannte Auth-/RLS-Altlasten sichten, die v1 betreffen (siehe `KNOWN_ISSUES.md`) — Fixes hier nur soweit sie SG1 nicht vorwegnehmen.
- Demo-Screens (`/demo/*`, `lib/mockData.ts`) bleiben vorerst unangetastet (dienen weiter als Pitch-Schaufenster), werden aber nicht weiterentwickelt.

**Fertig wenn:** Repo baut grün (`npm run build`), Doku spiegelt den Pivot, `.env`-Vorlage existiert.

---

## Sub-Goal 1 — Datenmodell v1 (Migration, design-unabhängig)

**Ziel:** Das Datenfundament für Warteschlange + Stempelkarte, sauber mit RLS.

**Umfang (neue/geänderte Tabellen, als SQL-Migration in `supabase/migrations/`):**
- `friseur` — bleibt (1:1 zu Auth-User). Ergänzen: Stempelkarten-Konfig (`stempel_anzahl int`, `stempel_belohnung text`), optional `slot_minuten int` (Default-Schnittdauer für Wartezeit-Schätzung).
- `kunde` — Soft-Account: `name`, `telefon` (für SMS-Ping = zugleich Identität), `friseur_id` (zu welchem Friseur er gehört), Geräte-/Token-Feld für Wiedererkennung ohne Login.
- `warteschlange` (neu, ersetzt `termin`) — `friseur_id`, `kunde_id` (nullable für noch-anonyme Walk-Ins), `status` (`wartend` / `unterwegs` / `da` / `aufgerufen` / `fertig` / `abgesprungen`), `eingereiht_at` (Reihenfolge), `aufgerufen_at`, `fertig_at`.
- `stempel` (neu) — `kunde_id`, `friseur_id`, `vergeben_at`, `eingeloest` (bool/Zeitpunkt für Belohnungs-Reset).
- **RLS:** Friseur sieht/verwaltet nur eigene Warteschlange/Kunden/Stempel; öffentliches Einreihen über kontrollierten Pfad (kein offenes `WITH CHECK (true)` mehr); „da"-Status nur über In-Laden-Pfad setzbar.

**Fertig wenn:** Migration angewendet (nach ausdrücklicher Freigabe — Live-DB!), RLS aus drei Perspektiven (Friseur, fremder Friseur, anonym) verifiziert.

**Hinweis:** Bite-Sized-TDD-Bauplan (SQL + Policy-Tests) wird zum Start dieser Etappe geschrieben.

---

## Sub-Goal 2 — DESIGN-PHASE (Gate vor allen UI-Etappen)

**Ziel:** Das visuelle Snippt festlegen, bevor UI gebaut wird. Richtung: **dunkel, leuchtend, farbig, modern, hochwertig** (siehe `docs/superpowers/design-references/2026-06-09-design-kandidaten.md`).

**Umfang:**
- Dunkles Design-System definieren (Farb-Tokens, Akzent/Glow, Typografie, Komponenten-Stil) — eigenständig, kein Template-Kopieren.
- Die Kern-Screens als Entwürfe/Mockups: Kunde (Friseur-Profil + „Anstellen" + Live-Wartezeit + Stempelkarte), Friseur (Warteschlangen-Liste mit Zuständen).
- **Alex wählt im Browser** aus 2–3 Varianten / gibt frei.
- **Mobile-Performance-Leitplanke:** Glows/Effekte sparsam, GPU-schonend, keine Dauer-Vollbild-Animation.

**Fertig wenn:** Alex hat ein Design freigegeben; Tokens + Komponenten-Stil stehen als Grundlage für SG3–SG6.

---

## Sub-Goal 3 — Friseur: Live-Warteschlange (Kern)

**Ziel:** Der Friseur arbeitet seine Reihe mit einem Tipp ab.

**Umfang:** Warteschlangen-Bildschirm (Mobile, geschützt): Liste in Reihenfolge mit Zustand 🟢 da / 🟡 unterwegs / ⚪ keine Antwort; „fertig/nächster" (rückt vor + benachrichtigt Nächsten); „nächsten nehmen" (überspringt, ohne Platzverlust); jemanden manuell rausnehmen; Live-Aktualisierung (Supabase Realtime). Beim „fertig" automatisch Stempel für erkannten Kunden (greift in SG6).

**Abhängig von:** SG1, SG2.

---

## Sub-Goal 4 — Kunde: Profil, Anstellen, Live-Wartezeit, Installation

**Ziel:** Die einfache Customer Journey aus dem Konzept.

**Umfang:** Öffentliche Friseur-Profilseite (`/[slug]`, via QR); großer „Anstellen"-Knopf; Live-Wartezeit-Anzeige; „bin da" nur per In-Laden-QR setzbar; **„Tim aufs Handy legen"** (PWA-Installation: Manifest, Service Worker, geführte Hilfe iOS/Android); Soft-Account per Name + Handynummer (keine Login-Hürde).

**Abhängig von:** SG1, SG2.

---

## Sub-Goal 5 — Benachrichtigungen („du bist dran")

**Ziel:** Der Ping, der den Wechsel zum Nachbarstuhl verhindert.

**Umfang:**
- **SMS-Ping als Basis** (erreicht jeden, der die Nummer dagelassen hat).
- **Web-Push** für Kunden, die die Web-App installiert haben (kostenlos) — als Ergänzung; SMS bleibt der universelle Fallback.
- Auslöser: Friseur-„fertig/nächster" → Nächster wird gepingt; Reaktionsfrist; bei keiner Reaktion No-Show-Logik (überspringen → ggf. automatisch raus).

**⚠️ GESCHÄFTSRELEVANTE ENTSCHEIDUNG (Alex):** SMS-Anbieter wählen (z. B. Twilio / MessageBird / Vonage). Resend kann **nur E-Mail**, kein SMS. Kosten ~7–10 Cent/SMS; beim Pilot vernachlässigbar. **Vor SG5 zu entscheiden.**

**Abhängig von:** SG3, SG4.

---

## Sub-Goal 6 — Digitale Stempelkarte

**Ziel:** Bindungs-Mechanik, friseur-gesteuert.

**Umfang:** Friseur-Konfig (Anzahl Stempel + Belohnungstext); Stempel **automatisch beim „fertig"** für erkannten Kunden; Walk-In-Onboarding („Stempel sichern? Kunde scannt" → erster Stempel + Anlage als Kunde); Kunden-Ansicht der Karte; „Belohnung fällig" → Friseur tippt „eingelöst" → Karte startet neu. Bewusst minimal (eine Karte, X = eine Belohnung, keine Extras).

**Abhängig von:** SG1, SG2, SG3.

---

## Sub-Goal 7 — Pilot-Härtung

**Ziel:** Bereit für den ersten echten Friseur.

**Umfang:** Wartezeit-Schätzung realistisch kalibrieren; automatisches Ausräumen von No-Shows (Hintergrund-Job/Cron); Uptime-Monitoring (Uptime Robot); Vercel-Rollback testen; einfache Notfall-Anleitung für den Friseur (1 Seite); Domains `snippt.de`/`snippt.app` sichern; rechtliches Minimum (Impressum/Datenschutz, da Handynummern + ggf. IP verarbeitet werden).

**Abhängig von:** SG3–SG6.

---

## Noch offene Umsetzungsdetails (in den jeweiligen Etappen zu lösen)

- Wartezeit-Schätzung: Fixwert pro Friseur vs. gelernter Durchschnitt (SG1/SG7).
- Genaue Friseur-Stress-UI (SG2/SG3).
- iOS/Android-Installations-Hilfe konkret (SG4).
- „unterwegs"-Ehrlichkeit / Anti-Vordrängeln technisch (SG3/SG4) — Grundregel steht im Spec (Abschnitt 7b).
