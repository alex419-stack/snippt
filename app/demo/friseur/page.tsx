import {
  getFriseurById,
  getKundeById,
  getTermineByFriseur,
} from '@/lib/mockData'
import { FriseurHeader } from './_components/FriseurHeader'
import { MeinBrandKarte } from './_components/MeinBrandKarte'
import { type TerminEintrag } from './_components/TagesTermine'
import { TagesZeitslots } from './_components/TagesZeitslots'
import { WochenRaster } from './_components/WochenRaster'

/**
 * Friseur-Tagesansicht — M0 Killer-Screen #2.
 *
 * Zeigt Marcos persönlichen Arbeitstag aus seiner Sicht auf dem Handy:
 * Begrüßung, „Mein Brand"-Karte (Personalbranding) und chronologische
 * Termin-Timeline mit JETZT-Linie und Kundennotizen.
 *
 * Mobile-First: max-w-[430px] simuliert Phone-Viewport.
 * Server Component. Alle Daten aus lib/mockData.ts, keine API-Calls.
 */

// ---------- Demo-Konstanten ----------

const MARCO_ID = 'f1'
const HEUTE_DATUM = '2026-05-01'
const HEUTE_LANG = 'Freitag, 1. Mai 2026'
/** Fiktives "Jetzt" — liegt zwischen letztem Done-Termin (11:30) und nächstem (14:00). */
const JETZT_UHRZEIT = '13:30'

// ---------- Page ----------

export default function FriseurPage() {
  const marco = getFriseurById(MARCO_ID)!

  // Marcos Termine heute, chronologisch sortiert
  const termineHeute = getTermineByFriseur(MARCO_ID)
    .filter((t) => t.start.startsWith(HEUTE_DATUM))
    .sort((a, b) => a.start.localeCompare(b.start))

  // Erster geplanter Termin = der nächste
  const naechsterTerminId = termineHeute.find((t) => t.status === 'geplant')?.id

  // TerminEinträge mit aufgelöstem Kunden-Objekt
  const eintraege: TerminEintrag[] = termineHeute
    .map((termin) => {
      const kunde = getKundeById(termin.kunde_id)
      if (!kunde) return null
      return { termin, kunde, istNaechster: termin.id === naechsterTerminId }
    })
    .filter((e): e is TerminEintrag => e !== null)

  // Tages-KPIs für den Header
  const anzahlErledigt = termineHeute.filter(
    (t) => t.status === 'abgeschlossen',
  ).length
  const anzahlWalkIn = termineHeute.filter(
    (t) => t.status === 'walkin',
  ).length
  const anzahlGesamt = termineHeute.length

  return (
    <div className="mx-auto max-w-[430px] space-y-8">
      <FriseurHeader
        friseur={marco}
        datumLang={HEUTE_LANG}
        anzahlErledigt={anzahlErledigt}
        anzahlWalkIn={anzahlWalkIn}
        anzahlGesamt={anzahlGesamt}
      />

      <MeinBrandKarte friseur={marco} />

      <TagesZeitslots eintraege={eintraege} jetztUhrzeit={JETZT_UHRZEIT} />

      <WochenRaster
        termine={getTermineByFriseur(MARCO_ID)}
        heuteDatum={HEUTE_DATUM}
      />

      <footer className="border-t border-coal/10 pt-6 text-xs text-coal/45">
        Mockup mit Demo-Daten aus{' '}
        <code className="rounded bg-coal/5 px-1.5 py-0.5 font-mono text-[11px] text-coal/70">
          lib/mockData.ts
        </code>{' '}
        — keine API, keine Logik außer Aggregation.
      </footer>
    </div>
  )
}
