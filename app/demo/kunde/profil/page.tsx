import Link from 'next/link'
import { getFriseurById } from '@/lib/mockData'
import { ProfilHeader } from './_components/ProfilHeader'
import { TrustSignale } from './_components/TrustSignale'

/**
 * Friseur-Profilseite — M0 Killer-Screen #5.
 *
 * Landing Page nach QR-Code-Scan im Salon: Endkunde sieht das Profil seines
 * Friseurs und kann direkt buchen oder einen Account anlegen.
 * Genau dieser Moment ist die Stammkunden-Conversion-Mechanik von Snippt.
 *
 * Mobile-First: max-w-[430px].
 * Server Component. Daten aus lib/mockData.ts.
 */

const FRISEUR_ID = 'f1' // Marco — Stammfriseur des Demo-Kunden

export default function ProfilPage() {
  const marco = getFriseurById(FRISEUR_ID)!
  const vorname = marco.name.split(' ')[0]

  return (
    <div className="mx-auto max-w-[430px] space-y-6">
      <ProfilHeader friseur={marco} salonName="Mein Friseur" />

      <TrustSignale friseur={marco} />

      {/* Haupt-CTA: Termin buchen */}
      <section className="space-y-3">
        <Link
          href="/demo/kunde/buchen"
          className="flex w-full items-center justify-center rounded-xl bg-ink px-4 py-4 text-sm font-semibold text-background transition-opacity hover:opacity-85"
        >
          Termin bei {vorname} buchen
        </Link>
        <p className="text-center text-xs text-coal/45">
          Nächste freie Slots ab Samstag — kein Anruf nötig
        </p>
      </section>

      {/* Conversion-Teaser: Soft-Account nach erstem Besuch */}
      <section className="rounded-2xl border border-gold/20 bg-gold/5 p-5 space-y-4">
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-ink">
            {vorname} merkt sich deinen Schnitt
          </p>
          <p className="text-sm leading-relaxed text-coal/65">
            Konto anlegen — beim nächsten Besuch ist {vorname} vorausgewählt,
            dein Schnitt bekannt. Kein Anruf nötig.
          </p>
        </div>
        <button
          type="button"
          className="flex w-full items-center justify-center rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-85"
        >
          Konto in 10 Sekunden anlegen
        </button>
      </section>

      <footer className="border-t border-coal/10 pt-6 text-xs text-coal/45">
        Mockup mit Demo-Daten aus{' '}
        <code className="rounded bg-coal/5 px-1.5 py-0.5 font-mono text-[11px] text-coal/70">
          lib/mockData.ts
        </code>{' '}
        — keine API, keine Logik außer Aggregation.
      </footer>
    </div>
  )
}
