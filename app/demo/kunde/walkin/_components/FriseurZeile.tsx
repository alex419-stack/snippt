import { ChevronRight } from 'lucide-react'
import type { Friseur } from '@/lib/mockData'

/**
 * FriseurZeile — Kompakte Zeile für weitere Friseure (nicht der Stammfriseur).
 *
 * Steht below the fold, nach der StammfriseurKarte und dem AuslastungsBlock.
 * Nur visuell im Demo — kein Link.
 * Server Component.
 */
export function FriseurZeile({
  friseur,
  freiAbUhrzeit,
}: {
  friseur: Friseur
  freiAbUhrzeit: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-bone/10 bg-surface px-4 py-3.5 transition-colors hover:border-bone/20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={friseur.foto}
        alt={friseur.name}
        className="h-10 w-10 flex-shrink-0 rounded-full border border-bone/10 object-cover"
      />

      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate text-sm font-medium text-ink">{friseur.name}</p>
        <p className="truncate text-xs text-coal/55">{friseur.spezialitaet}</p>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        <span className="text-xs text-coal/45">frei ab {freiAbUhrzeit}</span>
        <ChevronRight className="h-4 w-4 text-coal/30" strokeWidth={1.5} />
      </div>
    </div>
  )
}
