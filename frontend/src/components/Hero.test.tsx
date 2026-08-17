import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Hero } from './Hero'
import { firstRules, lastRule } from '../data/rules'

describe('Hero', () => {
  it('показує логотип шоу', () => {
    render(<Hero />)
    expect(screen.getByAltText('ШОУ КОНТРЛВЕ')).toBeInTheDocument()
  })

  it('показує одне з семи перших правил і останнє', () => {
    render(<Hero />)
    const items = screen.getAllByRole('listitem').map((li) => li.textContent)
    expect(firstRules).toContain(items[0])
    expect(items[1]).toBe(lastRule)
  })

  it('веде на плейлист і в App Store', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /дивитись/i })).toHaveAttribute(
      'href',
      expect.stringContaining('youtube.com/playlist'),
    )
    expect(screen.getByRole('link', { name: /завантажити гру/i })).toHaveAttribute(
      'href',
      expect.stringContaining('apps.apple.com'),
    )
  })

  it('показує чотирьох людей шоу', () => {
    render(<Hero />)
    expect(screen.getByAltText(/Женя Янович/)).toBeInTheDocument()
    expect(screen.getByAltText(/Антон Мигаль/)).toBeInTheDocument()
    expect(screen.getByAltText(/Дмитро Андрієнко/)).toBeInTheDocument()
    expect(screen.getByAltText(/Олександр Разбєйков/)).toBeInTheDocument()
  })
})
