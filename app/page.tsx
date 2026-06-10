import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

// Startseite (Landing) im Snippt-v1-Design: dunkel, leuchtend (Indigo/Cyan),
// Orange nur als Akzent für die Stempelkarte. Botschaft nach dem Pivot:
// einzelner Friseur, Live-Reihe ohne Uhrzeiten, Stammkunden-Bindung.

// Hintergrund-Glühen — identisch zum Look der echten App-Seiten.
const glow = (
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
)

// Die drei Kern-Vorteile. accent = Glow-Farbe der jeweiligen Karte.
const vorteile = [
  {
    accent: '#5468FF',
    titel: 'Live-Reihe ohne Uhrzeiten',
    text: 'Dein Kunde stellt sich mit einem Tap an und sieht seine Position in Echtzeit. Keine versprochenen Uhrzeiten, kein Anruf — nur deine Reihenfolge.',
  },
  {
    accent: '#2BE7FF',
    titel: 'Du bist die Marke',
    text: 'Dein Profil, dein Name, dein Foto. Der Kunde landet bei dir — nicht bei „irgendeinem Stuhl" im Salon.',
  },
  {
    accent: '#FF8A4C',
    titel: 'Digitale Stempelkarte',
    text: 'Jeder Schnitt ein Stempel, der zehnte gratis. So wird aus Laufkundschaft Schritt für Schritt Stammkundschaft.',
  },
]

export default function HomePage() {
  return (
    <main className="snippt-grain relative min-h-screen overflow-hidden bg-snippt-bg font-body text-snippt-ink">
      {glow}

      <div className="relative z-[1] mx-auto w-full max-w-3xl px-5 pb-16 pt-14 md:pt-20">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="text-center">
          <span className="inline-flex items-center gap-[7px] text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
            <span className="snippt-pulse h-[7px] w-[7px] rounded-full bg-snippt-glow2 shadow-[0_0_10px] shadow-snippt-glow2" />
            Live · für Friseure
          </span>

          <h1 className="mt-5 font-display text-[40px] font-semibold leading-none tracking-tight md:text-[56px]">
            Snippt
          </h1>

          <h2
            className="mx-auto mt-5 max-w-[18ch] font-display text-[30px] font-semibold leading-[1.08] tracking-tight md:text-[44px]"
            style={{
              background: 'linear-gradient(180deg,#fff,#b9c0ff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 0 40px rgba(84,104,255,.35)',
            }}
          >
            Deine Kunden bleiben bei dir.
          </h2>

          <p className="mx-auto mt-5 max-w-[46ch] text-[15px] leading-relaxed text-snippt-muted md:text-[17px]">
            Der Kunde will zu dir — aber du bist gerade besetzt. Mit Snippt stellt
            er sich in deine Live-Reihe, statt zum Kollegen am Nachbarstuhl zu
            wechseln. Keine Uhrzeiten, kein Anruf — nur deine Reihenfolge.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[16px] px-7 py-[16px] text-[16px] font-semibold text-[#070710] sm:w-auto"
              style={{
                background: 'linear-gradient(100deg,#2BE7FF,#5468FF)',
                boxShadow:
                  '0 12px 34px -10px rgba(84,104,255,.8), inset 0 0 0 1px rgba(255,255,255,.12)',
              }}
            >
              Kostenlos starten
              <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-[16px] border border-white/[0.14] px-7 py-[16px] text-[16px] font-semibold text-snippt-ink transition-colors hover:border-white/30 hover:bg-white/[0.04] sm:w-auto"
            >
              Anmelden
            </Link>
          </div>

          <div className="mt-5">
            <Link
              href="/demo"
              className="text-[13px] font-medium text-snippt-glow2 transition-colors hover:text-snippt-ink"
            >
              Live-Demo ansehen →
            </Link>
          </div>
        </section>

        {/* ── Hero-Vorschau: kleine Live-Reihe als Hingucker ──────── */}
        <section className="mt-12">
          <div
            className="relative mx-auto max-w-md overflow-hidden rounded-[22px] border border-white/[0.10] p-[18px]"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 0%, rgba(84,104,255,.20), transparent 60%), #141420',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.05)',
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.16em] text-snippt-glow2">
                Deine Reihe
              </span>
              <span className="text-[12px] text-snippt-faint">2 warten</span>
            </div>

            <div className="relative flex flex-col gap-[10px] pl-[24px]">
              {/* leuchtende Verbindungslinie */}
              <div
                className="absolute left-[8px] top-[6px] bottom-[6px] w-[2px] rounded-full"
                style={{
                  background: 'linear-gradient(180deg,#2BE7FF,#5468FF 60%,transparent)',
                  boxShadow: '0 0 14px rgba(84,104,255,.6)',
                }}
              />
              <div className="absolute left-[2px] top-[18px] h-[12px] w-[12px] rounded-full border-2 border-snippt-glow1 bg-snippt-bg shadow-[0_0_10px] shadow-snippt-glow1" />

              <div
                className="rounded-2xl p-[13px]"
                style={{
                  backgroundImage:
                    'radial-gradient(120% 120% at 0% 0%, rgba(84,104,255,.22), transparent 60%)',
                  boxShadow: '0 0 0 1px rgba(84,104,255,.45)',
                }}
              >
                <div className="text-[10px] uppercase tracking-[0.16em] text-snippt-glow2">
                  Jetzt dran
                </div>
                <div className="mt-[3px] flex items-center justify-between">
                  <b className="text-[14px] font-semibold">Mert K.</b>
                  <span className="text-[11px] text-snippt-da">ist da</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-snippt-surface p-[13px]">
                <div className="flex items-center justify-between">
                  <b className="text-[14px] font-semibold">Deniz</b>
                  <span className="text-[11px] text-snippt-faint">seit 6 Min</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-snippt-surface p-[13px]">
                <div className="flex items-center justify-between">
                  <b className="text-[14px] font-semibold">Jonas</b>
                  <span className="text-[11px] text-snippt-faint">unterwegs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── So funktioniert's ──────────────────────────────────── */}
        <section className="mt-16">
          <h3 className="text-center font-display text-[22px] font-semibold tracking-tight md:text-[26px]">
            So funktioniert's
          </h3>

          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
            {vorteile.map((v) => (
              <div
                key={v.titel}
                className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-snippt-surface p-[20px]"
              >
                <span
                  className="block h-[10px] w-[10px] rounded-full"
                  style={{ background: v.accent, boxShadow: `0 0 14px ${v.accent}` }}
                />
                <h4 className="mt-4 font-display text-[17px] font-semibold tracking-tight">
                  {v.titel}
                </h4>
                <p className="mt-2 text-[13px] leading-relaxed text-snippt-muted">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Abschluss-Band ─────────────────────────────────────── */}
        <section className="mt-16">
          <div
            className="relative overflow-hidden rounded-[22px] border border-white/[0.10] px-6 py-10 text-center"
            style={{
              background:
                'radial-gradient(120% 120% at 50% 0%, rgba(43,231,255,.14), transparent 60%), #141420',
            }}
          >
            <h3 className="mx-auto max-w-[22ch] font-display text-[24px] font-semibold leading-tight tracking-tight md:text-[30px]">
              Bereit, deine Stammkunden zu halten?
            </h3>
            <Link
              href="/register"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-[16px] px-8 py-[16px] text-[16px] font-semibold text-[#070710]"
              style={{
                background: 'linear-gradient(100deg,#2BE7FF,#5468FF)',
                boxShadow: '0 12px 34px -10px rgba(84,104,255,.8)',
              }}
            >
              Kostenlos starten
              <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </Link>
          </div>
        </section>

        {/* ── Fußzeile ───────────────────────────────────────────── */}
        <footer className="mt-14 flex flex-col items-center gap-3 border-t border-white/[0.07] pt-7 text-[12px] text-snippt-faint sm:flex-row sm:justify-between">
          <span className="font-display text-[15px] font-semibold tracking-tight text-snippt-ink">
            Snippt
          </span>
          <div className="flex items-center gap-5">
            <Link href="/demo" className="transition-colors hover:text-snippt-muted">
              Demo
            </Link>
            <Link href="/login" className="transition-colors hover:text-snippt-muted">
              Anmelden
            </Link>
            <Link href="/register" className="transition-colors hover:text-snippt-muted">
              Starten
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
