import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'
import type { Friseur } from '@/lib/mockData'

/**
 * ProfilHeader — Einstieg nach QR-Code-Scan.
 * Zeigt sofort: bei wem man war, wie gut er ist, aus welchem Salon.
 * Server Component.
 */
export function ProfilHeader({
  friseur,
  salonName,
}: {
  friseur: Friseur
  salonName: string
}) {
  return (
    <div className="space-y-6">
      <Link
        href="/demo"
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-coal/50 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Zur Demo-Übersicht
      </Link>

      {/* QR-Kontext-Label */}
      <div className="flex items-center gap-3 label-caps text-gold">
        <span className="h-px w-6 bg-gold" />
        via QR-Code · {salonName}
      </div>

      {/* Friseur-Hero */}
      <div className="border-b border-bone/10 pb-6">
        <div className="flex items-start gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={friseur.foto}
            alt={friseur.name}
            className="h-20 w-20 flex-shrink-0 rounded-2xl border border-bone/10 object-cover"
          />
          <div className="space-y-2 pt-1">
            <h1 className="text-h1 text-ink">{friseur.name}</h1>
            <p className="text-sm text-coal/65">{friseur.spezialitaet}</p>

            {friseur.social_proof.bewertung_durchschnitt != null && (
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" strokeWidth={0} />
                <span className="text-sm font-semibold tabular-nums text-ink">
                  {friseur.social_proof.bewertung_durchschnitt}
                </span>
                <span className="text-xs text-coal/40">
                  · {friseur.social_proof.bewertung_anzahl} Bewertungen
                </span>
              </div>
            )}

            {friseur.social_proof.instagram && (
              <p className="text-xs text-coal/45">
                {friseur.social_proof.instagram}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
