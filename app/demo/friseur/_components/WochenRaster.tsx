import type { Termin } from '@/lib/mockData'

/**
 * WochenRaster — Kompaktes Wochen-Grid für die Friseur-Sicht.
 *
 * Zeigt Marcos Termine der aktuellen Woche (Mo–Sa) als Dots
 * in einem Stunden × Tage-Raster. Heute-Spalte gold hervorgehoben.
 *
 * Mobile-First: overflow-x-auto, Spaltenbreite ~52px.
 * Server Component.
 */

const DEMO_TAGE = [
  { label: 'Mo', kuerzel: 'Mo', datum: '2026-04-27' },
  { label: 'Di', kuerzel: 'Di', datum: '2026-04-28' },
  { label: 'Mi', kuerzel: 'Mi', datum: '2026-04-29' },
  { label: 'Do', kuerzel: 'Do', datum: '2026-04-30' },
  { label: 'Fr', kuerzel: 'Fr', datum: '2026-05-01' },
  { label: 'Sa', kuerzel: 'Sa', datum: '2026-05-02' },
]

// Stunden 9–18 (letzte Zeile = 18:xx-Termine)
const STUNDEN = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

export function WochenRaster({
  termine,
  heuteDatum,
}: {
  termine: Termin[]
  heuteDatum: string
}) {
  // Termine in Grid-Struktur: Map[datum][stunde] = Termin[]
  const grid: Record<string, Record<number, Termin[]>> = {}

  for (const tag of DEMO_TAGE) {
    grid[tag.datum] = {}
    for (const h of STUNDEN) {
      grid[tag.datum][h] = []
    }
  }

  for (const t of termine) {
    const datum = t.start.slice(0, 10)
    const stunde = parseInt(t.start.slice(11, 13), 10)
    if (grid[datum] && stunde >= 9 && stunde <= 18) {
      grid[datum][stunde].push(t)
    }
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3 label-caps text-coal/50">
        <span className="h-px w-6 bg-coal/20" />
        Diese Woche
      </div>

      <div className="overflow-x-auto rounded-2xl border border-bone/10 bg-surface">
        <table className="w-full min-w-[340px] border-collapse text-center">
          {/* Kopfzeile */}
          <thead>
            <tr>
              <th className="w-10 border-b border-r border-bone/8 py-2.5 text-[10px] font-medium text-coal/30" />
              {DEMO_TAGE.map((tag) => {
                const istHeute = tag.datum === heuteDatum
                return (
                  <th
                    key={tag.datum}
                    className={`border-b border-bone/8 py-2.5 text-[11px] font-semibold ${
                      istHeute ? 'text-whiskey' : 'text-coal/50'
                    }`}
                  >
                    {tag.kuerzel}
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* Zeilen: eine pro Stunde */}
          <tbody>
            {STUNDEN.map((stunde) => (
              <tr key={stunde} className="group">
                {/* Stunden-Label */}
                <td className="border-r border-bone/8 py-1.5 pr-1 text-right text-[10px] tabular-nums text-coal/30">
                  {stunde}
                </td>

                {/* Zellen pro Tag */}
                {DEMO_TAGE.map((tag) => {
                  const istHeute = tag.datum === heuteDatum
                  const zellTermine = grid[tag.datum][stunde] ?? []

                  return (
                    <td
                      key={tag.datum}
                      className={`py-1 ${
                        istHeute ? 'bg-whiskey/5' : ''
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-center gap-0.5">
                        {zellTermine.length === 0 ? (
                          <span className="h-1.5 w-1.5" />
                        ) : (
                          zellTermine.map((t) => (
                            <TerminDot key={t.id} status={t.status} />
                          ))
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function TerminDot({
  status,
}: {
  status: Termin['status']
}) {
  const farbe =
    status === 'walkin'
      ? 'bg-whiskey'
      : status === 'abgeschlossen'
        ? 'bg-coal/30'
        : 'bg-whiskey/70'

  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${farbe}`} />
}
