import type { ReactNode } from 'react'

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-dark min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-16">
        {children}
      </div>
    </div>
  )
}
