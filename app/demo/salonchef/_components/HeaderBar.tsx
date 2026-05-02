import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/**
 * HeaderBar — Salonchef-Dashboard
 *
 * Subtile Premium-Kopfzeile: Salon-Name links, Datum mittig (deutsch),
 * Initialen-Avatar rechts. Bewusst flach (kein Logo-Block, keine Nav)
 * damit die KPI-/Matrix-Komponenten als Hauptdarsteller wirken.
 *
 * Server Component — keine Interaktivität.
 */
export function HeaderBar({
  salonName,
  datumLang,
  initialen,
}: {
  salonName: string
  datumLang: string
  initialen: string
}) {
  return (
    <div className="space-y-6">
      {/* Zurück-zum-Hub-Link, dezent */}
      <Link
        href="/demo"
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-coal/50 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Zurück zum Hub
      </Link>

      {/* Eigentliche Header-Zeile */}
      <header className="flex flex-col gap-6 border-b border-coal/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
            <span className="h-px w-6 bg-gold" />
            Salonchef · Dashboard
          </div>
          <h1 className="font-sans text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            {salonName}
          </h1>
          <p className="text-sm text-coal/65">{datumLang}</p>
        </div>

        {/* Salonchef-Avatar (Initialen, kein Bild) */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-ink">Alex Aghamir</div>
            <div className="text-xs text-coal/55">Inhaber</div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-coal/15 bg-white text-sm font-semibold tracking-wide text-ink">
            {initialen}
          </div>
        </div>
      </header>
    </div>
  )
}
