// Beispiel-Daten für die Design-Phase (SG3). Werden in einer späteren Etappe
// durch echte Warteschlangen-Daten aus Supabase ersetzt (Tabelle `warteschlange`).

export type QueueStatus = 'da' | 'unterwegs' | 'keine_antwort'

export interface QueueEntry {
  id: string
  name: string
  wartetMin: number
  status: QueueStatus
  hinweis?: string
}

export const mockQueue: QueueEntry[] = [
  { id: '1', name: 'Kaan', wartetMin: 18, status: 'unterwegs', hinweis: 'meldet „2 Min"' },
  { id: '2', name: 'Deniz', wartetMin: 6, status: 'da' },
  { id: '3', name: 'Luca', wartetMin: 3, status: 'da' },
  { id: '4', name: 'Jonas', wartetMin: 1, status: 'keine_antwort', hinweis: 'unterwegs · keine Antwort' },
]

export const mockStats = {
  schnitteHeute: 12,
  stammkunden: 9,
  neuGewonnen: 3,
}
