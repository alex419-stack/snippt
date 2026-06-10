/**
 * DemoReihe — statisches Live-Queue-Board für die Friseur-Demo.
 * Spiegelt QueueBoard.tsx — aber ohne Server Actions, rein presentational.
 * Dark/Glow-Design (SG2-Palette). Server Component.
 */

type DemoStatus = 'da' | 'unterwegs' | 'wartet'

type DemoEintrag = {
  id: string
  name: string
  status: DemoStatus
  wartetSeit: string
  stempelVoll?: boolean
}

// Status-Meta: Punkt-Farbe + Label
const STATUS_META: Record<DemoStatus, { dot: string; label: string }> = {
  da:         { dot: 'bg-snippt-da shadow-[0_0_8px] shadow-snippt-da',    label: 'ist da'      },
  unterwegs:  { dot: 'bg-snippt-weg shadow-[0_0_8px] shadow-snippt-weg',  label: 'unterwegs'   },
  wartet:     { dot: 'bg-snippt-faint',                                    label: 'wartet'      },
}

function StatusChip({ status, hinweis }: { status: DemoStatus; hinweis?: string }) {
  const meta = STATUS_META[status]
  return (
    <span className="mt-[6px] inline-flex items-center gap-[6px] text-[11px] tracking-[0.04em] text-snippt-muted">
      <i className={`h-[7px] w-[7px] rounded-full flex-shrink-0 ${meta.dot}`} />
      {hinweis ?? meta.label}
    </span>
  )
}

export function DemoReihe({ eintraege }: { eintraege: DemoEintrag[] }) {
  const [jetzt, ...wartend] = eintraege

  return (
    <section className="space-y-3">
      {/* Abschnitt-Label */}
      <div className="text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
        Live-Reihe
      </div>

      <div className="relative flex flex-col gap-3 pl-[26px]">
        {/* Leuchtende Spine — verbindet die Wartenden */}
        <div
          className="absolute left-[9px] top-[6px] bottom-[6px] w-[2px] rounded-full"
          style={{
            background: 'linear-gradient(180deg,#2BE7FF,#5468FF 60%,transparent)',
            boxShadow: '0 0 14px rgba(84,104,255,.6)',
          }}
        />
        {/* Spine-Kopfpunkt */}
        <div className="absolute left-[3px] top-[20px] h-[14px] w-[14px] rounded-full bg-snippt-bg border-2 border-snippt-glow1 shadow-[0_0_10px] shadow-snippt-glow1" />

        {/* Jetzt-dran-Karte */}
        {jetzt && (
          <div
            className="relative rounded-2xl border border-transparent p-[15px] bg-snippt-surface"
            style={{
              backgroundImage:
                'radial-gradient(120% 120% at 0% 0%, rgba(84,104,255,.22), transparent 60%)',
              boxShadow:
                '0 0 0 1px rgba(84,104,255,.5), 0 18px 40px -22px rgba(84,104,255,.9)',
            }}
          >
            {/* "Jetzt dran"-Label */}
            <div className="mb-[6px] text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
              Jetzt dran
            </div>

            {/* Name + Wartezeit */}
            <div className="flex items-center justify-between">
              <b className="text-[15px] font-semibold text-snippt-ink">{jetzt.name}</b>
              <span className="text-[12px] text-snippt-faint">wartet {jetzt.wartetSeit}</span>
            </div>

            <StatusChip status={jetzt.status} />

            {/* Stempelkarte voll */}
            {jetzt.stempelVoll && (
              <div className="mt-[10px] inline-flex items-center gap-[6px] rounded-full border border-snippt-ember/40 bg-snippt-ember/10 px-[10px] py-[4px] text-[11px] font-medium text-snippt-ember">
                ⭐ Karte voll — Belohnung fällig
              </div>
            )}

            {/* Visueller CTA — kein Server Action */}
            <div
              className="mt-[13px] flex w-full items-center justify-center gap-2 rounded-[13px] p-[14px] text-[15px] font-semibold text-[#070710] cursor-default select-none"
              style={{
                background: 'linear-gradient(100deg,#2BE7FF,#5468FF)',
                boxShadow: '0 10px 26px -10px rgba(84,104,255,.8)',
              }}
            >
              Fertig → Nächsten aufrufen
            </div>
          </div>
        )}

        {/* Wartende Einträge */}
        {wartend.map((eintrag, idx) => (
          <div
            key={eintrag.id}
            className="rounded-2xl border border-white/[0.07] bg-snippt-surface p-[13px]"
            style={{ opacity: 1 - idx * 0.08 }}
          >
            <div className="flex items-center justify-between">
              {/* Position */}
              <div className="flex items-center gap-[10px]">
                <span className="text-[11px] font-medium tabular-nums text-snippt-faint">
                  #{idx + 2}
                </span>
                <b className="text-[14px] font-semibold text-snippt-ink">{eintrag.name}</b>
              </div>
              <span className="text-[12px] text-snippt-faint">seit {eintrag.wartetSeit}</span>
            </div>
            <StatusChip status={eintrag.status} />
          </div>
        ))}

        {/* Leerer Slot — Einladung */}
        <div className="rounded-2xl border border-dashed border-white/[0.08] p-[13px] text-center">
          <span className="text-[12px] text-snippt-faint">+ Jemand reiht sich ein …</span>
        </div>
      </div>
    </section>
  )
}
