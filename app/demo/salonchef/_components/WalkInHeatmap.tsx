/**
 * WalkInHeatmap — 7 Tage × 11 Stunden-Slots (8:00–18:00).
 *
 * Read-only-Display. Jede Zelle wird über die Anzahl der Walk-Ins
 * im jeweiligen Slot gefärbt: hell = wenig, dunkel = viel.
 *
 * Datenbasis kommt als 2D-Array vom Caller (Page-Komponente),
 * damit die Heatmap selbst keine Aggregations-Logik trägt.
 *
 * Server Component.
 */

const SLOTS = Array.from({ length: 11 }, (_, i) => 8 + i) // 8..18
const TAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as const

export type WalkInRaster = {
  /** [tagIndex 0..6][slotIndex 0..10] = Anzahl Walk-Ins */
  zellen: number[][]
  /** Höchstwert im Raster — für die Skalen-Normalisierung */
  max: number
}

export function WalkInHeatmap({ raster }: { raster: WalkInRaster }) {
  return (
    <section className="space-y-5 rounded-2xl border border-coal/10 bg-white p-6">
      <header className="flex items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="font-sans text-xl font-semibold tracking-tight text-ink">
            Walk-In-Muster der Woche
          </h2>
          <p className="text-sm text-coal/65">
            Wann kommt spontane Laufkundschaft? Dunklere Felder = mehr
            Walk-Ins.
          </p>
        </div>
        <Legende max={raster.max} />
      </header>

      {/* Heatmap-Grid: 1 Spalte für Slot-Label + 7 Spalten für Tage */}
      <div className="grid grid-cols-[44px_repeat(7,minmax(0,1fr))] gap-1.5">
        {/* Kopfzeile: leere Zelle + 7 Tages-Kürzel */}
        <div />
        {TAGE.map((tag) => (
          <div
            key={tag}
            className="text-center text-[10.5px] font-medium uppercase tracking-[0.14em] text-coal/55"
          >
            {tag}
          </div>
        ))}

        {/* Eine Zeile pro Slot */}
        {SLOTS.map((stunde, slotIdx) => (
          <FragmentZeile
            key={stunde}
            stunde={stunde}
            slotIdx={slotIdx}
            raster={raster}
          />
        ))}
      </div>
    </section>
  )
}

// React-Fragment-Wrapper für eine Slot-Zeile (Label + 7 Zellen)
function FragmentZeile({
  stunde,
  slotIdx,
  raster,
}: {
  stunde: number
  slotIdx: number
  raster: WalkInRaster
}) {
  return (
    <>
      <div className="pr-2 text-right text-[11px] font-medium tabular-nums text-coal/55">
        {String(stunde).padStart(2, '0')}:00
      </div>
      {raster.zellen.map((tagSpalte, tagIdx) => {
        const wert = tagSpalte[slotIdx] ?? 0
        return (
          <Zelle
            key={tagIdx}
            wert={wert}
            max={raster.max}
            ariaLabel={`${TAGE[tagIdx]} ${String(stunde).padStart(2, '0')}:00 — ${wert} Walk-Ins`}
          />
        )
      })}
    </>
  )
}

function Zelle({
  wert,
  max,
  ariaLabel,
}: {
  wert: number
  max: number
  ariaLabel: string
}) {
  // Intensität 0..1; bei wert=0 nutzen wir eine sehr schwache Bone-Tönung,
  // damit die Zelle sichtbar bleibt aber „leer" wirkt.
  const intensitaet = max > 0 ? wert / max : 0

  // Schwarzwert in HSL — wir interpolieren von 96% (fast bone) auf 8% (fast ink).
  // Damit bleibt die Heatmap im Coal/Ink-Korridor und passt zur Premium-Palette.
  const lightness = wert === 0 ? 96 : 88 - intensitaet * 80
  const bg = `hsl(0 0% ${lightness}%)`

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      title={ariaLabel}
      className="aspect-[5/3] rounded-md ring-1 ring-inset ring-coal/5 transition-transform duration-150 hover:scale-[1.04]"
      style={{ backgroundColor: bg }}
    />
  )
}

function Legende({ max }: { max: number }) {
  // 5-Stufen-Skala: 0, 25%, 50%, 75%, 100% des Max
  const stufen = [0, 0.25, 0.5, 0.75, 1]
  return (
    <div className="hidden items-center gap-2 text-[11px] text-coal/55 md:flex">
      <span>wenig</span>
      <div className="flex gap-1">
        {stufen.map((s) => {
          const lightness = s === 0 ? 96 : 88 - s * 80
          return (
            <div
              key={s}
              className="h-3 w-5 rounded-sm ring-1 ring-inset ring-coal/5"
              style={{ backgroundColor: `hsl(0 0% ${lightness}%)` }}
            />
          )
        })}
      </div>
      <span>viel</span>
      {max > 0 && (
        <span className="ml-2 text-coal/45">(max. {max} pro Slot)</span>
      )}
    </div>
  )
}
