import Link from 'next/link'
import {
  ArrowLeft,
  Star,
  Clock,
  MessageSquare,
  CheckCircle2,
  Calendar,
} from 'lucide-react'
import {
  friseure,
  termine,
  kunden,
  getFriseurById,
  getKundeById,
} from '@/lib/mockData'

/**
 * Friseur-Tagesansicht — Hi-Fi Mockup
 *
 * Demo-Friseur: Marco Lehmann (f1), Demo-Datum: Sa 02.05.2026
 * Mobile-First, max-w-sm zentriert.
 * Server Component — alle Daten aus mockData.ts, kein Client-State.
 */

const DEMO_FRISEUR_ID = 'f1'
const DEMO_DATUM = '2026-05-02'

/** Formatiert ISO-Zeit als "09:30" */
function zeitAusISO(iso: string): string {
  return iso.slice(11, 16)
}

/** Formatiert Endzeit aus Start + Dauer */
function endzeitAusISO(iso: string, dauerMin: number): string {
  const h = parseInt(iso.slice(11, 13), 10)
  const m = parseInt(iso.slice(14, 16), 10)
  const gesamtMin = h * 60 + m + dauerMin
  const eh = Math.floor(gesamtMin / 60)
  const em = gesamtMin % 60
  return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`
}

const statusConfig = {
  geplant: {
    label: 'Geplant',
    farbe: 'bg-coal/8 text-coal/70',
    dot: 'bg-coal/40',
  },
  walkin: {
    label: 'Walk-In',
    farbe: 'bg-gold/15 text-gold',
    dot: 'bg-gold',
  },
  abgeschlossen: {
    label: 'Abgeschlossen',
    farbe: 'bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
}

export default function FriseurPage() {
  const friseur = getFriseurById(DEMO_FRISEUR_ID)
  if (!friseur) return null

  // Termine für Demo-Datum und Demo-Friseur
  const tagesTermine = termine
    .filter(
      (t) =>
        t.friseur_id === DEMO_FRISEUR_ID && t.start.startsWith(DEMO_DATUM)
    )
    .sort((a, b) => a.start.localeCompare(b.start))

  // Nächster Stammkunde = erster Termin, bei dem Kunde den Friseur als Lieblings-Friseur hat
  const naechsterStammkunde = tagesTermine.find((t) => {
    const k = getKundeById(t.kunde_id)
    return k?.lieblings_friseur_id === DEMO_FRISEUR_ID
  })
  const naechsterStammkundeKunde = naechsterStammkunde
    ? getKundeById(naechsterStammkunde.kunde_id)
    : null

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
        Friseur · Mobile
      </div>

      {/* ── "Mein Brand"-Karte ── */}
      <div className="overflow-hidden rounded-2xl border border-coal/10 bg-white shadow-sm">
        {/* Gold-Streifen oben */}
        <div className="h-1 w-full bg-gradient-to-r from-gold/80 via-gold to-gold/60" />

        <div className="p-5">
          {/* Kopfbereich: Foto + Eckdaten */}
          <div className="flex items-start gap-4">
            <div
              className="h-16 w-16 shrink-0 rounded-full bg-cover bg-center ring-2 ring-gold/30"
              style={{ backgroundImage: `url(${friseur.foto})` }}
            />
            <div className="min-w-0 flex-1">
              {/* Stammkunden-Badge */}
              <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/12 px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.12em] text-gold">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {Math.round(friseur.stammkunden_anteil * 100)}% Stammkunden
              </div>
              <div className="truncate font-sans text-[18px] font-semibold leading-snug tracking-tight text-ink">
                {friseur.name}
              </div>
              <div className="text-xs text-coal/65">{friseur.spezialitaet}</div>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-4 text-sm leading-relaxed text-coal/70">
            {/* Erster Satz der Bio */}
            {friseur.bio.split('.')[0]}.
          </p>

          {/* Trust-Signale */}
          <div className="mt-4 flex items-center gap-4 border-t border-coal/8 pt-4">
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              <span className="text-sm font-semibold text-ink">
                {friseur.social_proof.bewertung_durchschnitt}
              </span>
              <span className="text-xs text-coal/55">
                ({friseur.social_proof.bewertung_anzahl})
              </span>
            </div>
            <div className="h-3 w-px bg-coal/15" />
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-coal/45" />
              <span className="text-xs text-coal/65">
                {friseur.jahre_erfahrung} J. Erfahrung
              </span>
            </div>
            <div className="h-3 w-px bg-coal/15" />
            <div className="flex gap-1">
              {friseur.stilrichtung.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-coal/6 px-2 py-0.5 text-[10px] text-coal/60"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Nächster Stammkunde (Highlight-Box) ── */}
      {naechsterStammkunde && naechsterStammkundeKunde && (
        <div className="overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/8 to-gold/4 shadow-sm">
          <div className="p-5">
            <div className="mb-3 text-[10.5px] font-medium uppercase tracking-[0.18em] text-gold">
              Nächster Stammkunde
            </div>
            <div className="flex items-center gap-3.5">
              <div
                className="h-12 w-12 shrink-0 rounded-full bg-cover bg-center ring-2 ring-gold/30"
                style={{ backgroundImage: `url(${naechsterStammkundeKunde.foto})` }}
              />
              <div className="min-w-0 flex-1">
                <div className="font-sans text-[15px] font-semibold text-ink">
                  {naechsterStammkundeKunde.name}
                </div>
                <div className="flex items-center gap-2 text-xs text-coal/65">
                  <Clock className="h-3 w-3" />
                  {zeitAusISO(naechsterStammkunde.start)} Uhr ·{' '}
                  {naechsterStammkunde.leistung} ·{' '}
                  {naechsterStammkunde.dauer_min} Min
                </div>
              </div>
            </div>
            {/* Stammkunden-Notiz */}
            {naechsterStammkundeKunde.notiz && (
              <div className="mt-3.5 flex items-start gap-2 rounded-xl bg-white/60 px-3.5 py-3">
                <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
                <p className="text-xs italic leading-relaxed text-coal/70">
                  &ldquo;{naechsterStammkundeKunde.notiz}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tages-Timeline ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-coal/50">
            Samstag, 2. Mai 2026
          </h2>
          <span className="text-[11px] text-coal/45">
            {tagesTermine.length} Termine
          </span>
        </div>

        {/* Termin-Karten */}
        <div className="space-y-2">
          {tagesTermine.map((termin) => {
            const kunde = getKundeById(termin.kunde_id)
            const istStammkunde =
              kunde?.lieblings_friseur_id === DEMO_FRISEUR_ID
            const sc = statusConfig[termin.status]

            return (
              <div
                key={termin.id}
                className="flex items-start gap-3.5 rounded-2xl border border-coal/8 bg-white px-4 py-4 shadow-sm"
              >
                {/* Zeitblock */}
                <div className="w-[46px] shrink-0 pt-0.5 text-center">
                  <div className="font-sans text-[13px] font-semibold tabular-nums text-ink">
                    {zeitAusISO(termin.start)}
                  </div>
                  <div className="text-[10px] tabular-nums text-coal/40">
                    {endzeitAusISO(termin.start, termin.dauer_min)}
                  </div>
                </div>

                {/* Trennlinie */}
                <div className="mt-1 flex flex-col items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-coal/25" />
                  <div className="mt-0.5 h-full w-px bg-coal/10" />
                </div>

                {/* Termin-Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {kunde && (
                        <div
                          className="h-7 w-7 shrink-0 rounded-full bg-cover bg-center ring-1 ring-coal/15"
                          style={{ backgroundImage: `url(${kunde.foto})` }}
                        />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-sm font-semibold text-ink">
                            {kunde?.name ?? 'Unbekannt'}
                          </span>
                          {istStammkunde && (
                            <span className="shrink-0 rounded-full bg-gold/15 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.1em] text-gold">
                              Stamm
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-coal/60">
                          {termin.leistung} · {termin.dauer_min} Min
                        </div>
                      </div>
                    </div>
                    {/* Status-Badge */}
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${sc.farbe}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>
                  </div>

                  {/* Kunden-Notiz */}
                  {kunde?.notiz && istStammkunde && (
                    <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-bone px-2.5 py-1.5">
                      <MessageSquare className="mt-0.5 h-3 w-3 shrink-0 text-coal/40" />
                      <p className="text-[11px] italic leading-relaxed text-coal/60">
                        {kunde.notiz}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-2 text-[11px] text-coal/40">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Mockup-Demo · Daten aus mockData.ts
      </div>
    </div>
  )
}
