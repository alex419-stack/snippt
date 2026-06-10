import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'

// Statische Mock-Daten — kein Backend, kein Server Action.
// Marco ist der eine Friseur im Post-Pivot-Modell.
const marco = {
  name: 'Marco Ferretti',
  spezialitaet: 'Fade · Skin Fade · Bart',
  bewertung: 4.9,
  bewertungAnzahl: 134,
  instagram: '@marco.cuts',
  initial: 'M',
}

/**
 * ProfilHeader — Avatar, Name, Spezialität, Sterne, Instagram.
 * Kein Salon-Name (Post-Pivot: einzelner Friseur = eigene Marke).
 * Server Component, rein presentational.
 */
export function ProfilHeader() {
  return (
    <div className="space-y-7">
      {/* Zurück-Link */}
      <Link
        href="/demo"
        className="inline-flex items-center gap-[7px] text-[11px] uppercase tracking-[0.16em] text-snippt-faint transition-colors hover:text-snippt-muted"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Demo-Übersicht
      </Link>

      {/* Friseur-Hero */}
      <div className="flex items-center gap-[18px]">
        {/* Avatar: Initiale im Gradient-Tile (identisch slug-Seite) */}
        <div
          className="grid h-[72px] w-[72px] flex-none place-items-center rounded-[22px] font-display text-[28px] font-semibold text-snippt-ink"
          style={{
            background: 'linear-gradient(135deg,#2a2a40,#15151f)',
            boxShadow: '0 0 0 1px rgba(255,255,255,.12), 0 0 28px -6px #5468FF',
          }}
        >
          {marco.initial}
        </div>

        <div className="space-y-[5px]">
          {/* Name */}
          <h1 className="font-display text-[22px] font-semibold leading-none tracking-tight text-snippt-ink">
            {marco.name}
          </h1>

          {/* Spezialität */}
          <p className="text-[13px] text-snippt-muted">{marco.spezialitaet}</p>

          {/* Sterne */}
          <div className="flex items-center gap-[6px]">
            <div className="flex items-center gap-[2px]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="h-[11px] w-[11px]"
                  style={{
                    fill: s <= Math.round(marco.bewertung) ? '#FF8A4C' : 'transparent',
                    color: s <= Math.round(marco.bewertung) ? '#FF8A4C' : 'rgba(255,138,76,.3)',
                  }}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="font-display text-[13px] font-semibold text-snippt-ink tabular-nums">
              {marco.bewertung}
            </span>
            <span className="text-[12px] text-snippt-faint">
              · {marco.bewertungAnzahl} Bewertungen
            </span>
          </div>

          {/* Instagram */}
          <a
            href={`https://instagram.com/${marco.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[5px] text-[12px] text-snippt-faint transition-colors hover:text-snippt-muted"
          >
            {/* Einfaches IG-Kürzel ohne externes Icon */}
            <span className="font-display text-[10px] font-semibold tracking-tight opacity-60">IG</span>
            {marco.instagram}
          </a>
        </div>
      </div>
    </div>
  )
}
