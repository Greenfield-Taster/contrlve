import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
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

  describe('без instant, за справжнім IntersectionObserver', () => {
    let capturedCallback: IntersectionObserverCallback | null = null
    let disconnect: Mock<() => void>
    let originalIntersectionObserver: typeof IntersectionObserver

    beforeEach(() => {
      capturedCallback = null
      disconnect = vi.fn<() => void>()
      originalIntersectionObserver = window.IntersectionObserver

      class FakeIntersectionObserver implements IntersectionObserver {
        readonly root = null
        readonly rootMargin = ''
        readonly scrollMargin = ''
        readonly thresholds: ReadonlyArray<number> = []

        constructor(callback: IntersectionObserverCallback) {
          capturedCallback = callback
        }

        disconnect(): void {
          disconnect()
        }
        observe(): void {}
        unobserve(): void {}
        takeRecords(): IntersectionObserverEntry[] {
          return []
        }
      }

      vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
    })

    afterEach(() => {
      vi.stubGlobal('IntersectionObserver', originalIntersectionObserver)
    })

    it('відкриває mark--revealed, коли елемент входить у в’юпорт, і відключає спостерігач', () => {
      render(<Mark>ховають</Mark>)
      const mark = screen.getByText('ховають')

      expect(mark).not.toHaveClass('mark--revealed')
      expect(capturedCallback).not.toBeNull()

      act(() => {
        capturedCallback?.(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        )
      })

      expect(mark).toHaveClass('mark--revealed')
      expect(disconnect).toHaveBeenCalled()
    })
  })
})
