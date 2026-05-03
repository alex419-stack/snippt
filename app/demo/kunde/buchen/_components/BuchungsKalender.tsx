import type { Termin } from '@/lib/mockData'

/**
 * BuchungsKalender — Wochen-Grid aus Kundensicht.
 *
 * Zeigt zwei Wochen: aktuelle (mit Marco's Terminen) + nächste (alle frei).
 * Belegte Slots = gedimmt, freie Slots = buchbar (gold hover).
 *
 * Aus Kunden-Perspektive: frei = buchbar, belegt = nicht buchbar.
 * Unterschied zum Friseur-WochenRaster: hier ist "frei" das Positive.
 * Server Component.
 */

// Aktuelle Demo-Woche (diese Woche)
const DIESE_WOCHE = [
  { label: 'Mo', tagNummer: '27', datum: '2026-04-27' },
  { label: 'Di', tagNummer: '28', datum: '2026-04-28' },
  { label: 'Mi', tagNummer: '29', datum: '2026-04-29' },
  { label: 'Do', tagNummer: '30', datum: '2026-04-30' },
  { label: 'Fr', tagNummer: '01', datum: '2026-05-01' },
  { label: 'Sa', tagNummer: '02', datum: '2026-05-02' },
]

// Nächste Woche (keine Mockdaten = alle frei)
const NAECHSTE_WOCHE = [
  { label: 'Mo', tagNummer: '04', datum: '2026-05-04' },
  { label: 'Di', tagNummer: '05', datum: '2026-05-05' },
  { label: 'Mi', tagNummer: '06', datum: '2026-05-06' },
  { label: 'Do', tagNummer: '07', datum: '2026-05-07' },
  { label: 'Fr', tagNummer: '08', datum: '2026-05-08' },
  { label: 'Sa', tagNummer: '09', datum: '2026-05-09' },
]

// Buchbare Slot-Stunden (volle Stunden 9–18)
const SLOT_STUNDEN = [9, 10, 11, 12, 13, 14, 15, 16, 17]

export function BuchungsKalender({
  termine,
  heuteDatum,
}: {
  termine: Termin[]
  heuteDatum: string
}) {
  // Belegte Zellen: Set aus "datum|stunde"
  const belegt = new Set<string>()
  for (const t of termine) {
    const datum = t.start.slice(0, 10)
    const stunde = parseInt(t.start.slice(11, 13), 10)
    if (stunde >= 9 && stunde <= 18) {
      belegt.add(`${datum}|${stunde}`)
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 label-caps text-coal/50">
        <span className="h-px w-6 bg-coal/20" />
        Termin vorab buchen
      </div>

      <KalenderGrid
        tage={DIESE_WOCHE}
        belegt={belegt}
        heuteDatum={heuteDatum}
        wochenLabel="Diese Woche"
        monat="April / Mai"
      />

      <KalenderGrid
        tage={NAECHSTE_WOCHE}
        belegt={belegt}
        heuteDatum={heuteDatum}
        wochenLabel="Nächste Woche"
        monat="Mai"
      />
    </section>
  )
}

function KalenderGrid({
  tage,
  belegt,
  heuteDatum,
  wochenLabel,
  monat,
}: {
  tage: { label: string; tagNummer: string; datum: string }[]
  belegt: Set<string>
  heuteDatum: string
  wochenLabel: string
  monat: string
}) {
  return (
    <div className="rounded-2xl border border-bone/10 bg-surface overflow-hidden">
      {/* Wochen-Kopf */}
      <div className="flex items-baseline justify-between border-b border-bone/8 px-4 py-2.5">
        <span className="text-xs font-semibold text-coal/60">{wochenLabel}</span>
        <span className="text-[11px] text-coal/35">{monat}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[340px] border-collapse text-center">
          {/* Tag-Kopfzeile */}
          <thead>
            <tr>
              <th className="w-8 border-b border-r border-bone/8 py-2 text-[10px] font-medium text-coal/25" />
              {tage.map((tag) => {
                const istHeute = tag.datum === heuteDatum
                const istVergangenheit = tag.datum < heuteDatum
                return (
                  <th
                    key={tag.datum}
                    className={`border-b border-bone/8 py-2 text-[10px] font-semibold ${
                      istHeute
                        ? 'text-whiskey'
                        : istVergangenheit
                          ? 'text-coal/25'
                          : 'text-coal/55'
                    }`}
                  >
                    <div>{tag.label}</div>
                    <div className={`text-[9px] ${istHeute ? 'text-whiskey/70' : 'text-coal/30'}`}>
                      {tag.tagNummer}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* Stunden-Zeilen */}
          <tbody>
            {SLOT_STUNDEN.map((stunde) => (
              <tr key={stunde}>
                <td className="border-r border-bone/8 py-1 pr-1 text-right text-[9px] tabular-nums text-coal/25">
                  {stunde}
                </td>
                {tage.map((tag) => {
                  const istVergangenheit = tag.datum < heuteDatum
                  const istHeuteUndVorbei =
                    tag.datum === heuteDatum && stunde < 14 // Demo: vor 13:30 vorbei
                  const istBelegt = belegt.has(`${tag.datum}|${stunde}`)
                  const nichtBuchbar = istVergangenheit || istHeuteUndVorbei || istBelegt

                  return (
                    <td key={tag.datum} className="px-0.5 py-0.5">
                      {nichtBuchbar ? (
                        <span className="flex h-5 w-full items-center justify-center">
                          {istBelegt ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-coal/25" />
                          ) : (
                            <span className="h-px w-3 bg-bone/8" />
                          )}
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="h-5 w-full rounded bg-whiskey/10 text-[9px] font-medium text-whiskey/70 transition-colors hover:bg-whiskey/25 hover:text-whiskey"
                        >
                          frei
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legende */}
      <div className="flex items-center gap-4 border-t border-bone/8 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded bg-whiskey/20" />
          <span className="text-[10px] text-coal/40">Frei</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-coal/25" />
          <span className="text-[10px] text-coal/40">Belegt</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-px w-4 bg-bone/8" />
          <span className="text-[10px] text-coal/40">Vorbei</span>
        </div>
      </div>
    </div>
  )
}
