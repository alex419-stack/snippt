/**
 * WalkInHeatmap — 7 Tage × 11 Stunden-Slots (8:00–18:00).
 *
 * Dark-Mode-Anpassung:
 *   - bg-surface statt bg-white
 *   - Zellfarbe: Gold-Opacity-Stufen statt Grauton-Interpolation.
 *     5 diskrete Schwellen (nicht linear) — niedrige Werte bleiben sichtbar unterscheidbar.
 *     leer → fast transparent, voll → sattes Gold.
 *
 * Server Component.
 */

const SLOTS = Array.from({ length: 11 }, (_, i) => 8 + i)
const TAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as const

export type WalkInRaster = {
  zellen: number[][]
  max: number
}

// 5 nicht-lineare Gold-Opacity-Stufen für die Heatmap-Zellen.
// Diskrete Schwellen vermeiden, dass niedrige Werte (0.05–0.2) optisch ununterscheidbar werden.
function goldOpacity(wert: number, max: number): string {
  if (wert === 0 || max === 0) return 'rgba(201,168,76, 0.05)'
  const anteil = wert / max
  if (anteil <= 0.25) return 'rgba(201,168,76, 0.18)'
  if (anteil <= 0.50) return 'rgba(201,168,76, 0.38)'
  if (anteil <= 0.75) return 'rgba(201,168,76, 0.62)'
  return 'rgba(201,168,76, 0.85)'
}

export function WalkInHeatmap({ raster }: { raster: WalkInRaster }) {
  return (
    <section className="space-y-5 rounded-2xl border border-bone/10 bg-surface p-6">
      <header className="flex items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-h2 text-ink">
            Walk-In-Muster der Woche
          </h2>
          <p className="text-sm text-coal/65">
            Wann kommt spontane Laufkundschaft? Dunklere Felder = mehr Walk-Ins.
          </p>
        </div>
        <Legende max={raster.max} />
      </header>

      <div className="grid grid-cols-[44px_repeat(7,minmax(0,1fr))] gap-1.5">
        {/* Kopfzeile */}
        <div />
        {TAGE.map((tag) => (
          <div
            key={tag}
            className="text-center text-[10.5px] font-medium uppercase tracking-[0.14em] text-coal/55"
          >
            {tag}
          </div>
        ))}

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
  const bg = goldOpacity(wert, max)

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      title={ariaLabel}
      className="aspect-[5/3] rounded-md ring-1 ring-inset ring-bone/8 transition-transform duration-150 hover:scale-[1.04]"
      style={{ backgroundColor: bg }}
    />
  )
}

function Legende({ max }: { max: number }) {
  const stufen = [0, 0.25, 0.5, 0.75, 1]
  return (
    <div className="hidden items-center gap-2 text-[11px] text-coal/55 md:flex">
      <span>wenig</span>
      <div className="flex gap-1">
        {stufen.map((s) => (
          <div
            key={s}
            className="h-3 w-5 rounded-sm ring-1 ring-inset ring-bone/8"
            style={{ backgroundColor: goldOpacity(s, 1) }}
          />
        ))}
      </div>
      <span>viel</span>
      {max > 0 && (
        <span className="ml-2 text-coal/45">(max. {max} pro Slot)</span>
      )}
    </div>
  )
}
