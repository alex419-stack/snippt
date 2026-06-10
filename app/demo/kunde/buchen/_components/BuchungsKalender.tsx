'use client'

import { useState } from 'react'

/**
 * BuchungsKalender — Vereinfachter Tag+Slot-Picker für einen Friseur.
 * Horizontale Tage-Chips, darunter Grid mit freien/belegten Zeiten.
 * Dark/Glow-Design. Rein visuell, keine echte Buchungslogik.
 */

// Nächste 7 Tage (Demo-Daten relativ zu Fr 13. Jun 2026)
const TAGE = [
  { id: 'd0', label: 'Fr',  nummer: '13', heute: true  },
  { id: 'd1', label: 'Sa',  nummer: '14', heute: false },
  { id: 'd2', label: 'Mo',  nummer: '16', heute: false },
  { id: 'd3', label: 'Di',  nummer: '17', heute: false },
  { id: 'd4', label: 'Mi',  nummer: '18', heute: false },
  { id: 'd5', label: 'Do',  nummer: '19', heute: false },
  { id: 'd6', label: 'Fr',  nummer: '20', heute: false },
]

// Verfügbare Slots pro Tag — null = belegt
const SLOTS_PRO_TAG: Record<string, (string | null)[]> = {
  d0: [null, null, null, '15:00', null, '16:30', null, null],       // Heute — nachmittags fast voll
  d1: ['09:00', '09:30', null, '10:30', '11:00', null, '12:00', '14:00', '14:30', null, '16:00'],
  d2: ['09:00', null, '10:00', '10:30', null, '12:00', '13:00', null, '15:30', '16:00'],
  d3: [null, '09:30', '10:00', null, '11:30', '12:00', '13:00', '14:00', null, '16:30'],
  d4: ['09:00', '09:30', '10:00', '10:30', null, null, '13:00', '14:00', '15:00', '16:00'],
  d5: [null, '10:00', '10:30', '11:00', '11:30', '13:30', '14:00', null, '16:00'],
  d6: ['09:00', null, '10:30', null, '12:00', '13:00', '14:30', '15:00', null, '16:30'],
}

export function BuchungsKalender() {
  const [tagIdx, setTagIdx] = useState<string>('d1') // Sa vorgewählt (Heute fast voll)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const slots = SLOTS_PRO_TAG[tagIdx] ?? []
  const freieSlots = slots.filter(Boolean) as string[]

  return (
    <section>
      <div className="mb-3">
        <span className="text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
          Datum &amp; Uhrzeit
        </span>
      </div>

      {/* Tage-Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TAGE.map((tag) => {
          const isSelected = tag.id === tagIdx
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => {
                setTagIdx(tag.id)
                setSelectedSlot(null)
              }}
              className={`flex-none rounded-full border px-4 py-[9px] text-center transition-all ${
                isSelected
                  ? 'border-snippt-glow1 bg-snippt-glow1/15 text-snippt-ink'
                  : 'border-white/[0.08] bg-white/[0.02] text-snippt-muted hover:border-white/20 hover:text-snippt-ink'
              }`}
            >
              <div className={`text-[11px] uppercase tracking-[0.12em] ${isSelected ? 'text-snippt-glow2' : 'text-snippt-faint'}`}>
                {tag.label}
              </div>
              <div className="text-[16px] font-semibold leading-tight tabular-nums">
                {tag.nummer}
              </div>
              {tag.heute && (
                <div className={`text-[10px] ${isSelected ? 'text-snippt-glow2' : 'text-snippt-faint'}`}>
                  heute
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Zeit-Grid */}
      <div
        className="mt-3 rounded-[16px] border border-white/[0.07] p-4"
        style={{ background: 'rgba(20,20,32,.8)' }}
      >
        {freieSlots.length === 0 ? (
          <p className="py-4 text-center text-[13px] text-snippt-faint">
            Heute keine freien Slots mehr — wähle einen anderen Tag.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {slots.map((slot, i) => {
              if (!slot) {
                // Belegt
                return (
                  <div
                    key={i}
                    className="flex h-[42px] items-center justify-center rounded-[10px] border border-white/[0.04] bg-white/[0.02]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-snippt-faint/40" />
                  </div>
                )
              }

              const isSelected = selectedSlot === slot
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(isSelected ? null : slot)}
                  className={`h-[42px] rounded-[10px] border text-[13px] font-semibold tabular-nums transition-all ${
                    isSelected
                      ? 'border-snippt-glow1 bg-snippt-glow1/20 text-snippt-ink'
                      : 'border-white/[0.10] bg-white/[0.03] text-snippt-muted hover:border-snippt-glow1/40 hover:text-snippt-ink'
                  }`}
                  style={
                    isSelected
                      ? { boxShadow: '0 0 0 1px rgba(84,104,255,.4), 0 0 14px -4px rgba(84,104,255,.6)' }
                      : undefined
                  }
                >
                  {slot}
                </button>
              )
            })}
          </div>
        )}

        {/* Legende */}
        <div className="mt-3 flex items-center gap-4 border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-1.5">
            <span className="h-[10px] w-[10px] rounded-[3px] border border-white/10 bg-white/[0.03]" />
            <span className="text-[10px] text-snippt-faint">Belegt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-[10px] w-[10px] rounded-[3px] border border-white/[0.10] bg-white/[0.03]" />
            <span className="text-[10px] text-snippt-faint">Frei</span>
          </div>
        </div>
      </div>
    </section>
  )
}
