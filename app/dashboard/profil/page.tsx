import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { profilSpeichern } from '../actions'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: friseur } = await supabase
    .from('friseur')
    .select('name, slug, rolle, bio, spezialitaeten, instagram, foto_url')
    .eq('user_id', user.id)
    .single()

  const feld =
    'w-full rounded-[14px] border border-white/[0.1] bg-white/[0.03] px-4 py-[13px] text-[15px] text-snippt-ink placeholder:text-snippt-faint outline-none focus:border-snippt-glow1/60'
  const label = 'mb-[6px] block text-[12px] uppercase tracking-[0.12em] text-snippt-faint'

  return (
    <main className="snippt-grain relative min-h-screen overflow-hidden bg-snippt-bg font-body text-snippt-ink">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(60% 45% at 18% 4%, rgba(84,104,255,.18), transparent 60%),' +
            'radial-gradient(50% 40% at 88% 16%, rgba(43,231,255,.12), transparent 60%),' +
            'linear-gradient(180deg,#08080B,#0C0C12)',
        }}
      />
      <div className="relative z-[1] mx-auto w-full max-w-md px-5 pb-16 pt-12">
        <Link href="/dashboard" className="text-[13px] text-snippt-muted hover:text-snippt-ink">
          ← Zurück zur Reihe
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">Dein Profil</h1>
        <p className="mt-1 text-[13px] text-snippt-faint">
          Das sehen deine Kunden auf snippt.de/{friseur?.slug ?? 'dein-name'}. Mach es zu deiner Marke.
        </p>

        <form action={profilSpeichern} className="mt-7 space-y-5">
          <div>
            <label className={label} htmlFor="name">Name</label>
            <input id="name" name="name" defaultValue={friseur?.name ?? ''} className={feld} placeholder="z. B. Mehmet Yılmaz" />
          </div>
          <div>
            <label className={label} htmlFor="rolle">Kurzbeschreibung</label>
            <input id="rolle" name="rolle" defaultValue={friseur?.rolle ?? ''} className={feld} placeholder="z. B. Fades & Classic Cuts" />
          </div>
          <div>
            <label className={label} htmlFor="bio">Über dich</label>
            <textarea id="bio" name="bio" defaultValue={friseur?.bio ?? ''} rows={3} className={feld} placeholder="Ein, zwei Sätze über dich und deinen Stil." />
          </div>
          <div>
            <label className={label} htmlFor="spezialitaeten">Spezialitäten</label>
            <input id="spezialitaeten" name="spezialitaeten" defaultValue={friseur?.spezialitaeten ?? ''} className={feld} placeholder="kommagetrennt: Fade, Bart, Classic Cut" />
            <p className="mt-[6px] text-[11px] text-snippt-faint">Mit Komma trennen — erscheinen als Schlagworte.</p>
          </div>
          <div>
            <label className={label} htmlFor="instagram">Instagram</label>
            <input id="instagram" name="instagram" defaultValue={friseur?.instagram ?? ''} className={feld} placeholder="dein.handle (ohne @)" />
          </div>
          <div>
            <label className={label} htmlFor="foto_url">Foto-Link</label>
            <input id="foto_url" name="foto_url" defaultValue={friseur?.foto_url ?? ''} className={feld} placeholder="https://…/foto.jpg" />
            <p className="mt-[6px] text-[11px] text-snippt-faint">Vorerst per Link. Direktes Hochladen kommt später.</p>
          </div>

          <button
            type="submit"
            className="w-full rounded-[16px] p-[16px] text-[16px] font-semibold text-[#070710]"
            style={{
              background: 'linear-gradient(100deg,#2BE7FF,#5468FF)',
              boxShadow: '0 12px 34px -10px rgba(84,104,255,.8), inset 0 0 0 1px rgba(255,255,255,.12)',
            }}
          >
            Profil speichern
          </button>
        </form>
      </div>
    </main>
  )
}
