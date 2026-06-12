'use client'

import { useEffect, useRef, useState } from 'react'
import { audioFreischalten, tonAbspielen } from '@/lib/sound'

// Erkennt anhand des Server-Pollings (router.refresh / Realtime) neue Einträge
// in der Reihe: Vergleicht die aktuelle Namensliste mit der vom letzten Durchlauf.
// Kommt ein neuer Kunde dazu -> kurzer Toast oben + Ton. Der erste Durchlauf
// nach dem Laden löst bewusst KEINEN Alarm aus (sonst piept jede bestehende Reihe).
export function ReihenAlarm({ eintraege }: { eintraege: { id: string; name: string }[] }) {
  const gesehen = useRef<Set<string> | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // Ton beim ersten Tippen aufs Dashboard freischalten (iOS-Geste-Pflicht).
  useEffect(() => {
    const frei = () => audioFreischalten()
    window.addEventListener('pointerdown', frei, { once: true })
    return () => window.removeEventListener('pointerdown', frei)
  }, [])

  // Differenz zur letzten Liste bilden.
  useEffect(() => {
    const ids = new Set(eintraege.map((e) => e.id))
    if (gesehen.current === null) {
      gesehen.current = ids // Erststand merken, nicht alarmieren
      return
    }
    const neu = eintraege.filter((e) => !gesehen.current!.has(e.id))
    gesehen.current = ids
    if (neu.length > 0) {
      const letzter = neu[neu.length - 1]
      setToast(`Neuer Kunde: ${letzter.name}`)
      tonAbspielen()
    }
  }, [eintraege])

  // Toast nach kurzer Zeit selbst ausblenden.
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  if (!toast) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        className="snippt-pulse flex items-center gap-2 rounded-full border border-snippt-glow2/50 px-4 py-[10px] text-[14px] font-semibold text-snippt-ink"
        style={{
          background: 'linear-gradient(100deg, rgba(43,231,255,.22), rgba(84,104,255,.22)), #12121b',
          boxShadow: '0 12px 34px -10px rgba(84,104,255,.9)',
        }}
      >
        <span className="h-[8px] w-[8px] rounded-full bg-snippt-glow2 shadow-[0_0_10px] shadow-snippt-glow2" />
        {toast}
      </div>
    </div>
  )
}
