'use client'

import { useState } from 'react'

type Variante = 'gefahr' | 'primaer' | 'dezent'

// Knopf mit Zwei-Schritt-Bestätigung: erst Label, nach Klick
// "Wirklich? [Ja] [Abbrechen]". Verhindert versehentliches Entfernen/Absagen.
// `action` ist eine Server-Aktion (in Next 14 als Prop an Client-Komponenten
// übergebbar).
export function BestaetigungsButton({
  action,
  feldName,
  feldWert,
  label,
  bestaetigung,
  variante = 'dezent',
}: {
  action: (formData: FormData) => void | Promise<void>
  feldName: string
  feldWert: string
  label: string
  bestaetigung: string
  variante?: Variante
}) {
  const [offen, setOffen] = useState(false)

  const basis = 'rounded-[11px] px-[12px] py-[8px] text-[13px] font-semibold transition'
  const stil: Record<Variante, string> = {
    primaer: 'bg-snippt-glow2/15 text-snippt-glow2 border border-snippt-glow2/40',
    gefahr: 'bg-red-500/10 text-red-300 border border-red-400/40',
    dezent: 'text-snippt-faint hover:text-snippt-muted',
  }

  if (!offen) {
    return (
      <button type="button" onClick={() => setOffen(true)} className={`${basis} ${stil[variante]}`}>
        {label}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] text-snippt-muted">{bestaetigung}</span>
      <form action={action}>
        <input type="hidden" name={feldName} value={feldWert} />
        <button type="submit" className={`${basis} ${stil[variante]}`}>
          Ja
        </button>
      </form>
      <button type="button" onClick={() => setOffen(false)} className={`${basis} text-snippt-faint`}>
        Abbrechen
      </button>
    </div>
  )
}
