-- ============================================================
-- Migration 012 — Sicherheits-Feinschliff (aus Supabase-Advisor, 11.06.2026)
-- Zwei kleine Härtungen. Die übrigen Advisor-Warnungen sind bewusst akzeptiert
-- (siehe KNOWN_ISSUES.md): die öffentlichen RPCs (anstellen/einchecken/…) sollen
-- per Design von anon aufrufbar sein, Performance-Hinweise sind bei Ein-Friseur-
-- Skala irrelevant.
-- ============================================================

-- 1. Trigger-Funktion handle_new_user nicht als öffentliche RPC exponieren.
--    Sie läuft ausschließlich als Trigger auf auth.users; ein direkter Aufruf
--    über /rest/v1/rpc/ soll nicht möglich sein.
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.handle_new_user() from public;

-- 2. is_slug_reserved: festen, leeren search_path setzen (verhindert, dass über
--    einen manipulierten search_path andere Objekte untergeschoben werden).
--    Die Funktion nutzt nur eingebaute pg_catalog-Funktionen und funktioniert
--    daher auch ohne public im Pfad.
alter function public.is_slug_reserved(text) set search_path = '';
