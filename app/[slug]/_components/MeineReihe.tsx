'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { POLL_SEKUNDEN } from '@/lib/demoConfig'
import { audioFreischalten, tonAbspielen } from '@/lib/sound'

type Stand = { gefunden: boolean; status?: string; position?: number; dran?: boolean }

// Zeigt dem Kunden seinen eigenen Live-Stand in der Reihe (über das Geräte-Token):
//  - ein Banner „Du stehst in der Reihe — Platz X" mit Knopf „Ich bin jetzt da"
//  - Vollbild „Du bist dran!" + Ton, sobald der Friseur aufruft
// Läuft per eigenem Polling, weil der Server das Token nicht kennt.
export function MeineReihe({ slug }: { slug: string }) {
  const [stand, setStand] = useState<Stand>({ gefunden: false })
  const [melde, setMelde] = useState(false) // „Ich bin da" wird gerade gesendet
  const warDran = useRef(false) // Flankenerkennung: Ton/Overlay nur beim Übergang
  const [overlay, setOverlay] = useState(false)
  const tokenRef = useRef<string | null>(null)

  useEffect(() => {
    tokenRef.current = typeof window !== 'undefined' ? window.localStorage.getItem('snippt_token') : null
    // Ton beim ersten Tippen freischalten (iOS-Geste-Pflicht).
    const frei = () => audioFreischalten()
    window.addEventListener('pointerdown', frei, { once: true })
    return () => window.removeEventListener('pointerdown', frei)
  }, [])

  useEffect(() => {
    const token = tokenRef.current
    if (!token) return
    const supabase = createClient()
    let aktiv = true

    async function pruefe() {
      const { data } = await supabase.rpc('meine_position', { p_slug: slug, p_token: token })
      if (!aktiv) return
      const s = (data as Stand | null) ?? { gefunden: false }
      setStand(s)
      if (s.dran && !warDran.current) {
        warDran.current = true
        setOverlay(true)
        tonAbspielen()
      } else if (!s.dran && warDran.current) {
        warDran.current = false
        setOverlay(false)
      }
    }

    pruefe()
    const id = setInterval(pruefe, POLL_SEKUNDEN * 1000)
    return () => {
      aktiv = false
      clearInterval(id)
    }
  }, [slug])

  async function ichBinDa() {
    const token = tokenRef.current
    if (!token) return
    setMelde(true)
    const supabase = createClient()
    await supabase.rpc('ich_bin_da', { p_slug: slug, p_token: token })
    setStand((s) => ({ ...s, status: 'da' })) // sofortiges Feedback
    setMelde(false)
  }

  return (
    <>
      {/* Live-Status-Banner (nur wenn man wirklich in der Reihe steht und nicht gerade dran ist) */}
      {stand.gefunden && !stand.dran && (
        <div className="mb-5 rounded-[16px] border border-snippt-glow2/30 bg-snippt-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">In der Reihe</div>
              <div className="mt-[2px] text-[15px] text-snippt-ink">
                Platz <b>{stand.position}</b>
                {stand.status === 'da' && <span className="ml-2 text-[13px] text-snippt-da">· ✓ du bist da gemeldet</span>}
              </div>
            </div>
            {stand.status !== 'da' && (
              <button
                type="button"
                onClick={ichBinDa}
                disabled={melde}
                className="rounded-[12px] border border-snippt-da/50 bg-snippt-da/10 px-4 py-[10px] text-[14px] font-semibold text-snippt-da disabled:opacity-50"
              >
                {melde ? 'einen Moment …' : 'Ich bin da'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Vollbild „Du bist dran!" */}
      {overlay && (
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
            onClick={() => setOverlay(false)}
            className="mt-9 rounded-[16px] px-8 py-[15px] text-[16px] font-semibold text-[#070710]"
            style={{ background: 'linear-gradient(100deg,#2BE7FF,#5468FF)' }}
          >
            Alles klar
          </button>
        </div>
      )}
    </>
  )
}
