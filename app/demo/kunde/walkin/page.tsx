import { WalkInHeader } from './_components/WalkInHeader'
import { StammfriseurKarte } from './_components/StammfriseurKarte'
import { ConversionTeaser } from './_components/ConversionTeaser'

/**
 * Walk-In Live-Status — Snippt-v1-Design (dunkel, Glow).
 *
 * Demo-State: Kunde ist bereits in der Reihe (#3, 2 vor ihm).
 * So wird der Kern-Wert sofort sichtbar ohne Interaktion.
 *
 * Mobile-First: max-w-md. Server Component.
 * Keine Backend-Aufrufe, keine Server Actions.
 */

// ── Demo-Konstanten ──────────────────────────────────────────

const FRISEUR_NAME = 'Marco'
const HEUTE_LANG = 'Mittwoch, 10. Juni 2026'

// ── Queue-Typen (Inline-Mockdaten) ───────────────────────────

type QueueStatus = 'da' | 'unterwegs' | 'wartet'

interface QueueEintrag {
  id: string
  name: string
  status: QueueStatus
  ichBin?: boolean
}

const QUEUE: QueueEintrag[] = [
  { id: 'q1', name: 'Mert K.',  status: 'da' },
  { id: 'q2', name: 'Deniz',    status: 'unterwegs' },
  { id: 'q3', name: 'Du',       status: 'wartet', ichBin: true },
  { id: 'q4', name: 'Yusuf',    status: 'wartet' },
]

const STATUS_META: Record<QueueStatus, { dot: string; label: string }> = {
  da:        { dot: 'bg-snippt-da  shadow-[0_0_8px] shadow-snippt-da',  label: 'ist da' },
  unterwegs: { dot: 'bg-snippt-weg shadow-[0_0_8px] shadow-snippt-weg', label: 'unterwegs' },
  wartet:    { dot: 'bg-snippt-faint',                                   label: 'wartet' },
}

// ── Page ─────────────────────────────────────────────────────

export default function WalkinPage() {
  // Demo: Kunde ist angestellt, Position 3, 2 vor ihm
  const meinStatus = { typ: 'angestellt' as const, position: 3, vorDir: 2 }

  const [jetzt, ...wartend] = QUEUE

  return (
    <>
      {/* Hintergrund-Glühen */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 30% -10%, rgba(84,104,255,.18), transparent 60%),' +
            'radial-gradient(ellipse 60% 40% at 80% 110%, rgba(43,231,255,.12), transparent 55%)',
        }}
      />

      {/* Hauptinhalt */}
      <div className="relative z-[1] mx-auto w-full max-w-md px-5 pb-12 pt-12">
        <div className="space-y-6">

          {/* ── Header ───────────────────────────────────────────── */}
          <WalkInHeader friseurName={FRISEUR_NAME} datumLang={HEUTE_LANG} />

          {/* ── Hero-Status-Karte ─────────────────────────────────── */}
          <StammfriseurKarte status={meinStatus} />

          {/* ── Live Queue Board ──────────────────────────────────── */}
          <section className="space-y-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
              Live-Reihe
            </div>

            <div
              className="rounded-2xl p-4"
              style={{
                background: '#141420',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,.05), 0 0 0 1px rgba(255,255,255,.07)',
              }}
            >
              <div className="relative flex flex-col gap-[10px] pl-[26px]">

                {/* Leuchtende Spine */}
                <div
                  aria-hidden
                  className="absolute left-[9px] top-[6px] bottom-[6px] w-[2px] rounded-full"
                  style={{
                    background: 'linear-gradient(180deg,#2BE7FF,#5468FF 60%,transparent)',
                    boxShadow: '0 0 14px rgba(84,104,255,.6)',
                  }}
                />
                {/* Aktiver Punkt am Spine-Kopf */}
                <div
                  aria-hidden
                  className="absolute left-[3px] top-[20px] h-[14px] w-[14px] rounded-full border-2 border-snippt-glow1 bg-snippt-bg shadow-[0_0_10px] shadow-snippt-glow1"
                />

                {/* ── Jetzt dran ────────────────────────────────── */}
                <div
                  className="rounded-2xl p-[13px]"
                  style={{
                    backgroundImage:
                      'radial-gradient(120% 120% at 0% 0%, rgba(84,104,255,.22), transparent 60%)',
                    boxShadow: '0 0 0 1px rgba(84,104,255,.45)',
                  }}
                >
                  <div className="text-[10px] uppercase tracking-[0.16em] text-snippt-glow2">
                    Jetzt dran
                  </div>
                  <div className="mt-[4px] flex items-center justify-between">
                    <b className="text-[14px] font-semibold text-snippt-ink">
                      {jetzt.name}
                    </b>
                    <span className="inline-flex items-center gap-[5px] text-[11px] text-snippt-da">
                      <i className={`h-[6px] w-[6px] rounded-full ${STATUS_META.da.dot}`} />
                      ist da
                    </span>
                  </div>
                </div>

                {/* ── Warteschlange ─────────────────────────────── */}
                {wartend.map((eintrag) => {
                  const meta = STATUS_META[eintrag.status]
                  const istIch = eintrag.ichBin === true

                  return (
                    <div
                      key={eintrag.id}
                      className="rounded-2xl p-[13px]"
                      style={
                        istIch
                          ? {
                              border: '1px solid rgba(43,231,255,.35)',
                              background:
                                'radial-gradient(100% 100% at 0% 0%, rgba(43,231,255,.10), transparent 60%), #141420',
                            }
                          : {
                              border: '1px solid rgba(255,255,255,.07)',
                              background: '#141420',
                            }
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {istIch && (
                            <span
                              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.10em]"
                              style={{
                                background: 'rgba(43,231,255,.15)',
                                color: '#2BE7FF',
                              }}
                            >
                              Du
                            </span>
                          )}
                          <b
                            className="text-[14px] font-semibold"
                            style={{ color: istIch ? '#2BE7FF' : '#F4F2EE' }}
                          >
                            {eintrag.name}
                          </b>
                        </div>
                        <span
                          className="inline-flex items-center gap-[5px] text-[11px]"
                          style={{ color: istIch ? '#2BE7FF' : '#9D9BAB' }}
                        >
                          <i className={`h-[6px] w-[6px] rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ── Conversion Teaser ─────────────────────────────────── */}
          <ConversionTeaser />

          {/* ── Footer ────────────────────────────────────────────── */}
          <footer className="border-t border-white/[0.06] pt-5 text-[11px] text-snippt-faint">
            Mockup mit Demo-Daten · nicht in Echtzeit
          </footer>

        </div>
      </div>
    </>
  )
}
