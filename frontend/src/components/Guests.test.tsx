import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Guests } from './Guests'
import { episodes } from '../data/episodes'

describe('Guests', () => {
  it('показує кожного гостя (двічі — стрічка дублюється)', () => {
    render(<Guests />)
    for (const episode of episodes) {
      expect(screen.getAllByText(episode.guest).length).toBeGreaterThanOrEqual(1)
    }
  })

  it('кожна картка веде на своє відео у новій вкладці', () => {
    render(<Guests />)
    const first = screen.getAllByRole('link', { name: new RegExp(episodes[0].guest) })[0]
    expect(first).toHaveAttribute('href', expect.stringContaining(episodes[0].videoId))
    expect(first).toHaveAttribute('target', '_blank')
    expect(first).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
  })

  it('дублює список для безшовної стрічки, але копії сховані від читалок', () => {
    const { container } = render(<Guests />)
    const rows = container.querySelectorAll('[data-marquee-row]')
    expect(rows).toHaveLength(2)
    for (const row of rows) {
      const copies = row.querySelectorAll('[data-marquee-copy]')
      expect(copies).toHaveLength(1)
      expect(copies[0]).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('веде на повний плейлист', () => {
    render(<Guests />)
    expect(screen.getByRole('link', { name: /усі випуски/i })).toHaveAttribute(
      'href',
      expect.stringContaining('playlist'),
    )
  })

  it('розкладає випуски на два ряди', () => {
    const { container } = render(<Guests />)
    const [top, bottom] = container.querySelectorAll('[data-marquee-row]')
    // Копії стрічки мають aria-hidden, тож у дерево доступності потрапляє
    // рівно по одному посиланню на випуск.
    const count = (row: Element) =>
      within(row as HTMLElement).getAllByRole('link').length
    const half = Math.ceil(episodes.length / 2)
    expect(count(top)).toBe(half)
    expect(count(bottom)).toBe(episodes.length - half)
  })

  it('ряди їдуть назустріч один одному', () => {
    const { container } = render(<Guests />)
    const [top, bottom] = container.querySelectorAll('[data-marquee-row]')
    expect(top.querySelector('.marquee__track')).toHaveClass('marquee__track--left')
    expect(bottom.querySelector('.marquee__track')).toHaveClass('marquee__track--right')
  })

  it('приховані копії не потрапляють у Tab-порядок', () => {
    const { container } = render(<Guests />)
    const copies = container.querySelectorAll('[data-marquee-copy] a')
    expect(copies.length).toBeGreaterThan(0)
    for (const link of copies) {
      expect(link).toHaveAttribute('tabindex', '-1')
    }
    // Справжні (не задубльовані) картки лишаються у звичайному Tab-порядку.
    const real = container.querySelectorAll(
      '.marquee__group:not([data-marquee-copy]) a',
    )
    expect(real.length).toBe(episodes.length)
    for (const link of real) {
      expect(link).not.toHaveAttribute('tabindex')
    }
  })
})
