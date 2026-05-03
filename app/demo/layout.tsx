import type { ReactNode } from 'react'

/**
 * /demo Layout
 *
 * Hintergrund und Text via CSS-Token (bg-bone = Warm-Black in Dark Mode,
 * text-ink = Off-White). Das .snippt-premium-Theme kommt global vom <body>
 * in app/layout.tsx — hier kein redundantes Re-Setzen nötig.
 */
export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bone text-ink">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-16">
        {children}
      </div>
    </div>
  )
}
