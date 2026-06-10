// Reine Stempelkarten-Logik — keine Datenbank, keine React-Importe.
// Die geld-nahe Kern-Entscheidung liegt hier, damit sie testbar ist.

// Karte voll? Nur wenn eine Stempelkarte aktiv ist (Ziel > 0) und die offenen
// Stempel das Ziel erreichen oder ueberschreiten.
export function istKarteVoll(offeneStempel: number, ziel: number | null): boolean {
  if (!ziel || ziel <= 0) return false
  return offeneStempel >= ziel
}

// Aus den offenen Stempel-IDs (aufsteigend nach Vergabedatum, aelteste zuerst)
// die genau Ziel vielen aeltesten zum Einloesen auswaehlen. Ueberhang bleibt.
// Sind weniger als Ziel offen oder ist keine Karte aktiv: nichts einloesen.
export function waehleEinzuloesendeStempel(
  offeneStempelIdsAeltesteZuerst: string[],
  ziel: number | null,
): string[] {
  if (!ziel || ziel <= 0) return []
  if (offeneStempelIdsAeltesteZuerst.length < ziel) return []
  return offeneStempelIdsAeltesteZuerst.slice(0, ziel)
}
