# Backlog — Minor-Punkte

Kleine Verbesserungen und technische Schulden, die noch nicht priorisiert wurden.

---

- **`.env.local.example` erstellen** — Vorlage für neue Entwickler mit allen benötigten Umgebungsvariablen (Supabase URL, Anon Key usw.), ohne echte Werte. Verhindert, dass Entwickler die notwendigen Variablen erst aus dem Code heraussuchen müssen.

- **Slug-Längen-Validierung** — Mindestlänge von 3 Zeichen für Slugs erzwingen: Client-seitige Validierung im Registrierungsformular + DB-Constraint (`CHECK (char_length(slug) >= 3)`). Zu kurze Slugs (z. B. `a`) sind als URL-Bestandteil unpraktisch und kollisionsanfällig.

- **`router.refresh()` nach `router.push('/dashboard')` entfernen** — In `login`- und `register`-Flows ist `router.refresh()` nach `router.push('/dashboard')` redundant. Im Next.js 14 App Router löst `push()` bereits einen Re-Render der betroffenen Segmente aus. Der doppelte Aufruf kann zu einem kurzen Flackern führen.

- **`next/image` statt `<img>` in `app/[slug]/page.tsx`** — Friseur-Fotos sollten über die `next/image`-Komponente eingebunden werden. Vorteile: automatisches Lazy Loading, LCP-Optimierung (Largest Contentful Paint) und Schutz vor unerwarteten externen Bild-URLs durch die `remotePatterns`-Konfiguration in `next.config.mjs`.
