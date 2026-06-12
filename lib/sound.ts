// Kleiner Ton-Helfer für die Live-Cues (neuer Kunde / du bist dran).
//
// Erzeugt den Ton direkt im Browser (Web Audio), daher keine Audio-Datei nötig.
// WICHTIG für iPhone/iPad (iOS): Ton lässt sich nur abspielen, NACHDEM der
// Nutzer die Seite einmal berührt hat. Darum `audioFreischalten()` beim ersten
// Tippen aufrufen — danach kommt der spätere Ton zuverlässig.

let ctx: AudioContext | null = null

function holeCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

// Beim ersten Tippen aufrufen: schaltet den Ton frei (iOS-Geste-Pflicht).
export function audioFreischalten() {
  const c = holeCtx()
  if (!c) return
  if (c.state === 'suspended') void c.resume()
  // Unhörbarer „Warmlauf", damit der spätere echte Ton sofort sitzt.
  try {
    const o = c.createOscillator()
    const g = c.createGain()
    g.gain.value = 0.00001
    o.connect(g)
    g.connect(c.destination)
    o.start()
    o.stop(c.currentTime + 0.02)
  } catch {
    // Ignorieren — ohne Ton ist die Demo trotzdem funktionsfähig.
  }
}

// Kurzer, freundlicher Doppel-Ton als Aufmerksamkeits-Signal.
export function tonAbspielen() {
  const c = holeCtx()
  if (!c) return
  if (c.state === 'suspended') void c.resume()
  const start = c.currentTime
  const toene = [880, 1320] // zwei steigende Töne
  toene.forEach((freq, i) => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.value = freq
    const t = start + i * 0.16
    g.gain.setValueAtTime(0.00001, t)
    g.gain.exponentialRampToValueAtTime(0.3, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.00001, t + 0.15)
    o.connect(g)
    g.connect(c.destination)
    o.start(t)
    o.stop(t + 0.16)
  })
}
