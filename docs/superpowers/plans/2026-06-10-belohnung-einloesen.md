# Belohnung einlösen — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Commit-Regel (Projekt):** Alex committet nur auf Aufforderung. Die Commit-Schritte unten gehören zum TDD-Rhythmus, werden aber erst nach Alex' Freigabe ausgeführt — bei Inline-Ausführung an den Commit-Schritten kurz stoppen und fragen.

**Goal:** Der Friseur kann eine volle Stempelkarte per Knopf als Gratis-Schnitt einlösen; die Karte beginnt danach von vorn.

**Architecture:** Die geld-nahe Kern-Entscheidung („welche Stempel werden eingelöst", „ist die Karte voll") liegt in reinen Hilfsfunktionen in `lib/stempel.ts` und wird per Vitest getestet. Eine neue Server-Aktion `belohnungEinloesen` in `app/dashboard/actions.ts` nutzt diese Funktionen und teilt sich die Logik „abschließen + Nächsten aufrufen" mit dem bestehenden `fertigNaechster`. Das Dashboard reicht pro Warteschlangen-Eintrag einen `stempelVoll`-Marker an die Oberfläche durch, die einen zweiten Knopf anzeigt. Keine Datenbank-Migration nötig.

**Tech Stack:** Next.js 14 (App Router, Server Actions), TypeScript, Supabase JS Client (authentifiziert, RLS), Vitest (neu).

---

## Dateistruktur

- **Create:** `lib/stempel.ts` — reine Hilfsfunktionen (keine DB, keine React-Importe): `istKarteVoll`, `waehleEinzuloesendeStempel`.
- **Create:** `lib/stempel.test.ts` — Vitest-Unit-Tests für die reinen Funktionen.
- **Create:** `vitest.config.ts` — minimale Vitest-Konfiguration.
- **Modify:** `package.json` — `vitest` als devDependency, `test`-Script.
- **Modify:** `app/dashboard/actions.ts` — gemeinsame Hilfsfunktion `abschliessenUndNaechsten`; neue Aktion `belohnungEinloesen`; `fertigNaechster` auf die Hilfsfunktion umstellen.
- **Modify:** `app/dashboard/page.tsx` — Warteschlangen-Query um `kunde_id` erweitern, Sammelabfrage offener Stempel, `stempelVoll` pro Eintrag berechnen.
- **Modify:** `app/dashboard/_components/QueueBoard.tsx` — erweiterten Eintrags-Typ akzeptieren, „⭐ Karte voll"-Abzeichen + zweiten Knopf „Belohnung einlösen (gratis)" rendern.

---

## Task 1: Test-Framework Vitest einrichten

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Vitest installieren**

```bash
npm install -D vitest@^2
```

- [ ] **Step 2: Test-Script in package.json ergänzen**

In `package.json` den `scripts`-Block erweitern (neue Zeile nach `"lint"`):

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
```

- [ ] **Step 3: Minimale Vitest-Konfiguration anlegen**

Datei `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'

// Reine Logik-Tests (keine DOM-/React-Umgebung nötig).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
  },
})
```

- [ ] **Step 4: Lauffähigkeit prüfen (noch keine Tests)**

Run: `npm test`
Expected: Vitest startet und meldet „No test files found" (oder 0 Tests) — kein Fehler durch fehlende Konfiguration.

- [ ] **Step 5: Commit** (erst nach Alex' Freigabe)

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "Setup: Vitest fuer Unit-Tests (kritische Logik)"
```

---

## Task 2: Reine Stempel-Logik mit Tests (TDD)

**Files:**
- Create: `lib/stempel.ts`
- Test: `lib/stempel.test.ts`

- [ ] **Step 1: Failing Test schreiben**

Datei `lib/stempel.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { istKarteVoll, waehleEinzuloesendeStempel } from './stempel'

describe('istKarteVoll', () => {
  it('ist voll, wenn offene Stempel das Ziel erreichen', () => {
    expect(istKarteVoll(10, 10)).toBe(true)
    expect(istKarteVoll(11, 10)).toBe(true)
  })

  it('ist nicht voll unterhalb des Ziels', () => {
    expect(istKarteVoll(9, 10)).toBe(false)
    expect(istKarteVoll(0, 10)).toBe(false)
  })

  it('ist nie voll, wenn keine Stempelkarte aktiv ist (Ziel null)', () => {
    expect(istKarteVoll(20, null)).toBe(false)
  })

  it('ist nie voll bei Ziel 0 (ungueltig konfiguriert)', () => {
    expect(istKarteVoll(5, 0)).toBe(false)
  })
})

describe('waehleEinzuloesendeStempel', () => {
  // Eingabe ist nach Vergabedatum aufsteigend sortiert (aelteste zuerst).
  it('waehlt genau Ziel viele, die aeltesten zuerst', () => {
    const ids = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']
    expect(waehleEinzuloesendeStempel(ids, 10)).toEqual([
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    ])
  })

  it('laesst Ueberhang stehen (11 offen, Ziel 10 -> 10 eingeloest)', () => {
    const ids = Array.from({ length: 11 }, (_, i) => `s${i}`)
    expect(waehleEinzuloesendeStempel(ids, 10)).toHaveLength(10)
  })

  it('gibt nichts zurueck, wenn weniger als Ziel offen sind', () => {
    expect(waehleEinzuloesendeStempel(['a', 'b'], 10)).toEqual([])
  })

  it('gibt nichts zurueck bei Ziel null', () => {
    const ids = Array.from({ length: 10 }, (_, i) => `s${i}`)
    expect(waehleEinzuloesendeStempel(ids, null)).toEqual([])
  })
})
```

- [ ] **Step 2: Test ausführen, Fehlschlag bestätigen**

Run: `npm test`
Expected: FAIL — Modul `./stempel` bzw. die Funktionen existieren nicht.

- [ ] **Step 3: Minimale Implementierung schreiben**

Datei `lib/stempel.ts`:

```typescript
// Reine Stempelkarten-Logik — keine Datenbank, keine React-Importe.
// Die geld-nahe Kern-Entscheidung liegt hier, damit sie testbar ist.

// Karte voll? Nur wenn eine Stempelkarte aktiv ist (Ziel > 0) und die offenen
// Stempel das Ziel erreichen oder ueberschreiten.
export function istKarteVoll(offeneStempel: number, ziel: number | null): boolean {
  if (!ziel || ziel <= 0) return false
  return offeneStempel >= ziel
}

// Aus den offenen Stempel-IDs (aufsteigend nach Vergabedatum, aelteste zuerst)
// die genau Ziel vielen aeltesten zum Einloesen auswaehlen. Ueberhang bleibt.
// Sind weniger als Ziel offen oder ist keine Karte aktiv: nichts einloesen.
export function waehleEinzuloesendeStempel(
  offeneStempelIdsAeltesteZuerst: string[],
  ziel: number | null,
): string[] {
  if (!ziel || ziel <= 0) return []
  if (offeneStempelIdsAeltesteZuerst.length < ziel) return []
  return offeneStempelIdsAeltesteZuerst.slice(0, ziel)
}
```

- [ ] **Step 4: Test ausführen, Erfolg bestätigen**

Run: `npm test`
Expected: PASS — alle Tests in `lib/stempel.test.ts` grün.

- [ ] **Step 5: Commit** (erst nach Alex' Freigabe)

```bash
git add lib/stempel.ts lib/stempel.test.ts
git commit -m "Feature: Reine Stempel-Einloese-Logik mit Tests"
```

---

## Task 3: Server-Aktion `belohnungEinloesen` + geteilte Logik

**Files:**
- Modify: `app/dashboard/actions.ts`

- [ ] **Step 1: Gemeinsame Hilfsfunktion und neue Aktion einbauen**

In `app/dashboard/actions.ts` den Import ergänzen (oben, nach den bestehenden Imports):

```typescript
import { waehleEinzuloesendeStempel } from '@/lib/stempel'
```

Die bestehende Funktion `fertigNaechster` (Zeilen 12–66) **vollständig ersetzen** durch die folgende geteilte Hilfsfunktion plus die zwei Aktionen. `profilSpeichern` darunter bleibt unverändert.

```typescript
// Gemeinsamer Ablauf für beide Abschluss-Wege: aktuellen Eintrag schließen,
// optionalen Stempel-Schritt ausführen, nächsten aktiven Eintrag aufrufen.
// `stempelSchritt` bekommt die verknüpfte kunde_id (oder null) und erledigt
// das Stempel-Handling (vergeben ODER einlösen). Läuft als eingeloggter
// Friseur — RLS stellt sicher, dass nur eigene Einträge verändert werden.
async function abschliessenUndNaechsten(
  eintragId: string,
  stempelSchritt: (
    supabase: Awaited<ReturnType<typeof createClient>>,
    friseurId: string,
    kundeId: string | null,
  ) => Promise<void>,
) {
  if (!eintragId) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: friseur } = await supabase
    .from('friseur')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!friseur) return

  // 1. Aktuellen Eintrag abschließen
  await supabase
    .from('warteschlange')
    .update({ status: 'fertig', fertig_at: new Date().toISOString() })
    .eq('id', eintragId)
    .eq('friseur_id', friseur.id)

  // 2. Stempel-Schritt (vergeben oder einlösen), nur wenn ein Kunde verknüpft ist
  const { data: abgeschlossen } = await supabase
    .from('warteschlange')
    .select('kunde_id')
    .eq('id', eintragId)
    .single()
  await stempelSchritt(supabase, friseur.id, (abgeschlossen?.kunde_id as string | null) ?? null)

  // 3. Nächsten aktiven Eintrag (frühester) aufrufen
  const { data: naechster } = await supabase
    .from('warteschlange')
    .select('id')
    .eq('friseur_id', friseur.id)
    .in('status', AKTIV)
    .order('eingereiht_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (naechster) {
    await supabase
      .from('warteschlange')
      .update({ status: 'aufgerufen', aufgerufen_at: new Date().toISOString() })
      .eq('id', naechster.id)
      .eq('friseur_id', friseur.id)
  }

  revalidatePath('/dashboard')
}

// Friseur schließt den aktuellen Schnitt ab und ruft den Nächsten auf.
// Vergibt automatisch einen Stempel, falls ein erkannter Kunde verknüpft ist.
export async function fertigNaechster(formData: FormData) {
  const eintragId = String(formData.get('eintragId') ?? '')
  await abschliessenUndNaechsten(eintragId, async (supabase, friseurId, kundeId) => {
    if (kundeId) {
      await supabase.from('stempel').insert({ kunde_id: kundeId, friseur_id: friseurId })
    }
  })
}

// Friseur löst eine volle Stempelkarte als Gratis-Schnitt ein und ruft den
// Nächsten auf. Markiert die ältesten `ziel` offenen Stempel als eingelöst und
// vergibt KEINEN neuen Stempel (dieser Schnitt ist die Belohnung selbst).
export async function belohnungEinloesen(formData: FormData) {
  const eintragId = String(formData.get('eintragId') ?? '')
  await abschliessenUndNaechsten(eintragId, async (supabase, friseurId, kundeId) => {
    if (!kundeId) return

    // Ziel (Stempelanzahl) des Friseurs laden
    const { data: f } = await supabase
      .from('friseur')
      .select('stempel_anzahl')
      .eq('id', friseurId)
      .single()
    const ziel = (f?.stempel_anzahl as number | null) ?? null

    // Offene Stempel des Kunden, älteste zuerst
    const { data: offene } = await supabase
      .from('stempel')
      .select('id')
      .eq('kunde_id', kundeId)
      .eq('friseur_id', friseurId)
      .is('eingeloest_at', null)
      .order('vergeben_at', { ascending: true })

    const ids = (offene ?? []).map((s) => s.id as string)
    const einzuloesen = waehleEinzuloesendeStempel(ids, ziel)
    if (einzuloesen.length === 0) return

    await supabase
      .from('stempel')
      .update({ eingeloest_at: new Date().toISOString() })
      .in('id', einzuloesen)
      .eq('friseur_id', friseurId)
  })
}
```

- [ ] **Step 2: Typprüfung (Build-Disziplin)**

Run: `npx tsc --noEmit`
Expected: keine neuen Typfehler in `app/dashboard/actions.ts`.

- [ ] **Step 3: Commit** (erst nach Alex' Freigabe)

```bash
git add app/dashboard/actions.ts
git commit -m "Feature: Server-Aktion belohnungEinloesen + geteilte Abschluss-Logik"
```

---

## Task 4: Dashboard-Query um „Karte voll" erweitern

**Files:**
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Import der reinen Logik ergänzen**

In `app/dashboard/page.tsx` nach den bestehenden Imports (nach Zeile 6):

```typescript
import { istKarteVoll } from '@/lib/stempel'
import type { FriseurQueueEntry } from './_components/QueueBoard'
```

- [ ] **Step 2: Warteschlangen-Query und Eintrags-Aufbau ersetzen**

Den Block der Warteschlangen-Query (aktuell Zeilen 133–146: von `const { data: rows } = await supabase` bis zum Ende des `entries`-`map`) **ersetzen** durch:

```typescript
  const { data: rows } = await supabase
    .from('warteschlange')
    .select('id, gast_name, status, eingereiht_at, kunde_id')
    .eq('friseur_id', friseur?.id ?? '')
    .in('status', AKTIV)
    .order('eingereiht_at', { ascending: true })

  const ziel = (friseur?.stempel_anzahl as number | null) ?? null

  // Offene Stempel je Kunde der aktuellen Reihe in einer Sammelabfrage holen.
  const kundenIds = Array.from(
    new Set((rows ?? []).map((r) => r.kunde_id as string | null).filter((id): id is string => !!id)),
  )
  const offenProKunde = new Map<string, number>()
  if (kundenIds.length > 0 && ziel) {
    const { data: stempelRows } = await supabase
      .from('stempel')
      .select('kunde_id')
      .eq('friseur_id', friseur?.id ?? '')
      .is('eingeloest_at', null)
      .in('kunde_id', kundenIds)
    for (const s of stempelRows ?? []) {
      const k = s.kunde_id as string
      offenProKunde.set(k, (offenProKunde.get(k) ?? 0) + 1)
    }
  }

  const jetzt = Date.now()
  const entries: FriseurQueueEntry[] = (rows ?? []).map((r) => {
    const kundeId = (r.kunde_id as string | null) ?? null
    const offen = kundeId ? offenProKunde.get(kundeId) ?? 0 : 0
    return {
      id: r.id as string,
      name: (r.gast_name as string | null)?.trim() || 'Gast',
      wartetMin: Math.max(0, Math.round((jetzt - new Date(r.eingereiht_at as string).getTime()) / 60000)),
      status: mapStatus(r.status as string),
      kundeId,
      stempelVoll: istKarteVoll(offen, ziel),
    }
  })
```

> Hinweis: Die alte `const jetzt = Date.now()`-Zeile (vorher Zeile 140) ist im neuen Block enthalten — sicherstellen, dass sie nicht doppelt steht.

- [ ] **Step 3: Typprüfung**

Run: `npx tsc --noEmit`
Expected: keine Typfehler. `FriseurQueueEntry` wird in Task 5 in `QueueBoard.tsx` definiert — wenn dieser Task vor Task 5 ausgeführt wird, erscheint hier ein Import-Fehler. Task 5 unmittelbar danach ausführen, dann ist der Import gültig.

- [ ] **Step 4: Commit** (erst nach Alex' Freigabe, zusammen mit Task 5)

Kein eigener Commit — gemeinsam mit Task 5 committen (Query + UI gehören zusammen).

---

## Task 5: QueueBoard — Abzeichen + Einlöse-Knopf

**Files:**
- Modify: `app/dashboard/_components/QueueBoard.tsx`

- [ ] **Step 1: Erweiterten Typ und Import ergänzen**

In `app/dashboard/_components/QueueBoard.tsx` die Importzeile (Zeile 1–2) ersetzen durch:

```typescript
import type { QueueEntry, QueueStatus } from '@/lib/mockQueue'
import { fertigNaechster, belohnungEinloesen } from '../actions'

// Dashboard-spezifische Erweiterung des Reihen-Eintrags um Stempelkarten-Info.
// Bewusst hier (nicht in mockQueue), da mockQueue ein geteilter Mock-Typ ist.
export type FriseurQueueEntry = QueueEntry & {
  kundeId: string | null
  stempelVoll: boolean
}
```

- [ ] **Step 2: Komponenten-Signaturen auf den erweiterten Typ umstellen**

In `QueueBoard.tsx`:
- `function StatusChip({ entry }: { entry: QueueEntry })` → `{ entry: FriseurQueueEntry }`
- `export function QueueBoard({ entries }: { entries: QueueEntry[] })` → `{ entries: FriseurQueueEntry[] }`

- [ ] **Step 3: „Jetzt dran"-Karte um Abzeichen + zweiten Knopf erweitern**

Im `now`-Block den `<form action={fertigNaechster}>`-Abschnitt (aktuell Zeilen 56–68) ersetzen durch:

```tsx
          {now.stempelVoll && (
            <div className="mt-[10px] inline-flex items-center gap-[6px] rounded-full border border-snippt-ember/40 bg-snippt-ember/10 px-[10px] py-[4px] text-[11px] font-medium text-snippt-ember">
              ⭐ Karte voll — Belohnung fällig
            </div>
          )}
          <form action={fertigNaechster}>
            <input type="hidden" name="eintragId" value={now.id} />
            <button
              type="submit"
              className="mt-[13px] flex w-full items-center justify-center gap-2 rounded-[13px] p-[14px] text-[15px] font-semibold text-[#070710]"
              style={{
                background: 'linear-gradient(100deg,#2BE7FF,#5468FF)',
                boxShadow: '0 10px 26px -10px rgba(84,104,255,.8)',
              }}
            >
              Fertig → Nächsten aufrufen
            </button>
          </form>
          {now.stempelVoll && (
            <form action={belohnungEinloesen}>
              <input type="hidden" name="eintragId" value={now.id} />
              <button
                type="submit"
                className="mt-[10px] flex w-full items-center justify-center gap-2 rounded-[13px] border border-snippt-ember/50 bg-snippt-ember/10 p-[13px] text-[14px] font-semibold text-snippt-ember"
              >
                ⭐ Belohnung einlösen (gratis)
              </button>
            </form>
          )}
```

- [ ] **Step 4: Wartende Einträge um Vorab-Abzeichen erweitern**

Im `rest.map`-Block direkt nach `<StatusChip entry={entry} />` (aktuell Zeile 82) einfügen:

```tsx
          {entry.stempelVoll && (
            <div className="mt-[8px] inline-flex items-center gap-[5px] text-[11px] font-medium text-snippt-ember">
              ⭐ Karte voll
            </div>
          )}
```

- [ ] **Step 5: Typprüfung + Build**

Run: `npx tsc --noEmit`
Expected: keine Typfehler (Task 4 und 5 zusammen ergeben einen konsistenten Typ).

Run: `npm run build`
Expected: Build grün (Build-Disziplin laut Projektregel).

- [ ] **Step 6: Manueller UI-Test**

1. `npm run dev`, als Friseur einloggen, Modus „Warteschlange".
2. Über den eigenen Link (`/<slug>`) auf einem zweiten Gerät/Inkognito mit demselben Token oft genug anstellen + als Friseur „Fertig" drücken, bis ein Kunde `ziel` Stempel hat (oder Stempel testweise direkt in Supabase setzen).
3. Erwartung Dashboard: Beim „Jetzt dran"-Kunden erscheint „⭐ Karte voll" + Knopf „Belohnung einlösen (gratis)".
4. Knopf drücken → Eintrag abgeschlossen, nächster aufgerufen.
5. Kundenseite `/<slug>` neu laden → Stempelkarte steht wieder bei 0/Ziel.

- [ ] **Step 7: Commit** (erst nach Alex' Freigabe — Task 4 + 5 gemeinsam)

```bash
git add app/dashboard/page.tsx app/dashboard/_components/QueueBoard.tsx
git commit -m "Feature: Karte-voll-Anzeige + Belohnung-einloesen-Knopf im Dashboard"
```

---

## Abschluss-Checkliste

- [ ] `npm test` grün (reine Logik getestet).
- [ ] `npx tsc --noEmit` ohne neue Fehler.
- [ ] `npm run build` grün.
- [ ] Manueller UI-Test durchlaufen.
- [ ] Memory/Obsidian-Eintrag (Sub-Goal-Progress) anlegen — nach Abschluss, gemäß Projektregel.
