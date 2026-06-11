import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  // Kein Auth-Code im Query-Parameter vorhanden
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no-code`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  // Code-Austausch gegen Session fehlgeschlagen
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  // `next` nur als interne, relative Route zulassen (verhindert Open-Redirect).
  // Wird z. B. beim Passwort-Zurücksetzen auf /passwort-neu gesetzt.
  const ziel = next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
  return NextResponse.redirect(`${origin}${ziel}`)
}
