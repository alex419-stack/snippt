// Normalisiert eine eingegebene Telefonnummer auf das Format der WhatsApp
// Cloud API: nur Ziffern inklusive Landesvorwahl, ohne führendes "+"
// (z. B. "491701234567"). Gibt null zurück, wenn die Eingabe offensichtlich
// keine brauchbare Nummer ist.
//
// Beispiele (Standard-Landesvorwahl 49 = Deutschland):
//   "0170 1234567"   -> "491701234567"
//   "+49 170 1234567"-> "491701234567"
//   "0049 1701234567"-> "491701234567"
//   "170 1234567"    -> "491701234567"
//   ""/"abc"         -> null
export function normalisiereTelefon(
  roh: string | null | undefined,
  landesvorwahl = '49',
): string | null {
  if (!roh) return null
  let s = roh.trim()
  if (!s) return null

  // Internationale 00-Schreibweise wie eine +-Nummer behandeln
  if (s.startsWith('00')) s = '+' + s.slice(2)

  const hatLandesvorwahl = s.startsWith('+')
  let ziffern = s.replace(/\D/g, '')
  if (!ziffern) return null

  if (hatLandesvorwahl) {
    // Landesvorwahl ist bereits enthalten — nichts ergänzen
  } else if (ziffern.startsWith('0')) {
    // Nationale Schreibweise: führende Null(en) durch Landesvorwahl ersetzen
    ziffern = landesvorwahl + ziffern.replace(/^0+/, '')
  } else {
    // Weder + noch führende 0: Landesvorwahl fehlt vermutlich
    ziffern = landesvorwahl + ziffern
  }

  // Plausibilität: internationale Nummern haben grob 8–15 Stellen (E.164)
  if (ziffern.length < 8 || ziffern.length > 15) return null
  return ziffern
}
