import type { QueueEntry, QueueStatus } from '@/lib/mockQueue'
import { fertigNaechster, belohnungEinloesen, eintragEntfernen, praesenzUmschalten } from '../actions'
import { BestaetigungsButton } from './BestaetigungsButton'

// Dashboard-spezifische Erweiterung des Reihen-Eintrags um Stempelkarten-Info.
// Bewusst hier (nicht in mockQueue), da mockQueue ein geteilter Mock-Typ ist.
export type FriseurQueueEntry = QueueEntry & {
  kundeId: string | null
  stempelVoll: boolean
  istDa: boolean
  istAufgerufen: boolean
}

// „ist da"-Schalter: markiert einen Wartenden als angekommen (oder zurück auf
// wartend). Ein Tipp, kein Scan. Ändert die Position nicht.
function PraesenzToggle({ entry }: { entry: FriseurQueueEntry }) {
  const ziel = entry.istDa ? 'wartend' : 'da'
  return (
    <form action={praesenzUmschalten}>
      <input type="hidden" name="eintragId" value={entry.id} />
      <input type="hidden" name="zielStatus" value={ziel} />
      <button
        type="submit"
        className={
          entry.istDa
            ? 'rounded-full border border-snippt-da/50 bg-snippt-da/10 px-[11px] py-[5px] text-[12px] font-medium text-snippt-da'
            : 'rounded-full border border-white/[0.14] px-[11px] py-[5px] text-[12px] font-medium text-snippt-muted hover:border-snippt-da/50 hover:text-snippt-da'
        }
      >
        {entry.istDa ? '✓ ist da' : 'ist da?'}
      </button>
    </form>
  )
}

// Status-Darstellung: Punkt-Farbe + Text. Spiegelt das freigegebene Design (SG2).
const STATUS_META: Record<QueueStatus, { dot: string; label: string }> = {
  da:            { dot: 'bg-snippt-da shadow-[0_0_8px] shadow-snippt-da',   label: 'ist da' },
  unterwegs:     { dot: 'bg-snippt-weg shadow-[0_0_8px] shadow-snippt-weg',  label: 'unterwegs' },
  keine_antwort: { dot: 'bg-snippt-still',                                   label: 'keine Antwort' },
}

function StatusChip({ entry }: { entry: FriseurQueueEntry }) {
  const meta = STATUS_META[entry.status]
  return (
    <span className="mt-[7px] inline-flex items-center gap-[6px] text-[11px] tracking-[0.04em] text-snippt-muted">
      <i className={`h-[7px] w-[7px] rounded-full ${meta.dot}`} />
      {entry.hinweis ?? meta.label}
    </span>
  )
}

export function QueueBoard({ entries }: { entries: FriseurQueueEntry[] }) {
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
          {now.stempelVoll && (
            <div className="mt-[10px] inline-flex items-center gap-[6px] rounded-full border border-snippt-ember/40 bg-snippt-ember/10 px-[10px] py-[4px] text-[11px] font-medium text-snippt-ember">
              ⭐ Karte voll — Belohnung fällig
            </div>
          )}
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
          {now.stempelVoll && (
            <form action={belohnungEinloesen}>
              <input type="hidden" name="eintragId" value={now.id} />
              <button
                type="submit"
                className="mt-[10px] flex w-full items-center justify-center gap-2 rounded-[13px] border border-snippt-ember/50 bg-snippt-ember/10 p-[13px] text-[14px] font-semibold text-snippt-ember"
              >
                ⭐ Belohnung einlösen (gratis)
              </button>
            </form>
          )}
          <div className="mt-[10px] flex items-center justify-between">
            {now.istAufgerufen ? (
              <span className="text-[12px] text-snippt-glow2">wird gerufen …</span>
            ) : (
              <PraesenzToggle entry={now} />
            )}
            <BestaetigungsButton
              action={eintragEntfernen}
              feldName="eintragId"
              feldWert={now.id}
              label="Entfernen"
              bestaetigung="Aus der Reihe entfernen?"
              variante="dezent"
            />
          </div>
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
          {entry.stempelVoll && (
            <div className="mt-[8px] inline-flex items-center gap-[5px] text-[11px] font-medium text-snippt-ember">
              ⭐ Karte voll
            </div>
          )}
          <div className="mt-[8px] flex items-center justify-between">
            <PraesenzToggle entry={entry} />
            <BestaetigungsButton
              action={eintragEntfernen}
              feldName="eintragId"
              feldWert={entry.id}
              label="Entfernen"
              bestaetigung="Entfernen?"
              variante="dezent"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
