import { describe, it, expect } from 'vitest'
import { normalisiereTelefon } from './telefon'

describe('normalisiereTelefon', () => {
  it('wandelt nationale 0-Schreibweise in E.164 ohne + um', () => {
    expect(normalisiereTelefon('0170 1234567')).toBe('491701234567')
    expect(normalisiereTelefon('0170-123 45 67')).toBe('491701234567')
  })

  it('akzeptiert internationale +-Schreibweise', () => {
    expect(normalisiereTelefon('+49 170 1234567')).toBe('491701234567')
    expect(normalisiereTelefon('+491701234567')).toBe('491701234567')
  })

  it('akzeptiert 00-Schreibweise', () => {
    expect(normalisiereTelefon('0049 1701234567')).toBe('491701234567')
  })

  it('ergänzt fehlende Landesvorwahl ohne führende 0', () => {
    expect(normalisiereTelefon('170 1234567')).toBe('491701234567')
  })

  it('respektiert eine abweichende Landesvorwahl', () => {
    expect(normalisiereTelefon('0660 1234567', '43')).toBe('436601234567')
  })

  it('gibt null bei leerer oder unbrauchbarer Eingabe zurück', () => {
    expect(normalisiereTelefon('')).toBeNull()
    expect(normalisiereTelefon('   ')).toBeNull()
    expect(normalisiereTelefon(null)).toBeNull()
    expect(normalisiereTelefon(undefined)).toBeNull()
    expect(normalisiereTelefon('abc')).toBeNull()
  })

  it('gibt null bei zu kurzer Nummer zurück', () => {
    expect(normalisiereTelefon('0123')).toBeNull()
  })
})
