'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { waehleEinzuloesendeStempel } from '@/lib/stempel'
import { sendeDuBistDran } from '@/lib/whatsapp'

const AKTIV = ['wartend', 'unterwegs', 'da', 'aufgerufen']

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

// Gemeinsamer Ablauf für beide Abschluss-Wege: aktuellen Eintrag schließen,
// optionalen Stempel-Schritt ausführen, nächsten aktiven Eintrag aufrufen.
// `stempelSchritt` bekommt die verknüpfte kunde_id (oder null) und erledigt
// das Stempel-Handling (vergeben ODER einlösen). Läuft als eingeloggter
// Friseur — RLS stellt sicher, dass nur eigene Einträge verändert werden.
async function abschliessenUndNaechsten(
  eintragId: string,
  stempelSchritt: (
    supabase: SupabaseServerClient,
    friseurId: string,
    kundeId: string | null,
  ) => Promise<void>,
) {
  if (!eintragId) return

  const supabase = await createClient()
  const friseur = await eingeloggterFriseur(supabase)
  if (!friseur) return

  // 1. Aktuellen Eintrag abschließen und dabei direkt die verknüpfte kunde_id zurückgeben.
  //    Der Status-Guard macht den Aufruf idempotent: ein zweiter Klick (Doppeltipp,
  //    Retry) matcht nicht mehr -> kein doppelter Stempel / keine Doppelverarbeitung.
  const { data: abgeschlossen } = await supabase
    .from('warteschlange')
    .update({ status: 'fertig', fertig_at: new Date().toISOString() })
    .eq('id', eintragId)
    .eq('friseur_id', friseur.id)
    .in('status', AKTIV)
    .select('kunde_id')
    .maybeSingle()

  // 2. Stempel-Schritt (vergeben oder einlösen), nur wenn ein Kunde verknüpft ist
  await stempelSchritt(supabase, friseur.id, (abgeschlossen?.kunde_id as string | null) ?? null)

  // 3. Nächsten aktiven Eintrag (frühester) aufrufen
  const { data: naechster } = await supabase
    .from('warteschlange')
    .select('id, gast_name, gast_telefon')
    .eq('friseur_id', friseur.id)
    .in('status', AKTIV)
    .order('eingereiht_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (naechster) {
    await supabase
      .from('warteschlange')
      .update({ status: 'aufgerufen', aufgerufen_at: new Date().toISOString() })
      .eq('id', naechster.id)
      .eq('friseur_id', friseur.id)

    // „Du bist dran"-WhatsApp an den aufgerufenen Kunden. Robust: bricht den
    // Ablauf nie ab; ohne hinterlegte Meta-Konfiguration passiert einfach nichts.
    await sendeDuBistDran({
      telefon: (naechster.gast_telefon as string | null) ?? null,
      kundeName: (naechster.gast_name as string | null) ?? null,
      friseurName: friseur.name,
    })
  }

  revalidatePath('/dashboard')
}

// Friseur schließt den aktuellen Schnitt ab und ruft den Nächsten auf.
// Vergibt automatisch einen Stempel, falls ein erkannter Kunde verknüpft ist.
export async function fertigNaechster(formData: FormData) {
  const eintragId = String(formData.get('eintragId') ?? '')
  await abschliessenUndNaechsten(eintragId, async (supabase, friseurId, kundeId) => {
    if (kundeId) {
      await supabase.from('stempel').insert({ kunde_id: kundeId, friseur_id: friseurId })
    }
  })
}

// Friseur löst eine volle Stempelkarte als Gratis-Schnitt ein und ruft den
// Nächsten auf. Markiert die ältesten `ziel` offenen Stempel als eingelöst und
// vergibt KEINEN neuen Stempel (dieser Schnitt ist die Belohnung selbst).
export async function belohnungEinloesen(formData: FormData) {
  const eintragId = String(formData.get('eintragId') ?? '')
  await abschliessenUndNaechsten(eintragId, async (supabase, friseurId, kundeId) => {
    if (!kundeId) return

    // Ziel (Stempelanzahl) des Friseurs laden
    const { data: f } = await supabase
      .from('friseur')
      .select('stempel_anzahl')
      .eq('id', friseurId)
      .single()
    const ziel = (f?.stempel_anzahl as number | null) ?? null

    // Offene Stempel des Kunden, älteste zuerst
    const { data: offene } = await supabase
      .from('stempel')
      .select('id')
      .eq('kunde_id', kundeId)
      .eq('friseur_id', friseurId)
      .is('eingeloest_at', null)
      .order('vergeben_at', { ascending: true })

    const ids = (offene ?? []).map((s) => s.id as string)
    const einzuloesen = waehleEinzuloesendeStempel(ids, ziel)
    if (einzuloesen.length === 0) return

    await supabase
      .from('stempel')
      .update({ eingeloest_at: new Date().toISOString() })
      .in('id', einzuloesen)
      .eq('friseur_id', friseurId)
  })
}

// Holt die friseur-Zeile des eingeloggten Nutzers (oder null). Reduziert die
// wiederkehrende Auth→Friseur-Abfrage in den Aktionen unten.
async function eingeloggterFriseur(
  supabase: SupabaseServerClient,
): Promise<{ id: string; name: string } | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('friseur')
    .select('id, name')
    .eq('user_id', user.id)
    .maybeSingle()
  return (data as { id: string; name: string } | null) ?? null
}

// Friseur entfernt einen Eintrag aus der Reihe (No-Show oder Storno). Setzt ihn
// auf 'abgesprungen'; der nächste Eintrag rückt beim Neuladen automatisch nach.
// Kein Stempel.
export async function eintragEntfernen(formData: FormData) {
  const eintragId = String(formData.get('eintragId') ?? '')
  if (!eintragId) return

  const supabase = await createClient()
  const friseur = await eingeloggterFriseur(supabase)
  if (!friseur) return

  await supabase
    .from('warteschlange')
    .update({ status: 'abgesprungen' })
    .eq('id', eintragId)
    .eq('friseur_id', friseur.id)
    .in('status', AKTIV)

  revalidatePath('/dashboard')
}

// Friseur setzt selbst einen Walk-In (Couch-Kunde, der die App nicht nutzt) in
// die Reihe — nur Name, Nummer optional. Status 'da', weil er physisch da ist.
// Kein Kunde-Soft-Account (kein Gerät/Token), daher beim Abschluss kein Stempel.
export async function walkInHinzufuegen(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const telefon = String(formData.get('telefon') ?? '').trim()
  if (!name) return

  const supabase = await createClient()
  const friseur = await eingeloggterFriseur(supabase)
  if (!friseur) return

  await supabase.from('warteschlange').insert({
    friseur_id: friseur.id,
    gast_name: name,
    gast_telefon: telefon || null,
    status: 'da',
  })

  revalidatePath('/dashboard')
}

// Friseur sagt einen Termin ab. Setzt ihn auf 'abgesagt'. Kein Stempel.
export async function terminAbsagen(formData: FormData) {
  const terminId = String(formData.get('terminId') ?? '')
  if (!terminId) return

  const supabase = await createClient()
  const friseur = await eingeloggterFriseur(supabase)
  if (!friseur) return

  await supabase
    .from('termin')
    .update({ status: 'abgesagt' })
    .eq('id', terminId)
    .eq('friseur_id', friseur.id)
    .in('status', ['ausstehend', 'bestaetigt'])

  revalidatePath('/dashboard')
}

// Ermittelt den Kunden zu einem abgeschlossenen Termin: vorhandene kunde_id
// nutzen, sonst per besucher_token finden, sonst neu anlegen (Soft-Account).
// Gibt die kunde_id zurück oder null (z. B. Termin ohne Kundenbezug).
async function kundeAusTerminErmitteln(
  supabase: SupabaseServerClient,
  friseurId: string,
  termin: {
    kunde_id: string | null
    besucher_token: string | null
    gast_name: string | null
    gast_telefon: string | null
  },
): Promise<string | null> {
  if (termin.kunde_id) return termin.kunde_id

  const token = termin.besucher_token?.trim()
  if (!token) return null

  const { data: vorhanden } = await supabase
    .from('kunde')
    .select('id')
    .eq('friseur_id', friseurId)
    .eq('besucher_token', token)
    .maybeSingle()
  if (vorhanden) return vorhanden.id as string

  const { data: neu } = await supabase
    .from('kunde')
    .insert({
      friseur_id: friseurId,
      name: termin.gast_name?.trim() || 'Gast',
      telefon: termin.gast_telefon?.trim() || null,
      besucher_token: token,
      letzter_besuch_at: new Date().toISOString(),
    })
    .select('id')
    .maybeSingle()
  return (neu?.id as string | null) ?? null
}

// Friseur schließt einen Termin ab. Setzt ihn auf 'abgeschlossen' und vergibt
// automatisch einen Stempel (Kunde über kunde_id/Token ermitteln/anlegen).
export async function terminAbschliessen(formData: FormData) {
  const terminId = String(formData.get('terminId') ?? '')
  if (!terminId) return

  const supabase = await createClient()
  const friseur = await eingeloggterFriseur(supabase)
  if (!friseur) return

  // Termin abschließen und dabei die Kundendaten zurückgeben. Status-Guard
  // verhindert doppelte Stempel bei Doppelklick/Retry: ein bereits abgeschlossener
  // Termin matcht nicht mehr und gibt null zurück -> kein zweiter Stempel.
  const { data: termin } = await supabase
    .from('termin')
    .update({ status: 'abgeschlossen' })
    .eq('id', terminId)
    .eq('friseur_id', friseur.id)
    .in('status', ['ausstehend', 'bestaetigt'])
    .select('kunde_id, besucher_token, gast_name, gast_telefon')
    .maybeSingle()

  if (termin) {
    const kundeId = await kundeAusTerminErmitteln(supabase, friseur.id, {
      kunde_id: (termin.kunde_id as string | null) ?? null,
      besucher_token: (termin.besucher_token as string | null) ?? null,
      gast_name: (termin.gast_name as string | null) ?? null,
      gast_telefon: (termin.gast_telefon as string | null) ?? null,
    })
    if (kundeId) {
      await supabase.from('stempel').insert({ kunde_id: kundeId, friseur_id: friseur.id })
    }
  }

  revalidatePath('/dashboard')
}

// Friseur abmelden: Session beenden und zurück zum Login.
export async function abmelden() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// Friseur speichert sein öffentliches Profil (Personalbranding).
function leerZuNull(v: FormDataEntryValue | null) {
  const s = String(v ?? '').trim()
  return s.length ? s : null
}

export async function profilSpeichern(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: friseur } = await supabase
    .from('friseur')
    .select('id, slug')
    .eq('user_id', user.id)
    .single()
  if (!friseur) return

  await supabase
    .from('friseur')
    .update({
      name: leerZuNull(formData.get('name')) ?? 'Friseur',
      rolle: leerZuNull(formData.get('rolle')),
      bio: leerZuNull(formData.get('bio')),
      spezialitaeten: leerZuNull(formData.get('spezialitaeten')),
      instagram: leerZuNull(formData.get('instagram'))?.replace(/^@/, '') ?? null,
      foto_url: leerZuNull(formData.get('foto_url')),
      modus: String(formData.get('modus')) === 'termine' ? 'termine' : 'warteschlange',
      oeffnet: leerZuNull(formData.get('oeffnet')),
      schliesst: leerZuNull(formData.get('schliesst')),
    })
    .eq('id', friseur.id)

  revalidatePath('/dashboard')
  revalidatePath(`/${friseur.slug}`)
  redirect('/dashboard')
}
