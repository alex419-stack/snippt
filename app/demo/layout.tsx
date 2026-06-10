import type { ReactNode } from 'react'

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="snippt-grain relative min-h-screen overflow-hidden bg-snippt-bg font-body text-snippt-ink">
      <div className="relative z-[1] mx-auto w-full max-w-5xl px-6 py-12 md:px-10 md:py-16">
        {children}
      </div>
    </div>
  )
}
