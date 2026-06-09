# Snippt MVP — Konzept & Design (v1)

**Stand:** 2026-06-09
**Status:** Konzept inhaltlich abgeschlossen; Produkt-Entscheidungen getroffen. Restliche offene Punkte sind Umsetzungsdetails.
**Reihenfolge (mit Alex vereinbart):** 1. Technik-Konzept fertig → 2. Design → 3. Bau. Vor dem Bau-Start kommt eine eigene Design-Phase.
**Vorgänger-Kontext:** ersetzt die alte Salon-zentrierte Roadmap (M0–M9) im Punkt Zielgruppe und Funktionsumfang

---

## 1. Worum es geht — der Pivot

Snippt war ursprünglich als Buchungs- und Steuer-Tool für **Salon-Betreiber** gedacht (mit Salonchef-Dashboard, Wettbewerbs-Matrix, Mehr-Salon-Modell).

**Pivot am 2026-06-09:** Gespräche mit mehreren Salon-Betreibern zeigten klaren Widerstand gegen externe Tools. Dagegen sah ein **einzelner, angestellter Friseur** sofort echten Wert darin, seine Stammkunden zu halten.

→ **Neue Zielgruppe: der einzelne, offene Friseur** (oft angestellt in Salons, deren Chefs weniger konservativ sind). Der Salon-Chef ist nicht mehr Käufer und nicht mehr Ansprechpartner.

---

## 2. Das Kernproblem (Nordstern)

Aus realer Beobachtung: Ein Laufkunde will zu einem bestimmten Friseur, der ist aber **gerade besetzt**. Direkt daneben steht ein **freier Stuhl eines Kollegen**. Der Kunde wechselt — und der Friseur verliert ihn an den **Kollegen im selben Salon**.

**Wichtige Folge:** Den Schmerz spürt **nur der einzelne Friseur**. Der Salon verliert den Kunden nicht (er bleibt im Haus). Genau deshalb ist der Käufer der Friseur, nicht der Salon.

### Ziele der Beteiligten

| Wer | Will | Schmerz heute |
|-----|------|---------------|
| **Friseur** | Jeden Kunden, der zu IHM will, auch bekommen | Verliert besetzt-Momente an den Nachbarstuhl |
| **Kunde** | Schnell schneiden, am liebsten beim Lieblingsfriseur | Langes Warten, zu hohe Kosten |

---

## 3. Das Lösungsmodell: Reihenfolge statt Uhrzeiten

Snippt ist für diesen Markt **kein Terminkalender**, sondern eine **persönliche Live-Warteschlange pro Friseur**.

**Grundprinzip:** Es gibt keine versprochenen Uhrzeiten, nur eine **Reihenfolge**. Jeder Eintrag in der Schlange hat einen von drei Zuständen:

- **bin da** — Kunde steht im Laden
- **bin unterwegs** — Kunde kommt gerade
- **meldet sich nicht**

Der Friseur nimmt immer **den nächsten, der wirklich bereit ist**.

### Warum keine Uhrzeiten

Eine versprochene Uhrzeit (z. B. „15:00") erzeugt zwei Probleme:
1. Sie zwingt den Friseur, den Stuhl freizuhalten und Laufkunden abzuweisen → Terminkalender-Logik, die nicht zur Walk-In-Kultur passt.
2. Sie erzeugt die **Kollision**: Vorbucher (15:00) trifft auf Laufkunde, der sich 14:50 hinsetzt → einer wird enttäuscht.

Mit reiner Reihenfolge verschwindet die Kollision: Es wird nie eine Zeit versprochen, nur „wir sagen dir Bescheid, wenn du dran bist". Wer nicht reagiert, rutscht einen Platz nach hinten (löst zugleich No-Shows).

### Die Aufwands-Regel (entscheidend)

Die Arbeit liegt beim **Kunden**, nicht beim Friseur:

- Der **Kunde** trägt sich selbst ein (QR scannen / Profil öffnen).
- Die App **schätzt die Wartezeit automatisch** (Position × durchschnittliche Schnittdauer).
- Der **einzige** Handgriff des Friseurs: ein Tipp „fertig / nächster" pro abgeschlossenem Schnitt — das rückt die Liste vor und benachrichtigt den Nächsten automatisch.

So entsteht das „Live"-Gefühl, ohne dass der Friseur am Handy klebt.

### Warum das den Wechsel stoppt (Psychologie)

Sieht der Kunde „Tim ist in ~25 Min frei" **+** hat einen **reservierten Platz** **+** wird **gepingt**, dann dreht sich die Logik um:
- Wechseln **kostet** etwas (Platz bei Tim weg).
- Warten ist **billig** (Kaffee holen, wird benachrichtigt).

Aus „ich nehm den freien Stuhl" wird „ich warte kurz auf meinen Mann".

---

## 4. Drei harte Regeln für v1

1. **Für den Kunden komplett kostenlos** — sonst verstärkt Snippt seinen Schmerz „zu teuer".
2. **Warten muss sich kurz anfühlen** — Live-Wartezeit + Benachrichtigung, damit niemand rumsteht.
3. **Auch den „zu lange Wartenden" einfangen** — wenn Tim 45 Min braucht und der Kunde nicht warten kann, bietet Snippt trotzdem die Beziehung an („komm später zu Tim / werd beim nächsten Mal erkannt"). So verliert der Friseur höchstens den einen Schnitt, nicht den Kunden.

---

## 5. Funktionsumfang v1

### Drin

- **Friseur-Profil + persönlicher Link/QR** — der „werde zu Tims Kunde"-Einstieg nach dem Schnitt.
- **Eine Live-Warteschlange pro Friseur** — Kunde trägt sich ein (von zu Hause oder im Laden), sieht aktuelle Wartezeit, wird benachrichtigt wenn er dran ist.
- **Friseur-Ansicht (Mobile)** — die Reihe mit Zuständen „bin da / unterwegs / meldet sich nicht"; ein Tipp „fertig/nächster".
- **Leichte Kundenkartei** — Stammkunden-Erkennung (wer war schon mal da), simple Notiz.
- **Digitale Stempelkarte pro Friseur** — Bindungs-Mechanik (X Stempel = eine Belohnung), friseur-gesteuert. Verstärkt „aus Laufkunde wird Stammkunde" und den Installations-Anreiz.

### Bewusst draußen (später, nicht v1)

- Feste Uhrzeiten / klassischer Terminkalender
- Salonchef-Dashboard, Wettbewerbs-Matrix
- Mehrere Salons / Mandantentrennung (Multi-Tenant)
- Bezahlung / Online-Payment
- Bewertungen, In-App-Chat, WhatsApp-Erinnerungen, Loyalty
- Mehrsprachigkeit (nur Deutsch)

---

## 6. Die wichtigsten Abläufe

### A) Erstkontakt — aus Laufkunde wird „Tims Kunde"
Nach dem Schnitt sagt der Friseur „scann das, dann findest du mich nächstes Mal sofort". Der Kunde scannt den QR (am Stuhl / auf Karte) → landet auf Tims Profil → tippt **„Tim aufs Handy legen"** (Symbol auf dem Startbildschirm; der Friseur hilft kurz). Optional gibt er seine Handynummer an. Dieser eine geführte Handgriff im Laden ist der wichtigste Onboarding-Moment.

### A2) Zweiter Besuch und jedes weitere Mal (von zu Hause)
Kunde tippt das **Tim-Symbol** auf dem Startbildschirm → sieht „Tim — ca. 20 Min Wartezeit" + großen Knopf **„Anstellen"** → tippt → fertig. Zwei Tipps, nichts wird getippt oder gesucht.

### B) Kunde von zu Hause
Öffnet Tims Link → sieht „aktuell ~30 Min Wartezeit" → tippt „ich komme" → ist in der Reihe, Zustand „unterwegs" → wird gepingt, wenn er dran ist.

### C) Kunde im Laden, Tim besetzt
Statt zum freien Nachbarstuhl zu wechseln: scannt QR → „du bist in Tims Liste, ~20 Min" → geht raus / wartet entspannt → Ping → kommt zurück zu Tim.

### D) Friseur im Betrieb
Sieht die Reihe auf dem Handy. Schließt einen Schnitt ab → ein Tipp „fertig" → nächster Eintrag wird benachrichtigt. Sieht pro Person „da / unterwegs / keine Antwort" und entscheidet mit einem Blick, wen er als Nächsten nimmt.

### E) Der „zu lange Wartende"
Wartezeit zu hoch → Snippt bietet „später wiederkommen / beim nächsten Mal erkannt werden", statt den Kunden ganz zu verlieren.

---

## 7. Technische Grundlage (knapp)

- **Aufbau auf dem bestehenden Repo** `alex419-stack/snippt` (lokal `snippt-app`): Next.js 14 App Router, TypeScript, Tailwind + shadcn/ui, Supabase (Postgres + Auth + RLS), Vercel, Resend (E-Mail). Premium-Design-System (Dual-Mode, Inter + Playfair) bleibt.
- **Das vorhandene Einzel-Friseur-Schema passt** (`friseur` 1:1 Login, `kunde`, `termin`). Der früher geplante Multi-Tenant-Umbau **entfällt**.
- **Schema-Anpassung nötig:** Das zentrale Objekt ist nicht mehr ein „Termin" mit Uhrzeit, sondern ein **Warteschlangen-Eintrag** mit Zustand (wartend / unterwegs / da / dran / fertig / abgesprungen) und Reihenfolge. Die `termin`-Tabelle wird entsprechend umgedeutet/ersetzt. *(Detail im Implementierungsplan.)*
- **Bekannte Altlasten aus dem Repo**, die v1 betreffen und zu fixen sind: offene RLS-INSERT-Policy (`WITH CHECK (true)`), E-Mail-Bestätigung/Registrierungs-Race, Slug-Längen-Check. (Siehe `KNOWN_ISSUES.md`.)
- **Installierbare Web-App (PWA):** Snippt wird als „zum Startbildschirm hinzufügbare" Web-App gebaut (Manifest + Service Worker), kein App-Store. Gleicher Code für Friseur- und Kundenseite. Ermöglicht App-Symbol auf dem Handy und kostenlose Push-Nachrichten für alle, die installiert haben.

---

## 7a. Entschieden (2026-06-09): Benachrichtigung & Zurückfinden

- **Keine native Store-App in v1.** Native App bleibt Option für später (nach Pilot), wenn das Modell trägt. Begründung: ein App-Store-Download genau im Begeisterungs-Moment nach dem Schnitt würde die Kunden-Adoption abwürgen; das App-Gefühl liefert die installierbare Web-App ohne diese Hürde.
- **Weg zurück = Symbol auf dem Startbildschirm** (installierte Web-App), ein Tipp. Das ist die einfache Customer Journey.
- **SMS ist NICHT der Weg zurück** (zu umständlich — niemand kramt den Link aus den Nachrichten). SMS ist ausschließlich der **ausgehende Ping** („du bist gleich dran") als Fallback für Kunden, die die Web-App nicht installiert haben.
- **Benachrichtigung:** Wer die Web-App installiert hat → kostenlose Web-Push-Nachricht. Wer nur die Handynummer dagelassen hat → SMS-Ping (ein paar Cent, beim Pilot vernachlässigbar).
- **Konsequenz:** Der make-or-break-Moment ist die geführte Installation („Tim aufs Handy legen") im Laden. Die muss kinderleicht sein.

---

## 7b. Entschieden (2026-06-09): Fairness, No-Show & Stempelkarte

### Warteschlangen-Fairness — gegen Vordrängeln
Grundregel: **Wer auf den Stuhl will, muss da sein** (wie eine Nummer beim Bäcker, aber sie zählt nur, wenn man bei Aufruf wirklich anwesend ist).
- Anstellen darf jeder (von zu Hause oder im Laden) → Platz in der Reihe, Zustand **„unterwegs"**.
- **„da" kann man nicht von zu Hause setzen** — nur durch QR-Scan im Laden. Damit ist Vordrängeln durch Vortäuschen von Anwesenheit sinnlos.
- Bei Aufruf (Ping „du bist dran"): Ist die Person nur „unterwegs", entscheidet der Friseur mit einem Tipp — kurz warten **oder** „nächsten nehmen". Wird sie übersprungen, **verliert sie ihren Platz nicht**, sondern wird beim nächsten freien Stuhl erneut aufgerufen.

### No-Show — freundlich, ohne Strafe
- Aufgerufen, aber nicht da und keine Reaktion → **einmal übersprungen** (rutscht einen runter, bleibt drin).
- Zweimal übersprungen bzw. ~15 Min keine Reaktion → **fällt automatisch aus der Liste** („abgesprungen").
- **Kein Strafpunkt, keine Sperre** — jederzeit mit einem Tipp wieder anstellbar. Friseur kann zusätzlich selbst jemanden mit einem Tipp herausnehmen.
- Begründung: Ein No-Show kostet den Friseur fast nichts (nimmt den Nächsten) → harte Bestrafung würde nur Kunden verschrecken.

### Digitale Stempelkarte
- **Friseur richtet seine Karte selbst ein:** Anzahl Stempel (z. B. 10) + Belohnung als Freitext (z. B. „1 Schnitt gratis").
- **Stempel kommt nur vom Friseur, nie vom Kunden** (Anti-Schummel). Mechanik: **automatisch beim „fertig"-Tippen** für einen erkannten Kunden — kein Mehraufwand.
- **Walk-In-Moment = Onboarding:** Schließt der Friseur einen noch unbekannten Laufkunden ab, fragt die App „Stempel sichern? Kunde scannt kurz" → Kunde bekommt ersten Stempel **und** wird als „Tims Kunde" angelegt (zwei Dinge, ein Moment).
- **Karte voll → Belohnung:** Friseur sieht „Belohnung fällig", gibt sie, tippt „eingelöst", Karte startet neu.
- **Bewusst minimal:** genau eine Karte (X Stempel = eine Belohnung), keine Punkte-Shops, Stufen oder Rabatt-Codes.

---

## 8. Offene Punkte — beim Verfeinern / im Bauplan zu klären

Dies sind nur noch **technische Umsetzungsdetails** (keine Produkt-Entscheidungen mehr offen) — werden im Bauplan gelöst:

1. **Wartezeit-Schätzung realistisch halten:** Durchschnittliche Schnittdauer pro Friseur lernen? Fixwert? Was bei Verzug?
2. **Friseur-Stress-UI:** Was genau sieht er, damit „ein Blick, ein Tipp" auch im vollen Laden reicht?
3. **Installations-Hürde abfedern:** Wie machen wir „Tim aufs Handy legen" auf iPhone (Teilen → Zum Home-Bildschirm) und Android (Installations-Banner) kinderleicht und für den Friseur erklärbar?

*(Erledigt am 2026-06-09: Erstkontakt-Identität & Benachrichtigung → Abschnitt 7a; Fairness, No-Show & Stempelkarte → Abschnitt 7b.)*

---

## 9. Erfolgskriterien für den ersten echten Friseur (Pilot v1)

- Der Friseur **fängt mehr besetzt-Momente ab** als vorher (weniger Kunden wandern zum Nachbarstuhl).
- Erste echte Kunden tragen sich selbstständig in die Liste ein.
- Der Friseur empfindet den Aufwand als „nebenbei" (ein Tipp pro Schnitt), nicht als Last.
- Wiedererkennung: ein Teil der Erstkunden kommt als erkannter Stammkunde zurück.

*(Konkrete Schwellen definieren wir, sobald der Pilot-Friseur feststeht.)*
