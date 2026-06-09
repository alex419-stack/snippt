import type { QueueEntry, QueueStatus } from '@/lib/mockQueue'
import { fertigNaechster } from '../actions'

// Status-Darstellung: Punkt-Farbe + Text. Spiegelt das freigegebene Design (SG2).
const STATUS_META: Record<QueueStatus, { dot: string; label: string }> = {
  da:            { dot: 'bg-snippt-da shadow-[0_0_8px] shadow-snippt-da',   label: 'ist da' },
  unterwegs:     { dot: 'bg-snippt-weg shadow-[0_0_8px] shadow-snippt-weg',  label: 'unterwegs' },
  keine_antwort: { dot: 'bg-snippt-still',                                   label: 'keine Antwort' },
}

function StatusChip({ entry }: { entry: QueueEntry }) {
  const meta = STATUS_META[entry.status]
  return (
    <span className="mt-[7px] inline-flex items-center gap-[6px] text-[11px] tracking-[0.04em] text-snippt-muted">
      <i className={`h-[7px] w-[7px] rounded-full ${meta.dot}`} />
      {entry.hinweis ?? meta.label}
    </span>
  )
}

export function QueueBoard({ entries }: { entries: QueueEntry[] }) {
  const [now, ...rest] = entries

  return (
    <div className="relative flex flex-col gap-3 pl-[26px]">
      {/* Leuchtende „Spine" — moderne Barber-Pole, verbindet die Wartenden */}
      <div
        className="absolute left-[9px] top-[6px] bottom-[6px] w-[2px] rounded-full"
        style={{
          background:
            'linear-gradient(180deg,#2BE7FF,#5468FF 60%,transparent)',
          boxShadow: '0 0 14px rgba(84,104,255,.6)',
        }}
      />
      <div className="absolute left-[3px] top-[20px] h-[14px] w-[14px] rounded-full bg-snippt-bg border-2 border-snippt-glow1 shadow-[0_0_10px] shadow-snippt-glow1" />

      {/* Aktiver Eintrag: „Jetzt dran" */}
      {now && (
        <div
          className="relative rounded-2xl border border-transparent p-[15px] bg-snippt-surface2"
          style={{
            backgroundImage:
              'radial-gradient(120% 120% at 0% 0%, rgba(84,104,255,.22), transparent 60%)',
            boxShadow:
              '0 0 0 1px rgba(84,104,255,.5), 0 18px 40px -22px rgba(84,104,255,.9)',
          }}
        >
          <div className="mb-[6px] text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
            Jetzt dran
          </div>
          <div className="flex items-center justify-between">
            <b className="text-[15px] font-semibold text-snippt-ink">{now.name}</b>
            <span className="text-[12px] text-snippt-faint">wartet {now.wartetMin} Min</span>
          </div>
          <StatusChip entry={now} />
          <form action={fertigNaechster}>
            <input type="hidden" name="eintragId" value={now.id} />
            <button
              type="submit"
              className="mt-[13px] flex w-full items-center justify-center gap-2 rounded-[13px] p-[14px] text-[15px] font-semibold text-[#070710]"
              style={{
                background: 'linear-gradient(100deg,#2BE7FF,#5468FF)',
                boxShadow: '0 10px 26px -10px rgba(84,104,255,.8)',
              }}
            >
              Fertig → Nächsten aufrufen
            </button>
          </form>
        </div>
      )}

      {/* Restliche Reihe */}
      {rest.map((entry) => (
        <div
          key={entry.id}
          className="relative rounded-2xl border border-white/[0.07] bg-snippt-surface p-[15px]"
        >
          <div className="flex items-center justify-between">
            <b className="text-[15px] font-semibold text-snippt-ink">{entry.name}</b>
            <span className="text-[12px] text-snippt-faint">seit {entry.wartetMin} Min</span>
          </div>
          <StatusChip entry={entry} />
        </div>
      ))}
    </div>
  )
}
