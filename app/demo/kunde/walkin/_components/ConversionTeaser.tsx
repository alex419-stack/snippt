/**
 * ConversionTeaser — Soft-Account-Teaser am Ende des Screens.
 *
 * Kernbotschaft: App merkt sich den Stammfriseur und den üblichen Schnitt —
 * Konto anlegen ist eine Einladung, kein Zwang.
 * Nur visuell im Demo — kein Link.
 * Server Component.
 */
export function ConversionTeaser({ friseurName }: { friseurName: string }) {
  return (
    <section className="rounded-2xl border border-gold/20 bg-gold/5 p-5 space-y-4">
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-ink">
          {friseurName} merkt sich deinen Schnitt
        </p>
        <p className="text-sm leading-relaxed text-coal/65">
          Konto anlegen — beim nächsten Besuch direkt zu deinem Friseur.
          Kein Anruf, kein Warten.
        </p>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-85"
      >
        Konto in 10 Sekunden anlegen
      </button>
    </section>
  )
}
