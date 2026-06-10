# Reihe & Termine verwalten — Konzept & Design

**Stand:** 2026-06-10
**Status:** Entwurf mit Alex abgestimmt und freigegeben.
**Kontext:** Baut auf dem MVP auf. Schließt die zwei verbliebenen Dashboard-Features nach „Belohnung einlösen": die Warteschlange und die Termin-Liste für den Friseur-Alltag robust machen.

---

## 1. Worum es geht

Der Friseur kann aktuell in der Warteschlange nur „Fertig → Nächsten". Es fehlt:
- **No-Show / Storno entfernen** — wenn jemand nicht erscheint oder doch geht, staut sich sonst die Reihe.
- **Termin abschließen** — im Termin-Modus gibt es keinen Weg, einen Termin als erledigt zu markieren (samt Stempel) oder abzusagen.

---

## 2. Fachliche Entscheidungen (mit Alex abgestimmt)

- **Bestätigungsschritt:** Vor dem Entfernen/Absagen kommt ein kurzer „Wirklich?"-Schritt. Begründung: Ein Fehltipp würde sonst sofort jemanden aus der Reihe werfen oder einen Termin absagen.
- **Termin-Modus: beide Aktionen** — „Erledigt" (mit Stempel) UND „Absagen" (ohne Stempel). Symmetrisch zur Warteschlange.
- **Eine Entfernen-Aktion** (keine Trennung No-Show vs. Storno): fürs Ergebnis identisch, zwei Knöpfe würden nur verwirren.
- **Erledigte/abgesagte Einträge fallen aus der Liste** (wie „fertige" aus der Reihe), damit die Ansicht aktuell bleibt.

---

## 3. Architektur

Keine Datenbank-Migration nötig: Die RLS-Policies „Friseur verwaltet eigene Warteschlange / Termine / Kunden" (`for all`) erlauben dem eingeloggten Friseur alle nötigen Schreibzugriffe direkt. Die Status-Werte existieren bereits (`warteschlange.abgesprungen`, `termin.abgeschlossen`, `termin.abgesagt`).

### 3.1 Server-Aktionen (`app/dashboard/actions.ts`)

- `eintragEntfernen(formData)` — setzt den Warteschlangen-Eintrag auf `abgesprungen`. Kein Stempel. Der nächste Eintrag rückt beim Neuladen automatisch an Position 1 (die „Jetzt dran"-Karte ist schlicht der erste Eintrag — kein separater Status-Wechsel nötig).
- `terminAbsagen(formData)` — setzt den Termin auf `abgesagt`. Kein Stempel.
- `terminAbschliessen(formData)` — setzt den Termin auf `abgeschlossen` und vergibt automatisch einen Stempel. Der Kunde wird über die private Hilfsfunktion `kundeAusTerminErmitteln` ermittelt: vorhandene `kunde_id` nutzen, sonst per `besucher_token` finden, sonst neu anlegen (Name/Telefon aus den Gast-Feldern). Dann ein `stempel`-Insert.

Alle drei laufen als eingeloggter Friseur mit `.eq('friseur_id', friseur.id)`-Absicherung, gleicher Stil wie `fertigNaechster`/`belohnungEinloesen`.

### 3.2 Bestätigungs-Knopf (`app/dashboard/_components/BestaetigungsButton.tsx`, neu, Client)

Ein wiederverwendbarer Client-Knopf mit Zwei-Schritt-Bestätigung (DRY für alle drei Aktionen):
- Zustand 1: zeigt das Label (z. B. „Entfernen").
- Klick → Zustand 2: „Wirklich? [Ja] [Abbrechen]". „Ja" sendet ein `<form action={…}>` mit verstecktem ID-Feld an die übergebene Server-Aktion.
- Props: `action` (Server-Aktion als Prop — in Next 14 App Router serialisierbar an Client-Komponenten übergebbar), `feldName` + `feldWert` (verstecktes Eingabefeld), `label`, `bestaetigung`, `variante` ('gefahr' | 'primaer' | 'dezent').

### 3.3 Warteschlange (`app/dashboard/_components/QueueBoard.tsx`)

`QueueBoard` (Server-Komponente) rendert pro Eintrag — beim „Jetzt dran" und bei Wartenden — einen dezenten `BestaetigungsButton` mit `action={eintragEntfernen}`, Label „Entfernen", Variante 'dezent'. Optisch klar untergeordnet gegenüber „Fertig".

### 3.4 Termin-Liste (`app/dashboard/page.tsx`, Termin-Zweig)

- Query-Filter auf aktive Status `.in('status', ['ausstehend','bestaetigt'])` (statt nur `abgesagt` auszuschließen), damit erledigte/abgesagte verschwinden. Die Listen-Abfrage bleibt ansonsten minimal — `kunde_id`/`besucher_token` werden hier NICHT geladen, weil `terminAbschliessen` diese Felder beim Abschluss selbst nachlädt (über sein eigenes `update().select(...)`); im Listen-Render werden sie nicht gebraucht.
- Pro Termin zwei `BestaetigungsButton`: „Erledigt" (`terminAbschliessen`, Variante 'primaer') und „Absagen" (`terminAbsagen`, Variante 'gefahr').

### 3.5 Kundenseite — keine Änderung.

---

## 4. Tests

Es gibt hier kaum reine, datenbankunabhängige Logik (im Wesentlichen Status-Wechsel + ein Stempel-Insert). Die geld-nahe „genau ein Stempel"-Regel ist trivial und DB-gebunden — ein erzwungener Unit-Test wäre eine Attrappe ohne Aussagekraft. Daher:
- **Keine** neuen Unit-Tests; die bestehenden 9 Tests bleiben grün.
- Absicherung über `npx tsc --noEmit` (Typen) und `npm run build` (kompiliert) plus optionalen manuellen Test.

---

## 5. Randfälle

- **Entfernen des „Jetzt dran"-Kunden:** Eintrag wird `abgesprungen`, der Nächste rückt automatisch nach. Kein Stempel.
- **Termin abschließen ohne Token/Kunde** (z. B. Friseur hat manuell eingetragen): kein Kunde ermittelbar → kein Stempel, Status trotzdem `abgeschlossen`.
- **Stempelkarte inaktiv** (`stempel_anzahl` NULL): Stempel wird trotzdem vergeben (Sammeln läuft), nur „voll" wird nie erreicht — konsistent mit der Warteschlange.
- **Doppelklick / paralleler Zugriff:** `.eq('friseur_id', …)` + RLS sichern ab; für MVP ausreichend.

---

## 6. Bewusst nicht im Umfang

- Kein „Rückgängig" für entfernte Einträge / abgesagte Termine.
- Keine Bearbeitung von Termin-Zeiten.
- Keine Verschiebung/Umsortierung der Reihe (nur Entfernen).
