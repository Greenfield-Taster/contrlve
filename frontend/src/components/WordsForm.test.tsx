import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WordsForm } from './WordsForm'
import { submitWords } from '../lib/submitWords'

// Мокаємо саме точку «відправки»: справжній буфер обміну в jsdom конфліктує
// з тим, що підміняє userEvent.setup(), і тест ставав би флакі.
vi.mock('../lib/submitWords', () => ({ submitWords: vi.fn() }))

const fillWords = async (
  user: ReturnType<typeof userEvent.setup>,
  words: [string, string, string],
) => {
  const fields = screen.getAllByRole('textbox')
  for (let i = 0; i < 3; i += 1) {
    await user.clear(fields[i])
    await user.type(fields[i], words[i])
  }
}

describe('WordsForm', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(submitWords).mockReset()
    vi.mocked(submitWords).mockResolvedValue({
      text: 'КОНТРЛВЕ, мої три слова: пилосос, валідол, шифер',
      copied: true,
      attempts: 1,
    })
  })

  it('має три поля з підписами', () => {
    render(<WordsForm />)
    expect(screen.getAllByRole('textbox')).toHaveLength(3)
    expect(screen.getByLabelText('Слово 1')).toBeInTheDocument()
  })

  it('не пускає порожню форму і каже про це', async () => {
    const user = userEvent.setup()
    render(<WordsForm />)

    await user.click(screen.getByRole('button', { name: 'Скопіювати слова' }))

    expect(screen.getByText('три — це три')).toBeInTheDocument()
  })

  it('показує помилку короткого слова біля поля', async () => {
    const user = userEvent.setup()
    render(<WordsForm />)

    await fillWords(user, ['я', 'валідол', 'шифер'])
    await user.click(screen.getByRole('button', { name: 'Скопіювати слова' }))

    expect(screen.getByText('це не слово')).toBeInTheDocument()
  })

  it('після відправки показує слова і каже, що скопіював', async () => {
    const user = userEvent.setup()
    render(<WordsForm />)

    await fillWords(user, ['пилосос', 'валідол', 'шифер'])
    await user.click(screen.getByRole('button', { name: 'Скопіювати слова' }))

    expect(await screen.findByText(/скопіювали/i)).toBeInTheDocument()
    expect(submitWords).toHaveBeenCalledWith(['пилосос', 'валідол', 'шифер'])
  })

  it('не відправляє, поки є блокувальна помилка', async () => {
    const user = userEvent.setup()
    render(<WordsForm />)

    await fillWords(user, ['я', 'валідол', 'шифер'])
    await user.click(screen.getByRole('button', { name: 'Скопіювати слова' }))

    expect(submitWords).not.toHaveBeenCalled()
  })

  it('коли буфер недоступний — просить скопіювати руками', async () => {
    vi.mocked(submitWords).mockResolvedValue({
      text: 'КОНТРЛВЕ, мої три слова: пилосос, валідол, шифер',
      copied: false,
      attempts: 1,
    })
    const user = userEvent.setup()
    render(<WordsForm />)

    await fillWords(user, ['пилосос', 'валідол', 'шифер'])
    await user.click(screen.getByRole('button', { name: 'Скопіювати слова' }))

    expect(await screen.findByText(/скопіюй руками/i)).toBeInTheDocument()
  })

  it('кнопка «Не знаю, придумай» заповнює всі три поля', async () => {
    const user = userEvent.setup()
    render(<WordsForm />)

    await user.click(screen.getByRole('button', { name: 'Не знаю, придумай' }))

    const values = screen.getAllByRole('textbox').map((f) => (f as HTMLInputElement).value)
    expect(values.every((v) => v.length > 1)).toBe(true)
    expect(new Set(values).size).toBe(3)
  })

  it('з другого разу показує, скільки разів ти це вже робив', async () => {
    localStorage.setItem('contrlve.attempts', '4')
    render(<WordsForm />)
    expect(screen.getByText(/ти вже робив це 4 рази/i)).toBeInTheDocument()
  })

  it('не показує лічильник першого разу', () => {
    render(<WordsForm />)
    expect(screen.queryByText(/ти вже робив це/i)).not.toBeInTheDocument()
  })

  it('Ctrl+V у документі кладе вставлене в перше порожнє поле', async () => {
    render(<WordsForm />)

    const event = new Event('paste', { bubbles: true }) as ClipboardEvent
    Object.defineProperty(event, 'clipboardData', {
      value: { getData: () => 'домофон' },
    })
    document.dispatchEvent(event)

    await waitFor(() =>
      expect((screen.getAllByRole('textbox')[0] as HTMLInputElement).value).toBe('домофон'),
    )
  })

  it('подвійний клік «Відправити» не відправляє двічі', async () => {
    let resolveSubmit: (value: {
      text: string
      copied: boolean
      attempts: number
    }) => void = () => {}
    vi.mocked(submitWords).mockReturnValue(
      new Promise((resolve) => {
        resolveSubmit = resolve
      }),
    )

    const user = userEvent.setup()
    render(<WordsForm />)

    await fillWords(user, ['пилосос', 'валідол', 'шифер'])
    const button = screen.getByRole('button', { name: 'Скопіювати слова' })
    await user.click(button)
    await user.click(button)

    expect(submitWords).toHaveBeenCalledTimes(1)

    resolveSubmit({
      text: 'КОНТРЛВЕ, мої три слова: пилосос, валідол, шифер',
      copied: true,
      attempts: 1,
    })
    await screen.findByText(/скопіювали/i)
  })
})
