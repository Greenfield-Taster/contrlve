# КОНТРЛВЕ — сайт шоу

Односторінковий сайт українського гумористичного шоу КОНТРЛВЕ, який замінює
нинішній `contrlve.com.ua`.

Дизайн-спека:
[`docs/superpowers/specs/2026-08-17-contrlve-site-design.md`](docs/superpowers/specs/2026-08-17-contrlve-site-design.md).

## Що на сайті

Правила гри, резиденти й ведучий, стрічка гостей із двадцяти випусків,
застосунок для iPhone, форма «три слова» і соцмережі з кількістю підписників.

Бекенду немає. Форма трьох слів копіює слова в буфер обміну — нікуди їх не
надсилає і нічого не зберігає.

## Стек

React 19 · Vite · TypeScript · Tailwind v4. Без анімаційних бібліотек — усе на
CSS і `IntersectionObserver`.

`WebStarter.AppHost` (Aspire) і `WebStarter.Server` лишаються в репо для
локального запуску, але сайт від них не залежить.

## Запуск

```powershell
aspire start        # AppHost: сервер + Vite разом
```

Тільки фронтенд:

```powershell
cd frontend
npm install
npm run dev
```

## Деплой

Статичний білд на Cloudflare Pages.

```powershell
cd frontend
npm run build       # → frontend/dist
```

## Бренд

Кольори, шрифт і зображення взяті з чинного `contrlve.com.ua`: жовтий
`#FAE913`, маркери `#FDC20E`, чорний `#0a0a0a`, червоний CTA `#e5091a`, шрифт
Social Gothic Bold. Логотип шоу — це виділений текст із маркерами, тобто
Ctrl+V; сайт побудований навколо цієї метафори.

## Дані

Уся змінна частина — у `frontend/src/data/`: випуски, ведучий і резиденти,
правила, соцмережі, застосунок. Новий випуск додається одним рядком у
`episodes.ts`, кількість підписників — у `socials.ts`.
