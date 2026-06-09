import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { QueueBoard } from './_components/QueueBoard'
import { mockQueue, mockStats } from '@/lib/mockQueue'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: friseur } = await supabase
    .from('friseur')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Hinweis: Warteschlange + Kennzahlen sind in dieser Etappe (SG3) noch Beispiel-Daten.
  // Anbindung an die echte Tabelle `warteschlange` folgt nach dem Einspielen der Migration.

  return (
    <main className="snippt-grain relative min-h-screen overflow-hidden bg-snippt-bg font-body text-snippt-ink">
      {/* Statische Atmosphäre-Glows (handy-schonend, keine Dauer-Animation) */}
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
        {/* Kopf */}
        <header className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Deine Reihe</h1>
            <p className="mt-1 text-[13px] text-snippt-faint">
              Hallo {friseur?.name ?? 'Friseur'} · {' '}
              <a
                href={`/${friseur?.slug ?? ''}`}
                target="_blank"
                className="text-snippt-muted underline decoration-snippt-faint/50 underline-offset-2"
              >
                snippt.de/{friseur?.slug ?? 'dein-name'}
              </a>
            </p>
          </div>
          <span className="text-[12px] uppercase tracking-[0.14em] text-snippt-faint">
            {mockQueue.length} warten
          </span>
        </header>

        {/* Kennzahlen */}
        <div className="my-5 flex gap-[10px]">
          {[
            { n: mockStats.schnitteHeute, t: 'Schnitte heute' },
            { n: mockStats.stammkunden, t: 'Stammkunden' },
            { n: mockStats.neuGewonnen, t: 'neu gewonnen' },
          ].map((s) => (
            <div
              key={s.t}
              className="flex-1 rounded-[14px] border border-white/[0.07] bg-white/[0.02] px-[14px] py-3"
            >
              <div className="font-display text-[22px] leading-none">{s.n}</div>
              <div className="mt-[6px] text-[11px] tracking-[0.06em] text-snippt-faint">{s.t}</div>
            </div>
          ))}
        </div>

        {/* Warteschlange */}
        <QueueBoard entries={mockQueue} />
      </div>
    </main>
  )
}
