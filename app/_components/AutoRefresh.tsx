'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Hält die Seite ohne manuelles Neuladen aktuell: ruft in Intervallen
// router.refresh() auf (lädt die Server-Daten neu, behält Client-Zustand).
export function AutoRefresh({ seconds = 5 }: { seconds?: number }) {
  const router = useRouter()
  useEffect(() => {
    const id = setInterval(() => router.refresh(), Math.max(2, seconds) * 1000)
    return () => clearInterval(id)
  }, [router, seconds])
  return null
}
