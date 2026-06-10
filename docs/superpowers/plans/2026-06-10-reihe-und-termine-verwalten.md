# Reihe & Termine verwalten — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.
>
> **Commit-Regel (Projekt):** Alex committet nur auf Aufforderung. Commit-Schritte gehören zum Rhythmus, werden aber erst nach Freigabe ausgeführt.

**Goal:** Der Friseur kann Warteschlangen-Einträge entfernen (No-Show/Storno) und Termine abschließen (mit automatischem Stempel) oder absagen — jeweils mit kurzem Bestätigungsschritt.

**Architecture:** Drei neue Server-Aktionen in `app/dashboard/actions.ts` (`eintragEntfernen`, `terminAbsagen`, `terminAbschliessen`) plus eine private Kunde-aus-Termin-Hilfsfunktion und ein kleiner Login-Helfer gegen Duplikation. Ein wiederverwendbarer Client-Knopf `BestaetigungsButton` (Zwei-Schritt-Bestätigung) wird in `QueueBoard.tsx` (Entfernen) und in der Termin-Liste in `page.tsx` (Erledigt + Absagen) eingebunden. Keine Datenbank-Migration; alle Schreibzugriffe laufen als eingeloggter Friseur über bestehende RLS-Rechte.

**Tech Stack:** Next.js 14 (Server Actions + Client Components), TypeScript, Supabase (authentifiziert, RLS), Tailwind (snippt-* Tokens).

---

## Dateistruktur

- **Modify:** `app/dashboard/actions.ts` — Login-Helfer `eingeloggterFriseur`, Aktionen `eintragEntfernen` / `terminAbsagen` / `terminAbschliessen`, private Hilfsfunktion `kundeAusTerminErmitteln`.
- **Create:** `app/dashboard/_components/BestaetigungsButton.tsx` — Client-Knopf mit Zwei-Schritt-Bestätigung, wiederverwendbar.
- **Modify:** `app/dashboard/_components/QueueBoard.tsx` — „Entfernen"-Knopf pro Eintrag.
- **Modify:** `app/dashboard/page.tsx` — Termin-Query auf aktive Status filtern; „Erledigt"/„Absagen" pro Termin.

Keine neuen Unit-Tests (Begründung in der Spec, Abschnitt 4): kaum reine, DB-unabhängige Logik. Absicherung über `tsc` + `build`.

---

## Task 1: Server-Aktionen + Hilfsfunktionen

**Files:** Modify `app/dashboard/actions.ts`

- [ ] **Step 1: Login-Helfer + drei Aktionen + Kunde-Hilfsfunktion einfügen**

In `app/dashboard/actions.ts` direkt VOR der Zeile `// Friseur speichert sein öffentliches Profil (Personalbranding).` (aktuell Zeile 119) den folgenden Block einfügen. Nichts anderes ändern.

```typescript
// Holt die friseur-Zeile des eingeloggten Nutzers (oder null). Reduziert die
// wiederkehrende Auth→Friseur-Abfrage in den Aktionen unten.
async function eingeloggterFriseur(
  supabase: SupabaseServerClient,
): Promise<{ id: string } | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('friseur')
    .select('id')
    .eq('user_id', user.id)
    .single()
  return (data as { id: string } | null) ?? null
}

// Friseur entfernt einen Eintrag aus der Reihe (No-Show oder Storno). Setzt ihn
// auf 'abgesprungen'; der nächste Eintrag rückt beim Neuladen automatisch nach.
// Kein Stempel.
export async function eintragEntfernen(formData: FormData) {
  const eintragId = String(formData.get('eintragId') ?? '')
  if (!eintragId) return

  const supabase = await createClient()
  const friseur = await eingeloggterFriseur(supabase)
  if (!friseur) return

  await supabase
    .from('warteschlange')
    .update({ status: 'abgesprungen' })
    .eq('id', eintragId)
    .eq('friseur_id', friseur.id)

  revalidatePath('/dashboard')
}

// Friseur sagt einen Termin ab. Setzt ihn auf 'abgesagt'. Kein Stempel.
export async function terminAbsagen(formData: FormData) {
  const terminId = String(formData.get('terminId') ?? '')
  if (!terminId) return

  const supabase = await createClient()
  const friseur = await eingeloggterFriseur(supabase)
  if (!friseur) return

  await supabase
    .from('termin')
    .update({ status: 'abgesagt' })
    .eq('id', terminId)
    .eq('friseur_id', friseur.id)

  revalidatePath('/dashboard')
}

// Ermittelt den Kunden zu einem abgeschlossenen Termin: vorhandene kunde_id
// nutzen, sonst per besucher_token finden, sonst neu anlegen (Soft-Account).
// Gibt die kunde_id zurück oder null (z. B. Termin ohne Kundenbezug).
async function kundeAusTerminErmitteln(
  supabase: SupabaseServerClient,
  friseurId: string,
  termin: {
    kunde_id: string | null
    besucher_token: string | null
    gast_name: string | null
    gast_telefon: string | null
  },
): Promise<string | null> {
  if (termin.kunde_id) return termin.kunde_id

  const token = termin.besucher_token?.trim()
  if (!token) return null

  const { data: vorhanden } = await supabase
    .from('kunde')
    .select('id')
    .eq('friseur_id', friseurId)
    .eq('besucher_token', token)
    .maybeSingle()
  if (vorhanden) return vorhanden.id as string

  const { data: neu } = await supabase
    .from('kunde')
    .insert({
      friseur_id: friseurId,
      name: termin.gast_name?.trim() || 'Gast',
      telefon: termin.gast_telefon?.trim() || null,
      besucher_token: token,
      letzter_besuch_at: new Date().toISOString(),
    })
    .select('id')
    .maybeSingle()
  return (neu?.id as string | null) ?? null
}

// Friseur schließt einen Termin ab. Setzt ihn auf 'abgeschlossen' und vergibt
// automatisch einen Stempel (Kunde über kunde_id/Token ermitteln/anlegen).
export async function terminAbschliessen(formData: FormData) {
  const terminId = String(formData.get('terminId') ?? '')
  if (!terminId) return

  const supabase = await createClient()
  const friseur = await eingeloggterFriseur(supabase)
  if (!friseur) return

  // Termin abschließen und dabei die Kundendaten zurückgeben
  const { data: termin } = await supabase
    .from('termin')
    .update({ status: 'abgeschlossen' })
    .eq('id', terminId)
    .eq('friseur_id', friseur.id)
    .select('kunde_id, besucher_token, gast_name, gast_telefon')
    .maybeSingle()

  if (termin) {
    const kundeId = await kundeAusTerminErmitteln(supabase, friseur.id, {
      kunde_id: (termin.kunde_id as string | null) ?? null,
      besucher_token: (termin.besucher_token as string | null) ?? null,
      gast_name: (termin.gast_name as string | null) ?? null,
      gast_telefon: (termin.gast_telefon as string | null) ?? null,
    })
    if (kundeId) {
      await supabase.from('stempel').insert({ kunde_id: kundeId, friseur_id: friseur.id })
    }
  }

  revalidatePath('/dashboard')
}
```

- [ ] **Step 2: Typprüfung**

Run: `npx tsc --noEmit`
Expected: keine Fehler. (Hinweis: `besucher_token` und `letzter_besuch_at` existieren auf der `kunde`-Tabelle seit Migration 003; `termin.status` erlaubt 'abgeschlossen'/'abgesagt' seit Migration 001.)

- [ ] **Step 3: Commit** (erst nach Freigabe)

```bash
git add app/dashboard/actions.ts
git commit -m "Feature: Server-Aktionen Reihe entfernen + Termin abschliessen/absagen"
```

---

## Task 2: Wiederverwendbarer Bestätigungs-Knopf

**Files:** Create `app/dashboard/_components/BestaetigungsButton.tsx`

- [ ] **Step 1: Client-Komponente anlegen**

Datei `app/dashboard/_components/BestaetigungsButton.tsx`:

```tsx
'use client'

import { useState } from 'react'

type Variante = 'gefahr' | 'primaer' | 'dezent'

// Knopf mit Zwei-Schritt-Bestätigung: erst Label, nach Klick
// "Wirklich? [Ja] [Abbrechen]". Verhindert versehentliches Entfernen/Absagen.
// `action` ist eine Server-Aktion (in Next 14 als Prop an Client-Komponenten
// übergebbar).
export function BestaetigungsButton({
  action,
  feldName,
  feldWert,
  label,
  bestaetigung,
  variante = 'dezent',
}: {
  action: (formData: FormData) => void
  feldName: string
  feldWert: string
  label: string
  bestaetigung: string
  variante?: Variante
}) {
  const [offen, setOffen] = useState(false)

  const basis = 'rounded-[11px] px-[12px] py-[8px] text-[13px] font-semibold transition'
  const stil: Record<Variante, string> = {
    primaer: 'bg-snippt-glow2/15 text-snippt-glow2 border border-snippt-glow2/40',
    gefahr: 'bg-red-500/10 text-red-300 border border-red-400/40',
    dezent: 'text-snippt-faint hover:text-snippt-muted',
  }

  if (!offen) {
    return (
      <button type="button" onClick={() => setOffen(true)} className={`${basis} ${stil[variante]}`}>
        {label}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] text-snippt-muted">{bestaetigung}</span>
      <form action={action}>
        <input type="hidden" name={feldName} value={feldWert} />
        <button type="submit" className={`${basis} ${stil[variante]}`}>
          Ja
        </button>
      </form>
      <button type="button" onClick={() => setOffen(false)} className={`${basis} text-snippt-faint`}>
        Abbrechen
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Typprüfung**

Run: `npx tsc --noEmit`
Expected: keine Fehler.

- [ ] **Step 3: Commit** (erst nach Freigabe)

```bash
git add app/dashboard/_components/BestaetigungsButton.tsx
git commit -m "Feature: Wiederverwendbarer Bestaetigungs-Knopf (Zwei-Schritt)"
```

---

## Task 3: Entfernen-Knopf in der Warteschlange

**Files:** Modify `app/dashboard/_components/QueueBoard.tsx`

- [ ] **Step 1: Importe ergänzen**

In `app/dashboard/_components/QueueBoard.tsx` die Import-/Aktionszeile erweitern. Aktuell:
```typescript
import { fertigNaechster, belohnungEinloesen } from '../actions'
```
ersetzen durch:
```typescript
import { fertigNaechster, belohnungEinloesen, eintragEntfernen } from '../actions'
import { BestaetigungsButton } from './BestaetigungsButton'
```

- [ ] **Step 2: „Entfernen" beim „Jetzt dran"-Eintrag**

Im `now`-Block, unmittelbar NACH dem schließenden `)}` des `belohnungEinloesen`-Form-Blocks (also am Ende des „Jetzt dran"-Karteninhalts, vor dem schließenden `</div>` der Karte), einfügen:
```tsx
          <div className="mt-[10px] flex justify-end">
            <BestaetigungsButton
              action={eintragEntfernen}
              feldName="eintragId"
              feldWert={now.id}
              label="Entfernen"
              bestaetigung="Aus der Reihe entfernen?"
              variante="dezent"
            />
          </div>
```

- [ ] **Step 3: „Entfernen" bei wartenden Einträgen**

Im `rest.map`-Block, nach dem `stempelVoll`-Abzeichen-Block und vor dem schließenden `</div>` des Eintrags, einfügen:
```tsx
          <div className="mt-[8px] flex justify-end">
            <BestaetigungsButton
              action={eintragEntfernen}
              feldName="eintragId"
              feldWert={entry.id}
              label="Entfernen"
              bestaetigung="Entfernen?"
              variante="dezent"
            />
          </div>
```

- [ ] **Step 4: Typprüfung**

Run: `npx tsc --noEmit`
Expected: keine Fehler.

- [ ] **Step 5: Commit** (erst nach Freigabe — zusammen mit Task 4)

Kein eigener Commit; gemeinsam mit Task 4.

---

## Task 4: Erledigt/Absagen in der Termin-Liste

**Files:** Modify `app/dashboard/page.tsx`

- [ ] **Step 1: Importe ergänzen**

In `app/dashboard/page.tsx` nach den bestehenden Imports (nach der Zeile `import type { QueueEntry, QueueStatus } from '@/lib/mockQueue'` bzw. den in der Vorgänger-Aufgabe ergänzten Importen) hinzufügen:
```typescript
import { terminAbschliessen, terminAbsagen } from './actions'
import { BestaetigungsButton } from './_components/BestaetigungsButton'
```

- [ ] **Step 2: Termin-Query auf aktive Status filtern**

Im Termin-Zweig die Query ersetzen. Aktuell:
```typescript
    const { data: termine } = await supabase
      .from('termin')
      .select('id, datum, gast_name, gast_telefon, status')
      .eq('friseur_id', friseur?.id ?? '')
      .neq('status', 'abgesagt')
      .gte('datum', heuteStart.toISOString())
      .order('datum', { ascending: true })
```
ersetzen durch (nur die Filterzeile ändert sich — erledigte UND abgesagte fallen raus):
```typescript
    const { data: termine } = await supabase
      .from('termin')
      .select('id, datum, gast_name, gast_telefon, status')
      .eq('friseur_id', friseur?.id ?? '')
      .in('status', ['ausstehend', 'bestaetigt'])
      .gte('datum', heuteStart.toISOString())
      .order('datum', { ascending: true })
```

- [ ] **Step 3: Aktionsknöpfe pro Termin**

Im Termin-Zweig den einzelnen Termin-Eintrag in `liste.map(...)` ersetzen. Aktuell:
```tsx
                  <div key={t.id as string} className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-snippt-surface p-[15px]">
                    <div>
                      <b className="text-[15px] font-semibold text-snippt-ink">{(t.gast_name as string | null)?.trim() || 'Gast'}</b>
                      {t.gast_telefon && <div className="text-[12px] text-snippt-faint">{t.gast_telefon as string}</div>}
                    </div>
                    <div className="text-right">
                      <div className="font-display text-[16px] text-snippt-ink">{pad(d.getHours())}:{pad(d.getMinutes())}</div>
                      <div className="text-[12px] text-snippt-faint">{tagText(d)}</div>
                    </div>
                  </div>
```
ersetzen durch:
```tsx
                  <div key={t.id as string} className="rounded-2xl border border-white/[0.07] bg-snippt-surface p-[15px]">
                    <div className="flex items-center justify-between">
                      <div>
                        <b className="text-[15px] font-semibold text-snippt-ink">{(t.gast_name as string | null)?.trim() || 'Gast'}</b>
                        {t.gast_telefon && <div className="text-[12px] text-snippt-faint">{t.gast_telefon as string}</div>}
                      </div>
                      <div className="text-right">
                        <div className="font-display text-[16px] text-snippt-ink">{pad(d.getHours())}:{pad(d.getMinutes())}</div>
                        <div className="text-[12px] text-snippt-faint">{tagText(d)}</div>
                      </div>
                    </div>
                    <div className="mt-[12px] flex items-center justify-end gap-2">
                      <BestaetigungsButton
                        action={terminAbsagen}
                        feldName="terminId"
                        feldWert={t.id as string}
                        label="Absagen"
                        bestaetigung="Termin absagen?"
                        variante="gefahr"
                      />
                      <BestaetigungsButton
                        action={terminAbschliessen}
                        feldName="terminId"
                        feldWert={t.id as string}
                        label="Erledigt"
                        bestaetigung="Als erledigt markieren?"
                        variante="primaer"
                      />
                    </div>
                  </div>
```

- [ ] **Step 4: Typprüfung + Build**

Run: `npx tsc --noEmit`
Expected: keine Fehler.

Run: `npm run build`
Expected: Build grün.

- [ ] **Step 5: Manueller UI-Test (optional, durch Alex)**

Warteschlangen-Modus: Eintrag „Entfernen" → Bestätigung → Eintrag weg, Nächster rückt nach.
Termin-Modus: „Erledigt" → Termin weg, Stempel beim Kunden vergeben (Kundenseite zeigt +1). „Absagen" → Termin weg, kein Stempel.

- [ ] **Step 6: Commit** (erst nach Freigabe — Task 3 + 4 gemeinsam)

```bash
git add app/dashboard/page.tsx app/dashboard/_components/QueueBoard.tsx
git commit -m "Feature: Reihe entfernen + Termin erledigt/absagen im Dashboard"
```

---

## Abschluss-Checkliste

- [ ] `npm test` weiterhin grün (9 Tests, unverändert).
- [ ] `npx tsc --noEmit` ohne Fehler.
- [ ] `npm run build` grün.
- [ ] Obsidian-Progress-Eintrag aktualisieren/ergänzen.
