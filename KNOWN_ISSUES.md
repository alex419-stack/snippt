# Bekannte Probleme

Dokumentiert bekannte Schwachstellen, bewusste MVP-Kompromisse und notwendige Fixes vor Produktivbetrieb.

---

## 1. Race Condition: Registrierung + RLS

**Problem:** `signUp()` gibt bei aktivierter E-Mail-Bestätigung ein User-Objekt ohne aktive Session zurück. Der nachfolgende `friseur`-Insert schlägt dann wegen RLS (Row Level Security) still fehl — kein Fehler wird angezeigt, der Datensatz wird aber nicht angelegt.

**Workaround für lokale Tests:** E-Mail-Bestätigung in Supabase deaktivieren:
Supabase Dashboard → Authentication → Providers → Email → "Confirm email" **OFF**

**Fix vor Produktivbetrieb:** Insert serverseitig über eine API-Route mit Service-Role-Key ausführen, oder alternativ einen Database Trigger einsetzen, der den `friseur`-Datensatz automatisch nach User-Anlage erzeugt.

---

## 2. Fehlende Slug-Blacklist

**Problem:** Reservierte Slugs (`login`, `dashboard`, `register`, `auth`, `api`, `admin`) können bei der Registrierung eingetragen werden. Das führt zu Routing-Konflikten, weil Next.js diese Pfade intern belegt.

**Workaround:** Manuell vermeiden — reservierte Slugs nicht bei der Registrierung verwenden.

**Fix:** DB-Constraint auf der `friseur`-Tabelle ergänzen (`CHECK (slug NOT IN (...))`) sowie Client-seitige Validierung im Registrierungsformular.

---

## 3. RLS: Öffentliche Termin-Inserts ohne friseur_id-Prüfung

**Problem:** Die aktuelle RLS-Policy für die `termine`-Tabelle verwendet `WITH CHECK (true)`. Das erlaubt anonymen Nutzern, Termine für beliebige Friseur-IDs anzulegen — auch für nicht existierende oder fremde Salons.

**Bewusste MVP-Entscheidung:** Für den MVP akzeptabel, da keine sensiblen Daten betroffen sind.

**Fix vor Produktivbetrieb:** Rate-Limiting auf API-Ebene einführen und/oder die RLS-Policy verschärfen (z. B. `WITH CHECK (friseur_id IN (SELECT id FROM friseur WHERE aktiv = true))`).

---

## 4. salon-Tabelle: kein Write im MVP

**Problem:** Für die `salon`-Tabelle ist RLS aktiv, aber es existiert nur eine SELECT-Policy. INSERT, UPDATE und DELETE sind ausschließlich über das Supabase Studio möglich — nicht über die Applikation.

**Bewusste MVP-Entscheidung:** Salondaten werden im MVP manuell gepflegt.

**Fix in Phase 2:** Admin-Write-Policy ergänzen, sobald das Salonchef-Feature implementiert wird (authenticated user darf eigenen Salon-Datensatz schreiben).
