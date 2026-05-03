'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    return value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
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

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm space-y-8">
        {/* Wordmark */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl font-semibold tracking-tight text-ink">
              Snippt
            </span>
          </Link>
          <p className="text-sm text-coal/60">Richte dein persönliches Friseur-Profil ein.</p>
        </div>

        {/* Form-Card */}
        <div className="rounded-2xl border border-bone/10 bg-surface p-7 space-y-6">
          {/* Error-Banner — Gold statt Rot */}
          {error && (
            <div className="rounded-lg border border-whiskey/25 bg-whiskey/8 px-4 py-3 text-sm text-whiskey/90">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-coal/80">
                Dein Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (!slug) setSlug(generateSlug(e.target.value))
                }}
                required
                className="border-bone/15 bg-bone/5 text-ink placeholder:text-coal/35 focus-visible:ring-whiskey/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug" className="text-sm font-medium text-coal/80">
                Deine Buchungs-URL
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-coal/50 whitespace-nowrap">snippt.de/</span>
                <Input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  required
                  className="border-bone/15 bg-bone/5 text-ink placeholder:text-coal/35 focus-visible:ring-whiskey/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-coal/80">
                E-Mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="border-bone/15 bg-bone/5 text-ink placeholder:text-coal/35 focus-visible:ring-whiskey/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-coal/80">
                Passwort
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="border-bone/15 bg-bone/5 text-ink placeholder:text-coal/35 focus-visible:ring-whiskey/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-ink text-bone hover:bg-ink/90"
              disabled={loading}
            >
              {loading ? 'Wird erstellt…' : 'Konto erstellen'}
            </Button>
          </form>
        </div>

        <p className="text-sm text-center text-coal/55">
          Bereits ein Konto?{' '}
          <Link href="/login" className="font-medium text-ink hover:text-whiskey transition-colors">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  )
}
