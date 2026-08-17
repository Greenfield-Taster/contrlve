import { Mark } from './Mark'
import { Section } from './Section'
import { socials } from '../data/socials'
import { formatFollowers } from '../lib/format'

export function Socials() {
  return (
    <Section id="socials" title={<>Де нас <Mark>ще видно</Mark></>}>
      <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {socials.map((social) => (
          <li key={social.id}>
            <a
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="flex h-full flex-col justify-between rounded-2xl border border-white/15 bg-black/40 p-6 transition-colors hover:border-mark"
            >
              <span className="font-brand text-2xl">{social.label}</span>
              <span className="mt-1 text-white/50">{social.handle}</span>
              {social.followers !== null && (
                <span className="mt-6 font-brand text-3xl text-mark">
                  {formatFollowers(social.followers)}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
