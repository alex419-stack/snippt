'use client'

import { useRef, useState } from 'react'
import { walkInHinzufuegen } from '../actions'

// „Walk-In hinzufügen": Antwort auf den Couch-Kunden, der die App nicht nutzt.
// Der Friseur tippt selbst Name (Nummer optional) ein und setzt ihn in dieselbe
// Reihe. Eingeklappt als ein Button, damit das Dashboard ruhig bleibt.
export function WalkInForm() {
  const [offen, setOffen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  if (!offen) {
    return (
      <button
        type="button"
        onClick={() => setOffen(true)}
        className="mb-5 w-full rounded-[14px] border border-dashed border-white/[0.16] bg-white/[0.02] p-[13px] text-[14px] font-medium text-snippt-muted hover:border-snippt-glow2/50 hover:text-snippt-ink"
      >
        + Walk-In hinzufügen
      </button>
    )
  }

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await walkInHinzufuegen(fd)
        formRef.current?.reset()
        setOffen(false)
      }}
      className="mb-5 space-y-2 rounded-2xl border border-white/[0.08] bg-snippt-surface p-4"
    >
      <div className="text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">Walk-In in die Reihe</div>
      <input
        name="name"
        type="text"
        required
        autoFocus
        placeholder="Name (z.B. Kunde auf der Couch)"
        className="w-full rounded-[12px] border border-white/[0.1] bg-white/[0.03] px-3 py-[11px] text-[14px] text-snippt-ink placeholder:text-snippt-faint outline-none focus:border-snippt-glow1/60"
      />
      <input
        name="telefon"
        type="tel"
        placeholder="Handynummer (optional)"
        className="w-full rounded-[12px] border border-white/[0.1] bg-white/[0.03] px-3 py-[11px] text-[14px] text-snippt-ink placeholder:text-snippt-faint outline-none focus:border-snippt-glow1/60"
      />
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => setOffen(false)}
          className="flex-1 rounded-[12px] border border-white/[0.1] p-[11px] text-[14px] text-snippt-muted hover:text-snippt-ink"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          className="flex-1 rounded-[12px] p-[11px] text-[14px] font-semibold text-[#070710]"
          style={{ background: 'linear-gradient(100deg,#2BE7FF,#5468FF)' }}
        >
          In die Reihe
        </button>
      </div>
    </form>
  )
}
