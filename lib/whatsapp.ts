import { normalisiereTelefon } from './telefon'

// Sendet die "du bist dran"-Nachricht über die Meta WhatsApp Cloud API.
//
// Bewusst robust: Fehlt die Konfiguration (Meta-Keys noch nicht hinterlegt)
// oder schlägt der Versand fehl, wird der Vorgang NUR protokolliert und
// { gesendet:false } zurückgegeben. Der Warteschlangen-Ablauf im Laden darf
// dadurch niemals abbrechen. Sobald die Umgebungsvariablen gesetzt sind,
// funktioniert der Versand ohne weitere Code-Änderung.
//
// Erwartetes WhatsApp-Template (bei Meta als Kategorie "Utility" anlegen,
// damit der Versand günstig/kostenlos ist), mit zwei Body-Variablen:
//   {{1}} = Name des Kunden
//   {{2}} = Name des Friseurs
// Beispieltext: "Hallo {{1}}, du bist dran bei {{2}}! Komm bitte zu deinem Friseur."

interface DuBistDranParams {
  telefon: string | null | undefined
  kundeName?: string | null
  friseurName?: string | null
}

interface SendeErgebnis {
  gesendet: boolean
  grund?: 'nicht_konfiguriert' | 'keine_nummer' | 'api_fehler' | 'netzwerk'
}

const GRAPH_VERSION = 'v21.0'

export async function sendeDuBistDran({
  telefon,
  kundeName,
  friseurName,
}: DuBistDranParams): Promise<SendeErgebnis> {
  const token = process.env.WHATSAPP_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const template = process.env.WHATSAPP_TEMPLATE_NAME
  const sprache = process.env.WHATSAPP_TEMPLATE_SPRACHE || 'de'

  // Noch nicht eingerichtet -> stiller No-Op (kein Fehler im Laden)
  if (!token || !phoneNumberId || !template) {
    return { gesendet: false, grund: 'nicht_konfiguriert' }
  }

  const an = normalisiereTelefon(telefon)
  if (!an) return { gesendet: false, grund: 'keine_nummer' }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: an,
          type: 'template',
          template: {
            name: template,
            language: { code: sprache },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: kundeName?.trim() || 'Du' },
                  { type: 'text', text: friseurName?.trim() || 'deinem Friseur' },
                ],
              },
            ],
          },
        }),
      },
    )

    if (!res.ok) {
      const fehlertext = await res.text().catch(() => '')
      console.error('[whatsapp] Versand fehlgeschlagen:', res.status, fehlertext.slice(0, 300))
      return { gesendet: false, grund: 'api_fehler' }
    }
    return { gesendet: true }
  } catch (e) {
    console.error('[whatsapp] Netzwerkfehler:', e)
    return { gesendet: false, grund: 'netzwerk' }
  }
}
