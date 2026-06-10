import type { ReactNode } from 'react'

export default function KundeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="snippt-grain relative min-h-screen overflow-hidden bg-snippt-bg font-body text-snippt-ink">
      {children}
    </div>
  )
}
