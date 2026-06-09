'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const AKTIV = ['wartend', 'unterwegs', 'da', 'aufgerufen']

// Friseur schließt den aktuellen Schnitt ab und ruft den Nächsten auf.
// Läuft als eingeloggter Friseur — RLS stellt sicher, dass nur eigene Einträge
// verändert werden.
export async function fertigNaechster(formData: FormData) {
  const eintragId = String(formData.get('eintragId') ?? '')
  if (!eintragId) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: friseur } = await supabase
    .from('friseur')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!friseur) return

  // 1. Aktuellen Eintrag abschließen
  await supabase
    .from('warteschlange')
    .update({ status: 'fertig', fertig_at: new Date().toISOString() })
    .eq('id', eintragId)
    .eq('friseur_id', friseur.id)

  // 2. Automatisch Stempel vergeben, falls ein erkannter Kunde verknüpft ist
  const { data: abgeschlossen } = await supabase
    .from('warteschlange')
    .select('kunde_id')
    .eq('id', eintragId)
    .single()
  if (abgeschlossen?.kunde_id) {
    await supabase.from('stempel').insert({
      kunde_id: abgeschlossen.kunde_id,
      friseur_id: friseur.id,
    })
  }

  // 3. Nächsten aktiven Eintrag (frühester) aufrufen
  const { data: naechster } = await supabase
    .from('warteschlange')
    .select('id')
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
  }

  revalidatePath('/dashboard')
}
