import type { ReactNode } from 'react'

type ButtonProps = {
  href: string
  children: ReactNode
  variant?: 'cta' | 'ghost'
}

export function Button({ href, children, variant = 'cta' }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-full px-6 py-3 font-brand text-base transition-transform duration-100 active:scale-[0.97]'
  const styles =
    variant === 'cta'
      ? 'bg-cta text-white hover:bg-cta-hover'
      : 'border border-white/60 text-white hover:border-white hover:bg-white/10'

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${base} ${styles}`}
    >
      {children}
    </a>
  )
}
