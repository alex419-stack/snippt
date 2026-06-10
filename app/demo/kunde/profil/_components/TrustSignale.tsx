// Statische Mock-Daten — kein Backend, kein Server Action.
const marco = {
  bio: 'Ich schneide seit 11 Jahren. Jeder Kopf ist anders — ich nehme mir die Zeit, die er braucht. Kein Fließband, keine versprochenen Uhrzeiten. Dafür weißt du, dass du bei mir in guten Händen bist.',
  jahreErfahrung: 11,
  stilTags: ['Fade', 'Skin Fade', 'Textured Crop', 'Bart', 'Klassisch'],
  bewertungAnzahl: 134,
}

/**
 * TrustSignale — Bio, Erfahrungs-Badge, Stil-Tags, Bewertungs-Hinweis.
 * Zeigt dem Erstkunden, warum Marco sein Friseur werden sollte.
 * Server Component, rein presentational.
 */
export function TrustSignale() {
  return (
    <section className="space-y-5">
      {/* Bio */}
      <p className="text-[14px] leading-relaxed text-snippt-muted">{marco.bio}</p>

      {/* Erfahrungs-Badge + Bewertungs-Badge nebeneinander */}
      <div className="flex flex-wrap gap-3">
        {/* Jahre-Erfahrung */}
        <div
          className="flex items-center gap-[9px] rounded-[12px] px-[14px] py-[10px]"
          style={{
            background: 'rgba(84,104,255,.08)',
            border: '1px solid rgba(84,104,255,.18)',
          }}
        >
          <span
            className="font-display text-[22px] font-semibold leading-none"
            style={{
              background: 'linear-gradient(180deg,#fff,#b9c0ff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {marco.jahreErfahrung}
          </span>
          <span className="text-[11px] uppercase tracking-[0.14em] text-snippt-muted">
            Jahre<br />Erfahrung
          </span>
        </div>

        {/* Bewertungs-Badge */}
        <div
          className="flex items-center gap-[9px] rounded-[12px] px-[14px] py-[10px]"
          style={{
            background: 'rgba(43,231,255,.06)',
            border: '1px solid rgba(43,231,255,.14)',
          }}
        >
          <span
            className="font-display text-[22px] font-semibold leading-none"
            style={{
              background: 'linear-gradient(180deg,#fff,#a0f2ff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {marco.bewertungAnzahl}
          </span>
          <span className="text-[11px] uppercase tracking-[0.14em] text-snippt-muted">
            Kunden<br />bewertet
          </span>
        </div>
      </div>

      {/* Stil-Tags */}
      <div className="flex flex-wrap gap-[7px]">
        {marco.stilTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-[5px] text-[12px] text-snippt-ink"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  )
}
