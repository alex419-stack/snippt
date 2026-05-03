import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg space-y-10 text-center">
        {/* Gold-Akzent-Linie */}
        <div className="flex justify-center">
          <div className="flex items-center gap-3 label-caps text-whiskey">
            <span className="h-px w-8 bg-whiskey" />
            Premium-Buchung für Barbershops
            <span className="h-px w-8 bg-whiskey" />
          </div>
        </div>

        {/* Wordmark */}
        <h1 className="text-display text-ink">
          Snippt
        </h1>

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
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-bone transition-all hover:bg-ink/90 hover:shadow-[0_8px_24px_-6px_rgba(245,243,239,0.15)]"
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
            className="text-xs font-medium uppercase tracking-[0.16em] text-coal/50 transition-colors hover:text-whiskey"
          >
            Demo ansehen →
          </Link>
        </div>
      </div>
    </div>
  )
}
