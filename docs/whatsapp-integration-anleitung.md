# WhatsApp in Snippt einbauen — Schritt-für-Schritt-Anleitung

> Stand: 10. Juni 2026
> Diese Anleitung erklärt in einfacher Sprache, wie Snippt seinen Kunden Nachrichten über WhatsApp schickt (z. B. „Du bist als Nächstes dran"). Sie ist in zwei Teile geteilt: **was du selbst bei Meta/WhatsApp einrichten musst** und **was ich danach im Code mache**.

---

## 1. Worum geht es überhaupt?

Snippt soll dem Kunden Bescheid geben, wenn er in der Reihe vorne ist — ohne dass jemand anrufen muss. Der natürliche Kanal dafür ist **WhatsApp**, weil es fast jeder Kunde sowieso auf dem Handy hat und sofort sieht.

Damit eine App automatisch WhatsApp-Nachrichten verschicken darf, reicht **kein normales WhatsApp**. Man braucht einen offiziellen Zugang von Meta (dem Mutterkonzern von WhatsApp): die **WhatsApp Business Platform**. Stell dir das vor wie den Unterschied zwischen einem privaten Briefkasten und einem Postvertrag, mit dem ein Unternehmen automatisiert Briefe verschicken darf — für den Vertrag gelten Regeln, eine Prüfung und ein Preis pro Brief.

Diese Regeln gibt es, damit niemand Spam über WhatsApp verschickt. Deshalb dauert die Einrichtung ein paar Tage und nicht fünf Minuten.

---

## 2. Zwei Wege zum WhatsApp-Zugang — welcher ist besser?

Es gibt zwei Möglichkeiten, an den Zugang zu kommen. Das ist die einzige echte Geschäftsentscheidung in dieser Anleitung, deshalb hier ausführlich mit Vor- und Nachteilen.

### Weg A: Direkt über Meta (die „Cloud API")

Du richtest den Zugang direkt bei Meta ein. Meta betreibt die Technik kostenlos auf seinen eigenen Servern, du zahlst nur die einzelnen Nachrichten.

**Vorteile:**
- **Keine monatliche Grundgebühr** — du zahlst nur, was du wirklich verschickst (und die wichtigsten Snippt-Nachrichten sind sogar kostenlos, siehe Abschnitt 6).
- Kein dritter Anbieter, der mitverdient — günstigster Preis pro Nachricht.
- Volle Kontrolle, alles läuft direkt zwischen Snippt und Meta.

**Nachteile:**
- Die Ersteinrichtung ist etwas technischer (Konto bei Meta, App anlegen, Schlüssel erzeugen). Den technischen Teil übernehme aber ich.
- Support kommt nur von Meta selbst (Online-Hilfe), kein persönlicher Ansprechpartner.

### Weg B: Über einen Dienstleister (einen „BSP" wie Twilio, 360dialog, MessageBird)

Ein Zwischen-Anbieter nimmt dir einen Teil der Einrichtung ab und stellt eine einfachere Oberfläche bereit.

**Vorteile:**
- Etwas bequemere Einrichtung, oft mit deutschem Support und Rechnung.
- Manche bieten fertige Werkzeuge (Nachrichten-Verwaltung, Statistiken) obendrauf.

**Nachteile:**
- **Aufpreis auf jede Nachricht** und meist eine **monatliche Grundgebühr** (oft 0–50 €/Monat, je nach Anbieter).
- Du bist von einem weiteren Unternehmen abhängig.
- Für einen einzelnen Friseur mit wenigen Nachrichten am Tag lohnt sich der Aufpreis kaum.

### Meine Empfehlung

**Weg A (direkt über Meta).** Für den Piloten mit einem einzelnen Friseur und überschaubaren Nachrichtenmengen ist das mit Abstand am günstigsten — keine Grundgebühr, die Kern-Nachricht ist kostenlos. Der einzige Nachteil (technischere Einrichtung) fällt für dich weg, weil ich den Code-Teil mache. Falls Snippt später auf viele Friseure wächst und du Komfort-Werkzeuge oder deutschen Support willst, kann man jederzeit auf einen Dienstleister umsteigen.

Der Rest dieser Anleitung beschreibt **Weg A**.

---

## 3. Was du selbst einrichten musst (bei Meta)

Diesen Teil kann ich nicht für dich machen, weil er an deine Identität und deine Telefonnummer gebunden ist. Du brauchst dafür ungefähr **1–2 Stunden aktive Arbeit**, plus **Wartezeit auf die Prüfung durch Meta** (oft 1–3 Werktage, manchmal länger).

> **Tipp:** Mach das an einem ruhigen Tag. Du brauchst Ausweisdaten bzw. Unternehmensnachweise griffbereit, und du wartest zwischendurch auf Meta.

### Schritt 3.1 — Facebook-/Meta-Konto

Du brauchst ein ganz normales Facebook-Konto als Anmeldung. Wenn du keins hast oder kein privates nutzen willst: leg ein neues an, nur als Login für die Geschäftssachen.

### Schritt 3.2 — Meta Business Manager anlegen

Der **Business Manager** (Adresse: `business.facebook.com`) ist die Schaltzentrale, in der dein Unternehmen, deine Nummer und deine App zusammenlaufen. Stell ihn dir vor wie das „Firmen-Cockpit" bei Meta.

- Gehe auf `business.facebook.com` und erstelle ein Unternehmenskonto.
- Trag den Firmennamen ein (z. B. „Snippt" oder dein Gewerbename), deine Adresse und eine geschäftliche E-Mail.

### Schritt 3.3 — Unternehmens-Verifizierung starten

Meta will sicher sein, dass dein Unternehmen echt ist. Diese Prüfung heißt **Business Verification**. Dafür brauchst du in der Regel:
- einen Nachweis, dass das Unternehmen existiert (z. B. Gewerbeanmeldung, Handelsregisterauszug oder eine offizielle Rechnung mit Firmenname und Adresse),
- manchmal eine Bestätigung der Telefonnummer oder Domain.

Diese Prüfung kann ein paar Tage dauern. **Wichtig:** Du kannst die Technik schon vorher testen (mit einer Test-Nummer von Meta), aber für den echten Versand an deine Kunden muss die Verifizierung durch sein.

### Schritt 3.4 — Eine Telefonnummer für WhatsApp wählen

Du brauchst eine **eigene Telefonnummer nur für Snippt-WhatsApp**. Wichtige Regeln:
- Die Nummer darf **nicht** schon in der normalen WhatsApp- oder WhatsApp-Business-App in Benutzung sein. (Eine Nummer kann nur an einem Ort gleichzeitig aktiv sein.)
- Es kann eine Festnetz- oder Mobilnummer sein, Hauptsache du kannst dort einmalig einen Bestätigungs-Code per SMS oder Anruf empfangen.
- **Empfehlung:** Nimm eine **frische, separate Nummer** (z. B. eine günstige Zweit-SIM oder eine Nummer, die du sonst nicht brauchst), damit du deine private Nummer nicht „verbrennst".

Diese Nummer wird später der Absender, den deine Kunden in WhatsApp sehen.

### Schritt 3.5 — Eine „App" im Meta-Entwicklerbereich anlegen

Das klingt technischer, als es ist: Im Bereich `developers.facebook.com` legst du ein Projekt an (Meta nennt es „App") und fügst das Produkt **„WhatsApp"** hinzu. Damit verbindest du deine Nummer mit dem automatischen Versand.

**Hier kann ich dich per Bildschirm-Anleitung begleiten** — sag mir einfach Bescheid, dann gehe ich die Klicks mit dir durch. Am Ende dieses Schritts entstehen zwei Dinge, die ich für den Code brauche:
- eine **Zugangs-Kennung** (ein langer geheimer Schlüssel, „Access Token"),
- eine **Nummern-ID** (eine technische Kennung deiner WhatsApp-Nummer).

Diese beiden gibst du sicher an mich weiter (nicht per offener Chat-Nachricht — am besten über einen geschützten Weg). Ich baue sie in Snippt ein, ohne dass sie irgendwo öffentlich landen.

---

## 4. Nachrichten-Vorlagen („Templates") — und warum Meta sie genehmigen muss

Hier ist die wichtigste Besonderheit von WhatsApp, die viele am Anfang überrascht:

**Du darfst einem Kunden nicht einfach frei drauflos schreiben.** Wenn dein Unternehmen den Kunden zuerst anschreibt (also nicht der Kunde dich), muss der Nachrichtentext **vorher von Meta genehmigt** sein. So ein vorab genehmigter Text heißt **Template** (Vorlage).

Bild dazu: Es ist wie bei einem Formularbrief, den die Post erst freigibt, bevor du ihn millionenfach verschicken darfst. Lücken zum Ausfüllen (Name, Position in der Reihe) sind erlaubt — der Grundtext steht fest.

### Welche Vorlagen Snippt braucht

Wir reichen am Anfang ein bis zwei einfache Vorlagen ein, zum Beispiel:

1. **„Du bist als Nächstes dran"**
   > Hallo {{1}}, du bist bei {{2}} gleich an der Reihe. Komm bitte zum Laden. — Snippt

2. *(optional)* **„Dein Platz hat sich verschoben"**
   > Hallo {{1}}, es hat sich kurz etwas verschoben. Du bist jetzt auf Position {{2}}. — Snippt

Die `{{1}}`, `{{2}}` sind die Lücken, die Snippt automatisch füllt (Name, Friseur, Position).

### Wichtig für die Kosten: die richtige Kategorie

Beim Einreichen wählst du eine **Kategorie**. Wähle **„Utility"** (auf Deutsch etwa „Service-/Transaktionsnachricht"). Das ist entscheidend, weil:
- **Utility-Nachrichten** = sachliche Infos zu einem laufenden Vorgang (genau unser Fall: „du bist dran"). Diese sind **billig oder kostenlos**.
- **Marketing-Nachrichten** = Werbung/Angebote. Diese sind in Deutschland **deutlich teurer** (~0,11 € pro Stück).

Wenn du die „Du bist dran"-Nachricht versehentlich als Marketing einreichst, zahlst du unnötig. Also immer **Utility** für die Reihen-Pings.

Die Genehmigung einer Vorlage dauert meist nur **wenige Minuten bis Stunden**.

---

## 5. Einwilligung des Kunden (Opt-in) — rechtlich Pflicht

Du darfst einem Kunden nur dann auf WhatsApp schreiben, wenn er **vorher zugestimmt** hat. Das schreibt sowohl Meta als auch das deutsche Datenschutzrecht vor.

In Snippt ist das einfach gelöst: Wenn sich der Kunde in die Reihe einträgt, fragen wir ihn aktiv, ob er per WhatsApp benachrichtigt werden will (z. B. ein Häkchen „Benachrichtige mich per WhatsApp, wenn ich dran bin"). Erst wenn er zustimmt, schickt Snippt etwas. Diese Zustimmung speichern wir nachweisbar mit ab — das übernehme ich im Code.

---

## 6. Was kostet das? (Stand 2026)

Seit dem 1. Juli 2025 rechnet Meta **pro Nachricht** ab (vorher pro Gespräch). Die Preise hängen davon ab, in welchem Land der **Empfänger** sitzt und welche **Kategorie** die Nachricht hat.

Für Snippt in Deutschland:

| Art der Nachricht | Beispiel | Preis (Deutschland, ca.) |
|---|---|---|
| **Service** (Kunde schreibt zuerst, du antwortest innerhalb 24 Std.) | Kunde fragt „bis wann?" | **kostenlos** |
| **Utility innerhalb 24-Std.-Fenster** | „Du bist dran", kurz nachdem Kunde aktiv war | **kostenlos** |
| **Utility außerhalb des Fensters** | „Du bist dran" lange nach letzter Aktivität | sehr günstig (wenige Cent) |
| **Marketing** | Werbung, Angebote | ~0,11 € pro Stück |

**Was das praktisch bedeutet:** Die zentrale Snippt-Nachricht („du bist dran") fällt fast immer in den **kostenlosen oder fast-kostenlosen** Bereich, weil der Kunde sich ja gerade eben erst in die Reihe gestellt hat und damit „aktiv" ist. Solange du keine Werbung über WhatsApp verschickst, sind die laufenden Kosten für den Piloten **nahe null**.

> Hinweis: Meta kann Preise anpassen. Die aktuellen Zahlen stehen immer in der offiziellen Preisliste (siehe Quellen unten).

---

## 7. Was ich danach im Code mache (zur Info, keine Aufgabe für dich)

Sobald du mir die **Zugangs-Kennung** und die **Nummern-ID** aus Schritt 3.5 gegeben hast und mindestens eine Vorlage genehmigt ist, baue ich:

- einen **Versand-Baustein** in Snippt, der bei „fertig/Nächster" automatisch die genehmigte Vorlage an den nächsten Kunden schickt,
- die **sichere Ablage** der geheimen Schlüssel (als geschützte Umgebungs-Variablen bei Vercel, nie im öffentlichen Code),
- die **Einwilligungs-Abfrage** beim Eintragen in die Reihe (Abschnitt 5),
- einen **Fallback**: Wer kein WhatsApp will oder die App installiert hat, bekommt stattdessen eine Web-Push-Mitteilung (kostenlos).

Das ist überschaubar — die meiste Wartezeit steckt in der Meta-Prüfung, nicht im Programmieren.

---

## 7b. Stand der Technik (11.06.2026): Code ist fertig

Der Versand ist eingebaut und getestet. Sobald jemand in der Reihe aufgerufen wird („nächster aufrufen" im Dashboard), schickt Snippt automatisch die „du bist dran"-Nachricht — **vorausgesetzt, die vier Zugangswerte sind hinterlegt.** Solange sie fehlen, läuft alles normal weiter, es geht nur keine Nachricht raus (kein Fehler im Laden). Die Nachricht geht außerdem nur an Kunden, die beim Anstellen ihre **Handynummer** angegeben haben.

**Was du noch tun musst:** diese vier Werte bei Vercel eintragen (Projekt „snippt" → Settings → Environment Variables):

| Variable | Was es ist | Woher |
|---|---|---|
| `WHATSAPP_TOKEN` | dauerhaftes Zugriffstoken | Meta → System-User-Token |
| `WHATSAPP_PHONE_NUMBER_ID` | ID der WhatsApp-Nummer (**nicht** die Nummer selbst) | Meta → WhatsApp → API-Setup |
| `WHATSAPP_TEMPLATE_NAME` | Name der genehmigten Vorlage | wie bei Meta benannt |
| `WHATSAPP_TEMPLATE_SPRACHE` | Sprachcode der Vorlage (z. B. `de`) | wie bei Meta angelegt |

**Wichtig — die Vorlage muss genau zwei Platzhalter haben**, in dieser Reihenfolge:
- `{{1}}` = Name des Kunden
- `{{2}}` = Name des Friseurs

Beispiel-Text für die Vorlage (Kategorie **Utility**, damit günstig/kostenlos):
> Hallo {{1}}, du bist dran bei {{2}}! Komm bitte zu deinem Friseur.

Wenn du die Vorlage anders aufbaust (z. B. andere Anzahl Platzhalter), passt der Code nicht mehr — dann kurz Bescheid sagen, ich passe ihn an. Nach dem Eintragen bei Vercel einmal neu veröffentlichen (Redeploy), dann ist der Versand scharf.

---

## 8. Reihenfolge in Kurzform (deine Checkliste)

1. ☐ Facebook-/Meta-Konto bereit (Schritt 3.1)
2. ☐ Meta Business Manager angelegt (3.2)
3. ☐ Unternehmens-Verifizierung gestartet (3.3) — **früh anstoßen, dauert am längsten**
4. ☐ Separate Telefonnummer für Snippt-WhatsApp besorgt (3.4)
5. ☐ App im Entwicklerbereich angelegt + Produkt „WhatsApp" hinzugefügt (3.5) — *hier helfe ich dir live*
6. ☐ Zugangs-Kennung + Nummern-ID sicher an mich weitergegeben
7. ☐ Vorlage „Du bist dran" als **Utility** eingereicht und genehmigt (Abschnitt 4)
8. ☐ Ich baue Versand + Einwilligung + Fallback ein (Abschnitt 7)
9. ☐ Gemeinsamer Test mit einer echten Nummer
10. ☐ Scharfschalten

---

## Quellen (Preise & Regeln, Stand 2026)

- [WhatsApp Business API Pricing 2026 — Blueticks](https://blueticks.co/blog/whatsapp-business-api-pricing-2026)
- [WhatsApp Business Platform Pricing — offizielle Übersicht](https://whatsappbusiness.com/products/platform-pricing/)
- [WhatsApp Business API Pricing 2026 — Respond.io](https://respond.io/blog/whatsapp-business-api-pricing)
- [WhatsApp API Pricing 2026 — Chatarmin (DE-Markt)](https://chatarmin.com/en/blog/whats-app-api-pricing)
