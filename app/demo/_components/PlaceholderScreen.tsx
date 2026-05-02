import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/**
 * Geteilter Placeholder für Screens, die in späteren Phasen ausgebaut werden.
 * Liegt unter app/demo/_components/* — Unterstrich = privat, kein Routing.
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
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
          {akteur}
        </div>
        <h1 className="font-sans text-5xl font-semibold tracking-tight text-ink md:text-6xl">
          {titel}
        </h1>
      </header>

      <div className="rounded-2xl border border-dashed border-coal/20 bg-white/60 px-8 py-16 text-center">
        <div className="mx-auto max-w-md space-y-3">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-coal/50">
            In Arbeit
          </div>
          <p className="text-base text-coal/70">
            Dieser Screen wird in{' '}
            <span className="font-medium text-ink">{phase}</span>{' '}
            ausgearbeitet. Daten und Layout sind in{' '}
            <code className="rounded bg-coal/5 px-1.5 py-0.5 font-mono text-sm text-ink">
              lib/mockData.ts
            </code>{' '}
            bereits vorbereitet.
          </p>
        </div>
      </div>
    </div>
  )
}
