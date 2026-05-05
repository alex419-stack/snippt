import type { Friseur } from '@/lib/mockData'

/**
 * TrustSignale — Erfahrung, Stammkunden-Anteil, Stilrichtungen, Bio.
 * Zeigt dem Erstkunden warum er wiederkommen sollte.
 * Server Component.
 */
export function TrustSignale({ friseur }: { friseur: Friseur }) {
  return (
    <section className="space-y-5">
      {/* Erfahrung + Stammkunden als 2er-Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-bone/10 bg-surface p-4 space-y-1">
          <p className="text-2xl font-semibold tabular-nums text-ink">
            {friseur.jahre_erfahrung}
          </p>
          <p className="text-xs text-coal/55">Jahre Erfahrung</p>
        </div>
        <div className="rounded-xl border border-bone/10 bg-surface p-4 space-y-1">
          <p className="text-2xl font-semibold tabular-nums text-ink">
            {Math.round(friseur.stammkunden_anteil * 100)}%
          </p>
          <p className="text-xs text-coal/55">Stammkunden</p>
        </div>
      </div>

      {/* Stilrichtungen */}
      <div className="flex flex-wrap gap-2">
        {friseur.stilrichtung.map((s) => (
          <span
            key={s}
            className="rounded-full border border-bone/15 bg-surface px-3 py-1 text-xs font-medium text-coal/70"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Bio */}
      <blockquote className="border-l-2 border-gold/40 pl-4">
        <p className="text-sm leading-relaxed text-coal/75 italic">{friseur.bio}</p>
      </blockquote>
    </section>
  )
}
