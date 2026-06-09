import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { AnstellenButton } from './_components/AnstellenButton'
import { TerminBuchen } from './_components/TerminBuchen'
import { AutoRefresh } from '@/app/_components/AutoRefresh'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProfilPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: friseur } = await supabase
    .from('friseur')
    .select('id, name, slug, foto_url, bio, rolle, spezialitaeten, instagram, stempel_anzahl, stempel_belohnung, modus, oeffnet, schliesst, slot_minuten')
    .eq('slug', slug)
    .single()

  if (!friseur) notFound()

  // Echte Live-Wartezeit über die kontrollierte RPC (anon-fähig).
  const { data: statusRaw } = await supabase.rpc('warteschlange_status', { p_slug: slug })
  const status = (statusRaw as { wartende?: number; wartezeit_min?: number } | null) ?? null
  const wartende = status?.wartende ?? 0
  const wartezeitMin = status?.wartezeit_min ?? 0

  const istTermine = friseur.modus === 'termine'
  const oeffnet = (friseur.oeffnet ?? '09:00:00').slice(0, 5)
  const schliesst = (friseur.schliesst ?? '18:00:00').slice(0, 5)
  const slotMin = friseur.slot_minuten ?? 30

  // Stempelkarte: Konfig echt; der persönliche Stempelstand wird später
  // geräteseitig (besucher_token) nachgeladen — hier Startwert 0.
  const stempelGesamt = friseur.stempel_anzahl ?? 10
  const stempelHaben = 0
  const belohnung = friseur.stempel_belohnung ?? '1 Schnitt gratis'

  return (
    <main className="snippt-grain relative min-h-screen overflow-hidden bg-snippt-bg font-body text-snippt-ink">
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

      <div className="relative z-[1] mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-8 pt-12">
        {!istTermine && <AutoRefresh seconds={12} />}
        {/* Live-Anzeige */}
        <div className="mb-6 flex items-center justify-between">
          <span className="inline-flex items-center gap-[7px] text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
            <span className="snippt-pulse h-[7px] w-[7px] rounded-full bg-snippt-glow2 shadow-[0_0_10px] shadow-snippt-glow2" />
            Live
          </span>
        </div>

        {/* Profil */}
        <div className="mb-6 flex items-center gap-[14px]">
          {friseur.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={friseur.foto_url}
              alt={friseur.name}
              className="h-[62px] w-[62px] flex-none rounded-[20px] object-cover"
              style={{ boxShadow: '0 0 0 1px rgba(255,255,255,.12), 0 0 22px -6px #5468FF' }}
            />
          ) : (
            <div
              className="grid h-[62px] w-[62px] flex-none place-items-center rounded-[20px] font-display text-2xl"
              style={{
                background: 'linear-gradient(135deg,#2a2a40,#15151f)',
                boxShadow: '0 0 0 1px rgba(255,255,255,.12), 0 0 22px -6px #5468FF',
              }}
            >
              {friseur.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="font-display text-[21px] font-semibold tracking-tight">{friseur.name}</h1>
            {friseur.rolle && <p className="mt-[3px] text-[13px] text-snippt-glow2">{friseur.rolle}</p>}
          </div>
        </div>

        {/* Kurzes Profil — Personalbranding */}
        {(friseur.bio || friseur.spezialitaeten || friseur.instagram) && (
          <div className="mb-6 space-y-3">
            {friseur.bio && (
              <p className="text-[14px] leading-relaxed text-snippt-muted">{friseur.bio}</p>
            )}
            {friseur.spezialitaeten && (
              <div className="flex flex-wrap gap-2">
                {friseur.spezialitaeten
                  .split(',')
                  .map((s: string) => s.trim())
                  .filter(Boolean)
                  .map((s: string) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-[5px] text-[12px] text-snippt-ink"
                    >
                      {s}
                    </span>
                  ))}
              </div>
            )}
            {friseur.instagram && (
              <a
                href={`https://instagram.com/${friseur.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[13px] text-snippt-muted hover:text-snippt-ink"
              >
                @{friseur.instagram}
              </a>
            )}
          </div>
        )}

        {istTermine ? (
          /* Termin-Modus: Tag + freie Zeit buchen */
          <div className="rounded-[22px] border border-white/[0.12] bg-snippt-surface p-[22px]">
            <div className="text-[12px] uppercase tracking-[0.16em] text-snippt-muted">Termin buchen</div>
            <p className="mt-1 text-[13px] text-snippt-faint">Wähle einen Tag und eine freie Zeit.</p>
            <TerminBuchen slug={slug} oeffnet={oeffnet} schliesst={schliesst} slotMin={slotMin} />
          </div>
        ) : (
          <>
            {/* Warteschlangen-Modus: Live-Wartezeit Hero */}
            <div
              className="relative overflow-hidden rounded-[22px] border border-white/[0.12] p-[26px_22px] text-center"
              style={{
                background:
                  'radial-gradient(120% 90% at 50% 0%, rgba(84,104,255,.22), transparent 60%), #141420',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.05)',
              }}
            >
              <div className="text-[12px] uppercase tracking-[0.16em] text-snippt-muted">Wartezeit gerade</div>
              <div
                className="my-[6px] font-display text-[54px] font-semibold leading-none tracking-tight"
                style={{
                  background: 'linear-gradient(180deg,#fff,#b9c0ff)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 0 40px rgba(84,104,255,.4)',
                }}
              >
                {wartende === 0 ? 'Sofort' : `≈ ${wartezeitMin} Min`}
              </div>
              <div className="text-[13px] text-snippt-muted">
                {wartende === 0 ? (
                  'Niemand wartet gerade — du kommst direkt dran'
                ) : (
                  <>
                    <b className="text-snippt-ink">{wartende}</b> in der Reihe vor dir
                  </>
                )}
              </div>
              <AnstellenButton slug={slug} />
            </div>
            <p className="mt-[11px] text-center text-[12px] text-snippt-faint">
              Du wirst benachrichtigt, sobald du dran bist.
            </p>
          </>
        )}

        {/* Stempelkarte */}
        <div
          className="mt-auto rounded-[18px] p-[16px_18px]"
          style={{
            background: 'linear-gradient(120deg,rgba(255,138,76,.10),rgba(255,138,76,.02))',
            border: '1px solid rgba(255,138,76,.18)',
          }}
        >
          <div className="mb-[11px] flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-[0.14em] text-snippt-ember">Stempelkarte</span>
            <span className="font-display text-[15px] text-snippt-ink">
              {stempelHaben} / {stempelGesamt}
            </span>
          </div>
          <div className="flex flex-wrap gap-[7px]">
            {Array.from({ length: stempelGesamt }).map((_, i) => (
              <i
                key={i}
                className="h-[18px] w-[18px] rounded-full"
                style={
                  i < stempelHaben
                    ? {
                        background: 'radial-gradient(circle at 35% 30%,#ffb88a,#FF8A4C)',
                        boxShadow: '0 0 10px -1px #FF8A4C',
                      }
                    : { border: '1px solid rgba(255,138,76,.35)' }
                }
              />
            ))}
          </div>
          <div className="mt-[11px] text-[12px] text-snippt-muted">
            Noch <b className="text-snippt-ink">{Math.max(stempelGesamt - stempelHaben, 0)} Schnitte</b> bis {belohnung}.
          </div>
        </div>

        <div className="mt-[14px] flex items-center justify-center gap-2 text-[12px] text-snippt-faint">
          Tipp:{' '}
          <span className="rounded-[6px] border border-white/[0.07] px-[7px] py-[2px] text-snippt-muted">Teilen</span>{' '}
          → „Zum Home-Bildschirm" · immer dabei
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: friseur } = await supabase
    .from('friseur')
    .select('name')
    .eq('slug', slug)
    .single()

  return {
    title: friseur ? `${friseur.name} — bei Snippt anstellen` : 'Friseur nicht gefunden',
  }
}
