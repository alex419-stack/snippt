import {
  Scissors,
  UserPlus,
  Sparkles,
  CalendarCheck,
  Star,
} from 'lucide-react'
import type { ComponentType } from 'react'

/**
 * AktivitaetsFeed — letzte Demo-Events als kompakte Liste.
 *
 * Dark-Mode: bg-surface statt bg-white, hover:bg-bone/5 statt hover:bg-bone/60.
 * text-gold statt text-emerald-700 (auf dunklem BG lesbar + Design-System-konsistent).
 * Server Component.
 */

type EventTyp = 'termin' | 'walkin' | 'stammkunde' | 'meilenstein' | 'feedback'

type FeedEvent = {
  id: string
  typ: EventTyp
  text: string
  zeit: string
}

const EVENTS: FeedEvent[] = [
  {
    id: 'e1',
    typ: 'termin',
    text: 'Marco hat 09:30-Termin abgeschlossen — Thomas Brandt',
    zeit: 'vor 8 Min',
  },
  {
    id: 'e2',
    typ: 'walkin',
    text: 'Neue Walk-In-Buchung bei Jonas — 10:30',
    zeit: 'vor 22 Min',
  },
  {
    id: 'e3',
    typ: 'stammkunde',
    text: 'Sophie: 3 neue Stammkunden diese Woche',
    zeit: 'heute, 09:12',
  },
  {
    id: 'e4',
    typ: 'feedback',
    text: 'Marco hat eine 5-Sterne-Bewertung erhalten',
    zeit: 'gestern, 18:45',
  },
  {
    id: 'e5',
    typ: 'meilenstein',
    text: 'Jonas erreicht 30-Tage-Hoch bei Walk-Ins',
    zeit: 'gestern, 17:02',
  },
  {
    id: 'e6',
    typ: 'termin',
    text: 'Sophie hat Color-Termin abgeschlossen — Anna Reinhardt',
    zeit: 'gestern, 13:10',
  },
  {
    id: 'e7',
    typ: 'walkin',
    text: 'Walk-In bei Marco — Bartpflege spontan',
    zeit: 'gestern, 11:32',
  },
]

const ICONS: Record<EventTyp, ComponentType<{ className?: string }>> = {
  termin: CalendarCheck,
  walkin: Sparkles,
  stammkunde: UserPlus,
  meilenstein: Scissors,
  feedback: Star,
}

const ICON_FARBEN: Record<EventTyp, string> = {
  termin:      'text-coal/70',
  walkin:      'text-gold',
  stammkunde:  'text-gold/70',  // gold/70 statt emerald-700 — auf Dark lesbar
  meilenstein: 'text-ink',
  feedback:    'text-gold',
}

export function AktivitaetsFeed() {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-bone/10 bg-surface p-6">
      <header className="mb-4 space-y-1.5">
        <h2 className="text-h3 text-ink">
          Aktivität
        </h2>
        <p className="text-sm text-coal/65">Letzte Ereignisse im Salon</p>
      </header>

      <ol className="flex-1 space-y-1">
        {EVENTS.map((e) => {
          const Icon = ICONS[e.typ]
          return (
            <li
              key={e.id}
              className="-mx-2 flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-bone/5"
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bone/8">
                <Icon className={`h-3.5 w-3.5 ${ICON_FARBEN[e.typ]}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] leading-snug text-ink">{e.text}</p>
                <p className="mt-0.5 text-[11px] text-coal/50">{e.zeit}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
