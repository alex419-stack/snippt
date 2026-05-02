import Link from 'next/link'
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Zap,
  ChevronRight,
} from 'lucide-react'
import { friseure, termine } from '@/lib/mockData'

/**
 * Walk-In Live-Status — Hi-Fi Mockup
 *
 * Demo-Datum: Sa 02.05.2026, Demo-Uhrzeit: ~11:00 Uhr (hardcoded)
 * Mobile-First, max-w-sm zentriert.
 * Server Component — keine Client-Interaktivität.
 *
 * Status-Logik (hardcoded, glaubwürdig):
 *   - Marco (f1): letzter Termin 09:00–09:20 (abgeschlossen), nächster um 14:30 → Verfügbar
 *   - Sophie (f2): Termin t44 10:00–10:45 (Damenschnitt 45 min) → noch ~20 min → Wartezeit
 *   - Jonas (f3): Termin t45 10:30–11:00 (30 min) → gerade fertig → Verfügbar (Walk-In-Favorit)
 */

const DEMO_DATUM = '2026-05-02'

type LiveStatus = {
  typ: 'verfuegbar' | 'wartezeit' | 'ausgelastet'
  label: string
  subLabel?: string
  dotFarbe: string
  badgeFarbe: string
}

// Hardcodierte Status pro Friseur (Mockup, glaubwürdig basierend auf Termindaten)
const liveStatusMap: Record<string, LiveStatus> = {
  f1: {
    typ: 'verfuegbar',
    label: 'Verfügbar',
    subLabel: 'Nächster Termin um 14:30',
    dotFarbe: 'bg-emerald-500',
    badgeFarbe: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  f2: {
    typ: 'wartezeit',
    label: '~20 Min Wartezeit',
    subLabel: 'Termin läuft noch',
    dotFarbe: 'bg-amber-400',
    badgeFarbe: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  f3: {
    typ: 'verfuegbar',
    label: 'Verfügbar',
    subLabel: 'Gerade freigeworden',
    dotFarbe: 'bg-emerald-500',
    badgeFarbe: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
}

// Friseur mit höchstem walk_in_magnet_score
const walkInFavorit = friseure.reduce((a, b) =>
  a.walk_in_magnet_score > b.walk_in_magnet_score ? a : b
)

export default function WalkinPage() {
  // Termine des Tages
  const tagesTermine = termine.filter((t) => t.start.startsWith(DEMO_DATUM))

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

      {/* ── Salon-Header ── */}
      <div className="overflow-hidden rounded-2xl border border-coal/10 bg-white shadow-sm">
        <div className="h-1 w-full bg-gradient-to-r from-ink/80 via-ink to-ink/60" />
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-sans text-xl font-semibold tracking-tight text-ink">
                Mein Friseur
              </h1>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-coal/60">
                <MapPin className="h-3 w-3 shrink-0" />
                Kurfürstenstr. 45, Berlin
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-coal/60">
                <Clock className="h-3 w-3 shrink-0" />
                Heute 09:00 – 19:00 Uhr
              </div>
            </div>
            {/* Demo-Uhrzeit */}
            <div className="rounded-xl bg-bone px-3 py-2 text-right">
              <div className="font-sans text-lg font-semibold tabular-nums text-ink">
                11:00
              </div>
              <div className="text-[10px] text-coal/50">Sa 02.05.</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Highlight-Box: Walk-In-Favorit ── */}
      <div className="flex items-center gap-3.5 overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-gold/5 px-4 py-4 shadow-sm">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/20">
          <Zap className="h-4 w-4 text-gold" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-sans text-[14px] font-semibold text-ink">
            Schnell rein?{' '}
            <span className="text-gold">
              {walkInFavorit.name.split(' ')[0]}
            </span>{' '}
            ist jetzt frei
          </div>
          <div className="text-xs text-coal/60">
            {walkInFavorit.spezialitaet} · Walk-In-Favorit
          </div>
        </div>
        <div className="flex h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
      </div>

      {/* ── Friseur-Status-Karten ── */}
      <div className="space-y-2">
        <div className="px-1 text-[11px] font-medium uppercase tracking-[0.16em] text-coal/50">
          Live-Status · {tagesTermine.length} Termine heute
        </div>

        {friseure.map((friseur) => {
          const status = liveStatusMap[friseur.id]
          const istFavorit = friseur.id === walkInFavorit.id
          const istVerfuegbar = status.typ === 'verfuegbar'

          return (
            <div
              key={friseur.id}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
                istFavorit
                  ? 'border-gold/30 ring-1 ring-gold/20'
                  : 'border-coal/10'
              }`}
            >
              {istFavorit && (
                <div className="h-0.5 w-full bg-gradient-to-r from-gold/60 via-gold to-gold/40" />
              )}
              <div className="p-4">
                <div className="flex items-start gap-3.5">
                  {/* Friseur-Foto */}
                  <div className="relative shrink-0">
                    <div
                      className="h-14 w-14 rounded-full bg-cover bg-center ring-1 ring-coal/15"
                      style={{ backgroundImage: `url(${friseur.foto})` }}
                    />
                    {/* Live-Dot */}
                    <span
                      className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full ring-2 ring-white ${status.dotFarbe}`}
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-[15px] font-semibold text-ink">
                            {friseur.name}
                          </span>
                          {istFavorit && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/12 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-gold">
                              <Zap className="h-2.5 w-2.5" strokeWidth={2.5} />
                              Walk-In
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-coal/60">
                          {friseur.spezialitaet}
                        </div>
                      </div>
                      {/* Status-Badge */}
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${status.badgeFarbe}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${status.dotFarbe}`}
                        />
                        {status.label}
                      </span>
                    </div>

                    {/* Sub-Label */}
                    {status.subLabel && (
                      <div className="mt-1 text-[11px] text-coal/50">
                        {status.subLabel}
                      </div>
                    )}

                    {/* Trust-Signale */}
                    <div className="mt-3 flex items-center gap-3 border-t border-coal/8 pt-3">
                      {/* Bewertung */}
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-gold text-gold" />
                        <span className="text-xs font-semibold text-ink">
                          {friseur.social_proof.bewertung_durchschnitt}
                        </span>
                        <span className="text-[10px] text-coal/50">
                          ({friseur.social_proof.bewertung_anzahl})
                        </span>
                      </div>

                      <div className="h-2.5 w-px bg-coal/15" />

                      {/* Stammkunden-Anteil */}
                      <div className="text-[10px] text-coal/55">
                        {Math.round(friseur.stammkunden_anteil * 100)}%
                        Stammkunden
                      </div>

                      <div className="h-2.5 w-px bg-coal/15" />

                      {/* Walk-In-Magnet Indikator */}
                      <div className="flex items-center gap-1.5">
                        <div className="relative h-1 w-12 overflow-hidden rounded-full bg-coal/10">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-gold/70"
                            style={{
                              width: `${friseur.walk_in_magnet_score * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-coal/50">
                          Walk-In
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Express-Buchen CTA — nur für verfügbare Friseure */}
                {istVerfuegbar && (
                  <Link
                    href="/demo/kunde/buchen"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-bone transition-all hover:bg-ink/85"
                  >
                    <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Express bei {friseur.name.split(' ')[0]} buchen
                    <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                  </Link>
                )}

                {/* Wartezeit CTA — nur für Wartezeit-Status */}
                {status.typ === 'wartezeit' && (
                  <Link
                    href="/demo/kunde/buchen"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-coal/15 bg-bone px-4 py-2.5 text-sm font-medium text-coal/75 transition-all hover:border-coal/25 hover:text-ink"
                  >
                    Termin für später buchen
                    <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="pt-2 text-center text-[11px] text-coal/40">
        Live-Status aktualisiert um 11:00 · Demo-Daten
      </div>
    </div>
  )
}
