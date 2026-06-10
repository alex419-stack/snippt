import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/**
 * FriseurHeader — Begrüßung, Datum und Live-Reihen-Statistik.
 * Dark/Glow-Design (SG2-Palette). Kein Friseur-Typ-Import — hardcodete Mock-Props.
 * Server Component.
 */
export function FriseurHeader({
  name,
  datumLang,
  anzahlInReihe,
  anzahlFertig,
}: {
  name: string
  datumLang: string
  anzahlInReihe: number
  anzahlFertig: number
}) {
  return (
    <div className="space-y-5">
      {/* Zurück-Link */}
      <Link
        href="/demo"
        className="inline-flex items-center gap-[6px] text-[11px] font-medium uppercase tracking-[0.16em] text-snippt-faint transition-colors hover:text-snippt-muted"
      >
        <ArrowLeft className="h-3 w-3" />
        Demo-Übersicht
      </Link>

      {/* Kontext-Label */}
      <div className="text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
        Friseur · Live-Reihe
      </div>

      {/* Begrüßung */}
      <div className="space-y-[6px]">
        <h1 className="font-display text-[28px] font-semibold leading-tight tracking-tight text-snippt-ink">
          Hallo {name.split(' ')[0]}
        </h1>
        <p className="text-[14px] text-snippt-muted">{datumLang}</p>
      </div>

      {/* Stat-Zeile */}
      <div className="flex items-center gap-[6px] text-[13px] text-snippt-muted">
        <span className="font-semibold text-snippt-ink">{anzahlInReihe}</span>
        <span>in der Reihe</span>
        <span className="px-[2px] text-snippt-faint">·</span>
        <span className="font-semibold text-snippt-ink">{anzahlFertig}</span>
        <span>heute fertig</span>
      </div>
    </div>
  )
}
