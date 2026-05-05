// Professionelle Friseursschere — Spitzen rechts/oben, Griffringe links/unten.
// ~20° nach oben geneigt. currentColor → passt sich an text-ink an.
// ViewBox 118×76: Klingenspitzen zeigen nach rechts in Leserichtung.

export function SchereLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 118 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Obere Klinge — Spitze rechts oben, verjüngt von Pivot zur Spitze */}
      <path
        fill="currentColor"
        d="M60,31 C78,26 94,18 106,13 C94,19 78,29 60,37 Z"
      />
      {/* Oberer Griffarm — Pivot nach links unten zum Ring */}
      <path
        fill="currentColor"
        d="M60,31 L23,42 L23,50 L60,37 Z"
      />

      {/* Untere Klinge — Spitze rechts, etwas flacher */}
      <path
        fill="currentColor"
        d="M60,40 C78,38 94,34 106,30 C94,35 78,44 60,46 Z"
      />
      {/* Unterer Griffarm */}
      <path
        fill="currentColor"
        d="M60,40 L23,57 L23,65 L60,46 Z"
      />

      {/* Pivot-Schraube */}
      <circle cx="60" cy="38.5" r="5" fill="currentColor" />

      {/* Oberer Griffring */}
      <circle
        cx="17"
        cy="46"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.5"
      />

      {/* Unterer Griffring */}
      <circle
        cx="17"
        cy="62"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.5"
      />

      {/* Tang — Pinky-Haken am unteren Ring */}
      <path
        fill="currentColor"
        d="M13,70 Q14,75 20,75 L20,71 Q17,71 15,70 Z"
      />
    </svg>
  )
}
