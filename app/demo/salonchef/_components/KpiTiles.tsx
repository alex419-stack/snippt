import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

/**
 * KpiTiles — vier Kennzahlen-Kacheln.
 *
 * bg-surface statt bg-white — reagiert auf Dark/Light-Token.
 * Hover-Shadow für dunklen Hintergrund angepasst (größerer Spread, dunklere Farbe).
 * Server Component.
 */

type Trend = {
  delta: number
  label: string
}

export type Kpi = {
  label: string
  wert: string
  trend?: Trend
}

export function KpiTiles({ kpis }: { kpis: Kpi[] }) {
  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <article
          key={kpi.label}
          className="group relative overflow-hidden rounded-2xl border border-bone/10 bg-surface p-6 transition-all duration-200 hover:border-bone/20 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.09)]"
        >
          <div className="label-caps text-coal/55">
            {kpi.label}
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-3">
            <div className="font-sans text-4xl font-semibold tracking-tight text-ink tabular-nums">
              {kpi.wert}
            </div>
            {kpi.trend && <TrendBadge trend={kpi.trend} />}
          </div>
        </article>
      ))}
    </section>
  )
}

function TrendBadge({ trend }: { trend: Trend }) {
  const positiv = trend.delta > 0
  const negativ = trend.delta < 0
  const neutral = trend.delta === 0

  const vorzeichen = positiv ? '+' : negativ ? '' : '±'
  const text = `${vorzeichen}${trend.delta}%`

  // Anti-Toxizität: positiv = gold, negativ = dezentes coal, niemals Rot
  const farbe = positiv
    ? 'text-gold'
    : negativ
      ? 'text-coal/55'
      : 'text-coal/45'

  const Icon = positiv ? TrendingUp : negativ ? TrendingDown : Minus

  return (
    <div
      className={`inline-flex items-center gap-1 text-xs font-medium tabular-nums ${farbe}`}
      title={trend.label}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
      <span>{neutral ? '±0%' : text}</span>
    </div>
  )
}
