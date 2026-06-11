'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function PasswortVergessenPage() {
  const [email, setEmail] = useState('')
  const [info, setInfo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function absenden(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setInfo(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/passwort-neu`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Bewusst neutrale Bestätigung (verrät nicht, ob die E-Mail existiert).
    setInfo('Wenn es ein Konto mit dieser E-Mail gibt, haben wir dir gerade einen Link zum Zurücksetzen geschickt.')
    setLoading(false)
  }

  const feld =
    'w-full rounded-[14px] border border-white/[0.1] bg-white/[0.03] px-4 py-[13px] text-[15px] text-snippt-ink placeholder:text-snippt-faint outline-none focus:border-snippt-glow1/60'

  return (
    <main className="snippt-grain relative flex min-h-screen items-center justify-center overflow-hidden bg-snippt-bg font-body text-snippt-ink">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(60% 45% at 50% 0%, rgba(84,104,255,.18), transparent 60%),' +
            'radial-gradient(40% 35% at 85% 90%, rgba(43,231,255,.10), transparent 60%),' +
            'linear-gradient(180deg,#08080B,#0C0C12)',
        }}
      />
      <div className="relative z-[1] w-full max-w-sm px-6 py-16">
        <div className="text-center">
          <Link href="/" className="font-display text-3xl font-semibold tracking-tight">
            <span style={{ background: 'linear-gradient(100deg,#5468FF,#2BE7FF)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              Snippt
            </span>
          </Link>
          <p className="mt-2 text-[14px] text-snippt-muted">Passwort vergessen? Kein Problem.</p>
        </div>

        <div className="mt-8 rounded-[20px] border border-white/[0.08] bg-snippt-surface/80 p-7">
          {error && (
            <div className="mb-5 rounded-[12px] border border-snippt-weg/30 bg-snippt-weg/10 px-4 py-3 text-[13px] text-snippt-weg">
              {error}
            </div>
          )}
          {info ? (
            <div className="rounded-[12px] border border-snippt-glow2/30 bg-snippt-glow2/10 px-4 py-3 text-[13px] text-snippt-glow2">
              {info}
            </div>
          ) : (
            <form onSubmit={absenden} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-[6px] block text-[12px] uppercase tracking-[0.12em] text-snippt-faint">
                  E-Mail
                </label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={feld} />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[16px] p-[15px] text-[16px] font-semibold text-[#070710] disabled:opacity-50"
                style={{ background: 'linear-gradient(100deg,#2BE7FF,#5468FF)', boxShadow: '0 12px 34px -10px rgba(84,104,255,.8)' }}
              >
                {loading ? 'Wird gesendet …' : 'Link zum Zurücksetzen senden'}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-[14px] text-snippt-muted">
          <Link href="/login" className="font-medium text-snippt-glow2 hover:text-snippt-ink">
            Zurück zur Anmeldung
          </Link>
        </p>
      </div>
    </main>
  )
}
