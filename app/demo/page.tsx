import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { meinSalon } from '@/lib/mockData'

/**
 * /demo Hub
 *
 * Einstiegs-Karte für den Pitch: 4 Sichten, je eine Kachel.
 * "Snippt" als Display-Headline in Playfair Display Serif.
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
    href: '/demo/kunde/profil',
    titel: 'Friseur-Profil',
    akteur: 'Endkunde · QR-Code-Einstieg · Mobile',
    beschreibung:
      'Kunde scannt QR-Code nach dem Schnitt — landet beim Profil seines Friseurs, bucht den nächsten Termin, legt ein Konto an. Der Moment, in dem Laufkundschaft zu Stammkundschaft wird.',
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
      <header className="relative overflow-hidden">

        {/* Text-Content — auf Desktop Platz rechts für das Bild */}
        <div className="space-y-6 md:pr-[44%]">

          {/* Barber-Stripe — Rot / Weiß / Blau */}
          <div className="flex h-[3px] w-24 overflow-hidden rounded-full">
            <div className="flex-1 bg-[#C8201E]" />
            <div className="flex-1 bg-bone/25" />
            <div className="flex-1 bg-[#1A3A8F]" />
          </div>

          <div className="flex items-center gap-3 label-caps text-gold">
            <span className="h-px w-8 bg-gold" />
            Hi-Fi Mockup · M0
          </div>

          {/* Wordmark */}
          <h1 className="text-display text-ink">Snippt</h1>

          <p className="text-lg leading-relaxed text-coal/75 md:text-xl">
            Premium-Buchung für{' '}
            <span className="font-medium text-ink">{meinSalon.name}</span>.
            Stammkunden landen verlässlich bei ihrem Friseur — Walk-In und
            Vorab-Buchung gleichberechtigt.
          </p>
        </div>

        {/* Barbershop Hero-Grafik — rechts, transparenter Hintergrund */}
        <img
          src="/barber-hero-clean.png"
          alt="Snippt Barbershop"
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[42%]"
        />
      </header>

      {/* 4 Demo-Kacheln */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-bone/10 bg-surface p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-bone/20 hover:shadow-[0_8px_28px_-8px_rgba(0,0,0,0.09)]"
          >
            <div className="space-y-4">
              <div className="label-caps text-gold">
                {t.akteur}
              </div>
              <h2 className="text-h2 text-ink">
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
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-background transition-transform duration-200 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Footer-Notiz */}
      <footer className="border-t border-bone/10 pt-6 text-xs text-coal/50">
        Mockup mit Demo-Daten — keine echten Termine, keine Anbindung an
        Backend.
      </footer>
    </div>
  )
}
