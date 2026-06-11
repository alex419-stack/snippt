# Bekannte Probleme

Dokumentiert bekannte Schwachstellen, bewusste MVP-Kompromisse und notwendige Fixes vor Produktivbetrieb.

---

## 1. Race Condition: Registrierung + RLS — ✅ BEHOBEN (verifiziert 11.06.2026)

**War:** `signUp()` gibt bei aktivierter E-Mail-Bestätigung ein User-Objekt ohne aktive Session zurück. Ein client-seitiger `friseur`-Insert hätte deshalb wegen RLS still fehlschlagen können.

**Gelöst durch:** Database-Trigger `on_auth_user_created` → `handle_new_user()` (Migration 002). Der Trigger läuft mit `SECURITY DEFINER` und legt den `friseur`-Datensatz automatisch beim User-Insert an, unabhängig von der Session. In der Live-DB als aktiv verifiziert (11.06.2026). Es gibt keinen client-seitigen `friseur`-Insert mehr.

**Zusatz (Migration 009):** Der Trigger erzeugt jetzt immer einen gültigen, eindeutigen slug (säubert Format, hängt bei Kollision/reserviertem Wert einen Suffix an), damit der Insert nie an den neuen slug-Constraints scheitert.

**Hinweis E-Mail-Bestätigung:** Das Registrierungsformular leitet bei aktiver E-Mail-Bestätigung nicht mehr blind aufs Dashboard, sondern zeigt einen Bestätigungs-Hinweis.

---

## 2. Slug-Blacklist — ✅ BEHOBEN (Migration 009, 11.06.2026)

**War:** Reservierte Slugs (`login`, `dashboard`, `demo`, `api`, `admin` …) konnten als Friseur-Adresse eingetragen werden und echte App-Routen überlagern. Nur das Formular prüfte client-seitig (und `demo` fehlte dort).

**Gelöst durch:** Migration 009 (`009_slug_schutz.sql`):
- Zentrale Funktion `public.is_slug_reserved(text)` mit der Sperrliste.
- DB-Constraint `friseur_slug_not_reserved` (`CHECK (not is_slug_reserved(slug))`).
- DB-Constraint `friseur_slug_format` (`CHECK (slug ~ '^[a-z0-9][a-z0-9-]{0,30}[a-z0-9]$')`).
- Registrierungsformular synchronisiert (Sperrliste inkl. `demo`, Format-Check, Vorab-Prüfung „schon vergeben" mit klarer Meldung).

Greift jetzt auch bei direktem API-Zugriff, nicht nur im Formular.

---

## 3. RLS: Öffentliche Termin-Inserts ohne friseur_id-Prüfung — ✅ BEHOBEN (verifiziert 11.06.2026)

**War:** Die RLS-Policy `"Öffentliches Buchen erlaubt"` auf `public.termin` nutzte `WITH CHECK (true)` und erlaubte anonyme Inserts für beliebige Friseur-IDs.

**Gelöst durch:** Migration 003 entfernt diese Policy (`drop policy if exists`). In der Live-DB verifiziert (11.06.2026): `public.termin` hat nur noch Friseur-eigene SELECT/ALL-Policies, keine offene Insert-Policy. Kundenseitige Buchungen laufen über die RPC `termin_buchen()` (Migration 007, `SECURITY DEFINER`, validiert). Die `termin`-Tabelle ist im Warteschlangen-Konzept ohnehin deprecated.

---

## 4. salon-Tabelle: kein Write im MVP

**Problem:** Für die `salon`-Tabelle ist RLS aktiv, aber es existiert nur eine SELECT-Policy. INSERT, UPDATE und DELETE sind ausschließlich über das Supabase Studio möglich — nicht über die Applikation.

**Bewusste MVP-Entscheidung:** Salondaten werden im MVP manuell gepflegt.

**Fix in Phase 2:** Admin-Write-Policy ergänzen, sobald das Salonchef-Feature implementiert wird (authenticated user darf eigenen Salon-Datensatz schreiben).

---

## 5. Supabase-Advisor — bewusst akzeptierte Hinweise (Stand 11.06.2026)

Nach dem Sicherheits-/Performance-Audit behoben: Trigger-Funktion `handle_new_user` ist nicht mehr als öffentliche RPC aufrufbar, `is_slug_reserved` hat einen festen search_path (Migration 012). Folgende Hinweise bleiben bewusst offen:

- **Öffentlich aufrufbare SECURITY-DEFINER-Funktionen** (`anstellen`, `einchecken`, `warteschlange_status`, `mein_stempelstand`, `termin_buchen`, `gebuchte_zeiten`): **so gewollt.** Das ist das kontrollierte RPC-Design — anonyme Kunden müssen sich anstellen/einchecken können, die Funktionen validieren intern. Bewusst statt offener Tabellen-Policies gewählt.
- **Performance-Lints** (fehlende FK-Indizes, `auth_rls_initplan`, ungenutzte Indizes, mehrfache permissive Policies): bei Ein-Friseur-Pilot-Skala ohne Wirkung. Backlog für die Skalierungsphase.
- **`public_bucket_allows_listing` (friseur-fotos):** Profilfotos sind öffentlich gedacht; Auflisten ist kein kritisches Leck. Backlog.
- **Leaked-Password-Schutz deaktiviert:** optionale Auth-Einstellung (Abgleich mit HaveIBeenPwned). Empfehlung: im Supabase-Dashboard aktivieren — kostenlos, erhöht die Passwort-Sicherheit.

---

## 6. npm-Audit / Next.js-Version (Stand 11.06.2026)

`npm audit fix` (nicht-breaking) wurde angewendet. Verbleibende Hinweise:

- **Next.js 14.2.35** ist die neueste 14.2-Patch-Version; mehrere DoS-/Request-Smuggling-Advisories sind erst in **Next.js 15** behoben. Da Snippt auf **Vercel** läuft (plattformseitige DDoS-Abwehr), `next/image` mit externen Quellen nicht nutzt und keine komplexen Rewrites hat, ist das Restrisiko für den Pilot vertretbar. **Backlog:** Upgrade auf Next.js 15 als eigenes Vorhaben (Major, Breaking Changes — separat testen).
- **Test-Werkzeuge** (vitest/vite/esbuild) haben moderate Lints, betreffen aber nur die Entwicklung, nicht die deployte App. Ein Update auf vitest 4 (breaking) lohnt erst bei Gelegenheit.
