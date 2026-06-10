import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProfilHeader } from './_components/ProfilHeader'
import { TrustSignale } from './_components/TrustSignale'

// Statische Stempelkarte-Daten — kein Backend, kein Server Action.
const STEMPEL = { haben: 7, ziel: 10, belohnung: '1 Schnitt gratis' }

/**
 * Demo-Screen: Kunde · Dein Friseur (Profil)
 *
 * Was ein Kunde sieht, nachdem er Marcos QR-Code gescannt hat.
 * Dieser Moment ist die Stammkunden-Conversion-Mechanik von Snippt:
 * Laufkundschaft wird durch Live-Reihe + Stempelkarte zum Stammkunden.
 *
 * Layout (bg-snippt-bg, grain, font-body, text-snippt-ink) kommt von
 * app/demo/kunde/layout.tsx — diese Datei nicht anfassen.
 * Rein statisch, kein Backend, kein Server Action.
 */
export default function ProfilDemoPage() {
  const rest = Math.max(STEMPEL.ziel - STEMPEL.haben, 0)

  return (
    <>
      {/* ── Hintergrund-Glühen ─────────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(60% 45% at 18% 4%, rgba(84,104,255,.20), transparent 60%),' +
            'radial-gradient(50% 40% at 88% 16%, rgba(43,231,255,.13), transparent 60%),' +
            'radial-gradient(45% 40% at 70% 100%, rgba(255,138,76,.07), transparent 60%),' +
            'linear-gradient(180deg,#08080B,#0C0C12)',
        }}
      />

      {/* ── Inhalt ────────────────────────────────────────────── */}
      <div className="relative z-[1] mx-auto w-full max-w-md px-5 pb-12 pt-12">

        {/* QR-Kontext-Label */}
        <div className="mb-6 flex items-center gap-[10px]">
          <span
            className="inline-block h-[1px] w-6"
            style={{ background: 'linear-gradient(90deg,rgba(43,231,255,.6),transparent)' }}
          />
          <span className="text-[11px] uppercase tracking-[0.16em] text-snippt-faint">
            via QR-Code · Marcos Profil
          </span>
        </div>

        {/* ProfilHeader: Avatar, Name, Sterne, Instagram */}
        <ProfilHeader />

        {/* Divider */}
        <div className="my-7 h-px w-full bg-white/[0.06]" />

        {/* TrustSignale: Bio, Badges, Stil-Tags */}
        <TrustSignale />

        {/* Divider */}
        <div className="my-7 h-px w-full bg-white/[0.06]" />

        {/* ── Stempelkarte (Ember-Style — identisch StempelKarte.tsx) ── */}
        <div
          className="rounded-[18px] p-[16px_18px]"
          style={{
            background: 'linear-gradient(120deg,rgba(255,138,76,.10),rgba(255,138,76,.02))',
            border: '1px solid rgba(255,138,76,.18)',
          }}
        >
          {/* Kopfzeile */}
          <div className="mb-[11px] flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-[0.14em] text-snippt-ember">
              Stempelkarte
            </span>
            <span className="font-display text-[15px] text-snippt-ink">
              {STEMPEL.haben} / {STEMPEL.ziel}
            </span>
          </div>

          {/* Stempel-Dots */}
          <div className="flex flex-wrap gap-[7px]">
            {Array.from({ length: STEMPEL.ziel }).map((_, i) => (
              <i
                key={i}
                className="h-[18px] w-[18px] rounded-full"
                style={
                  i < STEMPEL.haben
                    ? {
                        background: 'radial-gradient(circle at 35% 30%,#ffb88a,#FF8A4C)',
                        boxShadow: '0 0 10px -1px #FF8A4C',
                      }
                    : { border: '1px solid rgba(255,138,76,.35)' }
                }
              />
            ))}
          </div>

          {/* Status-Text */}
          <div className="mt-[11px] text-[12px] text-snippt-muted">
            {rest === 0 ? (
              <b className="text-snippt-ink">Voll! Deine Belohnung: {STEMPEL.belohnung}.</b>
            ) : (
              <>
                Noch{' '}
                <b className="text-snippt-ink">
                  {rest} {rest === 1 ? 'Schnitt' : 'Schnitte'}
                </b>{' '}
                bis {STEMPEL.belohnung}.
              </>
            )}
          </div>
        </div>

        {/* ── Conversion-Copy ─────────────────────────────────── */}
        <div className="mt-7 space-y-2 text-center">
          <p className="text-[14px] font-semibold text-snippt-ink">
            Beim nächsten Mal ist Marco vorgemerkt.
          </p>
          <p className="text-[13px] leading-relaxed text-snippt-muted">
            Dein Friseur, deine Reihe — kein Anruf, keine Überraschung.
            Aus Laufkundschaft wird Stammkundschaft.
          </p>
        </div>

        {/* ── CTAs ────────────────────────────────────────────── */}
        <div className="mt-8 space-y-3">
          {/* Primär: Anstellen (Gradient-CTA wie überall im neuen Design) */}
          <Link
            href="/demo/kunde/walkin"
            className="flex w-full items-center justify-center gap-2 rounded-[16px] px-6 py-[16px] text-[15px] font-semibold text-[#070710] transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(100deg,#2BE7FF,#5468FF)',
              boxShadow: '0 12px 34px -10px rgba(84,104,255,.7)',
            }}
          >
            Bei Marco anstellen
            <ArrowRight className="h-[16px] w-[16px]" strokeWidth={2.5} />
          </Link>

          {/* Sekundär: Termin (Border-Button) */}
          <Link
            href="/demo/kunde/buchen"
            className="flex w-full items-center justify-center rounded-[16px] border px-6 py-[15px] text-[15px] font-semibold text-snippt-ink transition-colors hover:border-white/[0.18] hover:bg-white/[0.03]"
            style={{ borderColor: 'rgba(255,255,255,.10)' }}
          >
            Termin buchen
          </Link>
        </div>

        {/* ── Demo-Hinweis ─────────────────────────────────────── */}
        <p className="mt-10 text-center text-[11px] text-snippt-faint">
          Demo-Screen · Mockup-Daten · keine echte Buchung
        </p>
      </div>
    </>
  )
}
