import { friseure, termine, getFriseurById } from '@/lib/mockData'
import { WalkInHeader } from './_components/WalkInHeader'
import { StammfriseurKarte, type FriseurStatus } from './_components/StammfriseurKarte'
import { AuslastungsBlock } from './_components/AuslastungsBlock'
import { FriseurZeile } from './_components/FriseurZeile'
import { ConversionTeaser } from './_components/ConversionTeaser'

/**
 * Walk-In Live-Status — M0 Killer-Screen #3.
 *
 * Endkunde schaut von Zuhause: "Ist Marco frei? Soll ich hingehen?"
 * Leitprinzip: 3 Schritte, 1 Tap — Marco-Karte sofort sichtbar ohne Scrollen.
 *
 * Mobile-First: max-w-[430px].
 * Server Component. Alle Daten aus lib/mockData.ts.
 */

// ---------- Demo-Konstanten ----------

/** Stammfriseur des Demo-Kunden */
const STAMMFRISEUR_ID = 'f1' // Marco Lehmann

/** "Heute" für die Demo */
const HEUTE_DATUM = '2026-05-01'
const HEUTE_LANG  = 'Freitag, 1. Mai 2026'

/** Fiktives "Jetzt" — 13:30, konsistent mit Friseur-Tagesansicht */
const JETZT_ISO = '2026-05-01T13:30'

// ---------- Hilfsfunktionen ----------

/**
 * Gibt den ersten geplanten Termin eines Friseurs nach dem Jetzt-Zeitpunkt zurück.
 * Direkte ISO-String-Vergleiche vermeiden Zeitzonen-Effekte.
 */
function naechsterGeplant(friseurId: string): string | null {
  const kandidaten = termine
    .filter(
      (t) =>
        t.friseur_id === friseurId &&
        t.start.startsWith(HEUTE_DATUM) &&
        t.status === 'geplant' &&
        t.start > JETZT_ISO,
    )
    .sort((a, b) => a.start.localeCompare(b.start))

  if (!kandidaten[0]) return null
  return kandidaten[0].start.slice(11, 16)
}

/**
 * Berechnet den FriseurStatus für die Stammfriseur-Karte.
 */
function berechneFriseurStatus(friseurId: string): FriseurStatus {
  const naechster = naechsterGeplant(friseurId)
  if (naechster) {
    return { typ: 'frei', naechsterTermin: naechster }
  }
  return { typ: 'frei', naechsterTermin: '19:00' }
}

// ---------- Page ----------

export default function WalkinPage() {
  const marco = getFriseurById(STAMMFRISEUR_ID)!
  const marcoStatus = berechneFriseurStatus(STAMMFRISEUR_ID)

  const andereFriseure = friseure
    .filter((f) => f.id !== STAMMFRISEUR_ID)
    .map((f) => ({
      friseur: f,
      freiAb: naechsterGeplant(f.id) ?? '19:00',
    }))

  const anzahlGeplant = termine.filter(
    (t) => t.start.startsWith(HEUTE_DATUM) && t.status === 'geplant',
  ).length
  const auslastungsstufe =
    anzahlGeplant < 6 ? 'entspannt' : anzahlGeplant <= 12 ? 'maessig' : 'voll'

  const KAPAZITAET_TAG = 3 * Math.floor((10 * 60) / 45)
  const freieSlots = Math.max(0, KAPAZITAET_TAG - anzahlGeplant)

  return (
    <div className="relative">
    <div className="mx-auto max-w-[430px] space-y-6">
      <WalkInHeader salonName="Mein Friseur" datumLang={HEUTE_LANG} />
      <StammfriseurKarte friseur={marco} status={marcoStatus} />

      <AuslastungsBlock stufe={auslastungsstufe} freieSlots={freieSlots} />

      <section className="space-y-3">
        <div className="flex items-center gap-3 label-caps text-coal/50">
          <span className="h-px w-6 bg-coal/20" />
          Andere Friseure heute
        </div>
        <div className="space-y-2">
          {andereFriseure.map(({ friseur, freiAb }) => (
            <FriseurZeile key={friseur.id} friseur={friseur} freiAbUhrzeit={freiAb} />
          ))}
        </div>
      </section>

      <ConversionTeaser friseurName={marco.name.split(' ')[0]} />

      <footer className="border-t border-coal/10 pt-6 text-xs text-coal/45">
        Mockup mit Demo-Daten aus{' '}
        <code className="rounded bg-coal/5 px-1.5 py-0.5 font-mono text-[11px] text-coal/70">
          lib/mockData.ts
        </code>{' '}
        — keine API, keine Logik außer Aggregation.
      </footer>
    </div>

    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/barber-hero-clean.png"
      alt="Snippt Barbershop"
      className="absolute right-2 top-2 w-16 xl:right-8 xl:top-8 xl:w-[260px]"
    />
    </div>
  )
}
