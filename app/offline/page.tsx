export const metadata = { title: 'Offline — Snippt' }

export default function OfflinePage() {
  return (
    <main className="snippt-grain relative flex min-h-screen items-center justify-center overflow-hidden bg-snippt-bg font-body text-snippt-ink">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(60% 45% at 50% 0%, rgba(84,104,255,.16), transparent 60%),' +
            'linear-gradient(180deg,#08080B,#0C0C12)',
        }}
      />
      <div className="relative z-[1] w-full max-w-sm px-6 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Gerade keine Verbindung</h1>
        <p className="mt-3 text-[14px] text-snippt-muted">
          Snippt braucht kurz Internet. Sobald du wieder online bist, lädt die Seite normal weiter.
        </p>
      </div>
    </main>
  )
}
