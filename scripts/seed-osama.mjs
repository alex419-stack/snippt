// ============================================================
// Reset/Seed für die Pilot-Demo „Osama" (osi-barbier)
// ------------------------------------------------------------
// Stellt jederzeit einen frischen Demo-Stand her: Profil sicher gesetzt, Reihe
// geleert, 2 wartende Fake-Kunden gesetzt — damit der Tablet-Kunde auf Platz 3
// landet und der „Du bist dran"-Moment Dramaturgie hat.
//
// WIEDERHOLBAR: beliebig oft.  Aufruf:  npm run seed
//
// Braucht KEINEN geheimen Service-Key: Das Skript meldet sich als Osama an und
// räumt nur dessen eigene Reihe auf — genau das, was die Sicherheitsregeln (RLS)
// einem eingeloggten Friseur für seine eigenen Daten erlauben. Es nutzt nur die
// öffentlichen Werte aus .env.local (URL + anon-Key).
//
// Voraussetzung: Das Osama-Konto existiert bereits (einmalig angelegt). Falls
// nicht, schlägt der Login fehl und das Skript sagt das deutlich.
// ============================================================

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// .env.local von Hand einlesen (kein dotenv nötig).
function ladeEnv() {
  const text = readFileSync(join(__dirname, '..', '.env.local'), 'utf8')
  const env = {}
  for (const zeile of text.split(/\r?\n/)) {
    const m = zeile.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
  }
  return env
}

const env = ladeEnv()
const SB_URL = env.NEXT_PUBLIC_SUPABASE_URL
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!SB_URL || !ANON) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL oder NEXT_PUBLIC_SUPABASE_ANON_KEY fehlt in .env.local')
  process.exit(1)
}

// --- Demo-Konstanten ---
const EMAIL = 'osama@snippt.de'
const PASSWORT = 'Osama2026!'
const SLUG = 'osi-barbier'
const PROFIL = {
  name: 'Osama',
  slug: SLUG,
  rolle: 'Barber',
  bio: 'Fades, Bärte, klassische Schnitte. Seit 8 Jahren im Viertel — du kommst rein, ich mach den Rest.',
  spezialitaeten: 'Skin Fade, Bart-Konturen, Hot Towel Shave, Kids Cut',
  instagram: 'osibarbier',
  stempel_anzahl: 10,
  stempel_belohnung: '1 Schnitt gratis',
  modus: 'warteschlange',
  slot_minuten: 30,
  foto_url: null, // Platzhalter „O" im Markenstil (siehe Kundenseite)
}
const FAKE_WARTENDE = [
  { gast_name: 'Mehmet K.', vorMin: 22, status: 'da' },      // schon im Laden
  { gast_name: 'Luca', vorMin: 13, status: 'wartend' },      // noch unterwegs (von zuhause)
]

const supabase = createClient(SB_URL, ANON, { auth: { persistSession: false } })

async function main() {
  console.log('→ Reset startet gegen', SB_URL)

  // 1. Als Osama anmelden (RLS gibt danach Zugriff auf seine eigenen Daten)
  const { data: login, error: loginErr } = await supabase.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORT,
  })
  if (loginErr || !login?.user) {
    console.error('❌ Login als Osama fehlgeschlagen:', loginErr?.message ?? 'unbekannt')
    console.error('   Das Osama-Konto muss einmalig angelegt sein (osama@snippt.de).')
    process.exit(1)
  }

  // 2. Eigene friseur-Zeile holen
  const { data: friseur, error: fErr } = await supabase
    .from('friseur')
    .select('id')
    .eq('user_id', login.user.id)
    .single()
  if (fErr || !friseur) {
    console.error('❌ friseur-Profil nicht gefunden:', fErr?.message ?? 'keine Zeile')
    process.exit(1)
  }
  const friseurId = friseur.id

  // 3. Profil sicher setzen (Personalbranding + Stempelkarte)
  const { error: updErr } = await supabase.from('friseur').update(PROFIL).eq('id', friseurId)
  if (updErr) throw updErr
  console.log('→ Profil gesetzt:', PROFIL.name, '/', SLUG)

  // 4. Reihe, Stempel, Kunden frisch leeren (nur eigene — RLS-gesichert)
  await supabase.from('stempel').delete().eq('friseur_id', friseurId)
  await supabase.from('warteschlange').delete().eq('friseur_id', friseurId)
  await supabase.from('kunde').delete().eq('friseur_id', friseurId)
  console.log('→ Reihe geleert')

  // 5. Fake-Wartende einreihen (gestaffelte Zeiten -> stabile Reihenfolge)
  const jetzt = Date.now()
  const zeilen = FAKE_WARTENDE.map((f) => ({
    friseur_id: friseurId,
    gast_name: f.gast_name,
    status: f.status,
    eingereiht_at: new Date(jetzt - f.vorMin * 60_000).toISOString(),
  }))
  const { error: insErr } = await supabase.from('warteschlange').insert(zeilen)
  if (insErr) throw insErr
  console.log('→', zeilen.length, 'Fake-Wartende gesetzt:', FAKE_WARTENDE.map((f) => f.gast_name).join(', '))

  console.log('\n✅ Fertig. Demo bereit.')
  console.log('   Friseur-Login :', EMAIL, '/', PASSWORT)
  console.log('   Kundenseite   : /' + SLUG)
  console.log('   Tablet-Kunde landet auf Platz 3 (2 warten bereits).')
}

main().catch((e) => {
  console.error('❌ Reset fehlgeschlagen:', e.message ?? e)
  process.exit(1)
})
