import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckinFlow } from '../_components/CheckinFlow'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ c?: string }>
}

export default async function CheckinPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { c } = await searchParams
  const supabase = await createClient()

  const { data: friseur } = await supabase
    .from('friseur')
    .select('name, slug, foto_url')
    .eq('slug', slug)
    .single()

  if (!friseur) notFound()

  return (
    <main className="snippt-grain relative flex min-h-screen flex-col overflow-hidden bg-snippt-bg font-body text-snippt-ink">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(60% 45% at 18% 4%, rgba(84,104,255,.20), transparent 60%),' +
            'radial-gradient(50% 40% at 88% 16%, rgba(43,231,255,.13), transparent 60%),' +
            'linear-gradient(180deg,#08080B,#0C0C12)',
        }}
      />

      <div className="relative z-[1] mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-12">
        <div className="mb-6 flex items-center gap-[14px]">
          {friseur.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={friseur.foto_url}
              alt={friseur.name}
              className="h-[54px] w-[54px] flex-none rounded-[18px] object-cover"
              style={{ boxShadow: '0 0 0 1px rgba(255,255,255,.12), 0 0 22px -6px #5468FF' }}
            />
          ) : (
            <div
              className="grid h-[54px] w-[54px] flex-none place-items-center rounded-[18px] font-display text-xl"
              style={{ background: 'linear-gradient(135deg,#2a2a40,#15151f)', boxShadow: '0 0 0 1px rgba(255,255,255,.12)' }}
            >
              {friseur.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="text-[12px] uppercase tracking-[0.16em] text-snippt-muted">Du bist bei</div>
            <h1 className="font-display text-[20px] font-semibold tracking-tight">{friseur.name}</h1>
          </div>
        </div>

        <CheckinFlow slug={slug} code={c ?? ''} />

        <p className="mt-5 text-center text-[12px] text-snippt-faint">
          Noch nicht im Laden?{' '}
          <Link href={`/${slug}`} className="text-snippt-glow2 hover:text-snippt-ink">
            Hier vorab anstellen
          </Link>
        </p>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: friseur } = await supabase.from('friseur').select('name').eq('slug', slug).single()
  return { title: friseur ? `${friseur.name} — ich bin da` : 'Friseur nicht gefunden' }
}
