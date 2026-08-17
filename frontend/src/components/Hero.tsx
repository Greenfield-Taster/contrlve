import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Button } from './Button'
import { Mark } from './Mark'
import { appInfo } from '../data/app'
import { playlistUrl } from '../data/episodes'
import { hosts } from '../data/hosts'
import { firstRules, lastRule } from '../data/rules'
import { useReducedMotion } from '../hooks/useReducedMotion'

/** Зсуви фото, підібрані під чинний сайт: Мигаль найдалі праворуч, Разбєйков ліворуч */
const photoOffsets: Record<string, string> = {
  myhal: 'translate(60%, 45%)',
  andrienko: 'translate(30%, 40%)',
  yanovych: 'translateY(45%)',
  razbeikov: 'translate(-30%, 55%)',
}

export function Hero() {
  const rule = useMemo(
    () => firstRules[Math.floor(Math.random() * firstRules.length)],
    [],
  )
  const reduced = useReducedMotion()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const frame = useRef(0)

  useEffect(() => {
    if (reduced || window.matchMedia('(hover: none)').matches) return

    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 16
        const y = (event.clientY / window.innerHeight - 0.5) * 8
        setTilt({ x, y })
      })
    }

    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame.current)
    }
  }, [reduced])

  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pt-16 text-center">
        <h1 className="m-0">
          <img
            src="/logo.webp"
            width={600}
            height={214}
            alt="ШОУ КОНТРЛВЕ"
            className="w-[clamp(180px,42vw,420px)]"
          />
        </h1>

        <p className="m-0 max-w-2xl font-brand text-[clamp(20px,3.4vw,34px)] leading-tight">
          гра, у якій слова <Mark instant>ховають</Mark> у чужих історіях
        </p>

        <div>
          <p className="m-0 mb-2 font-brand text-sm uppercase tracking-[0.2em] text-white/60">
            офіційні правила
          </p>
          <ol className="m-0 list-decimal pl-6 text-left font-brand text-[clamp(15px,1.6vw,20px)]">
            <li>{rule}</li>
            <li>{lastRule}</li>
          </ol>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button href={playlistUrl}>Дивитись</Button>
          <Button href={appInfo.url} variant="ghost">
            Завантажити гру
          </Button>
        </div>
      </div>

      <div className="pointer-events-none relative flex h-[26vh] w-full items-end justify-center md:h-[30vh]">
        {hosts.map((host, index) => (
          <img
            key={host.id}
            src={host.photo}
            width={557}
            height={835}
            alt={`${host.name} — ШОУ КОНТРЛВЕ`}
            loading="eager"
            className="hero-photo h-auto w-[46%] max-w-[240px] self-end md:w-[20%] md:max-w-none"
            style={
              {
                '--hero-left': `${index * 22 - 8}%`,
                transform: `${photoOffsets[host.id]} translate3d(${
                  tilt.x * (index % 2 === 0 ? 1 : -1)
                }px, ${tilt.y}px, 0)`,
                zIndex: host.id === 'yanovych' ? 3 : 1,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </section>
  )
}
