'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const RESERVED_SLUGS = new Set([
  'dashboard', 'login', 'register', 'auth', 'api',
  'admin', 'settings', 'profile', 'help', 'about',
  'contact', 'pricing', 'terms', 'privacy', 'imprint',
])

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function generateSlug(value: string) {
    return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (RESERVED_SLUGS.has(slug)) {
      setError(`„${slug}" ist eine reservierte Adresse. Bitte wähle einen anderen Namen.`)
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { name, slug },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  const feld =
    'w-full rounded-[14px] border border-white/[0.1] bg-white/[0.03] px-4 py-[13px] text-[15px] text-snippt-ink placeholder:text-snippt-faint outline-none focus:border-snippt-glow1/60'
  const label = 'mb-[6px] block text-[12px] uppercase tracking-[0.12em] text-snippt-faint'

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
            <span
              style={{
                background: 'linear-gradient(100deg,#5468FF,#2BE7FF)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Snippt
            </span>
          </Link>
          <p className="mt-2 text-[14px] text-snippt-muted">Richte dein persönliches Friseur-Profil ein.</p>
        </div>

        <div className="mt-8 rounded-[20px] border border-white/[0.08] bg-snippt-surface/80 p-7">
          {error && (
            <div className="mb-5 rounded-[12px] border border-snippt-weg/30 bg-snippt-weg/10 px-4 py-3 text-[13px] text-snippt-weg">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className={label}>Dein Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (!slug) setSlug(generateSlug(e.target.value))
                }}
                required
                className={feld}
              />
            </div>
            <div>
              <label htmlFor="slug" className={label}>Deine Adresse</label>
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap text-[14px] text-snippt-faint">snippt.de/</span>
                <input id="slug" type="text" value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} required className={feld} />
              </div>
            </div>
            <div>
              <label htmlFor="email" className={label}>E-Mail</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={feld} />
            </div>
            <div>
              <label htmlFor="password" className={label}>Passwort</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" className={feld} />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[16px] p-[15px] text-[16px] font-semibold text-[#070710] disabled:opacity-50"
              style={{
                background: 'linear-gradient(100deg,#2BE7FF,#5468FF)',
                boxShadow: '0 12px 34px -10px rgba(84,104,255,.8)',
              }}
            >
              {loading ? 'Wird erstellt …' : 'Konto erstellen'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[14px] text-snippt-muted">
          Bereits ein Konto?{' '}
          <Link href="/login" className="font-medium text-snippt-glow2 hover:text-snippt-ink">
            Anmelden
          </Link>
        </p>
      </div>
    </main>
  )
}
