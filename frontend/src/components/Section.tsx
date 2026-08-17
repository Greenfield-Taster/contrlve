import type { ReactNode } from 'react'

type SectionProps = {
  id: string
  title: ReactNode
  children: ReactNode
}

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
      <h2 className="m-0 mb-10 font-brand text-[clamp(28px,4.5vw,56px)] leading-tight">
        {title}
      </h2>
      {children}
    </section>
  )
}
