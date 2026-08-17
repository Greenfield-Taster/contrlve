# CLAUDE.md

## Project

Односторінковий сайт шоу КОНТРЛВЕ. **React + Vite** фронтенд, який локально
піднімає **.NET Aspire** AppHost; продакшн — статика на Cloudflare Pages.

- `frontend/` — React + Vite застосунок; уся змінна частина сайту в `src/data/`
- `WebStarter.AppHost/` — Aspire; чіпляє Vite через `AddViteApp("webfrontend", "../frontend")`
- `WebStarter.Server/` — ASP.NET Core API, **сайтом не використовується**
- `WebStarter.sln` — містить `frontend/frontend.esproj`, тож скафолдинг має відтворити цей файл

Дизайн-спека: `docs/superpowers/specs/2026-08-17-contrlve-site-design.md`.
Читай її перед змінами в UI — там зафіксовані палітра, тон текстів і поведінка секцій.

## Commands

```powershell
aspire start          # AppHost: сервер + Vite dev-сервер разом
aspire ps             # список ресурсів
aspire logs           # логи
npm run dev           # тільки фронтенд, з frontend/
npm run build         # статичний білд → frontend/dist
```

## Constraints

- **Бекенду немає.** Сайт має збиратися і працювати з самого `npm run build`. Форма трьох слів копіює в буфер, нічого не надсилає.
- **Без анімаційних бібліотек.** CSS-переходи, CSS-анімації, `IntersectionObserver`.
- **Не вигадувати факти.** Кількість підписників, оцінки застосунку, кількість випусків — тільки перевірені числа з `src/data/`. Якщо числа немає — елемент рендериться без нього.
- `prefers-reduced-motion: reduce` вимикає всі анімації.

## Library documentation

Використовуй **context7** перед тим, як писати код проти будь-якої бібліотеки —
React, Vite, Tailwind. Не пиши API з пам'яті: спочатку резолвни library ID, потім
запитай конкретний API.

## UI design

`docs/stitch-mcp.md` описує Stitch MCP для генерації UI-екранів. Потребує
`STITCH_API_KEY` в оточенні.
