import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Cast } from './Cast'
import { hosts } from '../data/hosts'

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
})
