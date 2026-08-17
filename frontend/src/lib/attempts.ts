const KEY = 'contrlve.attempts'

export function readAttempts(): number {
  try {
    const raw = localStorage.getItem(KEY)
    const value = Number.parseInt(raw ?? '', 10)
    return Number.isFinite(value) && value > 0 ? value : 0
  } catch {
    return 0
  }
}

export function bumpAttempts(): number {
  const next = readAttempts() + 1
  try {
    localStorage.setItem(KEY, String(next))
  } catch {
    // приватний режим або заблокований сторедж — лічильник просто не переживе перезавантаження
  }
  return next
}
