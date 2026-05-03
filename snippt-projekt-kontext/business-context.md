# Business Context — Snippt
Stand: 03.05.2026 | Branch: m0-mockup

---

## Zielgruppe

**Primär (Pivot 02.05.2026):** Long-Tail-Barbershops mit 15–22€-Schnitten
- Türkische Barbershops
- Quartiersfriseure
- Migrations-Salons

**Warum diese Zielgruppe:** Kein Konkurrent (Treatwell, Booksy, Fresha, Planity, Shore, studiolution) ist dort registriert. Diese Betriebe leben von Walk-In + Telefon + Notizbuch. Snippt erschließt einen unbeackerten Markt statt gegen kapitalkräftige Wettbewerber in der Mittel/Premium-Kategorie anzutreten.

**Vorige Zielgruppe (verworfen):** Mittel-/Premium-Salons — dort ist der Markt besetzt.

**Drei Akteure:**
- **Salonchef** → zahlt (B2B-Kunde), kauft für seinen Salon
- **Friseur** → nutzt täglich (App-Nutzer, Brand-Aufbau, Stammkunden)
- **Endkunde** → bucht Termine, gibt Wiederkehr-Daten

---

## Pricing

**Aktueller Pilot-Preis:** €7 / Friseur / Monat (Pivot 02.05.2026)

**Break-Even-Analyse (aus CLAUDE.md):**

| Szenario | Salons | Friseure (ca.) | Einnahmen | Kosten (Max 5x + Infra) | Ergebnis |
|----------|--------|----------------|-----------|--------------------------|---------|
| Pessimistisch | 5 | ~13 | ~€91/Mo | €139/Mo | −€48/Mo |
| Realistisch | 15 | ~38 | ~€266/Mo | €139/Mo | +€127/Mo |
| Break-Even | ~8 | ~20 | ~€140/Mo | €139/Mo | ~€0 |

**Infrastrukturkosten Pilot (~€47/Mo):**
- Vercel Free
- Supabase Pro: €25
- Resend Pro: €20
- Domains: ~€2

**Bootstrap-Investment gesamt:** ~€750–1.250 (inkl. Anwalt-Review nach Pilot €300–800 laut CLAUDE.md)

**Wichtig:** Bei €7 Launch-Preis ist Snippt im ersten Jahr knapp — Profitabilität erst ab 50+ Salons oder nach Preis-Anhebung post-M9.

**Offene Pricing-Entscheidung:** Finale Preisstrategie (Lifetime / Volume / Stufenplan) wird nach M9-Erfolgsbewertung getroffen.

---

## Wettbewerber

| Anbieter | Basis/Mo (3 Friseure) | Personalbranding | Besonderheit |
|----------|----------------------|-----------------|-------------|
| Fresha | €27 + 20% Marketplace | gering | — |
| Booksy | €65 | mittel | — |
| Shore (DE) | €40–50 | gering | — |
| Treatwell | €35 + 35% Provision | gering | — |
| Planity (FR) | €39–79 | gering | Series C €45M, 19% DACH-Marktanteil digital |
| studiolution (DE) | €37 inkl. TSE-Kasse | gering | DE-fokussiert |

**Echter Konkurrent von Snippt laut CLAUDE.md:** Nicht Fresha, sondern „Telefon + Notizbuch".

**Was Snippt nicht als USP nennen soll:** "Keine Provision" — Shore, studiolution, Planity, Booksy sind alle provisionsfrei → kein Differenzierungsmerkmal mehr.

---

## Piloten-Status

**Aktueller Stand:** Pre-Pilot — kein Pilot läuft noch

**Pilot-Plan (M7–M9):**
- M7 (29.07.2026): Pilot-Onboarding
- M8 (19.08.2026): Live-Phase beginnt (3 Wochen)
- M9 (26.08.2026): Erfolgsbewertung + Go/No-Go

**Pilot-Strategie:** Hi-Fi-Code-Mockup (M0) → Pilot-Commit → MVP-Code. Erst zeigen, dann bauen.

**Offenes Risiko:** Plan-B-Salon fehlt noch (falls erster Pilot-Salonchef Nein sagt) — in Pre-M0 Tasks als offen dokumentiert.

**Gelernt:** Keine Information vorhanden — Pilot hat noch nicht stattgefunden.

---

## Erfolgskriterien (M9)

Aus CLAUDE.md:

| Kriterium | Schwelle |
|-----------|---------|
| App-Buchungen | ≥ 30% aller Termine |
| Walk-In-Anteil via App | ≥ 10% |
| Soft-Account-Adoption | ≥ 40% der Endkunden |
| Salonchef-Akzeptanz | JA zu €7/Friseur/Mo |
| Friseur-Retention | ≥ 60% wollen weiternutzen |

**Kill-Switch:** 3+ Kriterien unter Schwelle → Stop oder Vision-Pivot.

---

## Offene Business-Entscheidungen

Laut CLAUDE.md explizit noch nicht entschieden:

1. **Finale Preisstrategie post-M9:** Lifetime / Volume-Rabatt / Stufenplan — Entscheidung erst nach Pilot-Daten
2. **Domains snippt.de + snippt.app:** Noch nicht gesichert (~€25/Jahr) — als Pre-M0 Task offen
3. **Plan-B-Salon:** Noch nicht identifiziert
4. **Anwalt-Review:** Erst nach Pilot (€300–800) — Zeitpunkt offen

---

## Quellen
- `CLAUDE.md` (Pricing, Zielgruppe, USP-Karte, Wettbewerber, Erfolgskriterien, Finanzen)
- `app/demo/salonchef/` (implementierte Metriken)
- `lib/mockData.ts` (Demo-Friseurprofile)
