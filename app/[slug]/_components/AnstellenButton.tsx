'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { normalisiereTelefon } from '@/lib/telefon'

type Phase = 'idle' | 'form' | 'sending' | 'done' | 'error'

// Wiedererkennung ohne Login: ein zufälliges Token pro Gerät in localStorage.
function getBesucherToken() {
  if (typeof window === 'undefined') return ''
  let t = window.localStorage.getItem('snippt_token')
  if (!t) {
    t = crypto.randomUUID()
    window.localStorage.setItem('snippt_token', t)
  }
  return t
}

export function AnstellenButton({ slug }: { slug: string }) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')
  const [name, setName] = useState('')
  const [telefon, setTelefon] = useState('')
  const [position, setPosition] = useState<number | null>(null)
  const [fehler, setFehler] = useState<string | null>(null)
  const tokenRef = useRef('')

  useEffect(() => {
    tokenRef.current = getBesucherToken()
    // Name aus früherem Besuch vorausfüllen
    const gespeichert = window.localStorage.getItem('snippt_name')
    if (gespeichert) setName(gespeichert)
  }, [])

  async function absenden() {
    setFehler(null)

    // Handynummer ist Pflicht: darueber kommt die Du-bist-dran-Nachricht.
    if (!normalisiereTelefon(telefon)) {
      setFehler('Bitte gib deine Handynummer ein — darüber sagt dir dein Friseur Bescheid, wenn du dran bist.')
      setPhase('error')
      return
    }

    setPhase('sending')
    if (name.trim()) window.localStorage.setItem('snippt_name', name.trim())

    const supabase = createClient()
    const { data, error } = await supabase.rpc('anstellen', {
      p_slug: slug,
      p_name: name,
      p_telefon: telefon,
      p_token: tokenRef.current,
    })

    if (error) {
      setFehler('Das hat gerade nicht geklappt. Versuch es nochmal.')
      setPhase('error')
      return
    }

    const pos = (data as { position?: number } | null)?.position ?? null
    setPosition(pos)
    setPhase('done')
    router.refresh()
  }

  const ctaStyle = {
    background: 'linear-gradient(100deg,#2BE7FF,#5468FF)',
    boxShadow: '0 12px 34px -10px rgba(84,104,255,.8), inset 0 0 0 1px rgba(255,255,255,.12)',
  } as const

  if (phase === 'done') {
    return (
      <div
        className="mt-[18px] rounded-[16px] border border-snippt-glow2/40 p-[18px] text-center"
        style={{ background: 'radial-gradient(120% 90% at 50% 0%, rgba(43,231,255,.16), transparent 60%)' }}
      >
        <div className="font-display text-[20px] text-snippt-ink">Du bist in der Reihe ✓</div>
        {position != null && (
          <div className="mt-1 text-[14px] text-snippt-muted">
            Position <b className="text-snippt-ink">{position}</b> · wir sagen dir Bescheid, wenn du dran bist.
          </div>
        )}
      </div>
    )
  }

  if (phase === 'form' || phase === 'sending' || phase === 'error') {
    return (
      <div className="mt-[18px] space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dein Name"
          className="w-full rounded-[14px] border border-white/[0.1] bg-white/[0.03] px-4 py-[14px] text-[15px] text-snippt-ink placeholder:text-snippt-faint outline-none focus:border-snippt-glow1/60"
        />
        <input
          type="tel"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          placeholder="Handynummer (für die Benachrichtigung)"
          className="w-full rounded-[14px] border border-white/[0.1] bg-white/[0.03] px-4 py-[14px] text-[15px] text-snippt-ink placeholder:text-snippt-faint outline-none focus:border-snippt-glow1/60"
        />
        {fehler && <p className="text-[13px] text-snippt-weg">{fehler}</p>}
        <button
          type="button"
          onClick={absenden}
          disabled={phase === 'sending' || !name.trim() || !telefon.trim()}
          className="w-full rounded-[16px] p-[17px] text-[17px] font-semibold text-[#070710] disabled:opacity-50"
          style={ctaStyle}
        >
          {phase === 'sending' ? 'Einen Moment …' : 'In die Reihe'}
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPhase('form')}
      className="mt-[18px] w-full rounded-[16px] p-[17px] text-[17px] font-semibold text-[#070710]"
      style={ctaStyle}
    >
      Jetzt anstellen
    </button>
  )
}
