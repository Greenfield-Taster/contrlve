import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Cast, CastCard } from './Cast'
import { hosts } from '../data/hosts'
import type { Host } from '../data/hosts'

describe('Cast', () => {
  it('показує всіх чотирьох з іменами і ролями', () => {
    render(<Cast />)
    for (const host of hosts) {
      expect(screen.getByText(host.name)).toBeInTheDocument()
    }
    expect(screen.getAllByText('резидент')).toHaveLength(3)
    expect(screen.getByText('ведучий')).toBeInTheDocument()
  })

  it('показує підписи, які є в даних', () => {
    render(<Cast />)
    expect(screen.getByText('мінус бал')).toBeInTheDocument()
  })

  it('фото мають описовий alt', () => {
    render(<Cast />)
    expect(screen.getByAltText('Женя Янович')).toBeInTheDocument()
  })

  it('картка може отримати фокус через клавіатуру', async () => {
    render(<Cast />)
    const user = userEvent.setup()
    await user.tab()
    const firstCard = screen.getAllByRole('listitem')[0]
    expect(firstCard).toHaveFocus()
  })

  it('не показує елемент підпису, якщо його немає в даних', () => {
    const hostWithoutCaption: Host = {
      id: 'test',
      name: 'Тестер',
      role: 'тестер',
      photo: '/test.webp',
      caption: null,
    }

    const { container } = render(
      <ul>
        <CastCard host={hostWithoutCaption} />
      </ul>,
    )

    expect(screen.getByText('Тестер')).toBeInTheDocument()
    expect(container.querySelector('.cast-caption')).not.toBeInTheDocument()
  })
})
