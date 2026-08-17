# КОНТРЛВЕ Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Побудувати односторінковий сайт шоу КОНТРЛВЕ — правила, резиденти, стрічка гостей, застосунок для iOS, форма трьох слів і соцмережі — статичний, без бекенду.

**Architecture:** React-застосунок у `frontend/`, який збирається Vite у статику для Cloudflare Pages. Уся змінна частина (випуски, люди, правила, соцмережі) — типізовані файли в `src/data/`, без логіки. Уся логіка, яку варто тестувати (валідація слів, форматування чисел, підсвітка слів, буфер обміну), — чисті функції в `src/lib/`, покриті Vitest. Компоненти секцій тонкі: беруть дані, викликають функції, малюють.

**Tech Stack:** React 19 · Vite 7 · TypeScript · Tailwind CSS v4 (`@tailwindcss/vite`) · Vitest + jsdom + @testing-library/react. Node v22.23.2, npm 11.4.2. Без анімаційних бібліотек.

**Spec:** `docs/superpowers/specs/2026-08-17-contrlve-site-design.md`

## Global Constraints

- **Бекенду немає.** Сайт має повністю працювати з `npm run build` → `frontend/dist`. Жодних мережевих запитів до власного API. Форма трьох слів копіює в буфер обміну і нічого не надсилає.
- **Без анімаційних бібліотек.** Тільки CSS-переходи, CSS-анімації та `IntersectionObserver`.
- **Не вигадувати факти.** Числа в інтерфейсі беруться лише з `src/data/`. Якщо число невідоме (`null`) — елемент рендериться без нього, а не з нулем чи вигаданим значенням.
- **Копірайт не бреше.** Форма не пише «ми отримали» чи «ми розглянемо» — слова нікуди не летять.
- **Палітра, дослівно:** жовтий `#FAE913`, маркери `#FDC20E`, чорний `#0a0a0a`, червоний CTA `#e5091a`, hover `#c00718`, білий `#ffffff`.
- **Шрифт:** Social Gothic Bold (`/SocialGothicBold.otf`), `font-family: Gothic`, `font-display: swap`, preload. Довгі абзаци — системний sans.
- **Виділення жовтим — єдиний спосіб акценту.** Ніяких підкреслень чи кольорового тексту.
- **`prefers-reduced-motion: reduce` вимикає всі анімації** — виділення намальовані одразу, стрічка гостей стоїть, паралаксу немає.
- **Мова — тільки українська**, `lang="uk"`. Тон текстів — сухий абсурд без емодзі.
- Контраст: білого тексту на жовтому не існує на цьому сайті.

---

### Task 1: Каркас фронтенду, бренд-токени й ассети

**Files:**
- Create: `frontend/package.json`, `frontend/vite.config.ts`, `frontend/tsconfig.json`, `frontend/tsconfig.node.json`, `frontend/index.html`, `frontend/frontend.esproj`, `frontend/vitest.setup.ts`, `frontend/.gitignore`
- Create: `frontend/src/main.tsx`, `frontend/src/App.tsx`, `frontend/src/index.css`
- Create: `frontend/src/lib/format.ts`, `frontend/src/lib/format.test.ts`
- Create: `frontend/public/` (ассети, див. крок 3)

**Interfaces:**
- Consumes: нічого
- Produces: робочий `npm run dev`, `npm run build`, `npm test`; CSS-змінні теми `--color-mark`, `--color-handle`, `--color-ink`, `--color-cta`, `--color-cta-hover`, `--font-display`; `formatFollowers(n: number): string`

- [ ] **Step 1: Створити Vite-проєкт**

З кореня репозиторію:

```powershell
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

Якщо `frontend/` уже існує і порожня — Vite попросить підтвердження; обрати варіант, що лишає теку.

- [ ] **Step 2: Поставити решту залежностей**

```powershell
cd frontend
npm install tailwindcss @tailwindcss/vite
npm install -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

- [ ] **Step 3: Завантажити ассети в `frontend/public/`**

З кореня репозиторію:

```powershell
$pub = 'frontend\public'
New-Item -ItemType Directory -Force -Path "$pub\hosts","$pub\app" | Out-Null
$h = @{'User-Agent'='Mozilla/5.0'; 'Referer'='https://contrlve.com.ua/'}

$site = @{
  'SocialGothicBold.otf'      = '/SocialGothicBold.otf'
  'background.webp'           = '/background.webp'
  'favicon.ico'               = '/favicon.ico'
  'og-image.jpg'              = '/og-image.jpg'
  'logo.webp'                 = '/_astro/logo.Dshaws-K.webp'
  'hosts/myhal.webp'          = '/_astro/myhal.CQ323cK4.webp'
  'hosts/andrienko.webp'      = '/_astro/andrienko.DvJWD-yG.webp'
  'hosts/yanovych.webp'       = '/_astro/yanovych.CtxQ7LAC.webp'
  'hosts/razbeikov.webp'      = '/_astro/razbeikov.DorhwnQE.webp'
}
foreach ($k in $site.Keys) {
  Invoke-WebRequest "https://contrlve.com.ua$($site[$k])" -Headers $h -OutFile "$pub\$k" -TimeoutSec 60
}

$apple = @{
  'app/icon.png'        = 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/18/91/8e/18918e20-3b79-0bc1-6a24-10f22b830a5f/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.png'
  'app/screenshot1.png' = 'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/72/a1/1c/72a11c11-2974-7652-e125-86567d53b4ea/screenshot1_1284x2778.png/600x1300bb.png'
  'app/screenshot2.png' = 'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/4f/3a/3d/4f3a3db6-2db6-5642-29b8-45151cbc9998/screenshot2_1284x2778.png/600x1300bb.png'
  'app/screenshot3.png' = 'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/d0/09/16/d0091633-41b0-643e-bd5f-e235930a33f0/screenshot3_1284x2778.png/600x1300bb.png'
  'app/screenshot4.png' = 'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/ca/ae/88/caae8886-a384-2921-c892-e652d1d4a6fa/screenshot4_1284x2778.png/600x1300bb.png'
}
foreach ($k in $apple.Keys) {
  Invoke-WebRequest $apple[$k] -Headers $h -OutFile "$pub\$k" -TimeoutSec 60
}

Get-ChildItem -Recurse $pub -File | Select-Object Name, Length
```

Очікується 14 файлів, усі ненульового розміру. Шрифт ≈29 КБ, фон ≈34 КБ, скріншоти 200–400 КБ кожен.

- [ ] **Step 4: Налаштувати Vite і Vitest**

`frontend/vite.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
})
```

`frontend/vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

У `frontend/package.json` у `scripts` додати:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Написати падаючий тест форматування підписників**

`frontend/src/lib/format.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { formatFollowers } from './format'

describe('formatFollowers', () => {
  it('форматує тисячі', () => {
    expect(formatFollowers(264000)).toBe('264 тис.')
  })

  it('округлює тисячі до цілих', () => {
    expect(formatFollowers(12400)).toBe('12 тис.')
  })

  it('форматує мільйони з комою', () => {
    expect(formatFollowers(1200000)).toBe('1,2 млн')
  })

  it('не лишає нуля в дробовій частині мільйонів', () => {
    expect(formatFollowers(2000000)).toBe('2 млн')
  })

  it('малі числа лишає як є', () => {
    expect(formatFollowers(870)).toBe('870')
  })
})
```

- [ ] **Step 6: Запустити тест і переконатись, що падає**

Run: `cd frontend; npx vitest run src/lib/format.test.ts`
Expected: FAIL — `Failed to resolve import "./format"`.

- [ ] **Step 7: Реалізувати `formatFollowers`**

`frontend/src/lib/format.ts`:

```ts
export function formatFollowers(count: number): string {
  if (count >= 1_000_000) {
    const millions = (count / 1_000_000).toFixed(1).replace(/\.0$/, '')
    return `${millions.replace('.', ',')} млн`
  }
  if (count >= 1000) {
    return `${Math.round(count / 1000)} тис.`
  }
  return String(count)
}
```

- [ ] **Step 8: Запустити тест і переконатись, що проходить**

Run: `cd frontend; npx vitest run src/lib/format.test.ts`
Expected: PASS, 5 тестів.

- [ ] **Step 9: Написати бренд-тему і базові стилі**

`frontend/src/index.css` — повністю замінити вміст:

```css
@import 'tailwindcss';

@font-face {
  font-family: Gothic;
  src: url('/SocialGothicBold.otf') format('opentype');
  font-display: swap;
}

@theme {
  --color-mark: #fae913;
  --color-handle: #fdc20e;
  --color-ink: #0a0a0a;
  --color-cta: #e5091a;
  --color-cta-hover: #c00718;
  --font-brand: Gothic, system-ui, sans-serif;
  --font-body: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

html {
  background-color: var(--color-ink);
  background-image: url('/background.webp');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

body {
  margin: 0;
  color: #fff;
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

::selection {
  background: var(--color-mark);
  color: var(--color-ink);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 10: Прописати `index.html`**

`frontend/index.html` — замінити `<head>` і `<body>` цим (мова, шрифт, фавікон; повні мета-теги додає Task 12):

```html
<!doctype html>
<html lang="uk">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#e5091a" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="preload" href="/SocialGothicBold.otf" as="font" type="font/otf" crossorigin />
    <title>ШОУ КОНТРЛВЕ</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Видалити згенеровані Vite `frontend/src/App.css` і `frontend/src/assets/react.svg`, а `frontend/src/App.tsx` звести до:

```tsx
export default function App() {
  return <main />
}
```

`frontend/src/main.tsx` має імпортувати `./index.css` і не імпортувати `./App.css`.

- [ ] **Step 11: Відтворити `frontend.esproj`**

`frontend/frontend.esproj` (GUID типу проєкту вже прописаний у `WebStarter.sln`):

```xml
<Project Sdk="Microsoft.VisualStudio.JavaScript.Sdk/1.0.1184430">
  <PropertyGroup>
    <StartupCommand>npm run dev</StartupCommand>
    <JavaScriptTestRoot>src\</JavaScriptTestRoot>
    <JavaScriptTestFramework>Vitest</JavaScriptTestFramework>
    <ShouldRunBuildScript>false</ShouldRunBuildScript>
    <BuildCommand>npm run build</BuildCommand>
    <ProductionBuildCommand>npm run build</ProductionBuildCommand>
    <BuildOutputFolder>$(MSBuildProjectDirectory)\dist</BuildOutputFolder>
  </PropertyGroup>
</Project>
```

- [ ] **Step 12: Перевірити білд і запуск**

Run: `cd frontend; npm run build`
Expected: успішний білд, у `frontend/dist/` є `index.html`, `assets/`, і скопійовані `public`-файли (`SocialGothicBold.otf`, `background.webp`, `logo.webp`, `hosts/`, `app/`).

Run: `cd frontend; npx vitest run`
Expected: PASS, 5 тестів.

- [ ] **Step 13: Коміт**

```bash
git add frontend WebStarter.sln
git commit -m "feat: каркас фронтенду, бренд-токени і ассети"
```

---

### Task 2: Дані сайту

**Files:**
- Create: `frontend/src/data/episodes.ts`, `frontend/src/data/hosts.ts`, `frontend/src/data/rules.ts`, `frontend/src/data/socials.ts`, `frontend/src/data/app.ts`, `frontend/src/data/demo.ts`, `frontend/src/data/randomWords.ts`
- Test: `frontend/src/data/data.test.ts`

**Interfaces:**
- Consumes: нічого
- Produces:
  - `type Episode = { number: number; guest: string; videoId: string }`, `episodes: Episode[]`, `playlistUrl: string`, `thumbnailUrl(videoId: string): string`, `watchUrl(videoId: string): string`
  - `type Host = { id: string; name: string; role: string; photo: string; caption: string | null }`, `hosts: Host[]`
  - `firstRules: string[]`, `lastRule: string`
  - `type SocialId = 'youtube' | 'instagram' | 'threads' | 'tiktok'`, `type Social = { id: SocialId; label: string; handle: string; url: string; followers: number | null }`, `socials: Social[]`
  - `appInfo: { url: string; icon: string; screenshots: string[]; rating: number; ratingCount: number; price: string; minOs: string }`
  - `demo: { text: string; words: string[] }`
  - `randomWords: string[]`

- [ ] **Step 1: Написати падаючий тест цілісності даних**

`frontend/src/data/data.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { episodes, thumbnailUrl, watchUrl } from './episodes'
import { hosts } from './hosts'
import { firstRules } from './rules'
import { socials } from './socials'
import { appInfo } from './app'
import { demo } from './demo'
import { randomWords } from './randomWords'

describe('episodes', () => {
  it('містить двадцять випусків', () => {
    expect(episodes).toHaveLength(20)
  })

  it('пронумеровані підряд від першого', () => {
    expect(episodes.map((e) => e.number)).toEqual(
      Array.from({ length: 20 }, (_, i) => i + 1),
    )
  })

  it('має унікальні одинадцятисимвольні videoId', () => {
    const ids = episodes.map((e) => e.videoId)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[\w-]{11}$/)
  })

  it('має непорожні імена гостей', () => {
    for (const e of episodes) expect(e.guest.trim().length).toBeGreaterThan(0)
  })

  it('будує посилання на обкладинку і на відео', () => {
    expect(thumbnailUrl('O5eSviXCWT0')).toBe(
      'https://i.ytimg.com/vi/O5eSviXCWT0/hqdefault.jpg',
    )
    expect(watchUrl('O5eSviXCWT0')).toContain('https://www.youtube.com/watch?v=O5eSviXCWT0')
  })
})

describe('hosts', () => {
  it('містить ведучого і трьох резидентів', () => {
    expect(hosts).toHaveLength(4)
    expect(hosts.filter((h) => h.role === 'ведучий')).toHaveLength(1)
  })

  it('усі фото лежать у /hosts/', () => {
    for (const h of hosts) expect(h.photo).toMatch(/^\/hosts\/[a-z]+\.webp$/)
  })
})

describe('rules', () => {
  it('має сім варіантів першого правила', () => {
    expect(firstRules).toHaveLength(7)
  })
})

describe('socials', () => {
  it('містить чотири мережі з https-посиланнями', () => {
    expect(socials).toHaveLength(4)
    for (const s of socials) expect(s.url).toMatch(/^https:\/\//)
  })

  it('має перевірене число підписників на YouTube', () => {
    const youtube = socials.find((s) => s.id === 'youtube')
    expect(youtube?.followers).toBe(264000)
  })

  it('дозволяє невідому кількість підписників', () => {
    for (const s of socials) {
      expect(s.followers === null || typeof s.followers === 'number').toBe(true)
    }
  })
})

describe('appInfo', () => {
  it('веде на правильний застосунок і має чотири скріншоти', () => {
    expect(appInfo.url).toContain('id6762404205')
    expect(appInfo.screenshots).toHaveLength(4)
  })
})

describe('demo', () => {
  it('усі три слова справді заховані в тексті', () => {
    expect(demo.words).toHaveLength(3)
    for (const word of demo.words) {
      expect(demo.text.toLowerCase()).toContain(word.toLowerCase())
    }
  })
})

describe('randomWords', () => {
  it('має щонайменше двадцять унікальних слів', () => {
    expect(randomWords.length).toBeGreaterThanOrEqual(20)
    expect(new Set(randomWords).size).toBe(randomWords.length)
  })
})
```

- [ ] **Step 2: Запустити тест і переконатись, що падає**

Run: `cd frontend; npx vitest run src/data/data.test.ts`
Expected: FAIL — модулі `./episodes` та інші не резолвляться.

- [ ] **Step 3: Створити `episodes.ts`**

```ts
export type Episode = {
  number: number
  guest: string
  videoId: string
}

export const playlistUrl =
  'https://www.youtube.com/playlist?list=PLLHZWI9bLm5mu2UvhLsH6l0CW0ejyKbCd'

const playlistId = 'PLLHZWI9bLm5mu2UvhLsH6l0CW0ejyKbCd'

export const thumbnailUrl = (videoId: string) =>
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

export const watchUrl = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`

export const episodes: Episode[] = [
  { number: 1, guest: 'Роман Міщеряков', videoId: 'O5eSviXCWT0' },
  { number: 2, guest: 'Влад Куран', videoId: 'J1ansYRJVQg' },
  { number: 3, guest: 'OTOY', videoId: 'jkdx6tIQ2W8' },
  { number: 4, guest: 'Вова Шумко', videoId: 'LHoZsBopjio' },
  { number: 5, guest: 'Костя Трембовецький', videoId: 'KHGd0ap15Sk' },
  { number: 6, guest: 'Вова Дантес', videoId: 'zNnfeS87sL0' },
  { number: 7, guest: 'Емма Антонюк', videoId: 'v1_zqRhWw8Q' },
  { number: 8, guest: 'Олег Маслюк', videoId: 'fLyI4_Svy6s' },
  { number: 9, guest: 'Валік Міхієнко', videoId: 'jfn4PNLIp-U' },
  { number: 10, guest: 'Даша Кубік', videoId: 'ba-NNHEykpE' },
  { number: 11, guest: 'MONATIK', videoId: 'uTroVQQ72fM' },
  { number: 12, guest: 'Віталій Волочай', videoId: 'fGt2KnbHpb8' },
  { number: 13, guest: 'Паша Остріков і Вова Кравчук', videoId: 'iqxRKbRJ7cQ' },
  { number: 14, guest: 'Дядя Жора', videoId: 'HWgBkuiHQJs' },
  { number: 15, guest: 'Артем Дамницький', videoId: 'vKARLfzY0IE' },
  { number: 16, guest: 'Слава Бу', videoId: 'FwhZ_GgMGIo' },
  { number: 17, guest: 'Тріо Різні', videoId: 'esgVv_NUKUs' },
  { number: 18, guest: 'Роман Щербан', videoId: 'vv1_KPBUUvU' },
  { number: 19, guest: 'Марк Куцевалов', videoId: 'iErhH5Wu8hs' },
  { number: 20, guest: 'Влад Шевченко', videoId: 'scUEwXZcsH4' },
]
```

- [ ] **Step 4: Створити `hosts.ts`**

```ts
export type Host = {
  id: string
  name: string
  role: string
  photo: string
  caption: string | null
}

export const hosts: Host[] = [
  {
    id: 'myhal',
    name: 'Антон Мигаль',
    role: 'резидент',
    photo: '/hosts/myhal.webp',
    caption: 'мінус бал',
  },
  {
    id: 'andrienko',
    name: 'Дмитро Андрієнко',
    role: 'резидент',
    photo: '/hosts/andrienko.webp',
    caption: 'нічого не помітив',
  },
  {
    id: 'yanovych',
    name: 'Женя Янович',
    role: 'ведучий',
    photo: '/hosts/yanovych.webp',
    caption: 'завжди правий',
  },
  {
    id: 'razbeikov',
    name: 'Олександр Разбєйков',
    role: 'резидент',
    photo: '/hosts/razbeikov.webp',
    caption: 'зробив застосунок',
  },
]
```

Порядок збережено з чинного сайту — саме в такому порядку фото стоять у герої.

- [ ] **Step 5: Створити `rules.ts`**

Тексти взяті дослівно з чинного сайту, разом з їхньою пунктуацією.

```ts
export const firstRules: string[] = [
  'Ведучий завжди правий',
  'На все воля організаторів',
  'Як сказав ведучий - так і буде',
  'В разі виникнення спірних питань, команді Антона Мигаля - мінус бал',
  'Якщо ображають ведучого, мінус бал',
  'Ведучий може змінити правила в будь який момент',
  'Ведучий може підказувати команді, яка йому подобається',
]

export const lastRule = 'поки все'
```

- [ ] **Step 6: Створити `socials.ts`**

```ts
export type SocialId = 'youtube' | 'instagram' | 'threads' | 'tiktok'

export type Social = {
  id: SocialId
  label: string
  handle: string
  url: string
  /** null означає «число невідоме» — плитка рендериться без нього */
  followers: number | null
}

export const socials: Social[] = [
  {
    id: 'youtube',
    label: 'YouTube',
    handle: '@YanovychYevhenii',
    url: 'https://www.youtube.com/@YanovychYevhenii',
    followers: 264000,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@contrlve',
    url: 'https://www.instagram.com/contrlve/',
    followers: null,
  },
  {
    id: 'threads',
    label: 'Threads',
    handle: '@contrlve',
    url: 'https://www.threads.com/@contrlve',
    followers: null,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    handle: '@contrlve',
    url: 'https://www.tiktok.com/@contrlve',
    followers: null,
  },
]
```

- [ ] **Step 7: Створити `app.ts`**

```ts
export const appInfo = {
  url: 'https://apps.apple.com/ua/app/id6762404205',
  icon: '/app/icon.png',
  screenshots: [
    '/app/screenshot1.png',
    '/app/screenshot2.png',
    '/app/screenshot3.png',
    '/app/screenshot4.png',
  ],
  rating: 4.8,
  ratingCount: 48,
  price: 'Безкоштовно',
  minOs: 'iOS 15.1',
}
```

- [ ] **Step 8: Створити `demo.ts`**

```ts
/** Монолог для секції «Як грати». Три слова справді заховані в тексті. */
export const demo = {
  text:
    'Слухай, приїхав я до батьків у Черкаси, і мама з порога: сідай їж. ' +
    'Я кажу — мам, я на дієті. Вона мовчки дістає пилосос, вмикає його ' +
    'посеред кухні і каже: не чую. Батько сидить, запиває валідол компотом, ' +
    'дивиться в стіну і каже — синку, у цьому домі перемагає той, хто голосніший.',
  words: ['Черкаси', 'пилосос', 'валідол'],
}
```

- [ ] **Step 9: Створити `randomWords.ts`**

```ts
/** Слова для кнопки «Не знаю, придумай». */
export const randomWords: string[] = [
  'пилосос', 'валідол', 'шифер', 'кабачок', 'домофон', 'скумбрія',
  'холодець', 'подорожник', 'ватман', 'плінтус', 'кефір', 'дерматин',
  'кактус', 'бухгалтерія', 'шпаківня', 'мангал', 'півонія', 'редуктор',
  'тюль', 'сервант', 'мотоблок', 'фікус', 'вареник', 'штангенциркуль',
  'дискотека', 'абонемент', 'сільрада', 'кросворд',
]
```

- [ ] **Step 10: Запустити тести**

Run: `cd frontend; npx vitest run src/data/data.test.ts`
Expected: PASS, усі тести.

- [ ] **Step 11: Коміт**

```bash
git add frontend/src/data
git commit -m "feat: дані сайту — випуски, люди, правила, соцмережі, застосунок"
```

---

### Task 3: Логіка — валідація слів, підсвітка, буфер, лічильник спроб

**Files:**
- Create: `frontend/src/lib/words.ts`, `frontend/src/lib/highlight.ts`, `frontend/src/lib/clipboard.ts`, `frontend/src/lib/attempts.ts`, `frontend/src/lib/submitWords.ts`
- Test: `frontend/src/lib/words.test.ts`, `frontend/src/lib/highlight.test.ts`, `frontend/src/lib/submitWords.test.ts`, `frontend/src/lib/attempts.test.ts`

**Interfaces:**
- Consumes: нічого
- Produces:
  - `type WordIssue = { index: number; message: string; blocking: boolean }` (index `-1` — помилка рівня форми)
  - `validateWords(words: string[]): WordIssue[]`
  - `hasBlockingIssues(issues: WordIssue[]): boolean`
  - `type Segment = { text: string; marked: boolean }`, `splitByWords(text: string, words: string[]): Segment[]`
  - `copyText(text: string): Promise<boolean>`
  - `readAttempts(): number`, `bumpAttempts(): number`
  - `type SubmitResult = { text: string; copied: boolean; attempts: number }`, `submitWords(words: string[]): Promise<SubmitResult>`

- [ ] **Step 1: Написати падаючий тест валідації**

`frontend/src/lib/words.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { hasBlockingIssues, validateWords } from './words'

const messages = (words: string[]) => validateWords(words).map((i) => i.message)

describe('validateWords', () => {
  it('приймає три нормальні слова', () => {
    expect(validateWords(['пилосос', 'валідол', 'шифер'])).toEqual([])
  })

  it('вимагає всі три поля', () => {
    const issues = validateWords(['пилосос', '', ''])
    expect(issues).toContainEqual({ index: -1, message: 'три — це три', blocking: true })
  })

  it('не приймає односимвольне слово', () => {
    expect(messages(['я', 'валідол', 'шифер'])).toContain('це не слово')
  })

  it('не приймає слово довше за 24 символи', () => {
    expect(messages(['а'.repeat(25), 'валідол', 'шифер'])).toContain('це вже речення')
  })

  it('не приймає пробіл усередині поля', () => {
    expect(messages(['два слова', 'валідол', 'шифер'])).toContain('одне поле — одне слово')
  })

  it('латиницю пропускає, але попереджає', () => {
    const issues = validateWords(['vacuum', 'валідол', 'шифер'])
    const latin = issues.find((i) => i.index === 0)
    expect(latin?.message).toBe('можна й латиною, ведучий якось прочитає')
    expect(latin?.blocking).toBe(false)
    expect(hasBlockingIssues(issues)).toBe(false)
  })

  it('прив’язує помилку до конкретного поля', () => {
    const issues = validateWords(['пилосос', 'я', 'шифер'])
    expect(issues).toContainEqual({ index: 1, message: 'це не слово', blocking: true })
  })

  it('ігнорує пробіли по краях', () => {
    expect(validateWords(['  пилосос  ', 'валідол', 'шифер'])).toEqual([])
  })
})

describe('hasBlockingIssues', () => {
  it('порожній список не блокує', () => {
    expect(hasBlockingIssues([])).toBe(false)
  })

  it('блокувальна помилка блокує', () => {
    expect(hasBlockingIssues([{ index: 0, message: 'це не слово', blocking: true }])).toBe(true)
  })
})
```

- [ ] **Step 2: Запустити і переконатись, що падає**

Run: `cd frontend; npx vitest run src/lib/words.test.ts`
Expected: FAIL — `./words` не резолвиться.

- [ ] **Step 3: Реалізувати `words.ts`**

```ts
export type WordIssue = {
  /** Індекс поля, або -1 для помилки рівня форми */
  index: number
  message: string
  blocking: boolean
}

const MIN_LENGTH = 2
const MAX_LENGTH = 24

export function validateWords(words: string[]): WordIssue[] {
  const issues: WordIssue[] = []
  const trimmed = words.map((word) => word.trim())

  if (trimmed.some((word) => word.length === 0)) {
    issues.push({ index: -1, message: 'три — це три', blocking: true })
  }

  trimmed.forEach((word, index) => {
    if (word.length === 0) return

    if (/\s/.test(word)) {
      issues.push({ index, message: 'одне поле — одне слово', blocking: true })
      return
    }
    if (word.length < MIN_LENGTH) {
      issues.push({ index, message: 'це не слово', blocking: true })
      return
    }
    if (word.length > MAX_LENGTH) {
      issues.push({ index, message: 'це вже речення', blocking: true })
      return
    }
    if (/[a-z]/i.test(word)) {
      issues.push({
        index,
        message: 'можна й латиною, ведучий якось прочитає',
        blocking: false,
      })
    }
  })

  return issues
}

export function hasBlockingIssues(issues: WordIssue[]): boolean {
  return issues.some((issue) => issue.blocking)
}
```

- [ ] **Step 4: Запустити тест**

Run: `cd frontend; npx vitest run src/lib/words.test.ts`
Expected: PASS.

- [ ] **Step 5: Написати падаючий тест підсвітки**

`frontend/src/lib/highlight.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { splitByWords } from './highlight'

describe('splitByWords', () => {
  it('без слів повертає один шматок', () => {
    expect(splitByWords('текст без нічого', [])).toEqual([
      { text: 'текст без нічого', marked: false },
    ])
  })

  it('позначає слово всередині тексту', () => {
    expect(splitByWords('дістає пилосос і мовчить', ['пилосос'])).toEqual([
      { text: 'дістає ', marked: false },
      { text: 'пилосос', marked: true },
      { text: ' і мовчить', marked: false },
    ])
  })

  it('знаходить слово незалежно від регістру і зберігає оригінальний', () => {
    expect(splitByWords('приїхав у Черкаси', ['черкаси'])).toEqual([
      { text: 'приїхав у ', marked: false },
      { text: 'Черкаси', marked: true },
    ])
  })

  it('позначає кілька слів у порядку появи', () => {
    const segments = splitByWords('пилосос, потім валідол', ['валідол', 'пилосос'])
    expect(segments.filter((s) => s.marked).map((s) => s.text)).toEqual([
      'пилосос',
      'валідол',
    ])
  })

  it('не створює порожніх шматків', () => {
    const segments = splitByWords('пилосос', ['пилосос'])
    expect(segments).toEqual([{ text: 'пилосос', marked: true }])
  })
})
```

- [ ] **Step 6: Запустити і переконатись, що падає**

Run: `cd frontend; npx vitest run src/lib/highlight.test.ts`
Expected: FAIL — `./highlight` не резолвиться.

- [ ] **Step 7: Реалізувати `highlight.ts`**

```ts
export type Segment = {
  text: string
  marked: boolean
}

/**
 * Ріже текст на шматки, позначаючи входження кожного зі слів.
 * Пошук без урахування регістру, у результат потрапляє оригінальний текст.
 */
export function splitByWords(text: string, words: string[]): Segment[] {
  const hits: Array<{ start: number; end: number }> = []
  const haystack = text.toLowerCase()

  for (const word of words) {
    const needle = word.trim().toLowerCase()
    if (needle.length === 0) continue

    let from = 0
    for (;;) {
      const start = haystack.indexOf(needle, from)
      if (start === -1) break
      hits.push({ start, end: start + needle.length })
      from = start + needle.length
    }
  }

  hits.sort((a, b) => a.start - b.start)

  const segments: Segment[] = []
  let cursor = 0

  for (const hit of hits) {
    if (hit.start < cursor) continue
    if (hit.start > cursor) {
      segments.push({ text: text.slice(cursor, hit.start), marked: false })
    }
    segments.push({ text: text.slice(hit.start, hit.end), marked: true })
    cursor = hit.end
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), marked: false })
  }

  return segments
}
```

- [ ] **Step 8: Запустити тест**

Run: `cd frontend; npx vitest run src/lib/highlight.test.ts`
Expected: PASS.

- [ ] **Step 9: Написати падаючий тест лічильника спроб**

`frontend/src/lib/attempts.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { bumpAttempts, readAttempts } from './attempts'

describe('attempts', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('спочатку нуль', () => {
    expect(readAttempts()).toBe(0)
  })

  it('рахує спроби', () => {
    expect(bumpAttempts()).toBe(1)
    expect(bumpAttempts()).toBe(2)
    expect(readAttempts()).toBe(2)
  })

  it('не падає на сміттєвому значенні', () => {
    localStorage.setItem('contrlve.attempts', 'не число')
    expect(readAttempts()).toBe(0)
  })

  it('не падає, коли localStorage недоступний', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('заблоковано')
    })
    expect(readAttempts()).toBe(0)
    spy.mockRestore()
  })
})
```

- [ ] **Step 10: Запустити і переконатись, що падає**

Run: `cd frontend; npx vitest run src/lib/attempts.test.ts`
Expected: FAIL — `./attempts` не резолвиться.

- [ ] **Step 11: Реалізувати `attempts.ts`**

```ts
const KEY = 'contrlve.attempts'

export function readAttempts(): number {
  try {
    const raw = localStorage.getItem(KEY)
    const value = Number.parseInt(raw ?? '', 10)
    return Number.isFinite(value) && value > 0 ? value : 0
  } catch {
    return 0
  }
}

export function bumpAttempts(): number {
  const next = readAttempts() + 1
  try {
    localStorage.setItem(KEY, String(next))
  } catch {
    // приватний режим або заблокований сторедж — лічильник просто не переживе перезавантаження
  }
  return next
}
```

- [ ] **Step 12: Запустити тест**

Run: `cd frontend; npx vitest run src/lib/attempts.test.ts`
Expected: PASS.

- [ ] **Step 13: Написати падаючий тест `submitWords`**

`frontend/src/lib/submitWords.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { submitWords } from './submitWords'

describe('submitWords', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.unstubAllGlobals()
  })

  it('складає рядок зі слів і копіює його', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    const result = await submitWords([' пилосос ', 'валідол', 'шифер'])

    expect(result.text).toBe('КОНТРЛВЕ, мої три слова: пилосос, валідол, шифер')
    expect(writeText).toHaveBeenCalledWith(result.text)
    expect(result.copied).toBe(true)
  })

  it('рахує спробу навіть коли буфер недоступний', async () => {
    vi.stubGlobal('navigator', {})

    const result = await submitWords(['пилосос', 'валідол', 'шифер'])

    expect(result.copied).toBe(false)
    expect(result.attempts).toBe(1)
  })

  it('рахує кожну спробу', async () => {
    vi.stubGlobal('navigator', {})
    await submitWords(['а', 'б', 'в'])
    const second = await submitWords(['а', 'б', 'в'])
    expect(second.attempts).toBe(2)
  })

  it('переживає відмову в дозволі на буфер', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('відмовлено')) },
    })

    const result = await submitWords(['пилосос', 'валідол', 'шифер'])
    expect(result.copied).toBe(false)
  })
})
```

- [ ] **Step 14: Запустити і переконатись, що падає**

Run: `cd frontend; npx vitest run src/lib/submitWords.test.ts`
Expected: FAIL — `./submitWords` не резолвиться.

- [ ] **Step 15: Реалізувати `clipboard.ts` і `submitWords.ts`**

`frontend/src/lib/clipboard.ts`:

```ts
/** Копіює текст у буфер. Повертає false, якщо буфер недоступний або відмовив. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (!navigator?.clipboard?.writeText) return false
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
```

`frontend/src/lib/submitWords.ts`:

```ts
import { bumpAttempts } from './attempts'
import { copyText } from './clipboard'

export type SubmitResult = {
  text: string
  copied: boolean
  attempts: number
}

/**
 * Єдина точка «відправки» трьох слів. Бекенду немає: слова складаються в
 * рядок і копіюються в буфер обміну. Якщо колись з’явиться збереження,
 * змінюється тільки тіло цієї функції.
 */
export async function submitWords(words: string[]): Promise<SubmitResult> {
  const text = `КОНТРЛВЕ, мої три слова: ${words.map((w) => w.trim()).join(', ')}`
  const copied = await copyText(text)
  const attempts = bumpAttempts()
  return { text, copied, attempts }
}
```

- [ ] **Step 16: Запустити всі тести**

Run: `cd frontend; npx vitest run`
Expected: PASS, усі файли.

- [ ] **Step 17: Коміт**

```bash
git add frontend/src/lib
git commit -m "feat: логіка валідації слів, підсвітки, буфера і лічильника спроб"
```

---

### Task 4: Примітиви виділення — `useReveal`, `useReducedMotion`, `<Mark>`

**Files:**
- Create: `frontend/src/hooks/useReducedMotion.ts`, `frontend/src/hooks/useReveal.ts`, `frontend/src/components/Mark.tsx`
- Modify: `frontend/src/index.css`
- Test: `frontend/src/components/Mark.test.tsx`

**Interfaces:**
- Consumes: нічого
- Produces:
  - `useReducedMotion(): boolean`
  - `useReveal<T extends HTMLElement>(): { ref: React.RefObject<T | null>; revealed: boolean }`
  - `<Mark>{children}</Mark>` — жовтий блок виділення з двома маркерами; CSS-класи `mark`, `mark--revealed`

- [ ] **Step 1: Написати падаючий тест `<Mark>`**

`frontend/src/components/Mark.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Mark } from './Mark'

describe('Mark', () => {
  it('малює текст у семантичному <mark>', () => {
    render(<Mark>ховають</Mark>)
    const mark = screen.getByText('ховають')
    expect(mark.tagName).toBe('MARK')
  })

  it('за замовчуванням має клас mark', () => {
    render(<Mark>ховають</Mark>)
    expect(screen.getByText('ховають')).toHaveClass('mark')
  })

  it('з instant одразу виділений, без чекання на скрол', () => {
    render(<Mark instant>ховають</Mark>)
    expect(screen.getByText('ховають')).toHaveClass('mark--revealed')
  })
})
```

`IntersectionObserver` у jsdom відсутній — додати заглушку в `frontend/vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'

class NoopIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

vi.stubGlobal('IntersectionObserver', NoopIntersectionObserver)

window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})) as typeof window.matchMedia
```

- [ ] **Step 2: Запустити і переконатись, що падає**

Run: `cd frontend; npx vitest run src/components/Mark.test.tsx`
Expected: FAIL — `./Mark` не резолвиться.

- [ ] **Step 3: Реалізувати хуки**

`frontend/src/hooks/useReducedMotion.ts`:

```ts
import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    setReduced(media.matches)

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
}
```

`frontend/src/hooks/useReveal.ts`:

```ts
import { useEffect, useRef, useState } from 'react'

/**
 * Позначає елемент як «показаний», коли він уперше входить у в’юпорт.
 * Спрацьовує один раз і більше не повертається назад.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || revealed) return

    if (typeof IntersectionObserver !== 'function') {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [revealed])

  return { ref, revealed }
}
```

- [ ] **Step 4: Реалізувати `<Mark>`**

`frontend/src/components/Mark.tsx`:

```tsx
import type { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

type MarkProps = {
  children: ReactNode
  /** Виділити одразу, не чекаючи скролу */
  instant?: boolean
}

export function Mark({ children, instant = false }: MarkProps) {
  const { ref, revealed } = useReveal<HTMLElement>()
  const isRevealed = instant || revealed

  return (
    <mark ref={ref} className={`mark${isRevealed ? ' mark--revealed' : ''}`}>
      {children}
    </mark>
  )
}
```

- [ ] **Step 5: Додати стилі виділення**

Дописати в кінець `frontend/src/index.css`:

```css
.mark {
  position: relative;
  display: inline-block;
  padding: 0.05em 0.18em;
  color: #fff;
  background-color: transparent;
  background-image: linear-gradient(var(--color-mark), var(--color-mark));
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 320ms ease-out, color 320ms ease-out;
}

.mark--revealed {
  background-size: 100% 100%;
  color: var(--color-ink);
}

/* Маркери виділення, як на логотипі: лівий згори, правий знизу */
.mark::before,
.mark::after {
  content: '';
  position: absolute;
  width: 0.32em;
  height: 0.32em;
  border-radius: 50%;
  background: var(--color-handle);
  opacity: 0;
  transition: opacity 200ms ease-out 260ms;
}

.mark::before {
  left: -0.1em;
  top: -0.14em;
}

.mark::after {
  right: -0.1em;
  bottom: -0.14em;
}

.mark--revealed::before,
.mark--revealed::after {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .mark {
    background-size: 100% 100%;
    color: var(--color-ink);
  }

  .mark::before,
  .mark::after {
    opacity: 1;
  }
}
```

- [ ] **Step 6: Запустити тест**

Run: `cd frontend; npx vitest run src/components/Mark.test.tsx`
Expected: PASS, 3 тести.

- [ ] **Step 7: Коміт**

```bash
git add frontend/src/hooks frontend/src/components frontend/src/index.css frontend/vitest.setup.ts
git commit -m "feat: примітив виділення Mark і хуки reveal / reduced-motion"
```

---

### Task 5: Секція «Герой»

**Files:**
- Create: `frontend/src/components/Hero.tsx`, `frontend/src/components/Button.tsx`
- Modify: `frontend/src/App.tsx`, `frontend/src/index.css`
- Test: `frontend/src/components/Hero.test.tsx`

**Interfaces:**
- Consumes: `hosts` (`../data/hosts`), `firstRules`, `lastRule` (`../data/rules`), `playlistUrl` (`../data/episodes`), `appInfo` (`../data/app`), `<Mark>`, `useReducedMotion`
- Produces: `<Hero />`, `<Button href variant="cta" | "ghost">`

- [ ] **Step 1: Написати падаючий тест**

`frontend/src/components/Hero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Hero } from './Hero'
import { firstRules, lastRule } from '../data/rules'

describe('Hero', () => {
  it('показує логотип шоу', () => {
    render(<Hero />)
    expect(screen.getByAltText('ШОУ КОНТРЛВЕ')).toBeInTheDocument()
  })

  it('показує одне з семи перших правил і останнє', () => {
    render(<Hero />)
    const items = screen.getAllByRole('listitem').map((li) => li.textContent)
    expect(firstRules).toContain(items[0])
    expect(items[1]).toBe(lastRule)
  })

  it('веде на плейлист і в App Store', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /дивитись/i })).toHaveAttribute(
      'href',
      expect.stringContaining('youtube.com/playlist'),
    )
    expect(screen.getByRole('link', { name: /завантажити гру/i })).toHaveAttribute(
      'href',
      expect.stringContaining('apps.apple.com'),
    )
  })

  it('показує чотирьох людей шоу', () => {
    render(<Hero />)
    expect(screen.getByAltText(/Женя Янович/)).toBeInTheDocument()
    expect(screen.getByAltText(/Антон Мигаль/)).toBeInTheDocument()
    expect(screen.getByAltText(/Дмитро Андрієнко/)).toBeInTheDocument()
    expect(screen.getByAltText(/Олександр Разбєйков/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Запустити і переконатись, що падає**

Run: `cd frontend; npx vitest run src/components/Hero.test.tsx`
Expected: FAIL — `./Hero` не резолвиться.

- [ ] **Step 3: Реалізувати `<Button>`**

`frontend/src/components/Button.tsx`:

```tsx
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
```

- [ ] **Step 4: Реалізувати `<Hero>`**

`frontend/src/components/Hero.tsx`:

```tsx
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
```

- [ ] **Step 5: Додати позиціонування фото**

Дописати в кінець `frontend/src/index.css`. Абсолютні позиції потрібні лише на
телефоні — на десктопі фото стоять у ряд, і зсуви їм дає `transform`.

```css
.hero-photo {
  position: absolute;
  bottom: 0;
  left: var(--hero-left);
}

@media (min-width: 768px) {
  .hero-photo {
    position: relative;
    left: auto;
    bottom: auto;
  }
}
```

Додати `frontend/src/index.css` до списку файлів, які змінює ця задача.

- [ ] **Step 6: Підключити героя і перевірити тест**

`frontend/src/App.tsx`:

```tsx
import { Hero } from './components/Hero'

export default function App() {
  return (
    <main>
      <Hero />
    </main>
  )
}
```

Run: `cd frontend; npx vitest run src/components/Hero.test.tsx`
Expected: PASS, 4 тести.

- [ ] **Step 7: Перевірити очима**

Run: `cd frontend; npm run dev`

Перевірити на ширині 390px і 1440px: герой уміщається в екран разом з кнопками, фото підрізані нижнім краєм і не мають горизонтального скролу, лого не блимає підміною шрифту.

- [ ] **Step 8: Коміт**

```bash
git add frontend/src
git commit -m "feat: секція героя з випадковим правилом і фото учасників"
```

---

### Task 6: Секція «Як грати»

**Files:**
- Create: `frontend/src/components/Section.tsx`, `frontend/src/components/HowToPlay.tsx`
- Modify: `frontend/src/App.tsx`
- Test: `frontend/src/components/HowToPlay.test.tsx`

**Interfaces:**
- Consumes: `demo` (`../data/demo`), `splitByWords` (`../lib/highlight`), `<Mark>`
- Produces: `<Section id title>` — обгортка секції з заголовком; `<HowToPlay />`

- [ ] **Step 1: Написати падаючий тест**

`frontend/src/components/HowToPlay.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { HowToPlay } from './HowToPlay'
import { demo } from '../data/demo'

describe('HowToPlay', () => {
  it('показує три кроки', () => {
    render(<HowToPlay />)
    expect(screen.getByText(/Ведучий дає слова/i)).toBeInTheDocument()
    expect(screen.getByText(/Ти ховаєш їх у монолозі/i)).toBeInTheDocument()
    expect(screen.getByText(/Суперники шукають/i)).toBeInTheDocument()
  })

  // У заголовку секції теж є <Mark>, тож рахуємо виділення лише в самому монолозі
  const marksInDemo = () =>
    Array.from(
      screen.getByTestId('demo-text').querySelectorAll('mark'),
    ).map((m) => m.textContent)

  it('спочатку слова не підсвічені', () => {
    render(<HowToPlay />)
    expect(marksInDemo()).toHaveLength(0)
  })

  it('кнопка підсвічує всі три слова', async () => {
    const user = userEvent.setup()
    render(<HowToPlay />)

    await user.click(screen.getByRole('button', { name: 'Показати слова' }))

    const marks = marksInDemo()
    expect(marks).toHaveLength(demo.words.length)
    for (const word of demo.words) {
      expect(marks.some((text) => text?.toLowerCase() === word.toLowerCase())).toBe(true)
    }
  })

  it('кнопка перемикається назад', async () => {
    const user = userEvent.setup()
    render(<HowToPlay />)

    await user.click(screen.getByRole('button', { name: 'Показати слова' }))
    await user.click(screen.getByRole('button', { name: 'Сховати' }))

    expect(marksInDemo()).toHaveLength(0)
  })
})
```

- [ ] **Step 2: Запустити і переконатись, що падає**

Run: `cd frontend; npx vitest run src/components/HowToPlay.test.tsx`
Expected: FAIL — `./HowToPlay` не резолвиться.

- [ ] **Step 3: Реалізувати `<Section>`**

`frontend/src/components/Section.tsx`:

```tsx
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
```

- [ ] **Step 4: Реалізувати `<HowToPlay>`**

`frontend/src/components/HowToPlay.tsx`:

```tsx
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
```

- [ ] **Step 5: Підключити секцію і запустити тест**

Додати `<HowToPlay />` у `frontend/src/App.tsx` після `<Hero />`.

Run: `cd frontend; npx vitest run src/components/HowToPlay.test.tsx`
Expected: PASS, 4 тести.

- [ ] **Step 6: Коміт**

```bash
git add frontend/src
git commit -m "feat: секція «Як грати» з живою демонстрацією схованих слів"
```

---

### Task 7: Секція «Хто в кадрі»

**Files:**
- Create: `frontend/src/components/Cast.tsx`
- Modify: `frontend/src/App.tsx`
- Test: `frontend/src/components/Cast.test.tsx`

**Interfaces:**
- Consumes: `hosts` (`../data/hosts`), `<Section>`, `<Mark>`
- Produces: `<Cast />`

- [ ] **Step 1: Написати падаючий тест**

`frontend/src/components/Cast.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Cast } from './Cast'
import { hosts } from '../data/hosts'

describe('Cast', () => {
  it('показує всіх чотирьох з іменами і ролями', () => {
    render(<Cast />)
    for (const host of hosts) {
      expect(screen.getByText(host.name)).toBeInTheDocument()
    }
    expect(screen.getAllByText('резидент')).toHaveLength(3)
    expect(screen.getByText('ведучий')).toBeInTheDocument()
  })

  it('показує підписи, які є в даних', () => {
    render(<Cast />)
    expect(screen.getByText('мінус бал')).toBeInTheDocument()
  })

  it('фото мають описовий alt', () => {
    render(<Cast />)
    expect(screen.getByAltText('Женя Янович')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Запустити і переконатись, що падає**

Run: `cd frontend; npx vitest run src/components/Cast.test.tsx`
Expected: FAIL — `./Cast` не резолвиться.

- [ ] **Step 3: Реалізувати `<Cast>`**

`frontend/src/components/Cast.tsx`:

```tsx
import { Mark } from './Mark'
import { Section } from './Section'
import { hosts } from '../data/hosts'

export function Cast() {
  return (
    <Section id="cast" title={<>Хто в <Mark>кадрі</Mark></>}>
      <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {hosts.map((host) => (
          <li
            key={host.id}
            className="group relative overflow-hidden rounded-2xl border border-white/15 bg-black/50"
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
                <span className="mt-2 inline-block bg-mark px-2 py-0.5 font-brand text-sm text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                  {host.caption}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
```

- [ ] **Step 4: Підключити і запустити тест**

Додати `<Cast />` у `App.tsx` після `<HowToPlay />`.

Run: `cd frontend; npx vitest run src/components/Cast.test.tsx`
Expected: PASS, 3 тести.

- [ ] **Step 5: Коміт**

```bash
git add frontend/src
git commit -m "feat: секція учасників шоу"
```

---

### Task 8: Секція «Гості» — стрічка marquee

**Files:**
- Create: `frontend/src/components/Guests.tsx`
- Modify: `frontend/src/App.tsx`, `frontend/src/index.css`
- Test: `frontend/src/components/Guests.test.tsx`

**Interfaces:**
- Consumes: `episodes`, `playlistUrl`, `thumbnailUrl`, `watchUrl` (`../data/episodes`), `<Section>`, `<Mark>`
- Produces: `<Guests />`

- [ ] **Step 1: Написати падаючий тест**

`frontend/src/components/Guests.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Guests } from './Guests'
import { episodes } from '../data/episodes'

describe('Guests', () => {
  it('показує кожного гостя (двічі — стрічка дублюється)', () => {
    render(<Guests />)
    for (const episode of episodes) {
      expect(screen.getAllByText(episode.guest).length).toBeGreaterThanOrEqual(1)
    }
  })

  it('кожна картка веде на своє відео у новій вкладці', () => {
    render(<Guests />)
    const first = screen.getAllByRole('link', { name: new RegExp(episodes[0].guest) })[0]
    expect(first).toHaveAttribute('href', expect.stringContaining(episodes[0].videoId))
    expect(first).toHaveAttribute('target', '_blank')
    expect(first).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
  })

  it('дублює список для безшовної стрічки, але копії сховані від читалок', () => {
    const { container } = render(<Guests />)
    const rows = container.querySelectorAll('[data-marquee-row]')
    expect(rows).toHaveLength(2)
    for (const row of rows) {
      const copies = row.querySelectorAll('[data-marquee-copy]')
      expect(copies).toHaveLength(1)
      expect(copies[0]).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('веде на повний плейлист', () => {
    render(<Guests />)
    expect(screen.getByRole('link', { name: /усі випуски/i })).toHaveAttribute(
      'href',
      expect.stringContaining('playlist'),
    )
  })

  it('розкладає випуски на два ряди', () => {
    const { container } = render(<Guests />)
    const [top, bottom] = container.querySelectorAll('[data-marquee-row]')
    // Копії стрічки мають aria-hidden, тож у дерево доступності потрапляє
    // рівно по одному посиланню на випуск.
    const count = (row: Element) =>
      within(row as HTMLElement).getAllByRole('link').length
    expect(count(top) + count(bottom)).toBe(episodes.length)
  })
})
```

- [ ] **Step 2: Запустити і переконатись, що падає**

Run: `cd frontend; npx vitest run src/components/Guests.test.tsx`
Expected: FAIL — `./Guests` не резолвиться.

- [ ] **Step 3: Реалізувати `<Guests>`**

`frontend/src/components/Guests.tsx`:

```tsx
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

function Card({ episode }: { episode: Episode }) {
  return (
    <a
      href={watchUrl(episode.videoId)}
      target="_blank"
      rel="noreferrer"
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
            <Card key={`copy-${episode.videoId}`} episode={episode} />
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
```

- [ ] **Step 4: Додати стилі стрічки**

Дописати в кінець `frontend/src/index.css`:

```css
.marquee {
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
}

.marquee__track {
  display: flex;
  width: max-content;
  gap: 1.25rem;
}

.marquee__group {
  display: flex;
  gap: 1.25rem;
}

.marquee__track--left {
  animation: marquee-left 60s linear infinite;
}

.marquee__track--right {
  animation: marquee-right 60s linear infinite;
}

.marquee:hover .marquee__track,
.marquee:focus-within .marquee__track {
  animation-play-state: paused;
}

@keyframes marquee-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-50% - 0.625rem));
  }
}

@keyframes marquee-right {
  from {
    transform: translateX(calc(-50% - 0.625rem));
  }
  to {
    transform: translateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee {
    overflow-x: auto;
    mask-image: none;
  }

  .marquee__track {
    animation: none;
  }
}
```

- [ ] **Step 5: Підключити і запустити тест**

Додати `<Guests />` у `App.tsx` після `<Cast />`.

Run: `cd frontend; npx vitest run src/components/Guests.test.tsx`
Expected: PASS, 5 тестів.

- [ ] **Step 6: Перевірити очима**

Run: `cd frontend; npm run dev`

Перевірити: ряди їдуть назустріч один одному, наведення зупиняє ряд, Tab по картках теж зупиняє, обкладинки вантажаться з `i.ytimg.com`, немає горизонтального скролу сторінки.

- [ ] **Step 7: Коміт**

```bash
git add frontend/src
git commit -m "feat: стрічка гостей у два ряди зі зупинкою на наведенні"
```

---

### Task 9: Секція «Застосунок»

**Files:**
- Create: `frontend/src/components/AppSection.tsx`
- Modify: `frontend/src/App.tsx`
- Test: `frontend/src/components/AppSection.test.tsx`

**Interfaces:**
- Consumes: `appInfo` (`../data/app`), `<Section>`, `<Mark>`, `<Button>`
- Produces: `<AppSection />`

- [ ] **Step 1: Написати падаючий тест**

`frontend/src/components/AppSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppSection } from './AppSection'
import { appInfo } from '../data/app'

describe('AppSection', () => {
  it('веде в App Store', () => {
    render(<AppSection />)
    expect(screen.getByRole('link', { name: /завантажити в app store/i })).toHaveAttribute(
      'href',
      appInfo.url,
    )
  })

  it('показує оцінку і кількість оцінок з даних', () => {
    render(<AppSection />)
    expect(screen.getByText(/4\.8/)).toBeInTheDocument()
    expect(screen.getByText(/48 оцінок/)).toBeInTheDocument()
  })

  it('чесно каже, що застосунок лише для iPhone', () => {
    render(<AppSection />)
    expect(screen.getByText(/поки лише для iPhone/i)).toBeInTheDocument()
  })

  it('показує всі скріншоти', () => {
    const { container } = render(<AppSection />)
    const shots = container.querySelectorAll('img[src^="/app/screenshot"]')
    expect(shots).toHaveLength(appInfo.screenshots.length)
  })
})
```

- [ ] **Step 2: Запустити і переконатись, що падає**

Run: `cd frontend; npx vitest run src/components/AppSection.test.tsx`
Expected: FAIL — `./AppSection` не резолвиться.

- [ ] **Step 3: Реалізувати `<AppSection>`**

`frontend/src/components/AppSection.tsx`:

```tsx
import { Button } from './Button'
import { Mark } from './Mark'
import { Section } from './Section'
import { appInfo } from '../data/app'

export function AppSection() {
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
            Збираєш компанію, ділишся на команди від двох до п’яти, і граєш у те
            саме, що й у шоу: монологи та мініатюри, у яких треба непомітно
            заховати випадкові слова. Таймер, бали і таблиця лідерів усередині.
          </p>

          <p className="mt-4 font-brand text-xl">
            <span className="text-mark">★ {appInfo.rating}</span>{' '}
            <span className="text-white/60">· {appInfo.ratingCount} оцінок</span>
          </p>

          <p className="mt-2 text-white/50">поки лише для iPhone</p>

          <div className="mt-6">
            <Button href={appInfo.url}>Завантажити в App Store</Button>
          </div>
        </div>

        <ul className="m-0 flex list-none gap-4 overflow-x-auto p-0 pb-2">
          {appInfo.screenshots.map((src) => (
            <li key={src} className="shrink-0">
              <img
                src={src}
                width={600}
                height={1300}
                alt=""
                loading="lazy"
                className="h-[420px] w-auto rounded-2xl border border-white/15"
              />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
```

- [ ] **Step 4: Підключити і запустити тест**

Додати `<AppSection />` у `App.tsx` після `<Guests />`.

Run: `cd frontend; npx vitest run src/components/AppSection.test.tsx`
Expected: PASS, 4 тести.

- [ ] **Step 5: Коміт**

```bash
git add frontend/src
git commit -m "feat: секція застосунку для iOS"
```

---

### Task 10: Форма «Три слова»

**Files:**
- Create: `frontend/src/components/WordsForm.tsx`
- Modify: `frontend/src/App.tsx`
- Test: `frontend/src/components/WordsForm.test.tsx`

**Interfaces:**
- Consumes: `validateWords`, `hasBlockingIssues` (`../lib/words`), `submitWords` (`../lib/submitWords`), `readAttempts` (`../lib/attempts`), `randomWords` (`../data/randomWords`), `playlistUrl` (`../data/episodes`), `socials` (`../data/socials`), `<Section>`, `<Mark>`
- Produces: `<WordsForm />`

- [ ] **Step 1: Написати падаючий тест**

`frontend/src/components/WordsForm.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WordsForm } from './WordsForm'
import { submitWords } from '../lib/submitWords'

// Мокаємо саме точку «відправки»: справжній буфер обміну в jsdom конфліктує
// з тим, що підміняє userEvent.setup(), і тест ставав би флакі.
vi.mock('../lib/submitWords', () => ({ submitWords: vi.fn() }))

const fillWords = async (
  user: ReturnType<typeof userEvent.setup>,
  words: [string, string, string],
) => {
  const fields = screen.getAllByRole('textbox')
  for (let i = 0; i < 3; i += 1) {
    await user.clear(fields[i])
    await user.type(fields[i], words[i])
  }
}

describe('WordsForm', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(submitWords).mockReset()
    vi.mocked(submitWords).mockResolvedValue({
      text: 'КОНТРЛВЕ, мої три слова: пилосос, валідол, шифер',
      copied: true,
      attempts: 1,
    })
  })

  it('має три поля з підписами', () => {
    render(<WordsForm />)
    expect(screen.getAllByRole('textbox')).toHaveLength(3)
    expect(screen.getByLabelText('Слово 1')).toBeInTheDocument()
  })

  it('не пускає порожню форму і каже про це', async () => {
    const user = userEvent.setup()
    render(<WordsForm />)

    await user.click(screen.getByRole('button', { name: 'Відправити' }))

    expect(screen.getByText('три — це три')).toBeInTheDocument()
  })

  it('показує помилку короткого слова біля поля', async () => {
    const user = userEvent.setup()
    render(<WordsForm />)

    await fillWords(user, ['я', 'валідол', 'шифер'])
    await user.click(screen.getByRole('button', { name: 'Відправити' }))

    expect(screen.getByText('це не слово')).toBeInTheDocument()
  })

  it('після відправки показує слова і каже, що скопіював', async () => {
    const user = userEvent.setup()
    render(<WordsForm />)

    await fillWords(user, ['пилосос', 'валідол', 'шифер'])
    await user.click(screen.getByRole('button', { name: 'Відправити' }))

    expect(await screen.findByText(/скопіювали/i)).toBeInTheDocument()
    expect(submitWords).toHaveBeenCalledWith(['пилосос', 'валідол', 'шифер'])
  })

  it('не відправляє, поки є блокувальна помилка', async () => {
    const user = userEvent.setup()
    render(<WordsForm />)

    await fillWords(user, ['я', 'валідол', 'шифер'])
    await user.click(screen.getByRole('button', { name: 'Відправити' }))

    expect(submitWords).not.toHaveBeenCalled()
  })

  it('коли буфер недоступний — просить скопіювати руками', async () => {
    vi.mocked(submitWords).mockResolvedValue({
      text: 'КОНТРЛВЕ, мої три слова: пилосос, валідол, шифер',
      copied: false,
      attempts: 1,
    })
    const user = userEvent.setup()
    render(<WordsForm />)

    await fillWords(user, ['пилосос', 'валідол', 'шифер'])
    await user.click(screen.getByRole('button', { name: 'Відправити' }))

    expect(await screen.findByText(/скопіюй руками/i)).toBeInTheDocument()
  })

  it('кнопка «Не знаю, придумай» заповнює всі три поля', async () => {
    const user = userEvent.setup()
    render(<WordsForm />)

    await user.click(screen.getByRole('button', { name: 'Не знаю, придумай' }))

    const values = screen.getAllByRole('textbox').map((f) => (f as HTMLInputElement).value)
    expect(values.every((v) => v.length > 1)).toBe(true)
    expect(new Set(values).size).toBe(3)
  })

  it('з другого разу показує, скільки разів ти це вже робив', async () => {
    localStorage.setItem('contrlve.attempts', '4')
    render(<WordsForm />)
    expect(screen.getByText(/ти вже робив це 4 рази/i)).toBeInTheDocument()
  })

  it('не показує лічильник першого разу', () => {
    render(<WordsForm />)
    expect(screen.queryByText(/ти вже робив це/i)).not.toBeInTheDocument()
  })

  it('Ctrl+V у документі кладе вставлене в перше порожнє поле', async () => {
    render(<WordsForm />)

    const event = new Event('paste', { bubbles: true }) as ClipboardEvent
    Object.defineProperty(event, 'clipboardData', {
      value: { getData: () => 'домофон' },
    })
    document.dispatchEvent(event)

    expect((screen.getAllByRole('textbox')[0] as HTMLInputElement).value).toBe('домофон')
  })
})
```

- [ ] **Step 2: Запустити і переконатись, що падає**

Run: `cd frontend; npx vitest run src/components/WordsForm.test.tsx`
Expected: FAIL — `./WordsForm` не резолвиться.

- [ ] **Step 3: Реалізувати `<WordsForm>`**

`frontend/src/components/WordsForm.tsx`:

```tsx
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Mark } from './Mark'
import { Section } from './Section'
import { playlistUrl } from '../data/episodes'
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

      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
    const found = validateWords(words)
    setIssues(found)
    if (hasBlockingIssues(found)) return

    const trimmed = words.map((word) => word.trim())
    const result = await submitWords(trimmed)
    setSent({ words: trimmed, copied: result.copied })
    setAttempts(result.attempts)
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
                      issue.blocking ? 'text-cta' : 'text-white/50'
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
            <p className="m-0 mt-4 font-brand text-cta">
              {formIssue.message}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-cta px-6 py-3 font-brand text-white transition-colors hover:bg-cta-hover active:scale-[0.97]"
          >
            Відправити
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
          <p className="m-0 mt-4 text-sm text-white/40">
            ти вже робив це {attempts} {pluralAttempts(attempts)}
          </p>
        )}
      </form>

      {sent && (
        <div
          aria-live="polite"
          className="mt-10 rounded-2xl border border-white/15 bg-black/50 p-6 md:p-10"
        >
          <p className="m-0 flex flex-wrap gap-2 font-brand text-[clamp(20px,3vw,32px)]">
            {sent.words.map((word) => (
              <Mark key={word} instant>
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
              href={playlistUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/60 px-5 py-2 font-brand transition-colors hover:bg-white/10"
            >
              Коментарі на YouTube
            </a>
            <a
              href={threadsUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/60 px-5 py-2 font-brand transition-colors hover:bg-white/10"
            >
              Threads
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/60 px-5 py-2 font-brand transition-colors hover:bg-white/10"
            >
              Instagram
            </a>
          </div>
        </div>
      )}
    </Section>
  )
}
```

- [ ] **Step 4: Підключити і запустити тест**

Додати `<WordsForm />` у `App.tsx` після `<AppSection />`.

Run: `cd frontend; npx vitest run src/components/WordsForm.test.tsx`
Expected: PASS, 10 тестів.

- [ ] **Step 5: Перевірити очима**

Run: `cd frontend; npm run dev`

Перевірити в браузері: відправка справді кладе рядок у буфер (вставити в будь-яке поле), Ctrl+V поза полями заповнює перше порожнє поле і скролить до форми, «Не знаю, придумай» дає три різні слова.

- [ ] **Step 6: Коміт**

```bash
git add frontend/src
git commit -m "feat: форма трьох слів з копіюванням у буфер"
```

---

### Task 11: Соцмережі і футер

**Files:**
- Create: `frontend/src/components/Socials.tsx`, `frontend/src/components/Footer.tsx`
- Modify: `frontend/src/App.tsx`
- Test: `frontend/src/components/Socials.test.tsx`

**Interfaces:**
- Consumes: `socials` (`../data/socials`), `formatFollowers` (`../lib/format`), `firstRules` (`../data/rules`), `<Section>`, `<Mark>`
- Produces: `<Socials />`, `<Footer />`

- [ ] **Step 1: Написати падаючий тест**

`frontend/src/components/Socials.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Socials } from './Socials'
import { socials } from '../data/socials'

describe('Socials', () => {
  it('показує всі чотири мережі як посилання', () => {
    render(<Socials />)
    for (const social of socials) {
      expect(screen.getByRole('link', { name: new RegExp(social.label, 'i') })).toHaveAttribute(
        'href',
        social.url,
      )
    }
  })

  it('форматує відоме число підписників', () => {
    render(<Socials />)
    expect(screen.getByText('264 тис.')).toBeInTheDocument()
  })

  it('не вигадує числа, коли їх немає', () => {
    render(<Socials />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
    expect(screen.queryByText('null')).not.toBeInTheDocument()
  })

  it('показує хендли', () => {
    render(<Socials />)
    expect(screen.getAllByText('@contrlve').length).toBe(3)
  })
})
```

- [ ] **Step 2: Запустити і переконатись, що падає**

Run: `cd frontend; npx vitest run src/components/Socials.test.tsx`
Expected: FAIL — `./Socials` не резолвиться.

- [ ] **Step 3: Реалізувати `<Socials>`**

`frontend/src/components/Socials.tsx`:

```tsx
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
```

- [ ] **Step 4: Реалізувати `<Footer>`**

`frontend/src/components/Footer.tsx`:

```tsx
import { socials } from '../data/socials'

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 pb-16">
      <div className="flex flex-col gap-6 border-t border-white/15 pt-8 md:flex-row md:items-center md:justify-between">
        <img src="/logo.webp" width={600} height={214} alt="ШОУ КОНТРЛВЕ" className="w-32" />

        <nav className="flex flex-wrap gap-4">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="text-white/60 transition-colors hover:text-white"
            >
              {social.label}
            </a>
          ))}
        </nav>
      </div>

      <p className="m-0 mt-8 text-sm text-white/30">© 2026 ШОУ КОНТРЛВЕ</p>
      <p className="m-0 mt-1 text-sm text-white/30">
        Ведучий може змінити ці правила в будь який момент
      </p>
    </footer>
  )
}
```

- [ ] **Step 5: Підключити і запустити тест**

Додати `<Socials />` і `<Footer />` у `App.tsx` після `<WordsForm />`.

Run: `cd frontend; npx vitest run src/components/Socials.test.tsx`
Expected: PASS, 4 тести.

- [ ] **Step 6: Коміт**

```bash
git add frontend/src
git commit -m "feat: соцмережі з лічильниками і футер"
```

---

### Task 12: Складання сторінки, мета-теги і фінальна перевірка

**Files:**
- Modify: `frontend/index.html`, `frontend/src/App.tsx`
- Test: `frontend/src/App.test.tsx`

**Interfaces:**
- Consumes: усі секції з Tasks 5–11
- Produces: готова сторінка

- [ ] **Step 1: Написати падаючий тест складання**

`frontend/src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('містить усі сім секцій у правильному порядку', () => {
    const { container } = render(<App />)
    const ids = Array.from(container.querySelectorAll('section[id]')).map((s) => s.id)
    expect(ids).toEqual(['rules', 'cast', 'guests', 'app', 'words', 'socials'])
  })

  it('має рівно один h1', () => {
    render(<App />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('має футер', () => {
    render(<App />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Запустити і переконатись, що падає**

Run: `cd frontend; npx vitest run src/App.test.tsx`
Expected: FAIL — секцій ще немає в очікуваному порядку.

- [ ] **Step 3: Зібрати сторінку**

`frontend/src/App.tsx`:

```tsx
import { AppSection } from './components/AppSection'
import { Cast } from './components/Cast'
import { Footer } from './components/Footer'
import { Guests } from './components/Guests'
import { Hero } from './components/Hero'
import { HowToPlay } from './components/HowToPlay'
import { Socials } from './components/Socials'
import { WordsForm } from './components/WordsForm'

export default function App() {
  return (
    <>
      <main>
        <Hero />
        <HowToPlay />
        <Cast />
        <Guests />
        <AppSection />
        <WordsForm />
        <Socials />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Запустити тест**

Run: `cd frontend; npx vitest run src/App.test.tsx`
Expected: PASS, 3 тести.

- [ ] **Step 5: Дописати мета-теги**

`frontend/index.html` — у `<head>` після `<title>` додати:

```html
<meta name="description" content="КОНТРЛВЕ — українське гумористичне шоу і гра на уважність. Випуски, гості, застосунок для iPhone." />
<link rel="canonical" href="https://contrlve.com.ua/" />
<link rel="apple-touch-icon" href="/favicon.ico" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="ШОУ КОНТРЛВЕ" />
<meta property="og:title" content="ШОУ КОНТРЛВЕ" />
<meta property="og:description" content="КОНТРЛВЕ — українське гумористичне шоу і гра на уважність. Випуски, гості, застосунок для iPhone." />
<meta property="og:url" content="https://contrlve.com.ua/" />
<meta property="og:image" content="https://contrlve.com.ua/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="uk_UA" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="ШОУ КОНТРЛВЕ" />
<meta name="twitter:description" content="КОНТРЛВЕ — українське гумористичне шоу і гра на уважність. Випуски, гості, застосунок для iPhone." />
<meta name="twitter:image" content="https://contrlve.com.ua/og-image.jpg" />

<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ШОУ КОНТРЛВЕ",
    "url": "https://contrlve.com.ua/",
    "logo": "https://contrlve.com.ua/og-image.jpg",
    "sameAs": [
      "https://www.youtube.com/playlist?list=PLLHZWI9bLm5mu2UvhLsH6l0CW0ejyKbCd",
      "https://www.instagram.com/contrlve/",
      "https://www.threads.com/@contrlve",
      "https://www.tiktok.com/@contrlve"
    ]
  }
</script>
```

Змінити `<title>` на `ШОУ КОНТРЛВЕ — гра, у якій слова ховають у чужих історіях`.

- [ ] **Step 6: Прогнати всі тести і білд**

Run: `cd frontend; npx vitest run`
Expected: PASS, усі файли тестів.

Run: `cd frontend; npx tsc --noEmit`
Expected: без помилок.

Run: `cd frontend; npm run build`
Expected: успішний білд у `frontend/dist`.

- [ ] **Step 7: Ручна перевірка в браузері**

Run: `cd frontend; npm run preview`

Пройтися чеклістом:

1. Ширина 390px: немає горизонтального скролу на жодній секції; герой уміщається в екран.
2. Ширина 1440px: стрічка гостей їде в обидва боки, наведення зупиняє ряд.
3. У DevTools увімкнути «Emulate CSS prefers-reduced-motion: reduce» — стрічка стоїть і скролиться пальцем, виділення намальовані одразу, паралаксу немає.
4. Tab від початку сторінки: фокус видно на всіх кнопках і посиланнях, картка гостя досяжна з клавіатури.
5. Форма: відправка кладе рядок у буфер; Ctrl+V поза полями заповнює перше порожнє поле.
6. Мережа: усі `/hosts/*.webp`, `/app/*.png`, `/logo.webp`, `/SocialGothicBold.otf` віддаються 200, обкладинки з `i.ytimg.com` теж.

- [ ] **Step 8: Коміт**

```bash
git add frontend
git commit -m "feat: складання сторінки, мета-теги і фінальна перевірка"
```

---

## Deployment

Cloudflare Pages, налаштування проєкту:

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `frontend`
- Node version: 22

Бекенд не деплоїться. `WebStarter.AppHost` і `WebStarter.Server` потрібні лише для локального `aspire start`.
