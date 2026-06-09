'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Stand = { stempel: number; ziel: number; belohnung: string }

export function StempelKarte({ slug }: { slug: string }) {
  const [stand, setStand] = useState<Stand | null>(null)

  useEffect(() => {
    const token = window.localStorage.getItem('snippt_token') ?? ''
    const supabase = createClient()
    supabase.rpc('mein_stempelstand', { p_slug: slug, p_token: token }).then(({ data }) => {
      const d = data as { gefunden?: boolean; stempel?: number; ziel?: number; belohnung?: string } | null
      if (d?.gefunden) {
        setStand({ stempel: d.stempel ?? 0, ziel: d.ziel ?? 10, belohnung: d.belohnung ?? '1 Schnitt gratis' })
      }
    })
  }, [slug])

  const ziel = stand?.ziel ?? 10
  const haben = stand?.stempel ?? 0
  const rest = Math.max(ziel - haben, 0)
  const belohnung = stand?.belohnung ?? '1 Schnitt gratis'

  return (
    <div
      className="rounded-[18px] p-[16px_18px]"
      style={{
        background: 'linear-gradient(120deg,rgba(255,138,76,.10),rgba(255,138,76,.02))',
        border: '1px solid rgba(255,138,76,.18)',
      }}
    >
      <div className="mb-[11px] flex items-center justify-between">
        <span className="text-[12px] uppercase tracking-[0.14em] text-snippt-ember">Stempelkarte</span>
        <span className="font-display text-[15px] text-snippt-ink">
          {haben} / {ziel}
        </span>
      </div>
      <div className="flex flex-wrap gap-[7px]">
        {Array.from({ length: ziel }).map((_, i) => (
          <i
            key={i}
            className="h-[18px] w-[18px] rounded-full"
            style={
              i < haben
                ? {
                    background: 'radial-gradient(circle at 35% 30%,#ffb88a,#FF8A4C)',
                    boxShadow: '0 0 10px -1px #FF8A4C',
                  }
                : { border: '1px solid rgba(255,138,76,.35)' }
            }
          />
        ))}
      </div>
      <div className="mt-[11px] text-[12px] text-snippt-muted">
        {rest === 0 ? (
          <b className="text-snippt-ink">Voll! Deine Belohnung: {belohnung}.</b>
        ) : (
          <>
            Noch <b className="text-snippt-ink">{rest} {rest === 1 ? 'Schnitt' : 'Schnitte'}</b> bis {belohnung}.
          </>
        )}
      </div>
    </div>
  )
}
