import type { ReactNode } from 'react'

export default function SalonchefLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-dark min-h-screen bg-background text-foreground">
      {children}
    </div>
  )
}
