'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Phase = 'init' | 'form' | 'sending' | 'done' | 'error'

// Gleiche Geräte-Wiedererkennung wie beim Anstellen.
function getBesucherToken() {
  if (typeof window === 'undefined') return ''
  let t = window.localStorage.getItem('snippt_token')
  if (!t) {
    t = crypto.randomUUID()
    window.localStorage.setItem('snippt_token', t)
  }
  return t
}

export function CheckinFlow({ slug, code }: { slug: string; code: string }) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('init')
  const [name, setName] = useState('')
  const [position, setPosition] = useState<number | null>(null)
  const [fehler, setFehler] = useState<string | null>(null)
  const tokenRef = useRef('')
  const codeRef = useRef(code)

  useEffect(() => {
    tokenRef.current = getBesucherToken()
    const gespeichert = window.localStorage.getItem('snippt_name')
    if (gespeichert && gespeichert.trim()) {
      // Name aus früherem Besuch -> direkt einchecken, kein Formular nötig
      setName(gespeichert)
      void einchecken(gespeichert)
    } else {
      setPhase('form')
    }
    // einchecken/Refs sind stabil; bewusst nur beim Mount ausführen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function einchecken(nameWert: string) {
    setPhase('sending')
    setFehler(null)
    if (nameWert.trim()) window.localStorage.setItem('snippt_name', nameWert.trim())

    const supabase = createClient()
    const { data, error } = await supabase.rpc('einchecken', {
      p_slug: slug,
      p_token: tokenRef.current,
      p_code: codeRef.current,
      p_name: nameWert,
    })

    const ergebnis = data as { ok?: boolean; position?: number; grund?: string } | null

    if (error || !ergebnis?.ok) {
      setFehler(
        ergebnis?.grund === 'code_ungueltig'
          ? 'Dieser QR-Code ist nicht gültig. Bitte scanne den Code direkt im Laden.'
          : 'Das hat gerade nicht geklappt. Versuch es nochmal.',
      )
      setPhase('error')
      return
    }

    setPosition(ergebnis.position ?? null)
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
        className="rounded-[20px] border border-snippt-glow2/40 p-[26px] text-center"
        style={{ background: 'radial-gradient(120% 90% at 50% 0%, rgba(43,231,255,.18), transparent 60%), #141420' }}
      >
        <div className="font-display text-[26px] text-snippt-ink">Du bist da ✓</div>
        <div className="mt-2 text-[14px] text-snippt-muted">
          Dein Friseur weiß jetzt Bescheid, dass du im Laden bist.
        </div>
        {position != null && (
          <div className="mt-3 text-[14px] text-snippt-muted">
            Position <b className="text-snippt-ink">{position}</b> · du wirst aufgerufen, wenn du dran bist.
          </div>
        )}
      </div>
    )
  }

  if (phase === 'init' || phase === 'sending') {
    return (
      <div className="rounded-[20px] border border-white/[0.1] bg-snippt-surface p-[26px] text-center">
        <div className="text-[15px] text-snippt-muted">Einen Moment …</div>
      </div>
    )
  }

  // 'form' oder 'error': Name abfragen / Wiederholung anbieten
  return (
    <div className="rounded-[20px] border border-white/[0.12] bg-snippt-surface p-[22px]">
      <div className="text-[12px] uppercase tracking-[0.16em] text-snippt-muted">Im Laden anmelden</div>
      <p className="mt-1 text-[13px] text-snippt-faint">Wie heißt du? So ruft dich dein Friseur auf.</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Dein Name"
        className="mt-3 w-full rounded-[14px] border border-white/[0.1] bg-white/[0.03] px-4 py-[14px] text-[15px] text-snippt-ink placeholder:text-snippt-faint outline-none focus:border-snippt-glow1/60"
      />
      {fehler && <p className="mt-3 text-[13px] text-snippt-weg">{fehler}</p>}
      <button
        type="button"
        onClick={() => einchecken(name)}
        disabled={!name.trim()}
        className="mt-4 w-full rounded-[16px] p-[17px] text-[17px] font-semibold text-[#070710] disabled:opacity-50"
        style={ctaStyle}
      >
        Ich bin da
      </button>
    </div>
  )
}
