import { describe, expect, it } from 'vitest'
import { hasBlockingIssues, validateWords } from './words'

const messages = (words: string[]) => validateWords(words).map((i) => i.message)

describe('validateWords', () => {
  it('приймає три нормальні слова', () => {
    expect(validateWords(['пилосос', 'валідол', 'шифер'])).toEqual([])
  })

  it('вимагає всі три поля', () => {
    const issues = validateWords(['пилосос', '', ''])
    expect(issues).toContainEqual({ index: -1, message: 'три — це три', blocking: true })
  })

  it('не приймає односимвольне слово', () => {
    expect(messages(['я', 'валідол', 'шифер'])).toContain('це не слово')
  })

  it('не приймає слово довше за 24 символи', () => {
    expect(messages(['а'.repeat(25), 'валідол', 'шифер'])).toContain('це вже речення')
  })

  it('не приймає пробіл усередині поля', () => {
    expect(messages(['два слова', 'валідол', 'шифер'])).toContain('одне поле — одне слово')
  })

  it('латиницю пропускає, але попереджає', () => {
    const issues = validateWords(['vacuum', 'валідол', 'шифер'])
    const latin = issues.find((i) => i.index === 0)
    expect(latin?.message).toBe('можна й латиною, ведучий якось прочитає')
    expect(latin?.blocking).toBe(false)
    expect(hasBlockingIssues(issues)).toBe(false)
  })

  it('прив’язує помилку до конкретного поля', () => {
    const issues = validateWords(['пилосос', 'я', 'шифер'])
    expect(issues).toContainEqual({ index: 1, message: 'це не слово', blocking: true })
  })

  it('ігнорує пробіли по краях', () => {
    expect(validateWords(['  пилосос  ', 'валідол', 'шифер'])).toEqual([])
  })
})

describe('hasBlockingIssues', () => {
  it('порожній список не блокує', () => {
    expect(hasBlockingIssues([])).toBe(false)
  })

  it('блокувальна помилка блокує', () => {
    expect(hasBlockingIssues([{ index: 0, message: 'це не слово', blocking: true }])).toBe(true)
  })
})
