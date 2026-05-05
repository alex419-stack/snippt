import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl space-y-10 text-center">

        {/* Barber-Stripe — Rot / Weiß / Blau */}
        <div className="flex justify-center">
          <div className="flex h-[3px] w-24 overflow-hidden rounded-full">
            <div className="flex-1 bg-[#C8201E]" />
            <div className="flex-1 bg-bone/25" />
            <div className="flex-1 bg-[#1A3A8F]" />
          </div>
        </div>

        {/* Label */}
        <div className="flex justify-center">
          <div className="flex items-center gap-3 label-caps text-gold">
            <span className="h-px w-8 bg-gold" />
            Premium-Buchung für Barbershops
            <span className="h-px w-8 bg-gold" />
          </div>
        </div>

        {/* Wordmark */}
        <h1 className="text-display text-ink">Snippt</h1>

        {/* Barbershop Hero-Grafik */}
        <img
          src="/barbershop-hero.png"
          alt="Snippt Barbershop"
          className="w-full"
        />

        {/* Tagline */}
        <p className="text-lg leading-relaxed text-coal/70">
          Stammkunden landen verlässlich bei{' '}
          <span className="font-medium text-ink">ihrem</span> Friseur.
          Walk-In und Vorab-Buchung gleichberechtigt.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-ink/90"
          >
            Jetzt starten
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-bone/15 px-6 py-3 text-sm font-semibold text-ink transition-all hover:border-bone/30 hover:bg-bone/5"
          >
            Anmelden
          </Link>
        </div>

        {/* Demo-Link */}
        <div className="pt-4">
          <Link
            href="/demo"
            className="text-xs font-medium uppercase tracking-[0.16em] text-coal/50 transition-colors hover:text-gold"
          >
            Demo ansehen →
          </Link>
        </div>
      </div>
    </div>
  )
}
