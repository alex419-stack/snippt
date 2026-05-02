/**
 * Snippt — Mockdaten für M0 Hi-Fi-Code-Mockup
 *
 * Enthält ausschließlich Hardcoded-Demo-Daten für die /demo-Routen.
 * Multi-Tenant-Shape (Salon → Friseur → Termin/Kunde), wie er später
 * in der echten Supabase-Struktur landen wird (siehe CLAUDE.md, M1).
 *
 * KEINE API-Calls, KEINE Logik, KEINE Auth. Nur Daten.
 *
 * Datums-Konvention: Termine liegen in der laufenden Woche (Mo–Sa)
 * relativ zu „heute" (01.05.2026, ein Freitag). Wir hardcoden das Datum,
 * damit der Mockup deterministisch rendert und keine Zeitzonen-Surprises
 * auftauchen.
 */

// ---------- Types ----------

export type Salon = {
  id: string
  name: string
  slug: string
  friseure: Friseur[]
}

export type Friseur = {
  id: string
  name: string
  foto: string
  spezialitaet: string
  /** Anteil Stammkunden an Gesamttermin-Volumen, 0..1 (z.B. 0.72 = 72%) */
  stammkunden_anteil: number
}

export type Termin = {
  id: string
  friseur_id: string
  kunde_id: string
  /** ISO-8601 Datums-Zeit-String, lokale Zeit (Europe/Berlin) */
  start: string
  dauer_min: number
  leistung: string
  status: 'geplant' | 'walkin' | 'abgeschlossen'
}

export type Kunde = {
  id: string
  name: string
  foto: string
  lieblings_friseur_id: string
  notiz: string
}

// ---------- Friseure ----------

export const friseure: Friseur[] = [
  {
    id: 'f1',
    name: 'Marco Lehmann',
    foto: 'https://i.pravatar.cc/150?img=12',
    spezialitaet: 'Herrenschnitte & Bart',
    stammkunden_anteil: 0.78,
  },
  {
    id: 'f2',
    name: 'Sophie Wagner',
    foto: 'https://i.pravatar.cc/150?img=47',
    spezialitaet: 'Color & Strähnen',
    stammkunden_anteil: 0.64,
  },
  {
    id: 'f3',
    name: 'Jonas Kraus',
    foto: 'https://i.pravatar.cc/150?img=33',
    spezialitaet: 'Kurzhaarschnitte & Fades',
    stammkunden_anteil: 0.52,
  },
]

// ---------- Salon ----------

export const meinSalon: Salon = {
  id: 's1',
  name: 'Mein Friseur',
  slug: 'mein-friseur',
  friseure,
}

// ---------- Kunden ----------

export const kunden: Kunde[] = [
  { id: 'k1',  name: 'Thomas Brandt',     foto: 'https://i.pravatar.cc/150?img=68', lieblings_friseur_id: 'f1', notiz: 'Mag kürzer am Hals, Seiten 3mm. Immer Espresso vor dem Schnitt.' },
  { id: 'k2',  name: 'Lukas Hoffmann',    foto: 'https://i.pravatar.cc/150?img=15', lieblings_friseur_id: 'f1', notiz: 'Bart 6mm, Konturen sauber. Kommt meist freitags 17 Uhr.' },
  { id: 'k3',  name: 'Sebastian Voigt',   foto: 'https://i.pravatar.cc/150?img=51', lieblings_friseur_id: 'f1', notiz: 'Klassischer Sidepart, Pomade. Eilig — kurzer Smalltalk reicht.' },
  { id: 'k4',  name: 'Daniel Becker',     foto: 'https://i.pravatar.cc/150?img=60', lieblings_friseur_id: 'f1', notiz: 'Bartpflege monatlich. Allergisch gegen parfümierte Aftershaves.' },
  { id: 'k5',  name: 'Jan Pfeiffer',      foto: 'https://i.pravatar.cc/150?img=64', lieblings_friseur_id: 'f1', notiz: 'Übergang Maschine 0 auf 6, Deckhaar 4cm. Bringt eigene Foto-Referenz mit.' },
  { id: 'k6',  name: 'Christine Albrecht', foto: 'https://i.pravatar.cc/150?img=41', lieblings_friseur_id: 'f2', notiz: 'Balayage, warmer Goldton. Empfindliche Kopfhaut — sanft föhnen.' },
  { id: 'k7',  name: 'Anna Reinhardt',    foto: 'https://i.pravatar.cc/150?img=44', lieblings_friseur_id: 'f2', notiz: 'Strähnen alle 8 Wochen. Mag Tee, keinen Kaffee.' },
  { id: 'k8',  name: 'Julia Steinberg',   foto: 'https://i.pravatar.cc/150?img=23', lieblings_friseur_id: 'f2', notiz: 'Damenschnitt mit Pony, Stufen weich. Geburtstag im Mai — kleine Karte vorbereiten.' },
  { id: 'k9',  name: 'Melanie Burkhardt', foto: 'https://i.pravatar.cc/150?img=45', lieblings_friseur_id: 'f2', notiz: 'Color Refresh Aschblond. Allergie gegen PPD — ammoniakfreie Farbe.' },
  { id: 'k10', name: 'Sarah Engel',       foto: 'https://i.pravatar.cc/150?img=49', lieblings_friseur_id: 'f2', notiz: 'Lange Haare, Spitzen schneiden, keine Längenkorrektur größer 2cm.' },
  { id: 'k11', name: 'Felix Krämer',      foto: 'https://i.pravatar.cc/150?img=11', lieblings_friseur_id: 'f3', notiz: 'Skin Fade, Übergang messerscharf. Hört gerne House während des Schnitts.' },
  { id: 'k12', name: 'Tobias Mohr',       foto: 'https://i.pravatar.cc/150?img=14', lieblings_friseur_id: 'f3', notiz: 'Crew Cut, alle 3 Wochen. Pünktlich auf die Minute — bitte nicht warten lassen.' },
  { id: 'k13', name: 'Niklas Schubert',   foto: 'https://i.pravatar.cc/150?img=17', lieblings_friseur_id: 'f3', notiz: 'Buzz Cut 6mm gesamt. Schneller Kunde — 15 Min reichen.' },
  { id: 'k14', name: 'Alexander Heim',    foto: 'https://i.pravatar.cc/150?img=53', lieblings_friseur_id: 'f3', notiz: 'Fade mit Hard Part. Bringt fast immer den Sohn mit (12 J.).' },
  { id: 'k15', name: 'Maximilian Roth',   foto: 'https://i.pravatar.cc/150?img=58', lieblings_friseur_id: 'f3', notiz: 'Texturierter Crop, etwas Length oben. Empfindlicher Nacken.' },
  { id: 'k16', name: 'Patrick Vogel',     foto: 'https://i.pravatar.cc/150?img=65', lieblings_friseur_id: 'f1', notiz: 'Bart trimmen + Fade. Kommt aus Köln zu Besuch alle 6 Wochen.' },
  { id: 'k17', name: 'Vanessa Hartmann',  foto: 'https://i.pravatar.cc/150?img=20', lieblings_friseur_id: 'f2', notiz: 'Damenschnitt + Glanztönung. Lieblingstermin: Dienstag früh.' },
  { id: 'k18', name: 'Laura Friedrich',   foto: 'https://i.pravatar.cc/150?img=25', lieblings_friseur_id: 'f2', notiz: 'Bob mit A-Linie, präzise. Trinkt Wasser still, kein Sprudel.' },
]

// ---------- Termine ----------
//
// Aktuelle Woche (Mo 27.04. – Sa 02.05.2026), heute = Fr 01.05.2026
// Status-Verteilung: vor heute = abgeschlossen, heute/zukünftig = geplant/walkin
// Zeitfenster Salon: 09:00–19:00 Uhr

export const termine: Termin[] = [
  // ---- Mo 27.04. ----
  { id: 't01', friseur_id: 'f1', kunde_id: 'k1',  start: '2026-04-27T09:30:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't02', friseur_id: 'f1', kunde_id: 'k4',  start: '2026-04-27T10:30:00', dauer_min: 20, leistung: 'Bartpflege',     status: 'abgeschlossen' },
  { id: 't03', friseur_id: 'f2', kunde_id: 'k6',  start: '2026-04-27T10:00:00', dauer_min: 90, leistung: 'Color',          status: 'abgeschlossen' },
  { id: 't04', friseur_id: 'f3', kunde_id: 'k11', start: '2026-04-27T11:00:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't05', friseur_id: 'f3', kunde_id: 'k13', start: '2026-04-27T15:30:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't06', friseur_id: 'f1', kunde_id: 'k2',  start: '2026-04-27T17:00:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't07', friseur_id: 'f2', kunde_id: 'k8',  start: '2026-04-27T16:00:00', dauer_min: 45, leistung: 'Damenschnitt',   status: 'abgeschlossen' },

  // ---- Di 28.04. ----
  { id: 't08', friseur_id: 'f1', kunde_id: 'k5',  start: '2026-04-28T09:00:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't09', friseur_id: 'f2', kunde_id: 'k17', start: '2026-04-28T09:30:00', dauer_min: 45, leistung: 'Damenschnitt',   status: 'abgeschlossen' },
  { id: 't10', friseur_id: 'f2', kunde_id: 'k7',  start: '2026-04-28T11:00:00', dauer_min: 120, leistung: 'Strähnen',      status: 'abgeschlossen' },
  { id: 't11', friseur_id: 'f3', kunde_id: 'k12', start: '2026-04-28T13:00:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't12', friseur_id: 'f3', kunde_id: 'k14', start: '2026-04-28T14:00:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't13', friseur_id: 'f1', kunde_id: 'k3',  start: '2026-04-28T15:30:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't14', friseur_id: 'f1', kunde_id: 'k16', start: '2026-04-28T17:30:00', dauer_min: 45, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },

  // ---- Mi 29.04. ----
  { id: 't15', friseur_id: 'f1', kunde_id: 'k1',  start: '2026-04-29T10:00:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't16', friseur_id: 'f2', kunde_id: 'k9',  start: '2026-04-29T11:30:00', dauer_min: 90, leistung: 'Color',          status: 'abgeschlossen' },
  { id: 't17', friseur_id: 'f3', kunde_id: 'k15', start: '2026-04-29T12:30:00', dauer_min: 45, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't18', friseur_id: 'f1', kunde_id: 'k4',  start: '2026-04-29T14:00:00', dauer_min: 20, leistung: 'Bartpflege',     status: 'abgeschlossen' },
  { id: 't19', friseur_id: 'f2', kunde_id: 'k10', start: '2026-04-29T15:30:00', dauer_min: 45, leistung: 'Damenschnitt',   status: 'abgeschlossen' },
  { id: 't20', friseur_id: 'f3', kunde_id: 'k11', start: '2026-04-29T16:30:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },

  // ---- Do 30.04. ----
  { id: 't21', friseur_id: 'f1', kunde_id: 'k2',  start: '2026-04-30T09:00:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't22', friseur_id: 'f1', kunde_id: 'k5',  start: '2026-04-30T10:30:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't23', friseur_id: 'f2', kunde_id: 'k18', start: '2026-04-30T11:00:00', dauer_min: 45, leistung: 'Damenschnitt',   status: 'abgeschlossen' },
  { id: 't24', friseur_id: 'f3', kunde_id: 'k13', start: '2026-04-30T13:30:00', dauer_min: 20, leistung: 'Herrenschnitt',  status: 'walkin' },
  { id: 't25', friseur_id: 'f2', kunde_id: 'k6',  start: '2026-04-30T14:30:00', dauer_min: 90, leistung: 'Color',          status: 'abgeschlossen' },
  { id: 't26', friseur_id: 'f3', kunde_id: 'k14', start: '2026-04-30T16:00:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't27', friseur_id: 'f1', kunde_id: 'k3',  start: '2026-04-30T17:30:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },

  // ---- Fr 01.05. (HEUTE) ----
  { id: 't28', friseur_id: 'f1', kunde_id: 'k1',  start: '2026-05-01T09:30:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't29', friseur_id: 'f2', kunde_id: 'k7',  start: '2026-05-01T10:00:00', dauer_min: 120, leistung: 'Strähnen',      status: 'abgeschlossen' },
  { id: 't30', friseur_id: 'f3', kunde_id: 'k12', start: '2026-05-01T10:30:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't31', friseur_id: 'f1', kunde_id: 'k4',  start: '2026-05-01T11:30:00', dauer_min: 20, leistung: 'Bartpflege',     status: 'walkin' },
  { id: 't32', friseur_id: 'f3', kunde_id: 'k11', start: '2026-05-01T12:30:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'abgeschlossen' },
  { id: 't33', friseur_id: 'f1', kunde_id: 'k2',  start: '2026-05-01T14:00:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'geplant' },
  { id: 't34', friseur_id: 'f2', kunde_id: 'k8',  start: '2026-05-01T14:30:00', dauer_min: 45, leistung: 'Damenschnitt',   status: 'geplant' },
  { id: 't35', friseur_id: 'f1', kunde_id: 'k16', start: '2026-05-01T15:00:00', dauer_min: 45, leistung: 'Herrenschnitt',  status: 'geplant' },
  { id: 't36', friseur_id: 'f3', kunde_id: 'k15', start: '2026-05-01T15:30:00', dauer_min: 45, leistung: 'Herrenschnitt',  status: 'geplant' },
  { id: 't37', friseur_id: 'f2', kunde_id: 'k9',  start: '2026-05-01T16:00:00', dauer_min: 90, leistung: 'Color',          status: 'geplant' },
  { id: 't38', friseur_id: 'f1', kunde_id: 'k5',  start: '2026-05-01T16:30:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'geplant' },
  { id: 't39', friseur_id: 'f3', kunde_id: 'k14', start: '2026-05-01T17:00:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'geplant' },
  { id: 't40', friseur_id: 'f1', kunde_id: 'k3',  start: '2026-05-01T17:30:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'geplant' },
  { id: 't41', friseur_id: 'f2', kunde_id: 'k17', start: '2026-05-01T18:00:00', dauer_min: 45, leistung: 'Damenschnitt',   status: 'geplant' },

  // ---- Sa 02.05. ----
  { id: 't42', friseur_id: 'f1', kunde_id: 'k4',  start: '2026-05-02T09:00:00', dauer_min: 20, leistung: 'Bartpflege',     status: 'geplant' },
  { id: 't43', friseur_id: 'f1', kunde_id: 'k1',  start: '2026-05-02T09:30:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'geplant' },
  { id: 't44', friseur_id: 'f2', kunde_id: 'k10', start: '2026-05-02T10:00:00', dauer_min: 45, leistung: 'Damenschnitt',   status: 'geplant' },
  { id: 't45', friseur_id: 'f3', kunde_id: 'k13', start: '2026-05-02T10:30:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'geplant' },
  { id: 't46', friseur_id: 'f2', kunde_id: 'k18', start: '2026-05-02T11:30:00', dauer_min: 45, leistung: 'Damenschnitt',   status: 'geplant' },
  { id: 't47', friseur_id: 'f3', kunde_id: 'k12', start: '2026-05-02T13:00:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'geplant' },
  { id: 't48', friseur_id: 'f1', kunde_id: 'k5',  start: '2026-05-02T14:30:00', dauer_min: 30, leistung: 'Herrenschnitt',  status: 'geplant' },
  { id: 't49', friseur_id: 'f2', kunde_id: 'k6',  start: '2026-05-02T15:00:00', dauer_min: 90, leistung: 'Color',          status: 'geplant' },
  { id: 't50', friseur_id: 'f3', kunde_id: 'k15', start: '2026-05-02T16:30:00', dauer_min: 45, leistung: 'Herrenschnitt',  status: 'geplant' },
]

// ---------- Convenience-Lookups ----------
//
// Werden in den /demo-Screens verwendet, um IDs in lesbare Objekte aufzulösen.

export function getFriseurById(id: string): Friseur | undefined {
  return friseure.find((f) => f.id === id)
}

export function getKundeById(id: string): Kunde | undefined {
  return kunden.find((k) => k.id === id)
}

export function getTermineByFriseur(friseurId: string): Termin[] {
  return termine.filter((t) => t.friseur_id === friseurId)
}
