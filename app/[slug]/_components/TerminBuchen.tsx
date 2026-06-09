'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function getToken() {
  if (typeof window === 'undefined') return ''
  let t = window.localStorage.getItem('snippt_token')
  if (!t) {
    t = crypto.randomUUID()
    window.localStorage.setItem('snippt_token', t)
  }
  return t
}

const pad = (n: number) => String(n).padStart(2, '0')

function tagLabel(d: Date, i: number) {
  if (i === 0) return 'Heute'
  if (i === 1) return 'Morgen'
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

export function TerminBuchen({
  slug,
  oeffnet,
  schliesst,
  slotMin,
}: {
  slug: string
  oeffnet: string
  schliesst: string
  slotMin: number
}) {
  const supabase = useMemo(() => createClient(), [])
  const tage = useMemo(() => {
    const arr: Date[] = []
    const base = new Date()
    base.setHours(0, 0, 0, 0)
    for (let i = 0; i < 8; i++) {
      const d = new Date(base)
      d.setDate(base.getDate() + i)
      arr.push(d)
    }
    return arr
  }, [])

  const [tagIdx, setTagIdx] = useState(0)
  const [belegt, setBelegt] = useState<number[]>([])
  const [laden, setLaden] = useState(true)
  const [gewaehlt, setGewaehlt] = useState<Date | null>(null)
  const [name, setName] = useState('')
  const [telefon, setTelefon] = useState('')
  const [phase, setPhase] = useState<'liste' | 'form' | 'sending' | 'done'>('liste')
  const [fehler, setFehler] = useState<string | null>(null)
  const tokenRef = useRef('')

  useEffect(() => {
    tokenRef.current = getToken()
    const n = window.localStorage.getItem('snippt_name')
    if (n) setName(n)
  }, [])

  const tag = tage[tagIdx]

  const slots = useMemo(() => {
    const [oh, om] = oeffnet.split(':').map(Number)
    const [sh, sm] = schliesst.split(':').map(Number)
    const start = new Date(tag)
    start.setHours(oh || 9, om || 0, 0, 0)
    const end = new Date(tag)
    end.setHours(sh || 18, sm || 0, 0, 0)
    const out: Date[] = []
    const cur = new Date(start)
    while (cur < end) {
      out.push(new Date(cur))
      cur.setMinutes(cur.getMinutes() + (slotMin || 30))
    }
    return out
  }, [tag, oeffnet, schliesst, slotMin])

  useEffect(() => {
    let active = true
    setLaden(true)
    const tagStr = `${tag.getFullYear()}-${pad(tag.getMonth() + 1)}-${pad(tag.getDate())}`
    supabase.rpc('gebuchte_zeiten', { p_slug: slug, p_tag: tagStr }).then(({ data }) => {
      if (!active) return
      const arr = Array.isArray(data) ? (data as string[]) : []
      setBelegt(arr.map((d) => new Date(d).getTime()))
      setLaden(false)
    })
    return () => {
      active = false
    }
  }, [tag, slug, supabase])

  const jetzt = Date.now()
  const frei = slots.filter((s) => s.getTime() > jetzt && !belegt.includes(s.getTime()))

  async function buchen() {
    if (!gewaehlt) return
    setPhase('sending')
    setFehler(null)
    if (name.trim()) window.localStorage.setItem('snippt_name', name.trim())
    const { data, error } = await supabase.rpc('termin_buchen', {
      p_slug: slug,
      p_datum: gewaehlt.toISOString(),
      p_name: name,
      p_telefon: telefon,
      p_token: tokenRef.current,
    })
    const res = data as { ok?: boolean; grund?: string } | null
    if (error || !res?.ok) {
      setBelegt((b) => [...b, gewaehlt.getTime()])
      setFehler(res?.grund === 'belegt' ? 'Die Zeit wurde gerade vergeben — bitte eine andere wählen.' : 'Hat nicht geklappt.')
      setGewaehlt(null)
      setPhase('liste')
      return
    }
    setPhase('done')
  }

  if (phase === 'done' && gewaehlt) {
    return (
      <div
        className="mt-2 rounded-[16px] border border-snippt-glow2/40 p-[20px] text-center"
        style={{ background: 'radial-gradient(120% 90% at 50% 0%, rgba(43,231,255,.16), transparent 60%)' }}
      >
        <div className="font-display text-[20px] text-snippt-ink">Termin gebucht ✓</div>
        <div className="mt-1 text-[14px] text-snippt-muted">
          {gewaehlt.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit' })} um{' '}
          {pad(gewaehlt.getHours())}:{pad(gewaehlt.getMinutes())} Uhr
        </div>
      </div>
    )
  }

  if ((phase === 'form' || phase === 'sending') && gewaehlt) {
    return (
      <div className="mt-2 space-y-3">
        <p className="text-[14px] text-snippt-muted">
          Termin am{' '}
          <b className="text-snippt-ink">
            {tagLabel(tag, tagIdx)}, {pad(gewaehlt.getHours())}:{pad(gewaehlt.getMinutes())} Uhr
          </b>
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dein Name"
          className="w-full rounded-[14px] border border-white/[0.1] bg-white/[0.03] px-4 py-[14px] text-[15px] text-snippt-ink placeholder:text-snippt-faint outline-none focus:border-snippt-glow1/60"
        />
        <input
          type="tel"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          placeholder="Handynummer (optional)"
          className="w-full rounded-[14px] border border-white/[0.1] bg-white/[0.03] px-4 py-[14px] text-[15px] text-snippt-ink placeholder:text-snippt-faint outline-none focus:border-snippt-glow1/60"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setGewaehlt(null)
              setPhase('liste')
            }}
            className="rounded-[14px] border border-white/[0.12] px-4 py-[14px] text-[15px] text-snippt-muted"
          >
            Zurück
          </button>
          <button
            type="button"
            onClick={buchen}
            disabled={phase === 'sending' || !name.trim()}
            className="flex-1 rounded-[14px] p-[14px] text-[16px] font-semibold text-[#070710] disabled:opacity-50"
            style={{ background: 'linear-gradient(100deg,#2BE7FF,#5468FF)' }}
          >
            {phase === 'sending' ? 'Einen Moment …' : 'Termin bestätigen'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-2">
      {/* Tagewahl */}
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {tage.map((d, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setTagIdx(i)
              setGewaehlt(null)
            }}
            className={`flex-none rounded-full border px-4 py-2 text-[13px] ${
              i === tagIdx
                ? 'border-snippt-glow1 bg-snippt-glow1/15 text-snippt-ink'
                : 'border-white/[0.1] bg-white/[0.02] text-snippt-muted'
            }`}
          >
            {tagLabel(d, i)}
          </button>
        ))}
      </div>

      {fehler && <p className="mb-2 text-[13px] text-snippt-weg">{fehler}</p>}

      {laden ? (
        <p className="py-6 text-center text-[14px] text-snippt-faint">Lädt …</p>
      ) : frei.length === 0 ? (
        <p className="py-6 text-center text-[14px] text-snippt-faint">Keine freien Zeiten an diesem Tag.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {frei.map((s) => (
            <button
              key={s.getTime()}
              type="button"
              onClick={() => {
                setGewaehlt(s)
                setPhase('form')
              }}
              className="rounded-[12px] border border-white/[0.1] bg-white/[0.03] py-3 text-[15px] text-snippt-ink hover:border-snippt-glow1/60"
            >
              {pad(s.getHours())}:{pad(s.getMinutes())}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
