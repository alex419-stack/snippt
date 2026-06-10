/**
 * ConversionTeaser — Stammkunde-CTA am Ende des Termin-Buchungsscreens.
 * Dark/Glow-Design. Rein presentational.
 */
export function ConversionTeaser() {
  return (
    <div
      className="rounded-[16px] border border-snippt-glow2/25 p-5"
      style={{
        background: 'radial-gradient(120% 90% at 50% 0%, rgba(43,231,255,.10), transparent 60%), rgba(20,20,32,.8)',
      }}
    >
      {/* Label */}
      <span className="text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
        Stammkunde werden
      </span>

      <p className="mt-2 text-[15px] font-semibold leading-snug text-snippt-ink">
        Beim nächsten Mal ist Marco vorgemerkt.
      </p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-snippt-muted">
        Konto anlegen — Marco kennt deinen Schnitt, du überspringst die Auswahl,
        und dein Platz ist sofort bestätigt.
      </p>

      <button
        type="button"
        className="mt-4 w-full rounded-[14px] px-4 py-[13px] text-[14px] font-semibold text-snippt-faint transition-colors hover:text-snippt-muted border border-white/[0.08] bg-white/[0.02]"
      >
        Konto anlegen — kostenlos
      </button>
    </div>
  )
}
