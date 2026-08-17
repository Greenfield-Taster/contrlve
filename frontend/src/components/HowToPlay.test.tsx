import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { HowToPlay } from './HowToPlay'
import { demo } from '../data/demo'

describe('HowToPlay', () => {
  it('показує три кроки', () => {
    render(<HowToPlay />)
    expect(screen.getByText(/Ведучий дає слова/i)).toBeInTheDocument()
    expect(screen.getByText(/Ти ховаєш їх у монолозі/i)).toBeInTheDocument()
    expect(screen.getByText(/Суперники шукають/i)).toBeInTheDocument()
  })

  // У заголовку секції теж є <Mark>, тож рахуємо виділення лише в самому монолозі
  const marksInDemo = () =>
    Array.from(
      screen.getByTestId('demo-text').querySelectorAll('mark'),
    ).map((m) => m.textContent)

  it('спочатку слова не підсвічені', () => {
    render(<HowToPlay />)
    expect(marksInDemo()).toHaveLength(0)
  })

  it('кнопка підсвічує всі три слова', async () => {
    const user = userEvent.setup()
    render(<HowToPlay />)

    await user.click(screen.getByRole('button', { name: 'Показати слова' }))

    const marks = marksInDemo()
    expect(marks).toHaveLength(demo.words.length)
    for (const word of demo.words) {
      expect(marks.some((text) => text?.toLowerCase() === word.toLowerCase())).toBe(true)
    }
  })

  it('кнопка перемикається назад', async () => {
    const user = userEvent.setup()
    render(<HowToPlay />)

    await user.click(screen.getByRole('button', { name: 'Показати слова' }))
    await user.click(screen.getByRole('button', { name: 'Сховати' }))

    expect(marksInDemo()).toHaveLength(0)
  })
})
