/**
 * StammfriseurKarte — Hero-Karte für Marco's Live-Warteschlangen-Status.
 *
 * Zeigt: Anzahl Wartender, Statuszeile, CTA "Jetzt anstellen".
 * Nach dem Anstellen: Positionsanzeige "Du bist #3 · 2 vor dir".
 *
 * Snippt-v1-Design (dunkel, Glow-Palette). Server Component.
 */

export type WarteschlangenStatus =
  | { typ: 'offen'; wartend: number }
  | { typ: 'angestellt'; position: number; vorDir: number }

export function StammfriseurKarte({
  status,
}: {
  status: WarteschlangenStatus
}) {
  const istAngestellt = status.typ === 'angestellt'

  return (
    <section>
      <article
        className="rounded-2xl p-5 space-y-5"
        style={{
          background: 'radial-gradient(140% 100% at 50% 0%, rgba(43,231,255,.09) 0%, rgba(84,104,255,.07) 40%, transparent 70%), #141420',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.06), 0 0 0 1px rgba(255,255,255,.07)',
        }}
      >
        {/* Status-Block */}
        {istAngestellt ? (
          /* ── Angestellt: Positions-Anzeige ── */
          <div className="text-center space-y-3 py-2">
            <div className="text-[11px] uppercase tracking-[0.16em] text-snippt-glow2 mb-1">
              Du stehst in der Reihe
            </div>

            {/* Große Positionszahl */}
            <div
              className="font-display text-[72px] font-semibold leading-none tabular-nums"
              style={{
                background: 'linear-gradient(160deg,#2BE7FF,#5468FF)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              #{(status as { typ: 'angestellt'; position: number; vorDir: number }).position}
            </div>

            {/* Beschreibungszeile */}
            <p className="text-[15px] font-medium text-snippt-ink">
              {(status as { typ: 'angestellt'; position: number; vorDir: number }).vorDir === 1
                ? '1 Person vor dir'
                : `${(status as { typ: 'angestellt'; position: number; vorDir: number }).vorDir} Personen vor dir`}
            </p>
            <p className="text-[12px] text-snippt-muted">
              Wir sagen dir Bescheid, wenn du fast dran bist.
            </p>
          </div>
        ) : (
          /* ── Noch nicht angestellt: Warten-Zahl + CTA ── */
          <div className="space-y-4">
            {/* Wartende */}
            <div className="flex items-end gap-3">
              <span
                className="font-display text-[56px] font-semibold leading-none tabular-nums"
                style={{
                  background: 'linear-gradient(160deg,#2BE7FF,#5468FF)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {(status as { typ: 'offen'; wartend: number }).wartend}
              </span>
              <div className="pb-2 space-y-0.5">
                <p className="text-[15px] font-semibold text-snippt-ink leading-tight">
                  warten gerade
                </p>
                <p className="text-[12px] text-snippt-muted">
                  frei in ca.{' '}
                  {(status as { typ: 'offen'; wartend: number }).wartend} Schnitten
                </p>
              </div>
            </div>

            {/* Trennlinie */}
            <div className="border-t border-white/[0.06]" />

            {/* CTA */}
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-[15px] font-semibold transition-opacity hover:opacity-85"
              style={{
                background: 'linear-gradient(100deg,#2BE7FF,#5468FF)',
                color: '#070710',
              }}
            >
              Jetzt anstellen
            </button>
          </div>
        )}
      </article>
    </section>
  )
}
