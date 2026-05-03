/**
 * ConversionTeaser — Soft-Account-Teaser am Ende des Buchungsscreens.
 * Analog zu walkin/ConversionTeaser, aber spezifisch auf "nach Buchung" zugeschnitten.
 * Server Component.
 */
export function ConversionTeaser({ friseurVorname }: { friseurVorname: string }) {
  return (
    <section className="rounded-2xl border border-whiskey/20 bg-whiskey/5 p-5 space-y-4">
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-ink">
          {friseurVorname} merkt sich deinen Schnitt
        </p>
        <p className="text-sm leading-relaxed text-coal/65">
          Konto anlegen — bei deiner nächsten Buchung ist {friseurVorname} vorausgewählt,
          dein Schnitt bekannt, kein Anruf nötig.
        </p>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center rounded-xl bg-whiskey px-4 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-85"
      >
        Konto in 10 Sekunden anlegen
      </button>
    </section>
  )
}
