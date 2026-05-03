import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Friseur } from '@/lib/mockData'

/**
 * FriseurHeader — Begrüßung + Datum + Tages-Chips.
 *
 * Begrüßungs-H1 in Playfair Display Serif.
 * Server Component.
 */
export function FriseurHeader({
  friseur,
  datumLang,
  anzahlErledigt,
  anzahlWalkIn,
  anzahlGesamt,
}: {
  friseur: Friseur
  datumLang: string
  anzahlErledigt: number
  anzahlWalkIn: number
  anzahlGesamt: number
}) {
  return (
    <div className="space-y-6">
      <Link
        href="/demo"
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-coal/50 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Zurück zum Hub
      </Link>

      <header className="flex items-center justify-between border-b border-bone/10 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 label-caps text-whiskey">
            <span className="h-px w-6 bg-whiskey" />
            Friseur · Tagesansicht
          </div>
          <h1 className="text-h1 text-ink">
            Hallo, {friseur.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-coal/65">{datumLang}</p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={friseur.foto}
          alt={friseur.name}
          className="h-12 w-12 flex-shrink-0 rounded-full border border-bone/15 object-cover"
        />
      </header>

      {/* Tages-Chips */}
      <div className="flex flex-wrap gap-2">
        <Chip label={`${anzahlErledigt} erledigt`} />
        {anzahlWalkIn > 0 && <Chip label={`${anzahlWalkIn} Walk-In`} gold />}
        <Chip label={`${anzahlGesamt} heute gesamt`} />
      </div>
    </div>
  )
}

function Chip({ label, gold = false }: { label: string; gold?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        gold ? 'bg-whiskey/15 text-whiskey' : 'bg-bone/8 text-coal/70'
      }`}
    >
      {label}
    </span>
  )
}
