'use client'

import { useState } from 'react'

/**
 * SchnellSlots — Nächste freie Slots als tappbare Chips.
 * Der erste ist vorausgewählt (glow1-Ring). Rein visuell.
 */

type Slot = {
  id: string
  label: string // z.B. "Heute 16:30"
  sub: string   // z.B. "Fr, 13. Jun"
}

const SLOTS: Slot[] = [
  { id: 's1', label: 'Heute 16:30',  sub: 'Fr, 13. Jun' },
  { id: 's2', label: 'Morgen 10:00', sub: 'Sa, 14. Jun' },
  { id: 's3', label: 'Morgen 11:30', sub: 'Sa, 14. Jun' },
  { id: 's4', label: 'Mo 09:00',     sub: 'Mo, 16. Jun' },
]

export function SchnellSlots() {
  const [selected, setSelected] = useState<string>('s1')

  return (
    <section>
      <div className="mb-3">
        <span className="text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
          Nächste freie Slots
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {SLOTS.map((slot) => {
          const isSelected = slot.id === selected
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => setSelected(slot.id)}
              className={`flex-none rounded-[14px] border px-4 py-3 text-left transition-all ${
                isSelected
                  ? 'border-snippt-glow1 bg-snippt-glow1/15 text-snippt-ink'
                  : 'border-white/[0.08] bg-white/[0.02] text-snippt-muted hover:border-white/20 hover:text-snippt-ink'
              }`}
              style={
                isSelected
                  ? { boxShadow: '0 0 0 1px rgba(84,104,255,.45), 0 0 18px -6px rgba(84,104,255,.65)' }
                  : undefined
              }
            >
              <div className="text-[14px] font-semibold leading-tight">{slot.label}</div>
              <div
                className={`mt-[2px] text-[11px] ${
                  isSelected ? 'text-snippt-glow2' : 'text-snippt-faint'
                }`}
              >
                {slot.sub}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
