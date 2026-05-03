import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react'
import type { Friseur } from '@/lib/mockData'

/**
 * WettbewerbsMatrix — Hauptdarsteller der Salonchef-Sicht.
 *
 * Dark-Mode-Anpassungen:
 *   - bg-surface statt bg-white
 *   - Bar-Track: bg-bone/8 (helles Geist-Weiß bei 8% auf dunkler Surface)
 *   - Bar-Füllung: bg-ink (= Off-White im Dark Mode)
 *   - Trend "wachsend": text-whiskey statt text-emerald-700 (Anti-Toxizität + Dark-Lesbarkeit)
 *   - hover:bg-bone/5 (subtiler Hover-Tint auf dunkler Surface)
 *
 * Anti-Toxizitäts-Rahmung: kein Ranking, kein Rot.
 * Server Component.
 */

type FriseurMitAuslastung = Friseur & {
  auslastung_woche: number
}

export function WettbewerbsMatrix({
  friseure,
}: {
  friseure: FriseurMitAuslastung[]
}) {
  const maxWalkIn = Math.max(...friseure.map((f) => f.walk_in_magnet_score))

  return (
    <section className="space-y-6">
      <header className="flex items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h2 className="text-h2 text-ink">
            Wo unterstützt du dein Team?
          </h2>
          <p className="text-sm text-coal/65">
            Auslastung, Stammkundenbindung und Walk-In-Anziehung pro
            Friseur — ohne Rangliste, dafür mit Coaching-Blick.
          </p>
        </div>
        <div className="hidden text-xs font-medium uppercase tracking-[0.16em] text-coal/45 lg:block">
          Diese Woche
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-bone/10 bg-surface">
        {/* Tabellen-Header (nur Desktop) */}
        <div className="hidden grid-cols-[2.4fr_1.4fr_1.4fr_1.6fr_1fr] gap-6 border-b border-bone/10 px-6 py-3.5 text-[10.5px] font-medium uppercase tracking-[0.16em] text-coal/50 lg:grid">
          <div>Friseur</div>
          <div>Auslastung</div>
          <div>Stammkundenanteil</div>
          <div>Walk-In-Magnet</div>
          <div>30-Tage-Trend</div>
        </div>

        {/* Zeilen */}
        <div className="divide-y divide-bone/10">
          {friseure.map((f) => (
            <FriseurZeile
              key={f.id}
              friseur={f}
              istWalkInSpitzenreiter={f.walk_in_magnet_score === maxWalkIn}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function FriseurZeile({
  friseur,
  istWalkInSpitzenreiter,
}: {
  friseur: FriseurMitAuslastung
  istWalkInSpitzenreiter: boolean
}) {
  return (
    <div
      className="group grid cursor-pointer grid-cols-1 gap-5 px-6 py-5 transition-colors duration-150 hover:bg-bone/5 lg:grid-cols-[2.4fr_1.4fr_1.4fr_1.6fr_1fr] lg:items-center lg:gap-6"
      title="Klick öffnet Friseur-Detail (im Mockup deaktiviert)"
    >
      {/* Identität */}
      <div className="flex items-center gap-4">
        <div
          aria-hidden
          className="h-12 w-12 shrink-0 rounded-full bg-cover bg-center ring-1 ring-bone/15"
          style={{ backgroundImage: `url(${friseur.foto})` }}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate font-sans text-[15px] font-semibold text-ink">
              {friseur.name}
            </div>
          </div>
          <div className="truncate text-xs text-coal/65">
            {friseur.spezialitaet} · {friseur.jahre_erfahrung} J. Erfahrung
          </div>
        </div>
      </div>

      {/* Auslastung */}
      <KennzahlBar
        wertProzent={Math.round(friseur.auslastung_woche * 100)}
        mobileLabel="Auslastung"
      />

      {/* Stammkundenanteil */}
      <KennzahlBar
        wertProzent={Math.round(friseur.stammkunden_anteil * 100)}
        mobileLabel="Stammkunden"
      />

      {/* Walk-In-Magnet */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-coal/55 lg:hidden">
          Walk-In-Magnet
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-bone/8">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-bone/85"
              style={{ width: `${friseur.walk_in_magnet_score * 100}%` }}
            />
          </div>
          <div className="text-[12px] font-medium tabular-nums text-coal/75">
            {friseur.walk_in_magnet_score.toFixed(2)}
          </div>
          {istWalkInSpitzenreiter && (
            <span
              className="inline-flex items-center gap-1 rounded-full border border-whiskey/40 bg-whiskey/12 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.12em] text-whiskey"
              title="Stärkste Walk-In-Anziehung im Team"
            >
              <Sparkles className="h-3 w-3" strokeWidth={2.25} />
              Spitze
            </span>
          )}
        </div>
      </div>

      {/* Trend */}
      <TrendIndikator trend={friseur.trend_30_tage} />
    </div>
  )
}

function KennzahlBar({
  wertProzent,
  mobileLabel,
}: {
  wertProzent: number
  mobileLabel: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-coal/55 lg:hidden">
        {mobileLabel}
      </div>
      <div className="flex items-center gap-2.5">
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-bone/8">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-ink"
            style={{ width: `${wertProzent}%` }}
          />
        </div>
        <div className="w-9 text-right text-[12px] font-medium tabular-nums text-coal/75">
          {wertProzent}%
        </div>
      </div>
    </div>
  )
}

function TrendIndikator({
  trend,
}: {
  trend: 'wachsend' | 'stabil' | 'schrumpfend'
}) {
  const config = {
    wachsend: {
      Icon: TrendingUp,
      label: 'Wachsend',
      // gold statt emerald-700 — auf dunklem BG lesbar + im Design-System
      farbe: 'text-whiskey',
    },
    stabil: {
      Icon: Minus,
      label: 'Stabil',
      farbe: 'text-coal/65',
    },
    schrumpfend: {
      Icon: TrendingDown,
      label: 'Rückläufig',
      farbe: 'text-coal/55',
    },
  }[trend]

  const Icon = config.Icon
  return (
    <div
      className={`inline-flex items-center gap-1.5 text-[12.5px] font-medium ${config.farbe}`}
    >
      <Icon className="h-4 w-4" strokeWidth={2.25} />
      <span>{config.label}</span>
    </div>
  )
}
