import { socials } from '../data/socials'

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 pb-16 text-center md:text-left">
      <div className="flex flex-col items-center gap-6 border-t border-white/15 pt-8 md:flex-row md:items-center md:justify-between">
        <img src="/logo.webp" width={600} height={214} alt="ШОУ КОНТРЛВЕ" className="w-32" />

        <nav className="flex flex-wrap justify-center gap-4">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener"
              className="text-white/60 transition-colors hover:text-white"
            >
              {social.label}
            </a>
          ))}
        </nav>
      </div>

      <p className="m-0 mt-8 text-sm text-white/60">© 2026 ШОУ КОНТРЛВЕ</p>
      <p className="m-0 mt-1 text-sm text-white/60">
        Ведучий може змінити ці правила в будь який момент
      </p>
    </footer>
  )
}
