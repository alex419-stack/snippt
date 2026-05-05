import { getFriseurById, getTermineByFriseur } from '@/lib/mockData'
import { BuchungsHeader } from './_components/BuchungsHeader'
import { SchnellSlots } from './_components/SchnellSlots'
import { BuchungsKalender } from './_components/BuchungsKalender'
import { ConversionTeaser } from './_components/ConversionTeaser'

/**
 * Buchungs-Flow — M0 Killer-Screen #4.
 *
 * Endkunde bucht bei seinem Friseur (Marco):
 * 1. Schnell-Slots: Nächste freie Slots auf einen Blick
 * 2. Wochenkalender: Frei- und Belegtanzeige über zwei Wochen
 * 3. Conversion-Teaser: Stammkunde werden
 *
 * Mobile-First: max-w-[430px].
 * Server Component. Daten aus lib/mockData.ts.
 */

const STAMMFRISEUR_ID  = 'f1'  // Marco
const HEUTE_DATUM      = '2026-05-01'

// ---------- Schnell-Slots ----------
// Heute (Fr 01.05.) sind alle Nachmittagsslots bei Marco belegt (t33, t35, t38, t40).
// → Nächste freie Slots aus Sa 02.05. (Lücken zwischen t42/t43 um 9h und t48 um 14:30)
const SCHNELL_SLOTS = [
  { datum: 'Sa, 2. Mai', uhrzeit: '10:00' },
  { datum: 'Sa, 2. Mai', uhrzeit: '10:30' },
  { datum: 'Sa, 2. Mai', uhrzeit: '11:00' },
  { datum: 'Sa, 2. Mai', uhrzeit: '11:30' },
]

export default function BuchenPage() {
  const marco = getFriseurById(STAMMFRISEUR_ID)!
  const marcoTermine = getTermineByFriseur(STAMMFRISEUR_ID)
  const vorname = marco.name.split(' ')[0]

  return (
    <div className="relative">
    <div className="mx-auto max-w-[430px] space-y-6">
      <BuchungsHeader friseur={marco} />

      <SchnellSlots slots={SCHNELL_SLOTS} friseurVorname={vorname} />

      <BuchungsKalender termine={marcoTermine} heuteDatum={HEUTE_DATUM} />

      <ConversionTeaser friseurVorname={vorname} />

      <footer className="border-t border-coal/10 pt-6 text-xs text-coal/45">
        Mockup mit Demo-Daten aus{' '}
        <code className="rounded bg-coal/5 px-1.5 py-0.5 font-mono text-[11px] text-coal/70">
          lib/mockData.ts
        </code>{' '}
        — keine API, keine Logik außer Aggregation.
      </footer>
    </div>

    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/barber-hero-clean.png"
      alt="Snippt Barbershop"
      className="absolute right-2 top-2 w-16 xl:right-8 xl:top-8 xl:w-[260px]"
    />
    </div>
  )
}
