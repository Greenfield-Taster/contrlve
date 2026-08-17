import { Mark } from './Mark'
import { Section } from './Section'
import { hosts, type Host } from '../data/hosts'

export function CastCard({ host }: { host: Host }) {
  return (
    <li
      className="cast-card group relative overflow-hidden rounded-2xl border border-white/15 bg-black/50"
      tabIndex={0}
    >
      <img
        src={host.photo}
        width={557}
        height={835}
        alt={host.name}
        loading="lazy"
        className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4">
        <span className="block font-brand text-lg">{host.name}</span>
        <span className="block text-sm text-white/60">{host.role}</span>
        {host.caption && (
          <span className="mt-2 inline-block bg-mark px-2 py-0.5 font-brand text-sm text-ink cast-caption">
            {host.caption}
          </span>
        )}
      </div>
    </li>
  )
}

export function Cast() {
  return (
    <Section id="cast" title={<>Хто в <Mark>кадрі</Mark></>}>
      <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {hosts.map((host) => (
          <CastCard key={host.id} host={host} />
        ))}
      </ul>
    </Section>
  )
}
