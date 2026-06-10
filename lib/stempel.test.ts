import { describe, it, expect } from 'vitest'
import { istKarteVoll, waehleEinzuloesendeStempel } from './stempel'

describe('istKarteVoll', () => {
  it('ist voll, wenn offene Stempel das Ziel erreichen', () => {
    expect(istKarteVoll(10, 10)).toBe(true)
    expect(istKarteVoll(11, 10)).toBe(true)
  })

  it('ist nicht voll unterhalb des Ziels', () => {
    expect(istKarteVoll(9, 10)).toBe(false)
    expect(istKarteVoll(0, 10)).toBe(false)
  })

  it('ist nie voll, wenn keine Stempelkarte aktiv ist (Ziel null)', () => {
    expect(istKarteVoll(20, null)).toBe(false)
  })

  it('ist nie voll bei Ziel 0 (ungueltig konfiguriert)', () => {
    expect(istKarteVoll(5, 0)).toBe(false)
  })
})

describe('waehleEinzuloesendeStempel', () => {
  // Eingabe ist nach Vergabedatum aufsteigend sortiert (aelteste zuerst).
  it('waehlt genau Ziel viele, die aeltesten zuerst', () => {
    const ids = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']
    expect(waehleEinzuloesendeStempel(ids, 10)).toEqual([
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    ])
  })

  it('laesst Ueberhang stehen (11 offen, Ziel 10 -> 10 eingeloest)', () => {
    const ids = Array.from({ length: 11 }, (_, i) => `s${i}`)
    expect(waehleEinzuloesendeStempel(ids, 10)).toHaveLength(10)
  })

  it('gibt nichts zurueck, wenn weniger als Ziel offen sind', () => {
    expect(waehleEinzuloesendeStempel(['a', 'b'], 10)).toEqual([])
  })

  it('gibt nichts zurueck bei leerer Liste (Neukunde ohne Stempel)', () => {
    expect(waehleEinzuloesendeStempel([], 10)).toEqual([])
  })

  it('gibt nichts zurueck bei Ziel null', () => {
    const ids = Array.from({ length: 10 }, (_, i) => `s${i}`)
    expect(waehleEinzuloesendeStempel(ids, null)).toEqual([])
  })
})
