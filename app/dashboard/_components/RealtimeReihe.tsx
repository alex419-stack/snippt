'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Live-Aktualisierung der Reihe über Supabase Realtime. Sobald sich an den
// eigenen Warteschlangen-Einträgen etwas ändert (anstellen, einchecken,
// aufrufen, fertig), wird die Server-Komponente sofort neu geladen — kein
// Warten auf den nächsten Auto-Refresh. RLS sorgt dafür, dass nur die eigenen
// Einträge gestreamt werden (Abo läuft mit dem JWT des eingeloggten Friseurs).
export function RealtimeReihe({ friseurId }: { friseurId: string }) {
  const router = useRouter()

  useEffect(() => {
    if (!friseurId) return
    const supabase = createClient()
    const channel = supabase
      .channel(`reihe-${friseurId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'warteschlange',
          filter: `friseur_id=eq.${friseurId}`,
        },
        () => router.refresh(),
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [friseurId, router])

  return null
}
