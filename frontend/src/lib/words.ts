export type WordIssue = {
  /** Індекс поля, або -1 для помилки рівня форми */
  index: number
  message: string
  blocking: boolean
}

const MIN_LENGTH = 2
const MAX_LENGTH = 24

export function validateWords(words: string[]): WordIssue[] {
  const issues: WordIssue[] = []
  const trimmed = words.map((word) => word.trim())

  if (trimmed.some((word) => word.length === 0)) {
    issues.push({ index: -1, message: 'три — це три', blocking: true })
  }

  trimmed.forEach((word, index) => {
    if (word.length === 0) return

    if (/\s/.test(word)) {
      issues.push({ index, message: 'одне поле — одне слово', blocking: true })
      return
    }
    if (word.length < MIN_LENGTH) {
      issues.push({ index, message: 'це не слово', blocking: true })
      return
    }
    if (word.length > MAX_LENGTH) {
      issues.push({ index, message: 'це вже речення', blocking: true })
      return
    }
    if (/[a-z]/i.test(word)) {
      issues.push({
        index,
        message: 'можна й латиною, ведучий якось прочитає',
        blocking: false,
      })
    }
  })

  return issues
}

export function hasBlockingIssues(issues: WordIssue[]): boolean {
  return issues.some((issue) => issue.blocking)
}
