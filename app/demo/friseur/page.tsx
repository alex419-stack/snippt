import { FriseurHeader } from './_components/FriseurHeader'
import { MeinBrandKarte } from './_components/MeinBrandKarte'
import { DemoReihe } from './_components/DemoReihe'

/**
 * Friseur-Demo — Live-Reihe (Tagesansicht).
 *
 * Post-Pivot (2026-06-09): Ein Friseur „Marco", keine fixen Uhrzeiten —
 * nur Positionen und Statuses (ist da / unterwegs / wartet).
 * Digitale Stempelkarte als Akzent.
 *
 * Statisch/presentational — kein Backend, keine Server Actions.
 * Mobile-First: max-w-md zentriert, simuliert Phone-Viewport.
 */

// ── Mock-Daten ──────────────────────────────────────────────────────────────

const MARCO = {
  name: 'Marco Ferretti',
  foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
  spezialitaet: 'Fade · Skin Fade · Bart',
  bio: 'Ich schneide seit 11 Jahren. Jeder Kopf ist anders — ich nehme mir die Zeit, die es braucht. Keine Fließband-Schnitte.',
  jahreDerErfahrung: 11,
  bewertung: 4.9,
  bewertungAnzahl: 134,
  stammkundenProzent: 78,
  stilTags: ['Fade', 'Skin Fade', 'Textured Crop', 'Bart', 'Klassisch'],
  socialProofSatz:
    'Seit drei Jahren gehe ich nur noch zu Marco. Er kennt meinen Kopf besser als ich.',
}

const REIHE_HEUTE = [
  {
    id: '1',
    name: 'Kenan Y.',
    status: 'da' as const,
    wartetSeit: '4 Min',
    stempelVoll: true,
  },
  {
    id: '2',
    name: 'Mert K.',
    status: 'unterwegs' as const,
    wartetSeit: '12 Min',
  },
  {
    id: '3',
    name: 'Deniz A.',
    status: 'unterwegs' as const,
    wartetSeit: '23 Min',
  },
  {
    id: '4',
    name: 'Jonas B.',
    status: 'wartet' as const,
    wartetSeit: '31 Min',
  },
]

const DATUM_LANG = 'Mittwoch, 10. Juni 2026'
const ANZAHL_FERTIG = 6 // Mock: heute bereits abgeschlossen

// ── Page ────────────────────────────────────────────────────────────────────

export default function FriseurDemoPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Hintergrund-Glow — Indigo links oben, Cyan rechts oben */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 0% 0%, rgba(84,104,255,.18), transparent 70%), ' +
            'radial-gradient(50% 40% at 100% 0%, rgba(43,231,255,.12), transparent 65%), ' +
            '#08080B',
        }}
      />

      {/* Inhalt */}
      <div className="relative z-[1] mx-auto w-full max-w-md px-5 pb-12 pt-12 space-y-8">
        <FriseurHeader
          name={MARCO.name}
          datumLang={DATUM_LANG}
          anzahlInReihe={REIHE_HEUTE.length}
          anzahlFertig={ANZAHL_FERTIG}
        />

        <MeinBrandKarte daten={MARCO} />

        <DemoReihe eintraege={REIHE_HEUTE} />

        {/* Footer-Hinweis */}
        <p className="text-center text-[11px] text-snippt-faint">
          Demo-Ansicht · Keine Echtdaten
        </p>
      </div>
    </main>
  )
}
