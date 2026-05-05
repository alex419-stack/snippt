/**
 * BarberPole — Klassische Barbershop-Spirale, Rot/Weiß/Blau animiert.
 *
 * CSS-Animation via .barberpole-spin (definiert in globals.css).
 * Server Component — kein 'use client' nötig, da nur CSS-Animation.
 */
export function BarberPole({
  height = 64,
  width = 14,
}: {
  height?: number
  width?: number
}) {
  const capSize = Math.max(8, Math.round(width * 0.7))

  return (
    <div
      className="flex-shrink-0 flex flex-col"
      style={{ width, height }}
      aria-hidden="true"
    >
      {/* Obere Kappe */}
      <div
        className="flex-shrink-0 rounded-t-full"
        style={{
          height: capSize,
          background: 'linear-gradient(to bottom, #2A2A2A, #1A1A1A)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderBottom: 'none',
        }}
      />

      {/* Spiralzylinder */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          borderLeft: '1px solid rgba(0,0,0,0.3)',
          borderRight: '1px solid rgba(0,0,0,0.3)',
        }}
      >
        <div
          className="absolute inset-0 barberpole-spin"
          style={{
            background: `repeating-linear-gradient(
              -45deg,
              #C8201E 0px,   #C8201E 8px,
              #F8F6F3 8px,   #F8F6F3 16px,
              #1A3A8F 16px,  #1A3A8F 24px
            )`,
          }}
        />
        {/* Glanz-Overlay für Zylinder-Optik */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,0.18) 0%, transparent 40%, rgba(0,0,0,0.12) 100%)',
          }}
        />
      </div>

      {/* Untere Kappe */}
      <div
        className="flex-shrink-0 rounded-b-full"
        style={{
          height: capSize,
          background: 'linear-gradient(to bottom, #1A1A1A, #111111)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderTop: 'none',
        }}
      />
    </div>
  )
}

/**
 * BarberPolePair — Zwei Barber Poles flankieren den übergebenen Inhalt.
 */
export function BarberPolePair({
  children,
  height = 64,
}: {
  children: React.ReactNode
  height?: number
}) {
  return (
    <div className="flex items-center gap-3">
      <BarberPole height={height} />
      {children}
      <BarberPole height={height} />
    </div>
  )
}
