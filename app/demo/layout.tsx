import type { ReactNode } from 'react'

/**
 * /demo Layout
 *
 * Wrappt alle Mockup-Screens in das Snippt-Premium-Theme:
 *  - Off-White Hintergrund (#F8F7F4)
 *  - Tiefschwarz Text (#1C1C1E)
 *  - Geist Sans (bereits am <html> via app/layout.tsx)
 *  - shadcn-CSS-Variablen werden lokal auf die Premium-Palette gemappt
 *    (.snippt-premium in app/globals.css)
 *
 * Bewusst kein App-Chrome — der Mockup soll Pitch-Layout liefern,
 * keine Produkt-Navigation.
 */
export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="snippt-premium min-h-screen bg-bone text-coal antialiased">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-16">
        {children}
      </div>
    </div>
  )
}
