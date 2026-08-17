import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useDragScroll } from './useDragScroll'

function Strip() {
  const ref = useDragScroll<HTMLDivElement>()
  return <div ref={ref} data-testid="strip" />
}

/** jsdom не рахує розкладку, тож прокрутку тримаємо на власному полі */
function renderStrip() {
  render(<Strip />)
  const strip = screen.getByTestId('strip')
  let scrollLeft = 200
  Object.defineProperty(strip, 'scrollLeft', {
    configurable: true,
    get: () => scrollLeft,
    set: (value: number) => {
      scrollLeft = value
    },
  })
  return strip
}

describe('useDragScroll', () => {
  it('тягне стрічку за курсором: вліво на 60px — прокрутка вправо на 60px', () => {
    const strip = renderStrip()

    fireEvent.pointerDown(strip, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 300 })
    fireEvent.pointerMove(strip, { pointerId: 1, pointerType: 'mouse', clientX: 240 })

    expect(strip.scrollLeft).toBe(260)
  })

  it('відпущена кнопка зупиняє перетягування', () => {
    const strip = renderStrip()

    fireEvent.pointerDown(strip, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 300 })
    fireEvent.pointerMove(strip, { pointerId: 1, pointerType: 'mouse', clientX: 240 })
    fireEvent.pointerUp(strip, { pointerId: 1, pointerType: 'mouse' })
    fireEvent.pointerMove(strip, { pointerId: 1, pointerType: 'mouse', clientX: 100 })

    expect(strip.scrollLeft).toBe(260)
  })

  it('рух без натиснутої кнопки нічого не прокручує', () => {
    const strip = renderStrip()

    fireEvent.pointerMove(strip, { pointerId: 1, pointerType: 'mouse', clientX: 240 })

    expect(strip.scrollLeft).toBe(200)
  })

  it('дотик не перехоплює — на телефоні прокрутка лишається нативною', () => {
    const strip = renderStrip()

    fireEvent.pointerDown(strip, { pointerId: 1, pointerType: 'touch', button: 0, clientX: 300 })
    fireEvent.pointerMove(strip, { pointerId: 1, pointerType: 'touch', clientX: 240 })

    expect(strip.scrollLeft).toBe(200)
  })

  it('права кнопка миші не починає перетягування', () => {
    const strip = renderStrip()

    fireEvent.pointerDown(strip, { pointerId: 1, pointerType: 'mouse', button: 2, clientX: 300 })
    fireEvent.pointerMove(strip, { pointerId: 1, pointerType: 'mouse', clientX: 240 })

    expect(strip.scrollLeft).toBe(200)
  })

  it('поки тягнеш — позначає стан класом, щоб курсор змінився', () => {
    const strip = renderStrip()

    fireEvent.pointerDown(strip, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 300 })
    expect(strip).toHaveClass('is-dragging')

    fireEvent.pointerUp(strip, { pointerId: 1, pointerType: 'mouse' })
    expect(strip).not.toHaveClass('is-dragging')
  })
})
