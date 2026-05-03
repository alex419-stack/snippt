import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'
import type { Friseur } from '@/lib/mockData'

/**
 * BuchungsHeader — Friseur-Profil-Zeile oben auf dem Buchungsscreen.
 * Gibt dem Kunden sofort das Gefühl: „Ich buche bei meinem Friseur."
 * Server Component.
 */
export function BuchungsHeader({ friseur }: { friseur: Friseur }) {
  return (
    <div className="space-y-6">
      <Link
        href="/demo/kunde/walkin"
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-coal/50 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Zurück zum Live-Status
      </Link>

      <header className="border-b border-bone/10 pb-6">
        <div className="flex items-center gap-3 label-caps text-whiskey mb-3">
          <span className="h-px w-6 bg-whiskey" />
          Endkunde · Termin buchen
        </div>

        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={friseur.foto}
            alt={friseur.name}
            className="h-14 w-14 flex-shrink-0 rounded-xl border border-bone/10 object-cover"
          />
          <div className="space-y-1">
            <h1 className="text-h2 text-ink">{friseur.name}</h1>
            <p className="text-sm text-coal/65">{friseur.spezialitaet}</p>
            {friseur.social_proof.bewertung_durchschnitt != null && (
              <div className="flex items-center gap-1.5">
                <Star className="h-3 w-3 fill-whiskey text-whiskey" strokeWidth={0} />
                <span className="text-xs font-semibold tabular-nums text-ink">
                  {friseur.social_proof.bewertung_durchschnitt}
                </span>
                <span className="text-xs text-coal/40">
                  · {friseur.social_proof.bewertung_anzahl} Bewertungen
                </span>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}
