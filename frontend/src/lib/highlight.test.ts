import { describe, expect, it } from 'vitest'
import { splitByWords } from './highlight'

describe('splitByWords', () => {
  it('без слів повертає один шматок', () => {
    expect(splitByWords('текст без нічого', [])).toEqual([
      { text: 'текст без нічого', marked: false },
    ])
  })

  it('позначає слово всередині тексту', () => {
    expect(splitByWords('дістає пилосос і мовчить', ['пилосос'])).toEqual([
      { text: 'дістає ', marked: false },
      { text: 'пилосос', marked: true },
      { text: ' і мовчить', marked: false },
    ])
  })

  it('знаходить слово незалежно від регістру і зберігає оригінальний', () => {
    expect(splitByWords('приїхав у Черкаси', ['черкаси'])).toEqual([
      { text: 'приїхав у ', marked: false },
      { text: 'Черкаси', marked: true },
    ])
  })

  it('позначає кілька слів у порядку появи', () => {
    const segments = splitByWords('пилосос, потім валідол', ['валідол', 'пилосос'])
    expect(segments.filter((s) => s.marked).map((s) => s.text)).toEqual([
      'пилосос',
      'валідол',
    ])
  })

  it('не створює порожніх шматків', () => {
    const segments = splitByWords('пилосос', ['пилосос'])
    expect(segments).toEqual([{ text: 'пилосос', marked: true }])
  })
})
