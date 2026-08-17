import { useEffect, useRef } from 'react'

/**
 * Дозволяє тягнути горизонтальну стрічку курсором, як пальцем на телефоні.
 * Мишею стрічку видно, але без цього її нічим прокрутити, крім скролбара.
 *
 * Дотик і перо не перехоплюються: там прокрутка вже нативна, з інерцією,
 * і підміна її на ручний scrollLeft зробила б рух гіршим.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let dragging = false
    let startX = 0
    let startScroll = 0

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return

      dragging = true
      startX = event.clientX
      startScroll = node.scrollLeft
      node.classList.add('is-dragging')

      // Інакше браузер почне тягти саме зображення, а не стрічку
      event.preventDefault()
      if (typeof node.setPointerCapture === 'function') {
        node.setPointerCapture(event.pointerId)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return
      node.scrollLeft = startScroll + (startX - event.clientX)
    }

    const stop = (event: PointerEvent) => {
      if (!dragging) return

      dragging = false
      node.classList.remove('is-dragging')
      if (
        typeof node.releasePointerCapture === 'function' &&
        node.hasPointerCapture?.(event.pointerId)
      ) {
        node.releasePointerCapture(event.pointerId)
      }
    }

    node.addEventListener('pointerdown', onPointerDown)
    node.addEventListener('pointermove', onPointerMove)
    node.addEventListener('pointerup', stop)
    node.addEventListener('pointercancel', stop)

    return () => {
      node.removeEventListener('pointerdown', onPointerDown)
      node.removeEventListener('pointermove', onPointerMove)
      node.removeEventListener('pointerup', stop)
      node.removeEventListener('pointercancel', stop)
    }
  }, [])

  return ref
}
