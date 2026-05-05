import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/**
 * HeaderBar — Salonchef-Dashboard
 *
 * Salon-Name als Playfair-Display-Serif-H1, Datum als Geist-Body.
 * Server Component.
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
      <Link
        href="/demo"
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-coal/50 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Zurück zum Hub
      </Link>

      {/* Bild auf header-Ebene begrenzt — overflow-hidden verhindert Überlauf in KPI-Bereich */}
      <header className="relative overflow-hidden border-b border-bone/10 pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:pr-[42%]">
          <div className="space-y-2">
            <div className="flex items-center gap-3 label-caps text-gold">
              <span className="h-px w-6 bg-gold" />
              Salonchef · Dashboard
            </div>
            <h1 className="text-h1 text-ink">
              {salonName}
            </h1>
            <p className="text-sm text-coal/65">{datumLang}</p>
          </div>

          {/* Salonchef-Avatar */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-ink">Alex Aghamir</div>
              <div className="text-xs text-coal/55">Inhaber</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/15 bg-surface text-sm font-semibold tracking-wide text-ink">
              {initialen}
            </div>
          </div>
        </div>

        {/* Barbershop Hero-Grafik — bleibt innerhalb des Headers */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/barber-hero-clean.png"
          alt="Snippt Barbershop"
          className="hidden lg:block absolute right-0 top-0 bottom-0 w-[40%] object-contain object-right"
        />
      </header>
    </div>
  )
}
