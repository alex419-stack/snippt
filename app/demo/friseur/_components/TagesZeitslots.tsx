import type { TerminEintrag } from './TagesTermine'

/**
 * TagesZeitslots — Vertikale Zeitraster-Ansicht für den Arbeitstag.
 *
 * Zeigt Stunden-Marker (9–19 Uhr), Termine an ihrer Position und
 * die JETZT-Linie. Ersetzt TagesTermine auf der Friseur-Page.
 * Server Component.
 */
export function TagesZeitslots({
  eintraege,
  jetztUhrzeit,
}: {
  eintraege: TerminEintrag[]
  jetztUhrzeit: string
}) {
  // Alle Stunden 9–19 als Marker-Timestamps (HH:00)
  const stundenISOs = Array.from({ length: 11 }, (_, i) => {
    const h = (9 + i).toString().padStart(2, '0')
    return `${h}:00`
  })

  // Termine nach Uhrzeit sortiert (HH:MM aus ISO extrahiert)
  const sortiert = [...eintraege].sort((a, b) =>
    a.termin.start.slice(11, 16).localeCompare(b.termin.start.slice(11, 16)),
  )

  // Alle dargestellten Uhrzeiten sammeln und in Reihenfolge rendern
  type Item =
    | { typ: 'stunde'; uhrzeit: string }
    | { typ: 'termin'; eintrag: TerminEintrag }
    | { typ: 'jetzt'; uhrzeit: string }

  const items: (Item & { sortKey: string })[] = []

  // Stunden-Marker
  for (const u of stundenISOs) {
    items.push({ typ: 'stunde', uhrzeit: u, sortKey: u + '_a' })
  }

  // Termine
  for (const e of sortiert) {
    const uhrzeit = e.termin.start.slice(11, 16)
    items.push({ typ: 'termin', eintrag: e, sortKey: uhrzeit + '_b' })
  }

  // JETZT-Linie (nur wenn sie zwischen 9 und 19 liegt)
  if (jetztUhrzeit >= '09:00' && jetztUhrzeit <= '19:00') {
    items.push({ typ: 'jetzt', uhrzeit: jetztUhrzeit, sortKey: jetztUhrzeit + '_c' })
  }

  items.sort((a, b) => a.sortKey.localeCompare(b.sortKey))

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3 label-caps text-whiskey">
        <span className="h-px w-6 bg-whiskey" />
        Heute
      </div>

      <div className="space-y-0">
        {items.map((item, idx) => {
          if (item.typ === 'stunde') {
            return (
              <StundenMarker key={`h-${item.uhrzeit}`} uhrzeit={item.uhrzeit} />
            )
          }
          if (item.typ === 'jetzt') {
            return <JetztLinie key="jetzt" uhrzeit={item.uhrzeit} />
          }
          // typ === 'termin'
          const e = (item as Extract<Item, { typ: 'termin' }> & { sortKey: string }).eintrag
          return (
            <TerminBlock
              key={e.termin.id}
              eintrag={e}
            />
          )
        })}
      </div>
    </section>
  )
}

function StundenMarker({ uhrzeit }: { uhrzeit: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="w-10 flex-shrink-0 text-right text-[11px] tabular-nums text-coal/35">
        {uhrzeit}
      </span>
      <div className="h-px flex-1 bg-bone/8" />
    </div>
  )
}

function JetztLinie({ uhrzeit }: { uhrzeit: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="w-10 flex-shrink-0 text-right text-[11px] tabular-nums text-whiskey">
        {uhrzeit}
      </span>
      <div className="h-px flex-1 bg-whiskey/40" />
      <span className="flex-shrink-0 rounded-full border border-whiskey/30 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-whiskey/80">
        Jetzt
      </span>
    </div>
  )
}

function TerminBlock({ eintrag }: { eintrag: TerminEintrag }) {
  const { termin, kunde, istNaechster } = eintrag
  const uhrzeit = termin.start.slice(11, 16)
  const gedimmt = termin.status === 'abgeschlossen' || termin.status === 'walkin'

  const karteKlasse = istNaechster
    ? 'border-whiskey/40 bg-whiskey/8 shadow-[0_0_0_1px_rgba(139,94,60,0.12)]'
    : gedimmt
      ? 'border-bone/8 bg-surface/40'
      : 'border-bone/10 bg-surface'

  return (
    <div className="flex items-start gap-3 py-1">
      {/* Zeit */}
      <span
        className={`w-10 flex-shrink-0 pt-3.5 text-right text-[11px] font-semibold tabular-nums ${
          gedimmt ? 'text-coal/35' : 'text-coal/60'
        }`}
      >
        {uhrzeit}
      </span>

      {/* Karte */}
      <article className={`flex-1 rounded-xl border p-3 ${karteKlasse}`}>
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={kunde.foto}
            alt={kunde.name}
            className={`h-7 w-7 flex-shrink-0 rounded-full border object-cover ${
              gedimmt ? 'border-bone/8 opacity-50' : 'border-bone/15'
            }`}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`truncate text-sm font-medium ${
                  gedimmt ? 'text-coal/45' : 'text-ink'
                }`}
              >
                {kunde.name}
              </span>
              <StatusBadge status={termin.status} istNaechster={istNaechster} />
            </div>
            <p className={`text-xs ${gedimmt ? 'text-coal/30' : 'text-coal/55'}`}>
              {termin.leistung} · {termin.dauer_min} Min
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}

function StatusBadge({
  status,
  istNaechster,
}: {
  status: 'geplant' | 'walkin' | 'abgeschlossen'
  istNaechster: boolean
}) {
  if (istNaechster) {
    return (
      <span className="flex-shrink-0 rounded-full bg-whiskey/20 px-2 py-0.5 text-[10px] font-semibold text-whiskey">
        Als nächstes
      </span>
    )
  }
  if (status === 'walkin') {
    return (
      <span className="flex-shrink-0 rounded-full bg-whiskey/10 px-2 py-0.5 text-[10px] font-semibold text-whiskey/80">
        Walk-In
      </span>
    )
  }
  if (status === 'abgeschlossen') {
    return (
      <span className="flex-shrink-0 rounded-full bg-bone/8 px-2 py-0.5 text-[10px] font-medium text-coal/40">
        ✓
      </span>
    )
  }
  return null
}
