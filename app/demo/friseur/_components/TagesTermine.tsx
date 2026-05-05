import type { Termin, Kunde } from '@/lib/mockData'

/**
 * TagesTermine — chronologische Timeline des Arbeitstages.
 *
 * Dark-Mode: bg-surface statt bg-white/60, bg-surface/40 statt bg-white/40.
 * JETZT-Linie mit bone/10 Trennstrichen.
 * Server Component.
 */

export type TerminEintrag = {
  termin: Termin
  kunde: Kunde
  istNaechster: boolean
}

export function TagesTermine({
  eintraege,
  jetztUhrzeit,
}: {
  eintraege: TerminEintrag[]
  jetztUhrzeit: string
}) {
  const vergangenheit = eintraege.filter(
    (e) => e.termin.status === 'abgeschlossen' || e.termin.status === 'walkin',
  )
  const zukunft = eintraege.filter((e) => e.termin.status === 'geplant')

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3 label-caps text-gold">
        <span className="h-px w-6 bg-gold" />
        Heute
      </div>

      <div className="space-y-2">
        {vergangenheit.map((eintrag) => (
          <TerminZeile key={eintrag.termin.id} eintrag={eintrag} gedimmt />
        ))}

        {/* JETZT-Trennlinie */}
        <div className="flex items-center gap-3 py-3">
          <div className="h-px flex-1 bg-bone/10" />
          <span className="rounded-full border border-bone/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-coal/50">
            Jetzt {jetztUhrzeit}
          </span>
          <div className="h-px flex-1 bg-bone/10" />
        </div>

        {zukunft.map((eintrag) => (
          <TerminZeile key={eintrag.termin.id} eintrag={eintrag} />
        ))}
      </div>
    </section>
  )
}

function TerminZeile({
  eintrag,
  gedimmt = false,
}: {
  eintrag: TerminEintrag
  gedimmt?: boolean
}) {
  const { termin, kunde, istNaechster } = eintrag
  const zeitFormatiert = termin.start.slice(11, 16)

  return (
    <article
      className={`rounded-2xl border p-4 transition-all ${
        istNaechster
          ? 'border-gold/40 bg-gold/8 shadow-[0_0_0_1px_rgba(201,168,76,0.12)]'
          : gedimmt
            ? 'border-bone/8 bg-surface/40'
            : 'border-bone/10 bg-surface'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Zeit-Spalte */}
        <div className="w-12 flex-shrink-0 pt-0.5">
          <div
            className={`text-sm font-semibold tabular-nums ${
              gedimmt ? 'text-coal/40' : 'text-ink'
            }`}
          >
            {zeitFormatiert}
          </div>
          <div
            className={`mt-0.5 text-[11px] tabular-nums ${
              gedimmt ? 'text-coal/30' : 'text-coal/50'
            }`}
          >
            {termin.dauer_min} Min
          </div>
        </div>

        {/* Kunden-Avatar */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={kunde.foto}
          alt={kunde.name}
          className={`h-9 w-9 flex-shrink-0 rounded-full border object-cover ${
            gedimmt ? 'border-bone/8 opacity-50' : 'border-bone/15'
          }`}
        />

        {/* Inhalt */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <span
              className={`text-sm font-medium leading-tight ${
                gedimmt ? 'text-coal/50' : 'text-ink'
              }`}
            >
              {kunde.name}
            </span>
            <StatusBadge status={termin.status} istNaechster={istNaechster} />
          </div>
          <p className={`text-xs ${gedimmt ? 'text-coal/35' : 'text-coal/60'}`}>
            {termin.leistung}
          </p>
          <p
            className={`truncate text-[11px] italic ${
              gedimmt ? 'text-coal/25' : 'text-coal/45'
            }`}
          >
            „{kunde.notiz}"
          </p>
        </div>
      </div>
    </article>
  )
}

function StatusBadge({
  status,
  istNaechster,
}: {
  status: Termin['status']
  istNaechster: boolean
}) {
  if (istNaechster) {
    return (
      <span className="flex-shrink-0 rounded-full bg-gold/20 px-2.5 py-0.5 text-[11px] font-semibold text-gold">
        Als nächstes
      </span>
    )
  }
  if (status === 'walkin') {
    return (
      <span className="flex-shrink-0 rounded-full bg-gold/10 px-2.5 py-0.5 text-[11px] font-semibold text-gold/80">
        Walk-In
      </span>
    )
  }
  if (status === 'abgeschlossen') {
    return (
      <span className="flex-shrink-0 rounded-full bg-bone/8 px-2.5 py-0.5 text-[11px] font-medium text-coal/45">
        ✓ Erledigt
      </span>
    )
  }
  return null
}
