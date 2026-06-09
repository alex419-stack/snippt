import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { QueueBoard } from './_components/QueueBoard'
import { AutoRefresh } from '@/app/_components/AutoRefresh'
import type { QueueEntry, QueueStatus } from '@/lib/mockQueue'

const AKTIV = ['wartend', 'unterwegs', 'da', 'aufgerufen']

// DB-Status → Anzeige-Status (QueueBoard kennt: da / unterwegs / keine_antwort)
function mapStatus(dbStatus: string): QueueStatus {
  if (dbStatus === 'da') return 'da'
  return 'unterwegs' // wartend / unterwegs / aufgerufen
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: friseur } = await supabase
    .from('friseur')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Echte Warteschlange des eingeloggten Friseurs (RLS schützt auf eigene Zeilen).
  const { data: rows } = await supabase
    .from('warteschlange')
    .select('id, gast_name, status, eingereiht_at')
    .eq('friseur_id', friseur?.id ?? '')
    .in('status', AKTIV)
    .order('eingereiht_at', { ascending: true })

  const jetzt = Date.now()
  const entries: QueueEntry[] = (rows ?? []).map((r) => ({
    id: r.id as string,
    name: (r.gast_name as string | null)?.trim() || 'Gast',
    wartetMin: Math.max(0, Math.round((jetzt - new Date(r.eingereiht_at as string).getTime()) / 60000)),
    status: mapStatus(r.status as string),
  }))

  // Heute abgeschlossene Schnitte (echte Kennzahl).
  const heuteStart = new Date()
  heuteStart.setHours(0, 0, 0, 0)
  const { count: fertigHeute } = await supabase
    .from('warteschlange')
    .select('id', { count: 'exact', head: true })
    .eq('friseur_id', friseur?.id ?? '')
    .eq('status', 'fertig')
    .gte('fertig_at', heuteStart.toISOString())

  return (
    <main className="snippt-grain relative min-h-screen overflow-hidden bg-snippt-bg font-body text-snippt-ink">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(60% 45% at 18% 4%, rgba(84,104,255,.20), transparent 60%),' +
            'radial-gradient(50% 40% at 88% 16%, rgba(43,231,255,.13), transparent 60%),' +
            'linear-gradient(180deg,#08080B,#0C0C12)',
        }}
      />

      <div className="relative z-[1] mx-auto w-full max-w-md px-5 pb-12 pt-12">
        <AutoRefresh seconds={5} />
        <header className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Deine Reihe</h1>
            <p className="mt-1 text-[13px] text-snippt-faint">
              Hallo {friseur?.name ?? 'Friseur'} ·{' '}
              <a
                href={`/${friseur?.slug ?? ''}`}
                target="_blank"
                className="text-snippt-muted underline decoration-snippt-faint/50 underline-offset-2"
              >
                snippt.de/{friseur?.slug ?? 'dein-name'}
              </a>
            </p>
            <Link
              href="/dashboard/profil"
              className="mt-2 inline-block text-[12px] text-snippt-glow2 hover:text-snippt-ink"
            >
              Profil bearbeiten →
            </Link>
          </div>
          <span className="text-[12px] uppercase tracking-[0.14em] text-snippt-faint">
            {entries.length} warten
          </span>
        </header>

        <div className="my-5 flex gap-[10px]">
          <div className="flex-1 rounded-[14px] border border-white/[0.07] bg-white/[0.02] px-[14px] py-3">
            <div className="font-display text-[22px] leading-none">{entries.length}</div>
            <div className="mt-[6px] text-[11px] tracking-[0.06em] text-snippt-faint">in der Reihe</div>
          </div>
          <div className="flex-1 rounded-[14px] border border-white/[0.07] bg-white/[0.02] px-[14px] py-3">
            <div className="font-display text-[22px] leading-none">{fertigHeute ?? 0}</div>
            <div className="mt-[6px] text-[11px] tracking-[0.06em] text-snippt-faint">heute fertig</div>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.07] bg-snippt-surface px-5 py-10 text-center">
            <p className="font-display text-[18px] text-snippt-ink">Noch niemand in der Reihe</p>
            <p className="mt-2 text-[13px] text-snippt-muted">
              Sobald sich jemand über deinen Link anstellt, erscheint er hier.
            </p>
          </div>
        ) : (
          <QueueBoard entries={entries} />
        )}
      </div>
    </main>
  )
}
