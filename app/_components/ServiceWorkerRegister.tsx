'use client'

import { useEffect } from 'react'

// Registriert den Service Worker (macht die PWA installierbar und liefert einen
// Offline-Fallback). Bewusst erst nach dem Laden, um den Start nicht zu bremsen.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
    const registrieren = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Registrierung fehlgeschlagen -> App funktioniert trotzdem normal weiter.
      })
    }
    window.addEventListener('load', registrieren)
    return () => window.removeEventListener('load', registrieren)
  }, [])

  return null
}
