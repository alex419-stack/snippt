import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/**
 * Placeholder für Screens, die in späteren Phasen ausgebaut werden.
 * H1 in Playfair Display Serif, bg-surface statt bg-white/60.
 */
export function PlaceholderScreen({
  titel,
  akteur,
  phase,
}: {
  titel: string
  akteur: string
  phase: string
}) {
  return (
    <div className="space-y-12">
      <Link
        href="/demo"
        className="inline-flex items-center gap-2 text-sm font-medium text-coal/60 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zum Hub
      </Link>

      <header className="space-y-4">
        <div className="label-caps text-gold">
          {akteur}
        </div>
        <h1 className="text-h1 text-ink md:text-5xl">
          {titel}
        </h1>
      </header>

      <div className="rounded-2xl border border-dashed border-bone/20 bg-surface px-8 py-16 text-center">
        <div className="mx-auto max-w-md space-y-3">
          <div className="label-caps text-coal/50">
            In Arbeit
          </div>
          <p className="text-base text-coal/70">
            Dieser Screen wird in{' '}
            <span className="font-medium text-ink">{phase}</span>{' '}
            ausgearbeitet. Daten und Layout sind in{' '}
            <code className="rounded bg-bone/8 px-1.5 py-0.5 font-mono text-sm text-ink">
              lib/mockData.ts
            </code>{' '}
            bereits vorbereitet.
          </p>
        </div>
      </div>
    </div>
  )
}
