import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Socials } from './Socials'
import { socials } from '../data/socials'

describe('Socials', () => {
  it('показує всі чотири мережі як посилання', () => {
    render(<Socials />)
    for (const social of socials) {
      expect(screen.getByRole('link', { name: new RegExp(social.label, 'i') })).toHaveAttribute(
        'href',
        social.url,
      )
    }
  })

  it('форматує відоме число підписників', () => {
    render(<Socials />)
    expect(screen.getByText('264 тис.')).toBeInTheDocument()
  })

  it('не вигадує числа, коли їх немає', () => {
    render(<Socials />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
    expect(screen.queryByText('null')).not.toBeInTheDocument()
  })

  it('показує хендли', () => {
    render(<Socials />)
    expect(screen.getAllByText('@contrlve').length).toBe(3)
  })
})
