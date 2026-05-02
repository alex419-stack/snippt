import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { meinSalon } from '@/lib/mockData'

/**
 * /demo Hub
 *
 * Einstiegs-Karte für den Pitch: 4 Sichten, je eine Kachel.
 * Jede Kachel beschreibt Akteur und Sicht in einem Satz.
 */

type DemoTile = {
  href: string
  titel: string
  akteur: string
  beschreibung: string
}

const tiles: DemoTile[] = [
  {
    href: '/demo/salonchef',
    titel: 'Salonchef-Dashboard',
    akteur: 'Salonbesitzer · Desktop',
    beschreibung:
      'Auslastung pro Friseur, Stammkundenanteil und Walk-In-Pattern auf einen Blick — die Steuerzentrale für den Salon.',
  },
  {
    href: '/demo/friseur',
    titel: 'Friseur-Tagesansicht',
    akteur: 'Friseur · Mobile',
    beschreibung:
      'Eigener Tag, nächster Stammkunde mit Foto und Notiz. Kein Salon-Sammelsurium, sondern persönliche Sicht.',
  },
  {
    href: '/demo/kunde/walkin',
    titel: 'Walk-In Live-Status',
    akteur: 'Endkunde · Mobile',
    beschreibung:
      'Ist mein Friseur gerade frei? Live-Status pro Stuhl plus Express-Buchung in einem Tap.',
  },
  {
    href: '/demo/kunde/buchen',
    titel: 'Termin buchen',
    akteur: 'Endkunde · Mobile',
    beschreibung:
      'Lieblings-Friseur vorausgewählt, Slot wählen, bestätigen — drei Taps statt Anruf in der Mittagspause.',
  },
]

export default function DemoHubPage() {
  return (
    <div className="space-y-16">
      {/* Header / Wortmarke */}
      <header className="space-y-6">
        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-coal/60">
          <span className="h-px w-8 bg-gold" />
          Hi-Fi Mockup · M0
        </div>
        <h1 className="font-sans text-7xl font-semibold tracking-tight text-ink md:text-8xl">
          Snippt
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-coal/75 md:text-xl">
          Premium-Buchung für{' '}
          <span className="font-medium text-ink">{meinSalon.name}</span>.
          Stammkunden landen verlässlich bei ihrem Friseur — Walk-In und
          Vorab-Buchung gleichberechtigt.
        </p>
      </header>

      {/* 4 Demo-Kacheln */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-coal/10 bg-white p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-coal/20 hover:shadow-[0_12px_40px_-12px_rgba(15,15,15,0.18)]"
          >
            <div className="space-y-4">
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
                {t.akteur}
              </div>
              <h2 className="font-sans text-2xl font-semibold tracking-tight text-ink">
                {t.titel}
              </h2>
              <p className="text-sm leading-relaxed text-coal/70">
                {t.beschreibung}
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-coal/50">
                Ansehen
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-bone transition-transform duration-200 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Footer-Notiz */}
      <footer className="border-t border-coal/10 pt-6 text-xs text-coal/50">
        Mockup mit Demo-Daten — keine echten Termine, keine Anbindung an
        Backend.
      </footer>
    </div>
  )
}
