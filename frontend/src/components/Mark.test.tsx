import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Mark } from './Mark'

describe('Mark', () => {
  it('малює текст у семантичному <mark>', () => {
    render(<Mark>ховають</Mark>)
    const mark = screen.getByText('ховають')
    expect(mark.tagName).toBe('MARK')
  })

  it('за замовчуванням має клас mark', () => {
    render(<Mark>ховають</Mark>)
    expect(screen.getByText('ховають')).toHaveClass('mark')
  })

  it('з instant одразу виділений, без чекання на скрол', () => {
    render(<Mark instant>ховають</Mark>)
    expect(screen.getByText('ховають')).toHaveClass('mark--revealed')
  })
})
