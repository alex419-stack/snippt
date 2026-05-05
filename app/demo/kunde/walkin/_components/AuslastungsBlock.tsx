/**
 * AuslastungsBlock — Salon-Gesamtauslastung als Balken + Slot-Count.
 *
 * Sekundäre Information — steht below the fold, nach der Marco-Karte.
 * Server Component.
 */

type Auslastungsstufe = 'entspannt' | 'maessig' | 'voll'

const STUFEN: Record<
  Auslastungsstufe,
  { label: string; breite: string; farbe: string }
> = {
  entspannt: { label: 'Entspannt',  breite: 'w-[35%]', farbe: 'bg-gold/40' },
  maessig:   { label: 'Mäßig',      breite: 'w-[62%]', farbe: 'bg-gold/70' },
  voll:      { label: 'Sehr voll',  breite: 'w-[92%]', farbe: 'bg-gold' },
}

export function AuslastungsBlock({
  stufe,
  freieSlots,
}: {
  stufe: Auslastungsstufe
  freieSlots: number
}) {
  const { label, breite, farbe } = STUFEN[stufe]

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3 label-caps text-coal/50">
        <span className="h-px w-6 bg-coal/20" />
        Salon heute
      </div>

      <div className="rounded-2xl border border-bone/10 bg-surface p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-coal/80">{label} ausgelastet</span>
          <span className="text-xs text-coal/45">
            Noch {freieSlots} Slots heute
          </span>
        </div>

        {/* Balken */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-bone/8">
          <div className={`h-full rounded-full transition-all ${breite} ${farbe}`} />
        </div>
      </div>
    </section>
  )
}
