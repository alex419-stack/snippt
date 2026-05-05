import { Star } from 'lucide-react'
import type { Friseur } from '@/lib/mockData'

/**
 * MeinBrandKarte — Personalbranding-Karte für den eingeloggten Friseur.
 *
 * Dark-Mode: bg-surface statt bg-white/60.
 * Eigenname "Marco Lehmann" in Playfair Display Serif.
 * Server Component.
 */
export function MeinBrandKarte({ friseur }: { friseur: Friseur }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3 label-caps text-gold">
        <span className="h-px w-6 bg-gold" />
        Mein Brand
      </div>

      <article className="space-y-4 rounded-2xl border border-bone/10 bg-surface p-5">
        {/* Profil-Zeile */}
        <div className="flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={friseur.foto}
            alt={friseur.name}
            className="h-16 w-16 flex-shrink-0 rounded-xl border border-bone/10 object-cover"
          />
          <div className="min-w-0 space-y-1">
            <h2 className="text-h2 leading-tight text-ink">
              {friseur.name}
            </h2>
            <p className="text-sm text-coal/65">{friseur.spezialitaet}</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {friseur.stilrichtung.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-full bg-bone/8 px-2.5 py-0.5 text-[11px] text-coal/65"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm leading-relaxed text-coal/75">{friseur.bio}</p>

        <div className="border-t border-bone/10" />

        {/* Kennzahlen */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <StatBlock wert={`${friseur.jahre_erfahrung} J.`} label="Erfahrung" />
          {friseur.social_proof.bewertung_durchschnitt != null && (
            <StatBlock
              wert={String(friseur.social_proof.bewertung_durchschnitt)}
              label={`${friseur.social_proof.bewertung_anzahl} Bew.`}
              stern
            />
          )}
          <StatBlock
            wert={`${Math.round(friseur.stammkunden_anteil * 100)}%`}
            label="Stammkunden"
          />
        </div>

        {/* Trend */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-coal/50">Trend 30 Tage</span>
          <TrendLabel trend={friseur.trend_30_tage} />
        </div>
      </article>
    </section>
  )
}

function StatBlock({
  wert,
  label,
  stern = false,
}: {
  wert: string
  label: string
  stern?: boolean
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-center gap-1">
        {stern && (
          <Star className="h-3.5 w-3.5 fill-gold text-gold" strokeWidth={0} />
        )}
        <span className="font-sans text-lg font-semibold tabular-nums text-ink">
          {wert}
        </span>
      </div>
      <span className="block text-[11px] text-coal/55">{label}</span>
    </div>
  )
}

function TrendLabel({
  trend,
}: {
  trend: 'wachsend' | 'stabil' | 'schrumpfend'
}) {
  const map = {
    wachsend:    { label: 'Wachsend',    farbe: 'text-gold font-semibold' },
    stabil:      { label: 'Stabil',      farbe: 'text-coal/55' },
    schrumpfend: { label: 'Rückläufig',  farbe: 'text-coal/45' },
  } as const

  const { label, farbe } = map[trend]
  return <span className={`text-xs ${farbe}`}>{label}</span>
}
