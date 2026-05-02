import Link from 'next/link'
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Clock,
  CalendarDays,
  MessageSquare,
  ChevronRight,
  Scissors,
} from 'lucide-react'
import { getFriseurById, getKundeById } from '@/lib/mockData'

/**
 * Termin buchen — Hi-Fi Mockup
 *
 * Storyline: Stammkunde k1 (Thomas Brandt) bucht bei Marco (f1).
 * One-Page-Flow: Step 0 (Hero) → Step 1 (Slot wählen, aktiv) → Step 2 (Bestätigung)
 * Zeigt alle 3 Steps untereinander mit Step 1 als aktivem Highlight.
 * Mobile-First, max-w-sm zentriert.
 * Server Component — kein echtes Formular, kein Submit.
 */

const DEMO_FRISEUR_ID = 'f1'
const DEMO_KUNDE_ID = 'k1'

// Verfügbare Slots (nach bestehenden Terminen, plausibel)
const verfuegbareSlots = [
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
]
const AUSGEWAEHLTER_SLOT = '15:00'

// Leistungs-Optionen
const leistungen = [
  { id: 'schnitt', label: 'Herrenschnitt', dauer: '30 Min', preis: '18 €', ausgewaehlt: true },
  { id: 'bart', label: 'Bartpflege', dauer: '+20 Min', preis: '+12 €', ausgewaehlt: false },
]

export default function BuchenPage() {
  const friseur = getFriseurById(DEMO_FRISEUR_ID)
  const kunde = getKundeById(DEMO_KUNDE_ID)

  if (!friseur || !kunde) return null

  return (
    <div className="mx-auto max-w-sm space-y-4 px-4 py-8">
      {/* Back-Link */}
      <Link
        href="/demo"
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-coal/50 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Demo-Hub
      </Link>

      {/* Akteur-Label */}
      <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
        <span className="h-px w-6 bg-gold" />
        Endkunde · Mobile
      </div>

      {/* ── Progress-Indicator ── */}
      <div className="flex items-center gap-2 px-1">
        {['Willkommen', 'Slot wählen', 'Bestätigen'].map((label, i) => {
          const istAktiv = i === 1
          const istFertig = i === 0
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full items-center gap-1">
                {i > 0 && (
                  <div
                    className={`h-px flex-1 ${
                      i <= 1 ? 'bg-gold/60' : 'bg-coal/12'
                    }`}
                  />
                )}
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-all ${
                    istAktiv
                      ? 'bg-gold text-white shadow-[0_0_0_3px_rgba(201,168,76,0.2)]'
                      : istFertig
                      ? 'bg-ink text-bone'
                      : 'bg-coal/10 text-coal/45'
                  }`}
                >
                  {istFertig ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`h-px flex-1 ${
                      i < 1 ? 'bg-gold/60' : 'bg-coal/12'
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-[9.5px] font-medium uppercase tracking-[0.1em] ${
                  istAktiv ? 'text-gold' : istFertig ? 'text-ink' : 'text-coal/40'
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* ─────────────────────────────────────────────
          STEP 0 — Stammkunden-Hero (abgeschlossen)
         ───────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-coal/10 bg-white shadow-sm">
        <div className="h-1 w-full bg-ink" />
        <div className="p-5">
          {/* Schritt-Label */}
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-ink">
              <CheckCircle2 className="h-3 w-3 text-bone" strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-coal/50">
              Schritt 1 — Willkommen
            </span>
          </div>

          {/* Willkommensnachricht */}
          <div className="mb-4">
            <h1 className="font-sans text-2xl font-semibold tracking-tight text-ink">
              Willkommen zurück,
            </h1>
            <h1 className="font-sans text-2xl font-semibold tracking-tight text-gold">
              {kunde.name.split(' ')[0]}.
            </h1>
          </div>

          {/* Lieblings-Friseur Card */}
          <div className="flex items-center gap-3.5 rounded-xl border border-gold/20 bg-gradient-to-br from-gold/8 to-gold/4 p-3.5">
            <div
              className="h-12 w-12 shrink-0 rounded-full bg-cover bg-center ring-2 ring-gold/25"
              style={{ backgroundImage: `url(${friseur.foto})` }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gold">
                Dein Friseur
              </div>
              <div className="font-sans text-[15px] font-semibold text-ink">
                {friseur.name}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-coal/60">
                <Star className="h-3 w-3 fill-gold text-gold" />
                {friseur.social_proof.bewertung_durchschnitt} ·{' '}
                {friseur.spezialitaet}
              </div>
            </div>
            {/* Verfügbarkeits-Dot */}
            <div className="flex flex-col items-end gap-1">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[10px] text-emerald-600">Frei</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-coal/55">
            Dein Friseur ist heute verfügbar — wähle im nächsten Schritt
            deinen Wunschtermin.
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          STEP 1 — Slot wählen (AKTIV)
         ───────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-gold/35 bg-white shadow-[0_4px_20px_-4px_rgba(201,168,76,0.18)] ring-1 ring-gold/20">
        <div className="h-1 w-full bg-gradient-to-r from-gold/60 via-gold to-gold/50" />
        <div className="p-5">
          {/* Schritt-Label */}
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold">
              <span className="text-[11px] font-bold text-white">2</span>
            </div>
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-gold">
              Schritt 2 — Slot wählen
            </span>
          </div>

          {/* Datum */}
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-coal/45" />
            <span className="font-sans text-[15px] font-semibold text-ink">
              Samstag, 02. Mai 2026
            </span>
            <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
              7 Slots frei
            </span>
          </div>

          {/* Zeitslot-Grid */}
          <div className="grid grid-cols-4 gap-2">
            {verfuegbareSlots.map((slot) => {
              const istAusgewaehlt = slot === AUSGEWAEHLTER_SLOT
              return (
                <button
                  key={slot}
                  className={`rounded-xl border py-2.5 text-center text-[13px] font-semibold tabular-nums transition-all ${
                    istAusgewaehlt
                      ? 'border-gold bg-gold text-white shadow-[0_2px_8px_rgba(201,168,76,0.35)]'
                      : 'border-coal/12 bg-bone text-coal/75 hover:border-coal/25 hover:text-ink'
                  }`}
                >
                  {slot}
                </button>
              )
            })}
          </div>

          {/* Leistungs-Auswahl */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-coal/50">
              <Scissors className="h-3 w-3" />
              Leistung
            </div>
            {leistungen.map((l) => (
              <button
                key={l.id}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                  l.ausgewaehlt
                    ? 'border-ink bg-ink/4 ring-1 ring-ink/10'
                    : 'border-coal/10 bg-bone hover:border-coal/20'
                }`}
              >
                <div>
                  <div
                    className={`text-sm font-semibold ${l.ausgewaehlt ? 'text-ink' : 'text-coal/60'}`}
                  >
                    {l.label}
                  </div>
                  <div className="text-xs text-coal/50">{l.dauer}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${l.ausgewaehlt ? 'text-ink' : 'text-coal/45'}`}
                  >
                    {l.preis}
                  </span>
                  {l.ausgewaehlt && (
                    <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-ink">
                      <CheckCircle2 className="h-3 w-3 text-bone" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Weiter-CTA */}
          <div className="mt-4 flex items-center gap-1.5 rounded-xl bg-bone/60 px-3 py-2 text-xs text-coal/55">
            <Clock className="h-3 w-3 shrink-0 text-coal/40" />
            Ausgewählt: {AUSGEWAEHLTER_SLOT} Uhr · Herrenschnitt · 30 Min
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          STEP 2 — Bestätigung (Preview)
         ───────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-coal/10 bg-white shadow-sm opacity-80">
        <div className="h-1 w-full bg-coal/8" />
        <div className="p-5">
          {/* Schritt-Label */}
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-coal/10">
              <span className="text-[11px] font-bold text-coal/50">3</span>
            </div>
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-coal/40">
              Schritt 3 — Bestätigen
            </span>
          </div>

          {/* Zusammenfassung */}
          <div className="space-y-3 rounded-xl border border-coal/8 bg-bone p-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-coal/50">
              Dein Termin
            </div>

            {/* Friseur-Zeile */}
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-9 shrink-0 rounded-full bg-cover bg-center ring-1 ring-coal/15"
                style={{ backgroundImage: `url(${friseur.foto})` }}
              />
              <div>
                <div className="text-sm font-semibold text-ink">
                  {friseur.name}
                </div>
                <div className="text-xs text-coal/55">{friseur.spezialitaet}</div>
              </div>
            </div>

            <div className="border-t border-coal/8 pt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-coal/60">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Datum & Uhrzeit
                </span>
                <span className="font-semibold text-ink">
                  Sa 02.05. · {AUSGEWAEHLTER_SLOT} Uhr
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-coal/60">
                  <Scissors className="h-3.5 w-3.5" />
                  Leistung
                </span>
                <span className="font-semibold text-ink">
                  Herrenschnitt · 30 Min
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-coal/60">Preis</span>
                <span className="font-semibold text-ink">18 €</span>
              </div>
            </div>
          </div>

          {/* Kunden-Notiz an Friseur */}
          <div className="mt-3 rounded-xl border border-coal/8 bg-bone px-3.5 py-3">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-coal/45">
              <MessageSquare className="h-3 w-3" />
              Deine Notiz an Marco
            </div>
            <p className="text-xs italic leading-relaxed text-coal/65">
              &ldquo;{kunde.notiz}&rdquo;
            </p>
          </div>

          {/* Bestätigungs-CTA */}
          <button
            className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(201,168,76,0.35)] opacity-60"
            disabled
            title="Im Mockup deaktiviert"
          >
            <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
            Termin bestätigen
            <ChevronRight className="h-4 w-4 opacity-70" />
          </button>
          <p className="mt-2 text-center text-[10px] text-coal/40">
            Im Mockup deaktiviert · kein echter Submit
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 text-center text-[11px] text-coal/40">
        Demo-Buchung · Daten aus mockData.ts
      </div>
    </div>
  )
}
