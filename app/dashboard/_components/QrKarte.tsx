import { headers } from 'next/headers'
import QRCode from 'qrcode'

// QR-Karte direkt auf dem Dashboard: der Friseur hält sein Handy hin, der Kunde
// scannt mit dem eigenen Gerät und landet auf der öffentlichen Anstell-Seite
// (/[slug]). Das ist NICHT das Druck-Schild unter /dashboard/qr — jenes zeigt
// auf den Vor-Ort-Checkin. Hier geht es ums spontane Anstellen.
export async function QrKarte({ slug }: { slug: string }) {
  // Basis-URL aus dem aktuellen Host ableiten (lokal http, live https).
  const h = await headers()
  const host = h.get('host') ?? 'snippt.de'
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https'
  const url = `${proto}://${host}/${slug}`

  const qr = await QRCode.toDataURL(url, {
    width: 480,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#0C0C12', light: '#FFFFFF' },
  })

  return (
    <div
      className="mb-5 flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-snippt-surface p-4"
      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.04)' }}
    >
      <div className="rounded-[14px] bg-white p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="QR-Code zum Anstellen" className="h-[104px] w-[104px]" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">Zum Anstellen scannen</div>
        <p className="mt-1 text-[13px] leading-snug text-snippt-muted">
          Kunde scannt mit dem Handy und stellt sich selbst in die Reihe.
        </p>
        <div className="mt-2 truncate text-[12px] text-snippt-faint">snippt.de/{slug}</div>
      </div>
    </div>
  )
}
