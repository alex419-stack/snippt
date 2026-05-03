import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/**
 * WalkInHeader — Salon-Name, pulsierender Live-Dot, Datum.
 * Server Component.
 */
export function WalkInHeader({
  salonName,
  datumLang,
}: {
  salonName: string
  datumLang: string
}) {
  return (
    <div className="space-y-6">
      <Link
        href="/demo"
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-coal/50 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Zurück zum Hub
      </Link>

      <header className="flex items-start justify-between border-b border-bone/10 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 label-caps text-whiskey">
            <span className="h-px w-6 bg-whiskey" />
            Endkunde · Live-Status
          </div>
          <h1 className="text-h1 text-ink">{salonName}</h1>
          <p className="text-sm text-coal/65">{datumLang}</p>
        </div>

        {/* Live-Indikator */}
        <div className="flex items-center gap-2 rounded-full border border-whiskey/20 bg-whiskey/10 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-whiskey opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-whiskey" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-whiskey">
            Live jetzt
          </span>
        </div>
      </header>
    </div>
  )
}
