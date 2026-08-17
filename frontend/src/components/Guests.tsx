import { Button } from './Button'
import { Mark } from './Mark'
import { Section } from './Section'
import {
  episodes,
  playlistUrl,
  thumbnailUrl,
  watchUrl,
  type Episode,
} from '../data/episodes'

function Card({
  episode,
  duplicate = false,
}: {
  episode: Episode
  /** Копія для безшовної стрічки: видима, але поза Tab-порядком. */
  duplicate?: boolean
}) {
  return (
    <a
      href={watchUrl(episode.videoId)}
      target="_blank"
      rel="noreferrer"
      tabIndex={duplicate ? -1 : undefined}
      className="group block w-[240px] shrink-0 md:w-[300px]"
    >
      <img
        src={thumbnailUrl(episode.videoId)}
        width={480}
        height={360}
        alt=""
        loading="lazy"
        className="aspect-video w-full rounded-xl object-cover transition-transform duration-200 group-hover:scale-[1.03]"
      />
      <span className="mt-2 block font-brand text-sm text-white/50">
        випуск {episode.number}
      </span>
      <span className="block font-brand text-lg">{episode.guest}</span>
    </a>
  )
}

function Row({
  items,
  direction,
}: {
  items: Episode[]
  direction: 'left' | 'right'
}) {
  return (
    <div data-marquee-row className="marquee">
      <div className={`marquee__track marquee__track--${direction}`}>
        <div className="marquee__group">
          {items.map((episode) => (
            <Card key={episode.videoId} episode={episode} />
          ))}
        </div>
        <div className="marquee__group" data-marquee-copy aria-hidden="true">
          {items.map((episode) => (
            <Card key={`copy-${episode.videoId}`} episode={episode} duplicate />
          ))}
        </div>
      </div>
    </div>
  )
}

export function Guests() {
  const half = Math.ceil(episodes.length / 2)

  return (
    <Section id="guests" title={<>У нас <Mark>вже були</Mark></>}>
      <div className="-mx-6 flex flex-col gap-8">
        <Row items={episodes.slice(0, half)} direction="left" />
        <Row items={episodes.slice(half)} direction="right" />
      </div>

      <div className="mt-10">
        <Button href={playlistUrl}>Усі випуски</Button>
      </div>
    </Section>
  )
}
