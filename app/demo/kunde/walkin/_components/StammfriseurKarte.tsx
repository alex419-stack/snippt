import Link from 'next/link'
import { Star, MapPin } from 'lucide-react'
import type { Friseur } from '@/lib/mockData'

/**
 * StammfriseurKarte — Prominente Highlight-Karte für "Deinen Friseur".
 *
 * Zeigt Personalbranding (Foto, Name, Spezialität, Bewertung) und
 * den aktuellen Verfügbarkeitsstatus mit 2 CTAs.
 *
 * Steht above the fold — der Kunde sieht dies sofort ohne zu scrollen.
 * Server Component.
 */
export type FriseurStatus =
  | { typ: 'frei'; naechsterTermin: string }
  | { typ: 'besetzt'; freiAb: string }

export function StammfriseurKarte({
  friseur,
  status,
}: {
  friseur: Friseur
  status: FriseurStatus
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3 label-caps text-whiskey">
        <MapPin className="h-3 w-3 fill-whiskey text-whiskey" strokeWidth={0} />
        Dein Friseur
      </div>

      <article className="space-y-5 rounded-2xl border border-bone/10 bg-surface p-5">
        {/* Profil-Zeile */}
        <div className="flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={friseur.foto}
            alt={friseur.name}
            className="h-16 w-16 flex-shrink-0 rounded-xl border border-bone/10 object-cover"
          />
          <div className="min-w-0 space-y-1">
            <h2 className="text-h2 leading-tight text-ink">{friseur.name}</h2>
            <p className="text-sm text-coal/65">{friseur.spezialitaet}</p>
            {friseur.social_proof.bewertung_durchschnitt != null && (
              <div className="flex items-center gap-1.5 pt-0.5">
                <Star
                  className="h-3.5 w-3.5 flex-shrink-0 fill-whiskey text-whiskey"
                  strokeWidth={0}
                />
                <span className="text-sm font-semibold tabular-nums text-ink">
                  {friseur.social_proof.bewertung_durchschnitt}
                </span>
                <span className="text-xs text-coal/45">
                  · {friseur.jahre_erfahrung} J. Erfahrung
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-bone/10" />

        {/* Status */}
        <div className="space-y-1.5">
          <StatusPill status={status} />
          <p className="text-xs text-coal/50">
            {status.typ === 'frei'
              ? `Nächster Termin: ${status.naechsterTermin} Uhr`
              : `Nächster freier Slot: ${status.freiAb} Uhr`}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2.5">
          <Link
            href="/demo/kunde/buchen"
            className="flex w-full items-center justify-center rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-bone transition-opacity hover:opacity-80"
          >
            {status.typ === 'frei'
              ? 'Slot sichern'
              : `Slot um ${status.freiAb} Uhr sichern`}
          </Link>
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-xl border border-bone/15 px-4 py-3 text-sm font-medium text-coal/70 transition-colors hover:border-bone/30 hover:text-coal/90"
          >
            {status.typ === 'frei' ? 'Einfach hingehen' : 'Anderen Friseur wählen'}
          </button>
        </div>
      </article>
    </section>
  )
}

function StatusPill({ status }: { status: FriseurStatus }) {
  if (status.typ === 'frei') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-whiskey/15 px-3 py-1 text-xs font-medium text-whiskey">
        <span className="h-1.5 w-1.5 rounded-full bg-whiskey" />
        Gerade frei
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-coal/10 px-3 py-1 text-xs font-medium text-coal/60">
      <span className="h-1.5 w-1.5 rounded-full bg-coal/40" />
      Besetzt bis {status.freiAb} Uhr
    </span>
  )
}
