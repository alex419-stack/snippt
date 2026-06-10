# Belohnung einlösen — Konzept & Design

**Stand:** 2026-06-10
**Status:** Entwurf mit Alex abgestimmt und freigegeben.
**Kontext:** Baut auf dem MVP (`2026-06-09-snippt-mvp-design.md`) auf. Schließt die Stempelkarten-Schleife: Stempel sammeln existiert, Einlösen fehlt noch.

---

## 1. Worum es geht

Die digitale Stempelkarte sammelt schon automatisch Stempel: Jedes Mal, wenn der Friseur über „Fertig → Nächsten" einen Schnitt abschließt und ein wiedererkannter Kunde (per Geräte-Token) verknüpft ist, bekommt dieser Kunde einen Stempel.

Was fehlt: Wenn die Karte voll ist (z. B. 10/10), gibt es **keinen Weg, die Belohnung einzulösen**. Die Karte zeigt dem Kunden zwar „Voll! Deine Belohnung …", aber der Friseur kann sie nicht als gewährt markieren und zurücksetzen. Damit ist die Stammkunden-Mechanik nur halb fertig.

---

## 2. Fachliche Entscheidung (mit Alex abgestimmt)

**Auslöser:** Der **Friseur entscheidet bewusst per Knopf**. Bei voller Karte erscheint beim aktuellen Kunden ein zusätzlicher Knopf „Belohnung einlösen (gratis)". Nicht automatisch — der Friseur drückt ihn, wenn der Kunde den Gratis-Schnitt einfordert.

**Was „einlösen" bedeutet:**
- Die ältesten *Ziel*-vielen (z. B. 10) noch nicht eingelösten Stempel des Kunden werden als eingelöst markiert (`eingeloest_at = jetzt`).
- Dieser Gratis-Schnitt zählt **keinen** neuen Stempel (sonst stünde die Karte sofort wieder bei 1).
- Eventueller Überhang bleibt erhalten: Hat der Kunde 11 offene Stempel, werden 10 eingelöst, 1 bleibt → Karte zeigt danach 1/10.

**Begründung Auslöser-Wahl:** Reale Salons wollen kontrollieren, wann der Gratis-Schnitt gewährt wird (Kunde muss ihn einfordern). Automatik würde dem Friseur die Kontrolle nehmen.

---

## 3. Architektur

Vier Schichten, jede mit einer klaren Aufgabe:

### 3.1 Datenbank — keine Migration nötig
Die Tabelle `stempel` hat bereits das Feld `eingeloest_at`. Die RLS-Policy „Friseur verwaltet eigene Stempel" (`for all`) erlaubt dem eingeloggten Friseur, seine eigenen Stempel direkt zu bearbeiten. Es ist **kein neues SQL und keine Migration** erforderlich.

### 3.2 Dashboard-Abfrage erweitern
Beim Laden der Reihe (`app/dashboard/page.tsx`, Warteschlangen-Zweig) wird die Query um `kunde_id` pro Eintrag erweitert. Anschließend eine **Sammelabfrage** über alle vorkommenden `kunde_id`: Anzahl offener Stempel (`eingeloest_at is null`) pro Kunde. Daraus pro Eintrag:
- `stempelVoll: boolean` (offene Stempel ≥ `friseur.stempel_anzahl`)
- optional Zähler für Anzeige.

Wenn `friseur.stempel_anzahl` NULL ist (keine Stempelkarte aktiv), ist nie eine Karte „voll" → kein Einlöse-Knopf.

### 3.3 Server-Aktion `belohnungEinloesen`
Neue Aktion in `app/dashboard/actions.ts`, analog zu `fertigNaechster`, aber:
1. Aktuellen Eintrag auf `fertig` setzen (`fertig_at = jetzt`).
2. **Statt** einen neuen Stempel zu vergeben: die ältesten `stempel_anzahl` offenen Stempel des verknüpften Kunden als eingelöst markieren (`eingeloest_at = jetzt`).
3. Nächsten aktiven Eintrag aufrufen.
4. `revalidatePath('/dashboard')`.

Die gemeinsame Logik „Eintrag abschließen + Nächsten aufrufen" wird aus `fertigNaechster` in eine private Hilfsfunktion gezogen (`abschliessenUndNaechsten`), die beide Aktionen nutzen — damit kein doppelter Code entsteht. `fertigNaechster` ruft sie mit „Stempel vergeben", `belohnungEinloesen` mit „Stempel einlösen".

**Technische Wahl:** einfache Server-Aktion statt SECURITY-DEFINER-RPC. Begründung: Der eingeloggte Friseur darf seine Stempel laut RLS ohnehin direkt bearbeiten; `fertigNaechster` macht es schon genauso (direkter Tabellen-Insert über den authentifizierten Client). Gleicher Stil, kein neues SQL, keine Migration zum Freigeben.

### 3.4 Bedienoberfläche (`QueueBoard.tsx`)
- Typ der Einträge lokal im Dashboard erweitern (`kundeId`, `stempelVoll`) — **nicht** `lib/mockQueue` verändern, da das ein geteilter Mock-Typ ist.
- „Jetzt dran"-Karte: bei `stempelVoll` ein Abzeichen „⭐ Karte voll" und ein **zweiter Knopf** „Belohnung einlösen (gratis)" unter dem normalen „Fertig → Nächsten". Beide sind separate `<form action=…>`.
- Wartende Einträge: kleines „⭐ Karte voll"-Abzeichen als Vorab-Hinweis.
- Design-Tokens des bestehenden dunkel-leuchtenden Systems verwenden (`snippt-*`), kein Bruch.

### 3.5 Kundenseite — keine Änderung
`StempelKarte.tsx` und die RPC `mein_stempelstand` zählen nur offene Stempel (`eingeloest_at is null`). Nach dem Einlösen sind die alten Stempel eingelöst → Karte zeigt automatisch wieder 0/10. Konsistent ohne Zusatzarbeit.

---

## 4. Datenfluss (ein Einlöse-Vorgang)

1. Friseur sieht beim „Jetzt dran"-Kunden „⭐ Karte voll".
2. Friseur drückt „Belohnung einlösen (gratis)".
3. Server-Aktion: Eintrag → `fertig`; älteste `ziel` offene Stempel des Kunden → eingelöst; **kein** neuer Stempel; nächster Eintrag → `aufgerufen`.
4. Dashboard lädt neu, nächster Kunde steht oben.
5. Kunde öffnet seine Profilseite → Karte steht wieder bei 0/10.

---

## 5. Randfälle

- **Gast ohne Konto** (`kunde_id` NULL): keine Karte, kein Knopf. Unverändert.
- **Karte exakt voll vs. Überhang:** Es werden genau `ziel` Stempel eingelöst (älteste zuerst). Überhang bleibt.
- **Keine Stempelkarte aktiv** (`stempel_anzahl` NULL): nie „voll", kein Knopf.
- **Gleichzeitige Bedienung:** RLS + Friseur-Eigentum sichern ab; für MVP ausreichend.

---

## 6. Tests

Kritische Logik bekommt Tests (Projektregel — Treuewert ist geld-nah):
- Einlösen markiert **genau** `ziel` Stempel als eingelöst (nicht mehr, nicht weniger).
- Einlösen vergibt **keinen** neuen Stempel.
- Nach Einlösen steht der offene Stand auf `gesammelt − ziel` (Überhang korrekt).
- Eintrag wird `fertig`, nächster wird aufgerufen (geteilte Logik unverändert).

UI bekommt keine Tests (Projektregel).

---

## 7. Bewusst nicht im Umfang

- Kein QR-Code / Vorzeige-Mechanik für den Kunden (Friseur sieht den vollen Stand auf seinem eigenen Dashboard — reicht für MVP).
- Keine Einlöse-Historie / Auswertung („wie viele Belohnungen gewährt").
- Keine Einlösung außerhalb der aktiven Reihe (nur am „Jetzt dran"-Kunden).
