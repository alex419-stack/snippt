import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/**
 * WalkInHeader — Marcos Name, pulsierender Live-Dot, Datum.
 * Im neuen Snippt-v1-Design (dunkel, Glow-Palette).
 * Server Component.
 */
export function WalkInHeader({
  friseurName,
  datumLang,
}: {
  friseurName: string
  datumLang: string
}) {
  return (
    <div className="space-y-5">
      {/* Zurück-Link */}
      <Link
        href="/demo"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-snippt-faint transition-colors hover:text-snippt-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Demo-Übersicht
      </Link>

      {/* Header-Zeile */}
      <header className="flex items-start justify-between border-b border-white/[0.07] pb-5">
        <div className="space-y-1.5">
          {/* Label */}
          <div className="text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
            Endkunde · Live-Status
          </div>
          {/* Friseur-Name */}
          <h1 className="font-display text-[26px] font-semibold leading-tight tracking-tight text-snippt-ink">
            {friseurName}
          </h1>
          {/* Datum */}
          <p className="text-[13px] text-snippt-muted">{datumLang}</p>
        </div>

        {/* Live-Indikator */}
        <div className="flex items-center gap-2 rounded-full border border-snippt-glow2/25 bg-snippt-glow2/10 px-3 py-1.5">
          <span className="relative flex h-[7px] w-[7px]">
            <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-snippt-glow2 opacity-70" />
            <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-snippt-glow2 shadow-[0_0_8px] shadow-snippt-glow2" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-snippt-glow2">
            Live
          </span>
        </div>
      </header>
    </div>
  )
}
