import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Mark } from './Mark'
import { Section } from './Section'
import { latestEpisode, watchUrl } from '../data/episodes'
import { randomWords } from '../data/randomWords'
import { socials } from '../data/socials'
import { readAttempts } from '../lib/attempts'
import { submitWords } from '../lib/submitWords'
import { hasBlockingIssues, validateWords, type WordIssue } from '../lib/words'

type Sent = {
  words: string[]
  copied: boolean
}

const pluralAttempts = (n: number) => {
  const last = n % 10
  const teen = n % 100
  if (teen >= 11 && teen <= 14) return 'разів'
  if (last === 1) return 'раз'
  if (last >= 2 && last <= 4) return 'рази'
  return 'разів'
}

const pickThree = () => {
  const pool = [...randomWords]
  const picked: string[] = []
  while (picked.length < 3 && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length)
    picked.push(pool.splice(index, 1)[0])
  }
  return picked
}

export function WordsForm() {
  const [words, setWords] = useState(['', '', ''])
  const [issues, setIssues] = useState<WordIssue[]>([])
  const [sent, setSent] = useState<Sent | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [sending, setSending] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    setAttempts(readAttempts())
  }, [])

  // Ctrl+V будь-де на сторінці кладе вставлене в перше порожнє поле —
  // це і є назва шоу, тож жест має працювати.
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.tagName === 'INPUT') return

      const pasted = event.clipboardData?.getData('text')?.trim()
      if (!pasted) return

      setWords((current) => {
        const emptyIndex = current.findIndex((word) => word.trim().length === 0)
        if (emptyIndex === -1) return current
        const next = [...current]
        next[emptyIndex] = pasted.split(/\s+/)[0]
        return next
      })

      formRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
    }

    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [])

  const setWord = (index: number, value: string) => {
    setWords((current) => current.map((word, i) => (i === index ? value : word)))
    setIssues([])
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (sending) return

    const found = validateWords(words)
    setIssues(found)
    if (hasBlockingIssues(found)) return

    setSending(true)
    try {
      const trimmed = words.map((word) => word.trim())
      const result = await submitWords(trimmed)
      setSent({ words: trimmed, copied: result.copied })
      setAttempts(result.attempts)
    } finally {
      setSending(false)
    }
  }

  const issueFor = (index: number) => issues.find((issue) => issue.index === index)
  const formIssue = issues.find((issue) => issue.index === -1)
  const threadsUrl = socials.find((s) => s.id === 'threads')?.url ?? ''
  const instagramUrl = socials.find((s) => s.id === 'instagram')?.url ?? ''

  return (
    <Section id="words" title={<>Напиши <Mark>три слова</Mark></>}>
      <p className="m-0 mb-8 max-w-2xl text-lg text-white/70">
        З таких слів і складають завдання. Пиши те, що складно непомітно
        вставити в розмову.
      </p>

      <form ref={formRef} onSubmit={onSubmit} noValidate className="max-w-3xl">
        <div className="grid gap-4 md:grid-cols-3">
          {words.map((word, index) => {
            const issue = issueFor(index)
            return (
              <div key={index}>
                <label
                  htmlFor={`word-${index}`}
                  className="mb-2 block font-brand text-sm uppercase tracking-[0.2em] text-white/50"
                >
                  Слово {index + 1}
                </label>
                <input
                  id={`word-${index}`}
                  type="text"
                  value={word}
                  maxLength={40}
                  autoComplete="off"
                  onChange={(event) => setWord(index, event.target.value)}
                  aria-invalid={issue?.blocking ? true : undefined}
                  className="w-full rounded-xl border border-white/25 bg-black/50 px-4 py-3 font-brand text-xl outline-none focus:border-mark"
                />
                {issue && (
                  <p
                    className={`m-0 mt-2 text-sm ${
                      issue.blocking ? 'text-cta-text' : 'text-white/50'
                    }`}
                  >
                    {issue.message}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <div aria-live="polite">
          {formIssue && (
            <p className="m-0 mt-4 font-brand text-cta-text">
              {formIssue.message}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={sending}
            className="rounded-full bg-cta px-6 py-3 font-brand text-white transition-colors hover:bg-cta-hover active:scale-[0.97] disabled:opacity-60"
          >
            Скопіювати слова
          </button>
          <button
            type="button"
            onClick={() => {
              setWords(pickThree())
              setIssues([])
            }}
            className="rounded-full border border-white/60 px-6 py-3 font-brand transition-colors hover:bg-white/10"
          >
            Не знаю, придумай
          </button>
        </div>

        {attempts > 1 && !sent && (
          <p className="m-0 mt-4 text-sm text-white/55">
            ти вже робив це {attempts} {pluralAttempts(attempts)}
          </p>
        )}
      </form>

      <div aria-live="polite">
        {sent && (
          <div className="mt-10 rounded-2xl border border-white/15 bg-black/50 p-6 md:p-10">
            <p className="m-0 flex flex-wrap gap-2 font-brand text-[clamp(20px,3vw,32px)]">
              {sent.words.map((word, index) => (
                <Mark key={`${word}-${index}`} instant>
                  {word}
                </Mark>
              ))}
            </p>

            <p className="m-0 mt-6 text-lg text-white/70">
              {sent.copied
                ? 'скопіювали. кидай у коменти під випуском'
                : 'не вийшло скопіювати — виділи і скопіюй руками'}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={watchUrl(latestEpisode.videoId)}
                target="_blank"
                rel="noopener"
                className="rounded-full border border-white/60 px-5 py-2 font-brand transition-colors hover:bg-white/10"
              >
                Коментарі на YouTube
              </a>
              <a
                href={threadsUrl}
                target="_blank"
                rel="noopener"
                className="rounded-full border border-white/60 px-5 py-2 font-brand transition-colors hover:bg-white/10"
              >
                Threads
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener"
                className="rounded-full border border-white/60 px-5 py-2 font-brand transition-colors hover:bg-white/10"
              >
                Instagram
              </a>
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}
