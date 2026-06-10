import { Star } from 'lucide-react'

/**
 * MeinBrandKarte — Personalbranding-Karte für Marco.
 * Dark/Glow-Design (SG2-Palette). Statischer Mock-Inhalt.
 * Server Component.
 */

type BrandDaten = {
  name: string
  foto: string
  spezialitaet: string
  bio: string
  jahreDerErfahrung: number
  bewertung: number
  bewertungAnzahl: number
  stammkundenProzent: number
  stilTags: string[]
  socialProofSatz: string
}

export function MeinBrandKarte({ daten }: { daten: BrandDaten }) {
  return (
    <section className="space-y-3">
      {/* Abschnitt-Label */}
      <div className="text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
        Mein Brand
      </div>

      {/* Karte */}
      <article
        className="rounded-2xl border border-white/[0.07] bg-snippt-surface p-5 space-y-4"
        style={{
          backgroundImage:
            'radial-gradient(90% 80% at 100% 0%, rgba(43,231,255,.06), transparent 60%)',
        }}
      >
        {/* Profil-Zeile */}
        <div className="flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={daten.foto}
            alt={daten.name}
            className="h-[60px] w-[60px] flex-shrink-0 rounded-xl border border-white/[0.08] object-cover"
          />
          <div className="min-w-0 space-y-[5px]">
            <h2 className="font-display text-[18px] font-semibold leading-tight tracking-tight text-snippt-ink">
              {daten.name}
            </h2>
            <p className="text-[13px] text-snippt-muted">{daten.spezialitaet}</p>
            {/* Stil-Tags */}
            <div className="flex flex-wrap gap-[6px] pt-[2px]">
              {daten.stilTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-white/[0.08] bg-snippt-surface2 px-[9px] py-[3px] text-[11px] text-snippt-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-[13px] leading-relaxed text-snippt-muted">
          {daten.bio}
        </p>

        {/* Social-Proof-Satz */}
        <p className="text-[12px] italic leading-relaxed text-snippt-faint">
          „{daten.socialProofSatz}"
        </p>

        {/* Trennlinie */}
        <div className="border-t border-white/[0.06]" />

        {/* Kennzahlen */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <StatBlock
            wert={`${daten.jahreDerErfahrung} J.`}
            label="Erfahrung"
          />
          <StatBlock
            wert={String(daten.bewertung)}
            label={`${daten.bewertungAnzahl} Bew.`}
            stern
          />
          <StatBlock
            wert={`${daten.stammkundenProzent}%`}
            label="Stammkunden"
            akzentGlow
          />
        </div>
      </article>
    </section>
  )
}

function StatBlock({
  wert,
  label,
  stern = false,
  akzentGlow = false,
}: {
  wert: string
  label: string
  stern?: boolean
  akzentGlow?: boolean
}) {
  return (
    <div className="space-y-[4px]">
      <div className="flex items-center justify-center gap-[4px]">
        {stern && (
          <Star
            className="h-[13px] w-[13px] fill-snippt-ember text-snippt-ember"
            strokeWidth={0}
          />
        )}
        <span
          className={`font-display text-[18px] font-semibold tabular-nums ${
            akzentGlow ? 'text-snippt-da' : 'text-snippt-ink'
          }`}
        >
          {wert}
        </span>
      </div>
      <span className="block text-[11px] text-snippt-faint">{label}</span>
    </div>
  )
}
