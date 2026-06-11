# Snippt — Komplettes Business-Briefing für ein Strategie-Gespräch

> **Zweck dieser Datei:** Dieses Dokument fasst das gesamte Projekt „Snippt" zusammen — Vision, Philosophie, bisheriger Verlauf, Zielgruppe, aktueller Stand, Pricing, Marketing und Sales. Es ist so geschrieben, dass ein KI-Gesprächspartner **ohne jedes Vorwissen** sofort mitreden kann.
>
> **Mein Ziel mit diesem Dokument:** Ich möchte mit dir (Claude) über die **Geschäfts-Strategie** sprechen — konkret über **Preis-Strategie, Marketing-Strategie und Sales-Strategie**. Alle offenen Fragen dazu stehen gebündelt am Ende (Abschnitt 13).
>
> **Stand:** 11.06.2026
> **Quellen:** Snippt-Projektordner (Code + Doku) und mein Obsidian-Notizbuch (Strategie + Pilot).

---

## 1. Was ist Snippt — in einem Satz

Snippt ist eine **installierbare Handy-App (Web-App) für den einzelnen Friseur**, die seine Laufkundschaft über eine **Live-Warteschlange ohne Uhrzeiten** bei IHM hält und sie über eine **digitale Stempelkarte** zu Stammkunden macht.

**Wichtig zum Verständnis:** Snippt ist **kein** Terminkalender und **kein** Salon-Verwaltungs-Tool. Es ist ein persönliches Werkzeug für **einen Friseur**, nicht für den Salon-Chef.

---

## 2. Vision & Philosophie

### Die Grund-Idee
Ein Friseur hat ein paar Lieblings-Kunden, die regelmäßig kommen. Aber wenn er gerade besetzt ist — oder im Urlaub — gehen diese Kunden zu einem Kollegen oder zur Konkurrenz. Der Friseur verliert sie, ohne es steuern zu können. **Snippt sorgt dafür, dass die Kunden bei IHREM Friseur bleiben.**

### Die Philosophie dahinter
- **Der einzelne Friseur ist seine eigene Marke**, nicht ein austauschbarer Stuhl im Salon. (Fachbegriff: „Personalbranding" — der Friseur baut seinen eigenen Namen/Ruf auf.)
- **Laufkundschaft systematisch in Stammkundschaft verwandeln.** Das ist der Kern-Mechanismus. (Laufkundschaft = Leute, die spontan reinkommen. Stammkundschaft = Leute, die immer wiederkommen.)
- **Premium-Qualität ist Pflicht, nicht Kür.** Das Design soll aussehen wie bei den besten Tech-Firmen (Stripe, Linear, Cal.com) — aber zu einem Spottpreis. Motto intern: „Stripe-Niveau zum Schnitt-Preis."
- **Die Arbeit liegt beim Kunden, nicht beim Friseur.** Der Friseur soll im Laden-Stress nur einen einzigen Knopf drücken müssen. Alles andere macht der Kunde selbst oder die App automatisch.

### Wert für die drei Beteiligten
| Wer | Was er davon hat |
|-----|------------------|
| **Friseur** (der Nutzer + Käufer) | Stammkunden bleiben bei ihm → mehr Verdienst, eigener Markenaufbau, Kundenbindung |
| **Endkunde** (der Gast) | Kein Anrufen nötig, sieht seinen Friseur live, kann spontan kommen oder vorab anstellen |
| ~~Salon-Chef~~ | **Nicht mehr Zielgruppe** (siehe Pivot, Abschnitt 5) |

---

## 3. Das Kernproblem (der „Nordstern")

Dieses eine Szenario ist der Kern von allem:

> Ein Laufkunde will zu Tim (seinem Friseur). Tim ist gerade besetzt. Direkt daneben sitzt ein freier Stuhl eines Kollegen. Der Kunde wechselt zum Kollegen → **Tim verliert ihn an den Kollegen im selben Salon.**

**Entscheidende Erkenntnis:** Diesen Schmerz spürt **nur der einzelne Friseur**. Der Salon-Chef nicht (ihm ist egal, welcher seiner Stühle den Kunden bekommt — Hauptsache im Salon). Deshalb ist der Friseur der Käufer, nicht der Chef. (Das ist der ganze Grund für den Pivot, siehe Abschnitt 5.)

---

## 4. Die Lösung — die drei Kern-Features

### 4.1 Live-Warteschlange ohne Uhrzeiten (das Herzstück)

Snippt ist **kein Terminkalender mit festen Uhrzeiten**, sondern eine **persönliche Live-Warteschlange pro Friseur**. Es gibt **keine Uhrzeiten** (weil man die im Friseur-Alltag nie einhalten kann), sondern **nur eine Reihenfolge + einen Status**.

**Drei mögliche Zustände pro Kunde in der Reihe:**
1. **„bin da"** — Kunde steht physisch im Laden. Kann **nur per QR-Scan im Laden** gesetzt werden (Schutz gegen Schummeln/Vordrängeln von zu Hause).
2. **„bin unterwegs"** — Kunde kommt gerade.
3. **„meldet sich nicht"** — Kunde reagiert nicht.

**Wie es den Kundenwechsel stoppt (die Psychologie):**
Sieht der Kunde „Tim ist in ~25 Min frei" + hat einen reservierten Platz + wird automatisch benachrichtigt, wenn er dran ist:
- Wechseln **kostet** etwas (der gute Platz bei Tim ist dann weg).
- Warten ist **billig** (kurz einen Kaffee holen, man wird ja gepingt).
- → Aus „ich nehm halt den freien Stuhl" wird „ich warte kurz auf meinen Mann".

**Fairness gegen Vordrängeln:**
- Anstellen darf jeder (von zu Hause oder im Laden) → man bekommt einen Platz, Status „unterwegs".
- „da" kann man **nicht** von zu Hause setzen — nur per QR-Scan vor Ort.
- Wird jemand übersprungen (weil er nur „unterwegs" und nicht da ist), **verliert er seinen Platz nicht** — er wird beim nächsten freien Stuhl erneut aufgerufen.

**Der Aufwand liegt beim Kunden, nicht beim Friseur:**
- Kunde trägt sich selbst ein (QR scannen / Profil öffnen).
- App schätzt Wartezeit automatisch (Position in der Reihe × durchschnittliche Schnittdauer).
- Einziger Handgriff des Friseurs: **ein Tipp „fertig / nächster"** pro abgeschlossenem Schnitt. Die Reihe rückt vor, der Nächste wird automatisch benachrichtigt.

### 4.2 Digitale Stempelkarte (das Bindungs-Tool)

Eine digitale Version der bekannten Papier-Stempelkarte („10x schneiden, 1x gratis").

- **Friseur richtet seine Karte selbst ein:** Anzahl Stempel (z. B. 10) + Belohnung als freier Text (z. B. „1 Schnitt gratis").
- **Stempel kommt nur vom Friseur, nie vom Kunden** (Schutz gegen Schummeln).
- **Automatisch beim „fertig"-Tippen:** Schließt der Friseur einen erkannten Kunden ab, bekommt der automatisch seinen Stempel — kein Mehraufwand.
- **Der Walk-In-Moment ist das Onboarding:** Schließt der Friseur einen noch unbekannten Laufkunden ab, fragt die App: „Stempel sichern? Kunde scannt kurz." → Der Kunde bekommt seinen ersten Stempel **UND** wird als „Tims Kunde" angelegt. Zwei Dinge in einem Moment: aus einem Fremden wird ein erfasster Stammkunde.
- **Karte voll → Belohnung:** Friseur sieht „Belohnung fällig", gibt sie, tippt „eingelöst", Karte startet neu.
- **Bewusst minimal:** Genau eine Karte (X Stempel = eine Belohnung). Keine Punkte-Shops, keine Stufen, keine Rabatt-Codes.

**No-Show / kein-Erscheinen — freundlich, ohne Strafe:** Reagiert ein Kunde nicht, kann der Friseur ihn überspringen (er wird später erneut aufgerufen). Es gibt keinen Stempel fürs Nicht-Erscheinen, aber auch keine Strafe, keine Sperre. Bewusst positive Verstärkung statt Bestrafung.

### 4.3 PWA — installierbare Web-App

PWA heißt: eine Website, die sich wie eine echte App aufs Handy installieren lässt (Symbol auf dem Startbildschirm), **ohne den Umweg über App Store / Play Store**.

- Kostenlos, direkt über einen Web-Link erreichbar.
- Gleicher Code für Friseur- und Kundenseite.
- Ermöglicht: App-Symbol auf dem Handy **+ kostenlose Push-Nachrichten** an alle, die installiert haben.
- Kunde hat einen **Soft-Account**: nur Name + Handynummer, keine Login-Hürde (Magic-Link beim 2. Besuch). „Soft-Account" = ein Konto, das fast unsichtbar im Hintergrund entsteht, ohne dass der Kunde sich aktiv registrieren muss.

---

## 5. Der Pivot-Verlauf (die Geschichte des Projekts)

Snippt hat sich zweimal wesentlich gedreht. Das ist wichtig zu verstehen, weil ältere Dokumente teilweise noch den alten Stand beschreiben.

### Frühe Phase (April/Mai 2026): Salon-Tool
- Arbeitsname zuerst „Chairly", dann auf **„Snippt"** umbenannt (30.04.2026, Markenrechts-Check bei DPMA + EU sauber).
- Ursprüngliche Idee: ein **Salon-Management-Tool** für Salon-Chefs, mit Dashboard, „Wettbewerbs-Matrix" zwischen Friseuren, Multi-Salon-Struktur (Fachbegriff „Multi-Tenant" = ein System, das viele getrennte Salons gleichzeitig bedient).

### Pivot 1 (02.05.2026): Zielgruppe + Preis geschärft
- Zielgruppe enger gefasst: **Long-Tail-Barbershops** mit 15–22 €-Schnitten (türkische Barbershops, Quartiersfriseure — Läden, die heute mit Telefon + Notizbuch + Walk-In arbeiten und in keinem Buchungs-Tool registriert sind).
- Preis als Fixzahl: **€7/Friseur/Monat** als Pilot-Preis.
- Erkenntnis: „Der direkte Konkurrent ist nicht Fresha/Booksy, sondern Telefon + Notizbuch."

### Pivot 2 (09.06.2026): DER große Schwenk — vom Salon zum einzelnen Friseur
Das ist der entscheidende, aktuell gültige Stand.

- **Auslöser:** Mehrere echte Gespräche mit Salon-Betreibern zeigten klaren Widerstand gegen externe Tools (Kontrolle, Datenschutz, „brauch ich nicht"). Dagegen erkannte der **einzelne Friseur** sofort echten Wert.
- **Raus:** Salon-Chef-Dashboard, Wettbewerbs-Matrix, Multi-Salon-Umbau, das alte warm-helle (cremeweiße) Design.
- **Rein:** Eine reine **Einzel-Friseur-App**. Kern ist die Live-Warteschlange ohne Uhrzeiten + die digitale Stempelkarte, als installierbare PWA.
- **Neue Design-Richtung:** dunkel, leuchtend, farbig, modern, hochwertig (ersetzt das alte cremeweiße System).
- **Technischer Glücksfall:** Das alte Code-Fundament war ohnehin schon auf einen einzelnen Friseur ausgelegt — der geplante komplizierte Multi-Salon-Umbau **entfällt** komplett. Der MVP-Kern wurde an einem Abend gebaut und läuft.

---

## 6. Zielgruppe (sehr scharf definiert)

### Wer IST der Kunde (Käufer + Nutzer)
- **Der einzelne Friseur**, meist angestellt in einem Salon.
- Arbeitet in **Long-Tail-Barbershops** (kleine Läden, 1–3 Friseure, nicht Ketten).
- Schnitt-Preise **15–22 €**.
- Stammkunden-fokussiert („meine Kunden sollen wiederkommen"), nicht transaktions-fokussiert.
- Smartphone-/Tablet-gewöhnt, kommunikativ, offen.
- Nutzt heute **WhatsApp** für Termine — **nicht** Planity/Treatwell/Fresha.
- **Pilot-Markt: Hamburg.**

### Wer ist NICHT der Kunde (Anti-Persona — aus echten Gesprächen gelernt)
- Salon-Besitzer / Manager, die zentral kontrollieren wollen.
- Multi-Standort-/Corporate-Denker.
- Tech-Skeptiker.
- Reine Preis-Verhandler / Wettbewerbs-Denker (statt Kundenbindungs-Denker).

### Die Marktlücke
Etablierte Tools (Fresha, Booksy, Planity, Shore, Treatwell, studiolution) zielen alle auf den **Salon als Einheit**. Die Long-Tail-Barbershops mit 15–22 €-Schnitten sind dort **gar nicht registriert** — ein unbeackerter Markt. Snippts struktureller Unterschied: **der Friseur als Marke** + **Live-Walk-In-Status** + **Laufkunde-zu-Stammkunde-Mechanik**.

---

## 7. Aktueller Stand — was schon gebaut & live ist

- **Code-Repository:** `alex419-stack/snippt` (GitHub). Lokal unter `…/Snippt/snippt-app`. Aktiver Branch: `mvp-pivot-konzept`.
- **Tech-Stack:** Next.js 14 + TypeScript, Supabase (Datenbank + Login), Tailwind + shadcn/ui (Design), Vercel (Hosting), Resend (E-Mail), Vitest (Tests für die wichtige Logik).
- **Live im Internet:** **https://snippt-seven.vercel.app** — läuft produktiv, Datenbank-Verbindung verifiziert.
- **Startseite (Messaging):** „Deine Stammkunden, immer im Blick." Du-Form, persönlich, kein SaaS-Jargon. CTA „Kostenlos testen".
- **Demos:** drei Use-Cases visualisiert (Stammkundenliste, Reihen-Management, WhatsApp-Benachrichtigungen), mobile-first, im neuen dunklen Design.
- **Gebauter MVP-Kern:** Live-Warteschlange / Reihen-Management, Stempel-/Belohnungs-Logik, WhatsApp-Benachrichtigungs-Infrastruktur vorbereitet.
- **WhatsApp-Integration:** Anleitung geschrieben (Setup, Kosten, Templates). Wichtigster Kosten-Hebel: Benachrichtigungen als „Utility"-Kategorie verschicken (billig/kostenlos) statt „Marketing" (~0,11 € pro Nachricht). Noch nicht live im Einsatz, für den Pilot vorbereitet.

### Roadmap-Status (Sub-Goals des MVP)
- SG0 Aufräumen/Pivot ✅ · SG1 Datenmodell ✅ · SG2 Design-Phase (Richtung steht: dunkel/leuchtend) · SG3 Friseur-Warteschlange (Kern gebaut) · SG4 Kunden-Profil + Anstellen + PWA-Installation · SG5 Benachrichtigungen · SG6 Stempelkarte · SG7 Pilot-Härtung.
- **Noch vor dem echten Pilot zu fixen (Sicherheit):** Registrierungs-Race-Condition, Slug-Blacklist (damit niemand sich „admin"/„api" als Profil-Adresse nimmt), öffentliche Termin-Inserts absichern.

---

## 8. PRICING — aktueller Stand (HIER GIBT ES EINEN OFFENEN PUNKT)

**Achtung — Widerspruch in meinen eigenen Unterlagen, den ich klären will:**

| Quelle | Datum | genannter Preis |
|--------|-------|-----------------|
| Projekt-Doku (CLAUDE.md), Kern-Entscheidung #1 | 02.05.2026 | **€7 / Friseur / Monat** |
| Meine Obsidian-Notiz „Feinschliff + Kostenstrategie" | 10.06.2026 (neuer) | **€4,99 / Monat** (≈ €59,88/Jahr) |

Die **€4,99 ist die jüngere** Entscheidung, also vermutlich der aktuelle Stand — aber bewusst final festgelegt ist das nicht. **Das ist genau eines der Themen, über die ich mit dir sprechen will.**

### Bisherige Pricing-Logik (Begründung für den niedrigen Preis)
- **Schmerz-Level ist spürbar, aber nicht existenziell** → kein Preis im oberen Bereich durchsetzbar.
- **Umsatz pro Friseur ist klein** (grob €20–100/Tag-Größenordnung bei 15–22 €-Schnitten, dünne Marge).
- **Unter 5 € = sehr niedrige Einstiegs-Hürde** („No-Brainer"). Gedankenanker: „€7/Mo = ein einziger Schnitt pro Monat."
- **Fokus auf langfristige Kundenbindung (LTV)** statt schnellem Gewinn.
- **Finale Preis-Strategie** (z. B. Lifetime-Deal, Mengen-Rabatt, Stufenmodell) bewusst **erst nach der Pilot-Auswertung** entscheiden.

### Pitch-Reihenfolge (bewusst gewählt)
Erst der Wow-Moment (Friseur-Profilseite aus Kundensicht zeigen, Mechanik erklären), **dann erst** der Preis. Der Preis-Reveal kommt als Erleichterung („so wenig?"), nicht als Hürde.

---

## 9. MARKETING — bisheriger Stand

- **Botschaft / Positionierung:** „Deine Stammkunden, immer im Blick." Emotion (Kundenbindung) vor Funktions-Aufzählung.
- **Storyline:** „Eure Laufkundschaft kommt rein, schneidet, geht — und ihr seht sie nie wieder. Snippt verwandelt sie in Stammkundschaft, mit Premium-UX zum Schnitt-Preis."
- **Bildsprache:** Long-Tail-Barbershop (kein Premium-Hochglanz-Salon). Du-Form, persönlich.
- **Kanal aktuell:** ausschließlich **Direktkontakt** — vor Ort / WhatsApp / persönlich. **Bewusst KEIN** Paid Advertising, kein Marktplatz, keine Massen-Kampagne (zu früh, erst Pilot validieren).
- **Geplanter Proof:** eine Pilot-Erfolgsgeschichte (Case Study mit dem ersten Friseur) als späteres Marketing-Asset.

---

## 10. SALES / PILOT — bisheriger Stand

### Die Sales-Philosophie: das PCP-Modell
Aus „Diary of a CEO" übernommen, prägt meine Gesprächsführung. PCP = **P**erception, **C**ontext, **P**ermission:
- **Perception (Wahrnehmung):** Mit dem richtigen Bild einsteigen — „Tool für DEINEN Kundenstamm", nicht „Tool für mehrere Nutzer".
- **Context (Kontext):** Am richtigen Ort, auf Augenhöhe (Walk-In in den Laden, Gespräch vor/nach dem Schnitt) — nicht von oben herab.
- **Permission (Erlaubnis):** Nicht zu früh verkaufen. Erst wenn der Friseur das Problem selbst ausspricht und fragt „Was wäre der nächste Schritt?", ist Verkaufen erlaubt.

Aus echten Gesprächen gelernt: Genau diese Frame-Fehler (falsche Wahrnehmung, von oben herab, zu früh verkauft) führten anfangs zu Absagen — und damit zur Pivot-Erkenntnis, dass der Friseur (nicht der Chef) der Käufer ist.

### Outreach-Plan (13.05.2026)
- Ziel: 3–5 Problem-Interviews mit Friseuren in Hamburg → daraus 1 Pilot-Friseur gewinnen.
- Interview-Aufbau (3 Phasen, ~30 Min): Alltag verstehen → Schmerzpunkt vertiefen → Bedarf testen.
- **Pilot-Auswahlkriterien:** (1) Feedback-Bereitschaft [wichtigster Punkt], (2) technische Grundoffenheit, (3) kein direkter Wettbewerber, (4) in Hamburg erreichbar, (5) mind. 6 Monate Erfahrung.

### Pilot-Kandidaten (Hamburg)
- **Top-Kandidat #1: OSI Barbier** (Inhaber **Osama**, Uhlenhorst, Papenhuder Str. 52). 4.580 Instagram-Follower. Nutzt **kein** Buchungssystem, nur WhatsApp. Stammkunden- und Community-fokussiert, Walk-Ins willkommen, Kundenlob „bestes Preis-Leistungs-Verhältnis / man fühlt sich verstanden". Status: Gespräch geplant.
- Weitere auf der Longlist: Elbsalon (Winterhude), Bawo Barbier (Eppendorf), Kandidaten in Eimsbüttel/Schanze/Altona.

### Erfolgskriterien für den Pilot
- Buchungen über App ≥ 30 % aller Termine, Walk-In-Anteil ≥ 10 %, Soft-Account-Adoption ≥ 40 % der Wiederkehrer, Friseur sagt „Ja" zum Preis, ≥ 60 % der Pilot-Friseure wollen weiternutzen.
- **Kill-Switch:** 3+ Kriterien unter Schwelle → Projekt stoppen oder neu drehen.

---

## 11. Bewusst NICHT im MVP (Abgrenzung)

Online-Zahlung, Bewertungen, In-App-Chat, automatische WhatsApp-Erinnerungen (Infrastruktur vorbereitet, aber nicht aktiv), komplexe Loyalty-/Rabattcode-Systeme, Mehrsprachigkeit (nur Deutsch, DACH-Fokus), Salon-Wechsel-Logik, Multi-Salon. Bewusst schlank: lieber 3 Funktionen richtig als 10 halb.

---

## 12. Konkurrenz-Landschaft (zur Einordnung)

- **Etablierte Buchungs-Tools:** Fresha, Booksy, Planity, Shore, Treatwell, studiolution. Alle zielen auf den **Salon als Einheit**, alle provisionsfrei (deshalb ist „keine Provision" KEIN Verkaufsargument mehr — es ist Erwartung). In den Long-Tail-Barbershops sind sie schlicht nicht präsent.
- **Der eigentliche Konkurrent:** **Telefon + Notizbuch + WhatsApp.** Das ist der Status quo, den Snippt ablösen will.

---

## 13. Worüber ich mit dir sprechen will (die offenen Strategie-Fragen)

Das ist der eigentliche Anlass für dieses Dokument. Ich möchte mit dir folgende drei Bereiche durchgehen:

### A) Preis-Strategie
1. **€4,99 vs. €7 pro Friseur/Monat — was ist klüger?** Oder sogar ein ganz anderer Anker? (Argumente für niedrig: No-Brainer, dünne Marge der Läden. Argumente für höher: Premium-Anspruch, Wert der Kundenbindung, Wahrnehmung „zu billig = nicht ernst zu nehmen".)
2. **Ab wann Geld nehmen?** Pilot kostenlos und erst danach Preis? Oder von Anfang an einen kleinen Preis, um echte Zahlungs-Bereitschaft zu testen?
3. **Welches Modell langfristig?** Reines Monats-Abo, Lifetime-Deal für Früh-Kunden, Mengen-/Salon-Rabatt, Stufenmodell?
4. **Wie skaliert der Preis,** wenn aus „1 Friseur" mehrere Friseure im selben Laden werden?

### B) Marketing-Strategie
1. **Wie komme ich nach dem ersten Pilot vom Einzelfall zu Reichweite** — ohne früh Geld für Werbung zu verbrennen?
2. **Welcher Kanal passt zur Zielgruppe** (türkische / Quartiers-Barbershops, WhatsApp-Welt, Instagram-affin)? Instagram? Mundpropaganda unter Friseuren? Friseur-Influencer?
3. **Wie baue und nutze ich die Pilot-Erfolgsgeschichte** als Marketing-Hebel?
4. **Positionierung:** Ist „Deine Stammkunden, immer im Blick" stark genug — oder soll der Walk-In-/Warteschlangen-Aspekt stärker nach vorne?

### C) Sales-Strategie
1. **Wie wird aus 1 Pilot-Friseur ein wiederholbarer Verkaufsprozess?** (Heute alles Direktkontakt 1:1 — wie systematisieren, ohne die persönliche Augenhöhe zu verlieren?)
2. **Friseur als Einstieg, Salon als Ausweitung?** Lohnt es, über zufriedene Einzel-Friseure in den ganzen Laden hineinzuwachsen — obwohl der Chef bewusst NICHT die Zielgruppe ist?
3. **Was ist das richtige „Ja"** beim ersten Gespräch — sofort zahlender Pilot, oder erst kostenlos testen lassen und später konvertieren?
4. **Wie viele Piloten gleichzeitig?** Erst einer (OSI Barbier) sauber, dann ausrollen — oder von Anfang an 2–3 parallel für besseren Vergleich?

---

## Anhang: Quellen-Übersicht

**Projektordner (Code + Doku):**
- `docs/superpowers/specs/2026-06-09-snippt-mvp-design.md` — das gültige MVP-Konzept (Warteschlange, Stempelkarte, PWA, Design)
- `docs/superpowers/plans/2026-06-09-snippt-mvp-roadmap.md` — Bau-Etappen
- `docs/superpowers/specs|plans/2026-06-10-*` — Belohnung einlösen + Reihe/Termine verwalten (Folge-Etappen)
- `docs/whatsapp-integration-anleitung.md` — WhatsApp-Setup + Kosten
- `CLAUDE.md` — Projekt-Identität, Kern-Entscheidungen (Achtung: Pricing-Stand €7 dort ist überholt)

**Obsidian-Notizbuch (Strategie + Pilot):**
- `10 - Projekte/Snippt/2026-05-13 — Friseur-Outreach-Plan.md`
- `10 - Projekte/Snippt/Pilotphase/` — Persona-Hypothese, Partner-Interview, Longlist Hamburg, Kandidat OSI Barbier
- `10 - Projekte/Snippt/2026-06-09 — MVP-Pivot + funktionierender Kern.md` — der große Schwenk
- `10 - Projekte/Snippt/2026-06-10 — *` — Belohnung, Reihe/Termine, WhatsApp + Kostenstrategie (€4,99), Vercel live + Design
- `20 - Wissen/2026-05-07 — Diary of a CEO — PCP-Modell.md` — Sales-Gesprächsmodell

*Erstellt 11.06.2026 als Gesprächs-Grundlage für die Business-Strategie (Preis, Marketing, Sales).*
