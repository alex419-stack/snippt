import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import QRCode from 'qrcode'
import { DruckButton } from '../_components/DruckButton'

export default async function QrPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: friseur } = await supabase
    .from('friseur')
    .select('name, slug, checkin_code')
    .eq('user_id', user.id)
    .single()
  if (!friseur) redirect('/dashboard')

  // Basis-URL aus dem aktuellen Host ableiten (lokal http, sonst https).
  const h = await headers()
  const host = h.get('host') ?? 'snippt.de'
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https'
  const url = `${proto}://${host}/${friseur.slug}/checkin?c=${friseur.checkin_code}`

  const qr = await QRCode.toDataURL(url, {
    width: 600,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#0C0C12', light: '#FFFFFF' },
  })

  return (
    <main className="relative min-h-screen overflow-hidden bg-snippt-bg font-body text-snippt-ink print:bg-white">
      <div
        className="pointer-events-none fixed inset-0 z-0 print:hidden"
        style={{
          background:
            'radial-gradient(60% 45% at 18% 4%, rgba(84,104,255,.18), transparent 60%),' +
            'radial-gradient(50% 40% at 88% 16%, rgba(43,231,255,.12), transparent 60%),' +
            'linear-gradient(180deg,#08080B,#0C0C12)',
        }}
      />

      <div className="relative z-[1] mx-auto w-full max-w-md px-5 py-10 print:py-0">
        <div className="mb-6 print:hidden">
          <Link href="/dashboard" className="text-[13px] text-snippt-glow2 hover:text-snippt-ink">
            ← Zurück zur Reihe
          </Link>
          <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight">Dein Laden-Schild</h1>
          <p className="mt-1 text-[14px] text-snippt-muted">
            Druck das Schild aus und stell es an deinen Platz. Kunden scannen den Code, um sich
            als „da" anzumelden — das funktioniert nur hier vor Ort, nicht von zu Hause.
          </p>
        </div>

        {/* Das Schild — druckbar (heller Hintergrund, dunkler QR) */}
        <div
          className="mx-auto max-w-[360px] rounded-[24px] bg-white p-8 text-center text-[#0C0C12] print:rounded-none print:shadow-none"
          style={{ boxShadow: '0 20px 60px -20px rgba(0,0,0,.6)' }}
        >
          <div className="font-display text-[26px] font-semibold tracking-tight">Bist du dran?</div>
          <p className="mt-2 text-[14px] text-[#555]">
            Scan mich, wenn du im Laden bist — dann weiß {friseur.name}, dass du da bist.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="QR-Code zum Einchecken" className="mx-auto mt-5 h-auto w-full max-w-[260px]" />
          <div className="mt-4 font-display text-[19px] font-semibold tracking-tight">{friseur.name}</div>
          <div className="mt-1 text-[12px] text-[#888]">snippt.de/{friseur.slug}</div>
        </div>

        <div className="mt-7 flex items-center justify-center print:hidden">
          <DruckButton />
        </div>
      </div>
    </main>
  )
}
