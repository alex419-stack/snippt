import type { ReactNode } from 'react'

export default function FriseurLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-light min-h-screen bg-background text-foreground">
      {children}
    </div>
  )
}
