import { BuchungsHeader } from './_components/BuchungsHeader'
import { SchnellSlots } from './_components/SchnellSlots'
import { BuchungsKalender } from './_components/BuchungsKalender'
import { ConversionTeaser } from './_components/ConversionTeaser'

/**
 * Termin-Buchungsscreen — Marco Ferretti (Termin-Modus).
 *
 * Demo-Screen: Ein Friseur, keine API, keine Server Actions.
 * Layout (bg-snippt-bg, font-body, snippt-grain) kommt vom Eltern-Layout.
 * Interaktive Elemente (Slot-Auswahl, Tag-Picker) sind Client Components.
 */
export default function BuchenPage() {
  return (
    <>
      {/* Hintergrund-Glow — indigo links oben, cyan rechts */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(60% 45% at 18% 4%, rgba(84,104,255,.20), transparent 60%),' +
            'radial-gradient(50% 40% at 88% 16%, rgba(43,231,255,.13), transparent 60%),' +
            'linear-gradient(180deg,#08080B,#0C0C12)',
        }}
      />

      {/* Seiteninhalt */}
      <div className="relative z-[1] mx-auto w-full max-w-md px-5 pb-12 pt-12">
        <div className="space-y-8">
          {/* Friseur-Header + Hinweis-Banner */}
          <BuchungsHeader />

          {/* Schnell-Slots: nächste freie Termine als Chips */}
          <SchnellSlots />

          {/* Kalender: Tag wählen + Uhrzeit wählen */}
          <BuchungsKalender />

          {/* Stammkunden-Teaser */}
          <ConversionTeaser />

          {/* Primäre CTA — Gradient-Button */}
          <button
            type="button"
            className="w-full rounded-[16px] py-[17px] text-[16px] font-semibold text-[#070710] transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(100deg,#2BE7FF,#5468FF)',
              boxShadow: '0 12px 34px -10px rgba(84,104,255,.8), inset 0 0 0 1px rgba(255,255,255,.12)',
            }}
          >
            Termin bestätigen
          </button>
        </div>
      </div>
    </>
  )
}
