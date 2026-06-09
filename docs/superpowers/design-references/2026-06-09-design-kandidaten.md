# Design-Kandidaten (für die Design-Phase)

Sammlung von Design-Ideen, die Alex einbringt. Bewertung erfolgt in der Design-Phase (nach Abschluss des Technik-Konzepts).

---

## ENTSCHIEDENE DESIGN-RICHTUNG (2026-06-09)

Alex' Geschmack, klar benannt: **dunkel, leuchtend, mit Farbe, modern und hochwertig.**

→ Das ersetzt das alte „warm-premium / Cremeweiß"-System (das im Mai für das alte Salon-Produkt festgelegt wurde). Snippt bekommt einen **dunklen, modernen Look mit leuchtenden Farbakzenten/Glows**.

**Umsetzungs-Leitplanken (Claude, in der Design-Phase zu beachten):**
- Eigenständiges Snippt-Design, KEIN Kopieren fremder Tech-Templates.
- **Mobile-Performance hat Vorrang:** Glows/Animationen sparsam und GPU-schonend (kein dauerlaufendes Vollbild-Canvas mit `shadowBlur`); Effekte als statische Verläufe/dezente Bewegung, nicht als Dauer-Animation.
- Lesbarkeit & Bedienbarkeit im Laden-Stress (Friseur) und für Laufkunden (Kunde) müssen trotz dunklem Look top sein.
- Die zwei eingebrachten Beispiele (Wellen-Hero, Preis-Tabelle) dienen nur als **Stimmungs-Referenz** für „dunkel/leuchtend/modern", nicht als zu bauende Screens. Die Preis-Tabelle passt inhaltlich nicht (Snippt hat keine 3 Tarif-Stufen).

---

## Kandidat 1 — „GlowyWavesHero" (animierte Leucht-Wellen, Canvas)

**Eingebracht:** 2026-06-09 von Alex (als React-Komponente, framer-motion + Canvas-Animation, Maus-reaktive leuchtende Wellen, dunkler „Tech/AI-Playground"-Look mit „Launch Studio"-CTA).

**Wofür gedacht:** vermutlich öffentliche Landing-Page / Hero. (Noch zu klären.)

**Erste Einschätzung (Claude):**
- **Pro:** modern, eye-catching, premium-wirkende Bewegung; technisch machbar.
- **Contra / Risiken:**
  - **Marken-Bruch:** Snippt-Design-System ist warm-premium & ruhig (Cal.com/Stripe/Linear/Things3, Warm-Cream/Warm-Black, Gold, Inter+Playfair). Dieser Look ist eher neon/cyber → gegenteiliges Gefühl für ein vertrauenswürdiges Friseur-Tool um die Ecke.
  - **Mobile-Performance:** Vollbild-Canvas mit `shadowBlur` pro Welle pro Frame ist GPU-/akkulastig. Unsere Nutzer sind mobile-first → Ruckel-/Akku-Risiko.
  - **Falsche Fläche:** Es ist ein Marketing-Hero, kein App-Screen. Die wichtigen Flächen (Warteschlange, Stempelkarte) brauchen einen ruhigeren, schnellen, warmen Stil.
  - **Token-Bruch:** nutzt shadcn-Default-Tokens (`--primary/--accent/...`), nicht Snippts Custom-Tokens (`ink/coal/bone/gold/surface`); bräuchte Umbau. Fügt `framer-motion` als Abhängigkeit hinzu.

**Empfehlung:** höchstens als EIN Kandidat für die öffentliche Landing-Page führen, nicht als App-weiter Stil. Entscheidung liegt bei Alex (besucher-/kundenseitig). Volle Komponente liegt im Chat-Verlauf vom 2026-06-09; auf Wunsch hier verbatim ablegen.
