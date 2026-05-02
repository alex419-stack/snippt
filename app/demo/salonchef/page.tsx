import {
  meinSalon,
  termine,
  friseure,
  getKundeById,
  type Termin,
} from '@/lib/mockData'
import { HeaderBar } from './_components/HeaderBar'
import { KpiTiles, type Kpi } from './_components/KpiTiles'
import { WettbewerbsMatrix } from './_components/WettbewerbsMatrix'
import { WalkInHeatmap, type WalkInRaster } from './_components/WalkInHeatmap'
import { AktivitaetsFeed } from './_components/AktivitaetsFeed'

/**
 * Salonchef-Dashboard — Phase 1 Hi-Fi Mockup.
 *
 * Server Component. Führt die einmalige Aggregation der Mockdaten durch
 * (heutige Termine, Wochen-Walk-Ins, Auslastung pro Friseur, Heatmap-
 * Raster) und reicht alles als fertige Props an die Sub-Komponenten.
 *
 * Layout-Disziplin:
 *   - Desktop-First (Optimum ≥1280 px)
 *   - Bricht aus dem max-w-6xl-Demo-Layout via negativen Margins aus,
 *     damit die Wettbewerbs-Matrix und Heatmap genug Platz bekommen.
 *
 * KEINE Logik die nicht für die Demo nötig ist — alles deterministisch
 * aus lib/mockData.ts. Hardcoded-Demo-Konstanten sind als UPPER_CASE
 * benannt und im Header dieser Datei dokumentiert.
 */

// ---------- Demo-Konstanten ----------
//
// Diese Werte sind im Pitch glaubwürdig, lassen sich aus den Mockdaten aber
// nicht 1:1 herleiten (es gibt keine Preise, keine Vorwoche etc.).
// Sie sind bewusst plausibel im Verhältnis zur Termin-Anzahl gewählt.

/** Wochenumsatz in Euro — passt grob zu ~50 Wochenterminen × ~85 € Schnitt. */
const UMSATZ_WOCHE_EUR = 4280
/** Trend-Werte „vs. Vorwoche", in Prozent (positiv = Steigerung). */
const TREND_TERMINE_HEUTE = 12
const TREND_UMSATZ_WOCHE = 8
const TREND_AUSLASTUNG = -3
const TREND_WALKIN_QUOTE = 18

/** „Heute" für die Demo. Entspricht dem im Briefing genannten Datum. */
const HEUTE_DATUM = '2026-05-02' // Sa
const HEUTE_LANG = 'Samstag, 2. Mai 2026'

/** Kapazität pro Friseur pro Tag in Minuten (10 Stunden Salon-Öffnung × 60). */
const KAPAZITAET_TAG_MIN = 10 * 60
/** Anzahl Werktage pro Woche, die wir für die Auslastungs-Berechnung ansetzen. */
const ARBEITSTAGE_WOCHE = 6

// ---------- Aggregationen ----------

/**
 * Walk-In-Definition für die Heatmap & KPIs:
 *   - explizit `status === 'walkin'`, ODER
 *   - Kunde geht zu einem Friseur, der NICHT sein Lieblings-Friseur ist
 *     (Indiz für Walk-In-Charakter, da Stammkunden bei „ihrem" Friseur landen).
 *
 * Das gibt der Heatmap genug Verteilung, ohne die Mockdaten manipulieren zu
 * müssen.
 */
function istWalkIn(t: Termin): boolean {
  if (t.status === 'walkin') return true
  const kunde = getKundeById(t.kunde_id)
  if (!kunde) return false
  return kunde.lieblings_friseur_id !== t.friseur_id
}

/**
 * Parst direkt aus dem ISO-String, um Server-Zeitzonen-Effekte zu vermeiden.
 * (Auf Vercel läuft der Server in UTC, lokale `new Date()`-Auswertung würde
 * sonst bei Mitternachts-Slots inkonsistent rendern.)
 */
function tagIndexAusISO(iso: string): number {
  // YYYY-MM-DD aus dem ISO-String extrahieren und als UTC interpretieren —
  // alle Mockdaten sind lokale Zeiten ohne TZ-Suffix, der Tag ist eindeutig.
  const datumOnly = iso.slice(0, 10)
  const d = new Date(`${datumOnly}T12:00:00Z`)
  const js = d.getUTCDay() // 0=So..6=Sa
  return (js + 6) % 7 // → Mo=0..So=6
}

function slotIndexAusISO(iso: string): number {
  // Stunden 8..18 → Index 0..10. Außerhalb → -1.
  // Direkt aus dem ISO-String an Position 11..12 gelesen.
  const stundeStr = iso.slice(11, 13)
  const h = parseInt(stundeStr, 10)
  if (Number.isNaN(h) || h < 8 || h > 18) return -1
  return h - 8
}

// ---------- Page ----------

export default function SalonchefPage() {
  // --- Termine heute ---
  const termineHeute = termine.filter((t) => t.start.startsWith(HEUTE_DATUM))

  // --- Walk-In-Quote (Anteil Walk-Ins an Wochen-Terminen) ---
  const wochenTermineGesamt = termine.length
  const wochenWalkIns = termine.filter(istWalkIn).length
  const walkInQuoteProzent = Math.round(
    (wochenWalkIns / wochenTermineGesamt) * 100
  )

  // --- Auslastung pro Friseur (Woche) ---
  // (Summe Termin-Minuten) / (Kapazität Woche pro Friseur)
  const kapazitaetWoche = KAPAZITAET_TAG_MIN * ARBEITSTAGE_WOCHE
  const friseureMitAuslastung = friseure.map((f) => {
    const minuten = termine
      .filter((t) => t.friseur_id === f.id)
      .reduce((sum, t) => sum + t.dauer_min, 0)
    const auslastung = Math.min(1, minuten / kapazitaetWoche)
    return { ...f, auslastung_woche: auslastung }
  })

  // --- Salon-Schnitt-Auslastung heute ---
  // Vereinfachung: wir mitteln die Wochen-Auslastung über alle Friseure und
  // skalieren leicht hoch (heute = Spitzentag Samstag im Demo-Setup).
  const auslastungSchnitt = Math.round(
    (friseureMitAuslastung.reduce((s, f) => s + f.auslastung_woche, 0) /
      friseureMitAuslastung.length) *
      100
  )

  // --- KPI-Daten ---
  const kpis: Kpi[] = [
    {
      label: 'Termine heute',
      wert: String(termineHeute.length),
      trend: { delta: TREND_TERMINE_HEUTE, label: 'vs. Vorwoche' },
    },
    {
      label: 'Umsatz Woche',
      wert: `${UMSATZ_WOCHE_EUR.toLocaleString('de-DE')} €`,
      trend: { delta: TREND_UMSATZ_WOCHE, label: 'vs. Vorwoche' },
    },
    {
      label: 'Auslastung heute',
      wert: `${auslastungSchnitt}%`,
      trend: { delta: TREND_AUSLASTUNG, label: 'vs. Vorwoche' },
    },
    {
      label: 'Walk-In-Quote',
      wert: `${walkInQuoteProzent}%`,
      trend: { delta: TREND_WALKIN_QUOTE, label: 'vs. Vorwoche' },
    },
  ]

  // --- Walk-In-Raster für Heatmap (7 Tage × 11 Slots) ---
  const zellen: number[][] = Array.from({ length: 7 }, () =>
    Array.from({ length: 11 }, () => 0)
  )
  for (const t of termine) {
    if (!istWalkIn(t)) continue
    const tagIdx = tagIndexAusISO(t.start)
    const slotIdx = slotIndexAusISO(t.start)
    if (tagIdx < 0 || slotIdx < 0) continue
    zellen[tagIdx][slotIdx] += 1
  }
  const max = zellen.reduce(
    (m, spalte) => Math.max(m, ...spalte),
    0
  )
  const raster: WalkInRaster = { zellen, max }

  return (
    // Layout-Ausbruch: Demo-Layout begrenzt auf max-w-6xl (1152 px).
    // Salonchef braucht mehr Breite — wir holen sie über negative Margins
    // auf größeren Viewports zurück und zentrieren in 1400 px.
    <div className="lg:-mx-12 xl:-mx-24">
      <div className="mx-auto w-full max-w-[1400px] space-y-10">
        <HeaderBar
          salonName={meinSalon.name}
          datumLang={HEUTE_LANG}
          initialen="AA"
        />

        <KpiTiles kpis={kpis} />

        <WettbewerbsMatrix friseure={friseureMitAuslastung} />

        {/* Heatmap (2/3) + Aktivitäts-Feed (1/3) auf Desktop, gestapelt darunter */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WalkInHeatmap raster={raster} />
          </div>
          <div className="lg:col-span-1">
            <AktivitaetsFeed />
          </div>
        </div>

        <footer className="border-t border-coal/10 pt-6 text-xs text-coal/45">
          Mockup mit Demo-Daten aus{' '}
          <code className="rounded bg-coal/5 px-1.5 py-0.5 font-mono text-[11px] text-coal/70">
            lib/mockData.ts
          </code>{' '}
          — keine API, keine Logik außer Aggregation.
        </footer>
      </div>
    </div>
  )
}
