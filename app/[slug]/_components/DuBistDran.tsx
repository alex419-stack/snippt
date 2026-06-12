'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { POLL_SEKUNDEN } from '@/lib/demoConfig'
import { audioFreischalten, tonAbspielen } from '@/lib/sound'

// Pollt den eigenen Stand in der Reihe (über das Geräte-Token) und blendet einen
// Vollbild-„Du bist dran!" ein, sobald der Friseur diesen Kunden aufruft.
// Läuft unabhängig vom Seiten-Refresh, weil der Server das Token nicht kennt.
export function DuBistDran({ slug }: { slug: string }) {
  const [sichtbar, setSichtbar] = useState(false)
  const warDran = useRef(false) // Flankenerkennung: Ton nur beim Übergang

  // Ton beim ersten Tippen freischalten (falls der Kunde nicht selbst angestellt hat).
  useEffect(() => {
    const frei = () => audioFreischalten()
    window.addEventListener('pointerdown', frei, { once: true })
    return () => window.removeEventListener('pointerdown', frei)
  }, [])

  useEffect(() => {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('snippt_token') : null
    if (!token) return

    const supabase = createClient()
    let aktiv = true

    async function pruefe() {
      const { data } = await supabase.rpc('meine_position', { p_slug: slug, p_token: token })
      if (!aktiv) return
      const istDran = !!(data as { dran?: boolean } | null)?.dran
      if (istDran && !warDran.current) {
        // Übergang „noch nicht dran" -> „dran": Vollbild + Ton.
        warDran.current = true
        setSichtbar(true)
        tonAbspielen()
      } else if (!istDran && warDran.current) {
        // Episode vorbei (Schnitt fertig / aus Reihe) -> zurücksetzen.
        warDran.current = false
        setSichtbar(false)
      }
    }

    pruefe()
    const id = setInterval(pruefe, POLL_SEKUNDEN * 1000)
    return () => {
      aktiv = false
      clearInterval(id)
    }
  }, [slug])

  if (!sichtbar) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 text-center"
      style={{
        background:
          'radial-gradient(90% 70% at 50% 30%, rgba(84,104,255,.45), transparent 65%),' +
          'radial-gradient(80% 60% at 50% 90%, rgba(43,231,255,.30), transparent 65%),' +
          '#08080B',
      }}
    >
      <div
        className="snippt-pulse mb-6 grid h-[120px] w-[120px] place-items-center rounded-full text-[56px]"
        style={{
          background: 'linear-gradient(135deg,#2BE7FF,#5468FF)',
          boxShadow: '0 0 80px -10px rgba(84,104,255,.9)',
        }}
      >
        ✂️
      </div>
      <div
        className="font-display text-[44px] font-semibold leading-none tracking-tight"
        style={{
          background: 'linear-gradient(180deg,#fff,#b9c0ff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Du bist dran!
      </div>
      <p className="mt-4 max-w-[300px] text-[15px] text-snippt-muted">
        Geh zu deinem Friseur — er wartet auf dich.
      </p>
      <button
        type="button"
        onClick={() => setSichtbar(false)}
        className="mt-9 rounded-[16px] px-8 py-[15px] text-[16px] font-semibold text-[#070710]"
        style={{ background: 'linear-gradient(100deg,#2BE7FF,#5468FF)' }}
      >
        Alles klar
      </button>
    </div>
  )
}
