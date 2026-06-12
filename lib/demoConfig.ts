// Zentrale Schraube für das Live-Polling von Dashboard und Kundenseite.
//
// BEWUSST kurz für die Pilot-Demo: So erscheint ein neuer Kunde beim Friseur
// und der „Du bist dran"-Moment beim Kunden in ~3 Sekunden statt erst nach
// einer halben Minute — das macht die Vorführung lebendig.
//
// ⚠️ NACH der Demo zum Skalieren wieder hochsetzen (z.B. 20–30):
// Jeder offene Bildschirm fragt sonst alle 3 Sekunden den Server —
// bei vielen gleichzeitigen Friseuren/Kunden sind das unnötig viele Abfragen.
export const POLL_SEKUNDEN = 3
