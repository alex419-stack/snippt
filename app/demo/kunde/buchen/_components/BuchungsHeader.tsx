import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/**
 * BuchungsHeader — Marco's Profil-Zeile im Termin-Modus.
 * Dark/Glow-Design. Rein presentational, keine Props nötig.
 */
export function BuchungsHeader() {
  return (
    <div className="space-y-6">
      {/* Zurück-Link */}
      <Link
        href="/demo"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-snippt-faint transition-colors hover:text-snippt-muted"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Demo-Übersicht
      </Link>

      {/* Friseur-Profil-Zeile */}
      <div className="flex items-center gap-4">
        {/* Avatar — Gradient-Tile mit Initial */}
        <div
          className="grid h-[72px] w-[72px] flex-none place-items-center rounded-[22px] font-display text-[28px] font-semibold text-snippt-ink"
          style={{
            background: 'linear-gradient(135deg,#2a2a40,#15151f)',
            boxShadow: '0 0 0 1px rgba(255,255,255,.12), 0 0 28px -6px #5468FF',
          }}
        >
          M
        </div>

        <div>
          {/* Label-Caps Zeile */}
          <span className="text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
            Termin buchen
          </span>
          <h1 className="mt-[3px] font-display text-[21px] font-semibold tracking-tight text-snippt-ink">
            Marco Ferretti
          </h1>
          <p className="text-[13px] text-snippt-muted">Fade · Skin Fade · Bart</p>
        </div>
      </div>

      {/* Hinweis-Zeile: Termin-Modus */}
      <div
        className="rounded-[14px] border border-snippt-glow1/20 px-4 py-[11px]"
        style={{ background: 'rgba(84,104,255,.06)' }}
      >
        <p className="text-[13px] text-snippt-muted">
          <span className="font-medium text-snippt-ink">Marco arbeitet mit festen Terminen.</span>
          {' '}Wähle einen freien Slot — die Zeit gehört dann nur dir.
        </p>
      </div>
    </div>
  )
}
