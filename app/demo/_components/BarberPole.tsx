/**
 * BarberPole — Klassische Barbershop-Spirale als CSS-Streifen.
 *
 * Rot / Weiß / Blau — nur als dekoratives Element, nie als Textfarbe.
 * Wird im Demo-Hub neben dem App-Namen platziert.
 * Server Component.
 */
export function BarberPole({
  height = 48,
  width = 10,
}: {
  height?: number
  width?: number
}) {
  // Streifen: Rot · Weiß · Blau · Rot · Weiß · Blau (6 Segmente)
  const streifen = ['#C0392B', '#F5F3EF', '#2E4A6B', '#C0392B', '#F5F3EF', '#2E4A6B']
  const segmentHoehe = Math.round(height / streifen.length)

  return (
    <div
      className="flex-shrink-0 overflow-hidden rounded-full border border-bone/15"
      style={{ width, height }}
      aria-hidden="true"
    >
      {streifen.map((farbe, i) => (
        <div
          key={i}
          style={{
            height: segmentHoehe,
            backgroundColor: farbe,
            opacity: farbe === '#F5F3EF' ? 0.9 : 0.85,
          }}
        />
      ))}
    </div>
  )
}

/**
 * BarberPolePair — Zwei Barber Poles als Rahmenpaar.
 * Wraps children mit einem Pole links und rechts.
 */
export function BarberPolePair({
  children,
  height = 48,
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
