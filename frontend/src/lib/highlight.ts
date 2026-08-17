export type Segment = {
  text: string
  marked: boolean
}

/**
 * Ріже текст на шматки, позначаючи входження кожного зі слів.
 * Пошук без урахування регістру, у результат потрапляє оригінальний текст.
 */
export function splitByWords(text: string, words: string[]): Segment[] {
  const hits: Array<{ start: number; end: number }> = []
  const haystack = text.toLowerCase()

  for (const word of words) {
    const needle = word.trim().toLowerCase()
    if (needle.length === 0) continue

    let from = 0
    for (;;) {
      const start = haystack.indexOf(needle, from)
      if (start === -1) break
      hits.push({ start, end: start + needle.length })
      from = start + needle.length
    }
  }

  hits.sort((a, b) => a.start - b.start)

  const segments: Segment[] = []
  let cursor = 0

  for (const hit of hits) {
    if (hit.start < cursor) continue
    if (hit.start > cursor) {
      segments.push({ text: text.slice(cursor, hit.start), marked: false })
    }
    segments.push({ text: text.slice(hit.start, hit.end), marked: true })
    cursor = hit.end
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), marked: false })
  }

  return segments
}
