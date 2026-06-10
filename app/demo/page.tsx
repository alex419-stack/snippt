import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

// Demo-Hub im Snippt-v1-Design: dunkel, leuchtend (Indigo/Cyan).
// Zeigt 4 Perspektiven nach dem Pivot auf den einzelnen Friseur "Marco".
// Statischer Pitch-Screen — kein Backend, keine Server Actions.

// Atmosphärisches Hintergrundglühen — identisch zur Landing Page.
const glow = (
  <div
    className="pointer-events-none fixed inset-0 z-0"
    style={{
      background:
        'radial-gradient(60% 45% at 18% 4%, rgba(84,104,255,.20), transparent 60%),' +
        'radial-gradient(50% 40% at 88% 16%, rgba(43,231,255,.13), transparent 60%),' +
        'linear-gradient(180deg,#08080B,#0C0C12)',
    }}
  />
)

type DemoTile = {
  href: string
  titel: string
  akteur: string
  beschreibung: string
}

// Genau 4 Kacheln nach Pivot — Salonchef-Tile entfernt.
const tiles: DemoTile[] = [
  {
    href: '/demo/friseur',
    titel: 'Live-Reihe',
    akteur: 'Friseur · Mobile',
    beschreibung:
      'Wer ist dran, wer wartet — ein Tap für fertig → nächster. Kein Notizbuch, keine Anrufe.',
  },
  {
    href: '/demo/kunde/profil',
    titel: 'Dein Friseur',
    akteur: 'Kunde · Mobile',
    beschreibung:
      'Profil + digitale Stempelkarte. Der Moment, in dem aus Laufkundschaft Stammkundschaft wird.',
  },
  {
    href: '/demo/kunde/walkin',
    titel: 'In der Reihe',
    akteur: 'Kunde · Mobile',
    beschreibung:
      'Ist mein Friseur frei? Stell dich mit einem Tap an und sieh deine Position live.',
  },
  {
    href: '/demo/kunde/buchen',
    titel: 'Termin buchen',
    akteur: 'Kunde · Mobile',
    beschreibung:
      'Für Friseure im Termin-Modus: Slot wählen, bestätigen — ohne Anruf.',
  },
]

export default function DemoHubPage() {
  return (
    <>
      {glow}

      <div className="relative z-[1] space-y-14">

        {/* ── Hero ───────────────────────────────────────────── */}
        <header className="space-y-5 text-center">

          {/* Eyebrow mit Puls-Punkt */}
          <span className="inline-flex items-center gap-[7px] text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
            <span
              className="snippt-pulse h-[7px] w-[7px] rounded-full bg-snippt-glow2"
              style={{ boxShadow: '0 0 10px rgba(43,231,255,.8)' }}
            />
            Live-Demo
          </span>

          {/* Wortmarke */}
          <h1 className="font-display text-[52px] font-semibold leading-none tracking-tight md:text-[72px]">
            Snippt
          </h1>

          {/* Tagline */}
          <p className="mx-auto max-w-[42ch] text-[15px] leading-relaxed text-snippt-muted md:text-[17px]">
            Eine Live-Reihe pro Friseur — ohne Uhrzeiten.
            Stammkunden bleiben bei ihrem Friseur, aus Laufkundschaft
            wird Stammkundschaft.
          </p>
        </header>

        {/* ── 4 Demo-Kacheln ─────────────────────────────────── */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {tiles.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.07] bg-snippt-surface p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:shadow-[0_12px_40px_-12px_rgba(84,104,255,.18)]"
            >
              <div className="space-y-4">
                {/* Akteur-Label */}
                <div className="text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
                  {t.akteur}
                </div>

                {/* Kachel-Titel */}
                <h2 className="font-display text-[22px] font-semibold leading-tight tracking-tight text-snippt-ink md:text-[24px]">
                  {t.titel}
                </h2>

                {/* Beschreibung */}
                <p className="text-[14px] leading-relaxed text-snippt-muted">
                  {t.beschreibung}
                </p>
              </div>

              {/* Fußzeile mit Pfeil-Button */}
              <div className="mt-8 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.16em] text-snippt-faint">
                  Ansehen
                </span>
                {/* Gradient-Kreis mit ArrowUpRight */}
                <span
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:rotate-45"
                  style={{
                    background: 'linear-gradient(100deg,#2BE7FF,#5468FF)',
                    color: '#070710',
                  }}
                >
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* ── Footer-Hinweis ─────────────────────────────────── */}
        <footer className="border-t border-white/[0.07] pt-6 text-[12px] text-snippt-faint">
          Mockup mit Demo-Daten — keine echten Termine.
        </footer>
      </div>
    </>
  )
}
