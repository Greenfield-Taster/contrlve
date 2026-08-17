import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Cast } from './Cast'
import { hosts } from '../data/hosts'
import { Mark } from './Mark'
import { Section } from './Section'
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
      <Section id="cast" title={<>Хто в <Mark>кадрі</Mark></>}>
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          <li
            key={hostWithoutCaption.id}
            className="cast-card group relative overflow-hidden rounded-2xl border border-white/15 bg-black/50"
            tabIndex={0}
          >
            <img
              src={hostWithoutCaption.photo}
              width={557}
              height={835}
              alt={hostWithoutCaption.name}
              loading="lazy"
              className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4">
              <span className="block font-brand text-lg">{hostWithoutCaption.name}</span>
              <span className="block text-sm text-white/60">{hostWithoutCaption.role}</span>
              {hostWithoutCaption.caption && (
                <span className="mt-2 inline-block bg-mark px-2 py-0.5 font-brand text-sm text-ink cast-caption">
                  {hostWithoutCaption.caption}
                </span>
              )}
            </div>
          </li>
        </ul>
      </Section>,
    )

    expect(screen.getByText('Тестер')).toBeInTheDocument()
    expect(container.querySelector('.cast-caption')).not.toBeInTheDocument()
  })
})
