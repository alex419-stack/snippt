/**
 * SchnellSlots — Nächste freie Slots bei Marco als tappbare Chips.
 *
 * Im Demo: Heute (Fr 01.05.) ist Marco nachmittags voll — zeigt
 * daher die nächsten freien Slots für Sa 02.05.
 * Nur visuell — kein echter Booking-Handler.
 * Server Component.
 */

type Slot = {
  datum: string   // z.B. "Sa, 2. Mai"
  uhrzeit: string // z.B. "10:00"
}

export function SchnellSlots({ slots, friseurVorname }: { slots: Slot[]; friseurVorname: string }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3 label-caps text-gold">
        <span className="h-px w-6 bg-gold" />
        Schnell buchen
      </div>

      <div className="rounded-2xl border border-bone/10 bg-surface p-4 space-y-3">
        <p className="text-sm text-coal/65">
          Nächste freie Slots bei {friseurVorname}:
        </p>

        {slots.length === 0 ? (
          <p className="text-sm text-coal/45 italic">
            Heute keine freien Slots mehr — weiter unten buchen.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {slots.map((slot) => (
              <button
                key={`${slot.datum}-${slot.uhrzeit}`}
                type="button"
                className="rounded-xl border border-bone/15 bg-surface px-3.5 py-2.5 text-left transition-colors hover:border-gold/40 hover:bg-gold/5"
              >
                <div className="text-sm font-semibold text-ink">{slot.uhrzeit}</div>
                <div className="text-[11px] text-coal/50">{slot.datum}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
