import { Button } from './Button'
import { Mark } from './Mark'
import { Section } from './Section'
import { appInfo } from '../data/app'
import { useDragScroll } from '../hooks/useDragScroll'

export function AppSection() {
  const strip = useDragScroll<HTMLUListElement>()

  return (
    <Section id="app" title={<>Гра в <Mark>телефоні</Mark></>}>
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center">
        <div>
          <div className="flex items-center gap-4">
            <img
              src={appInfo.icon}
              width={96}
              height={96}
              alt=""
              className="h-20 w-20 rounded-2xl"
            />
            <div>
              <p className="m-0 font-brand text-2xl">КОНТРЛВЕ</p>
              <p className="m-0 text-white/60">
                {appInfo.price} · {appInfo.minOs}
              </p>
            </div>
          </div>

          <p className="mt-6 text-lg leading-relaxed text-white/80">
            Збираєш компанію, ділишся на команди від двох до п'яти, і граєш у те
            саме, що й у шоу: монологи та мініатюри, у яких треба непомітно
            заховати випадкові слова. Таймер і підрахунок балів усередині.
          </p>

          <p className="mt-4 font-brand text-xl">
            <span className="text-white/60">★</span> <Mark instant>{appInfo.rating}</Mark>{' '}
            <span className="text-white/60">· {appInfo.ratingCount} оцінок</span>
          </p>

          <p className="mt-2 text-white/50">поки лише для iPhone</p>

          <div className="mt-6">
            <Button href={appInfo.url}>Завантажити в App Store</Button>
          </div>
        </div>

        <ul
          ref={strip}
          tabIndex={0}
          aria-label="Скріншоти застосунку"
          className="scroll-x m-0 flex list-none gap-4 overflow-x-auto p-0 pb-3"
        >
          {appInfo.screenshots.map((src) => (
            <li key={src} className="shrink-0">
              <img
                src={src}
                width={600}
                height={1300}
                alt=""
                loading="lazy"
                draggable={false}
                className="h-[420px] w-auto rounded-2xl border border-white/15"
              />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
