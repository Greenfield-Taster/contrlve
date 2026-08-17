import { useState } from 'react'
import { Mark } from './Mark'
import { Section } from './Section'
import { demo } from '../data/demo'
import { splitByWords } from '../lib/highlight'

const steps = [
  { number: '1', text: 'Ведучий дає слова' },
  { number: '2', text: 'Ти ховаєш їх у монолозі' },
  { number: '3', text: 'Суперники шукають' },
]

export function HowToPlay() {
  const [shown, setShown] = useState(false)
  const segments = shown ? splitByWords(demo.text, demo.words) : [{ text: demo.text, marked: false }]

  return (
    <Section id="rules" title={<>Як <Mark>грати</Mark></>}>
      <ol className="m-0 mb-12 grid list-none gap-4 p-0 md:grid-cols-3">
        {steps.map((step) => (
          <li
            key={step.number}
            className="rounded-2xl border border-white/15 bg-black/40 p-6 backdrop-blur-sm"
          >
            <span className="block font-brand text-4xl text-mark">
              {step.number}
            </span>
            <span className="mt-2 block font-brand text-xl">{step.text}</span>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-white/15 bg-black/40 p-6 backdrop-blur-sm md:p-10">
        <p data-testid="demo-text" className="m-0 text-lg leading-relaxed md:text-xl">
          {segments.map((segment, index) =>
            segment.marked ? (
              <Mark key={index} instant>
                {segment.text}
              </Mark>
            ) : (
              <span key={index}>{segment.text}</span>
            ),
          )}
        </p>

        <button
          type="button"
          onClick={() => setShown((value) => !value)}
          className="mt-6 rounded-full border border-white/60 px-5 py-2 font-brand transition-colors hover:bg-white/10"
        >
          {shown ? 'Сховати' : 'Показати слова'}
        </button>
      </div>
    </Section>
  )
}
