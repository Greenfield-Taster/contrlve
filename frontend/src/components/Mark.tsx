import type { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

type MarkProps = {
  children: ReactNode
  /** Виділити одразу, не чекаючи скролу */
  instant?: boolean
}

export function Mark({ children, instant = false }: MarkProps) {
  const { ref, revealed } = useReveal<HTMLElement>()
  const isRevealed = instant || revealed

  return (
    <mark ref={ref} className={`mark${isRevealed ? ' mark--revealed' : ''}`}>
      {children}
    </mark>
  )
}
