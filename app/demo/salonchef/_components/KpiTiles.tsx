import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

/**
 * KpiTiles — vier Kennzahlen-Kacheln nebeneinander auf Desktop, 2x2 auf Tablet.
 *
 * Jede Kachel: kleiner Label-Text oben, großer Wert mittig,
 * dezenter Trend-Vergleich „vs. Vorwoche" mit Pfeil-Icon in Akzentfarbe.
 *
 * Server Component, alle Werte werden als Props reingereicht — die
 * Aggregation passiert in der Page-Komponente, damit hier 0 Logik liegt.
 */

type Trend = {
  delta: number // +8 | -3 | 0
  label: string // „vs. Vorwoche"
}

export type Kpi = {
  label: string
  wert: string // bereits formatiert, z.B. "9", "4.280 €", "78 %"
  trend?: Trend
}

export function KpiTiles({ kpis }: { kpis: Kpi[] }) {
  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <article
          key={kpi.label}
          className="group relative overflow-hidden rounded-2xl border border-coal/10 bg-white p-6 transition-all duration-200 hover:border-coal/20 hover:shadow-[0_8px_28px_-12px_rgba(15,15,15,0.12)]"
        >
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-coal/55">
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

  // Vorzeichen explizit, damit „+8%" lesbar bleibt
  const vorzeichen = positiv ? '+' : negativ ? '' : '±'
  const text = `${vorzeichen}${trend.delta}%`

  // Anti-Toxizität: positiv = warmgold (Akzent), negativ = dezentes Coal,
  // niemals Rot — wir wollen keine Alarm-Stimmung im Pitch.
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
