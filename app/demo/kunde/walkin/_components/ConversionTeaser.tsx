/**
 * ConversionTeaser — Soft-Account-Teaser am Ende des Screens.
 *
 * Kernbotschaft: Konto anlegen, um benachrichtigt zu werden wenn du fast dran bist.
 * Kein Zwang — sanfte Einladung.
 *
 * Snippt-v1-Design (dunkel, Glow-Palette). Server Component.
 */
export function ConversionTeaser() {
  return (
    <section
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: 'rgba(84,104,255,.07)',
        boxShadow: '0 0 0 1px rgba(84,104,255,.18)',
      }}
    >
      <div className="space-y-1.5">
        <p className="text-[14px] font-semibold text-snippt-ink leading-snug">
          Nie wieder verpassen, wenn du fast dran bist
        </p>
        <p className="text-[13px] leading-relaxed text-snippt-muted">
          Konto anlegen — Snippt benachrichtigt dich, bevor du dran bist.
          Kein Anruf, kein Warten vor der Tür.
        </p>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center rounded-xl border border-snippt-glow1/40 px-4 py-3 text-[13px] font-semibold text-snippt-glow2 transition-colors hover:border-snippt-glow1/70 hover:bg-snippt-glow1/10"
      >
        Konto in 10 Sekunden anlegen
      </button>
    </section>
  )
}
