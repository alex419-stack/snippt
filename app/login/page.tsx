'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
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
          <p className="text-sm text-coal/60">Melde dich mit deiner E-Mail an.</p>
        </div>

        {/* Form-Card */}
        <div className="rounded-2xl border border-bone/10 bg-surface p-7 space-y-6">
          {/* Error-Banner — Gold statt Rot (Anti-Toxizität) */}
          {error && (
            <div className="rounded-lg border border-whiskey/25 bg-whiskey/8 px-4 py-3 text-sm text-whiskey/90">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
                autoComplete="current-password"
                className="border-bone/15 bg-bone/5 text-ink placeholder:text-coal/35 focus-visible:ring-whiskey/50"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-ink text-bone hover:bg-ink/90"
              disabled={loading}
            >
              {loading ? 'Wird angemeldet…' : 'Anmelden'}
            </Button>
          </form>
        </div>

        <p className="text-sm text-center text-coal/55">
          Noch kein Konto?{' '}
          <Link href="/register" className="font-medium text-ink hover:text-whiskey transition-colors">
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  )
}
