# SDD ledger — plan: docs/superpowers/plans/2026-08-17-contrlve-site.md

Spec: docs/superpowers/specs/2026-08-17-contrlve-site-design.md (read, binding)
Branch: feat/contrlve-site, branch base 4d69a1b

## Pre-flight scan

### Пари задач, що ділять файл або інтерфейс

| Пара | Виробляє → споживає | Знайдено |
| --- | --- | --- |
| T1 → T5..T12 | `frontend/src/App.tsx` (`<main />`) → повна заміна в T5, доповнення в T6-T11, фінальна збірка T12 | чисто, послідовне доповнення |
| T1 → T4, T5, T8 | `frontend/src/index.css` (тема, @font-face) → дописування блоків `.mark`, `.hero-photo`, `.marquee` | чисто, лише append |
| T1 → T12 | `frontend/index.html` (базовий head) → повні мета-теги і JSON-LD | чисто |
| T1 → T4 | `frontend/vitest.setup.ts` (jest-dom) → повна заміна зі стабами IntersectionObserver і matchMedia | чисто; тести T1-T3 стабів не потребують |
| T1 → T11 | `formatFollowers(n): string` → плитки соцмереж | чисто, сигнатура збігається |
| T2 → T5,6,7,8,9,10,11 | `episodes/hosts/rules/socials/appInfo/demo/randomWords` → усі секції | чисто, усі імена й типи звірені |
| T3 → T6 | `splitByWords(text, words): Segment[]` → демонстрація в «Як грати» | чисто |
| T3 → T10 | `validateWords`, `hasBlockingIssues`, `WordIssue`, `submitWords`, `readAttempts` → форма | чисто, `WordIssue.index === -1` для помилки рівня форми узгоджено з `formIssue` у формі |
| T4 → T5..T11 | `<Mark instant?>`, `useReveal`, `useReducedMotion` | чисто |
| T5 → T8, T9 | `<Button href variant>` → «Усі випуски», «Завантажити в App Store» | чисто, T5 передує |
| T6 → T7..T11 | `<Section id title>` → усі наступні секції | чисто, T6 передує |
| T6..T11 → T12 | id секцій → `App.test` очікує `['rules','cast','guests','app','words','socials']` | чисто, збігається один в один; герой навмисно без id |

### Внутрішня узгодженість кожної задачі

| Задача | Знайдено |
| --- | --- |
| T1 | **Дефект:** токен `--font-display` оголошений у `@theme`, але код усюди використовує `font-[Gothic]` — токен мертвий. Так само `bg-[var(--color-cta)]` замість утиліт з токенів. |
| T2 | чисто — тести перевіряють рівно ті інваріанти, які дані обіцяють |
| T3 | чисто — усі експортовані імена вживаються в тестах і в T6/T10 |
| T4 | **Дефект:** у `.mark` властивість `color` оголошена двічі |
| T5 | **Дефект:** inline `left` застосовується на всіх брейкпоінтах, хоча на md+ фото `relative` — зсув поламав би ряд на десктопі |
| T6 | **Дефект (виправлено до старту):** тест рахував усі `<mark>`, а в заголовку секції теж є `<Mark>` |
| T7 | чисто |
| T8 | **Дефект (виправлено до старту):** тест очікував 40 посилань, але копії стрічки мають `aria-hidden` і не потрапляють у дерево доступності |
| T9 | чисто |
| T10 | **Дефект (виправлено до старту):** тест підміняв `navigator.clipboard`, який `userEvent.setup()` теж підміняє |
| T11 | чисто |
| T12 | чисто |

### Рішення (усі прийняті до дispatch Task 1)

- Ruling: замінив довільні Tailwind-значення (`font-[Gothic]`, `bg-[var(--color-cta)]` тощо) на утиліти з токенів теми (`font-brand`, `bg-cta`, `text-mark`), а токен `--font-display` перейменував на `--font-brand`. Причина: інакше токени теми оголошені й не використані, і рецензент справедливо позначив би це в кожній задачі. Ціна помилки: якщо якась утиліта не згенерується, зламається оформлення однієї секції — видно одразу в браузері.
- Ruling: прибрав дубльовану властивість `color` у `.mark`, лишив `#fff` як стан до виділення. Причина: друга декларація і так перемагала, дубль лише збивав з пантелику. Ціна помилки: нульова, поведінка не змінюється.
- Ruling: позиціонування фото героя перенесено з inline `left` у клас `.hero-photo`, який абсолютний лише до 768px; inline лишився тільки `--hero-left`, `transform` і `z-index`. Причина: inline `left` діяв би і на десктопі, де фото `relative`, і розсунув би ряд. Ціна помилки: зсуви фото в герої виглядатимуть не так, як на чинному сайті — правиться однією медіа-квері.
- Ruling: три дефекти в тестах (T6, T8, T10) виправлені ще на етапі self-review плану, до створення цього ледера. Причина: усі три зробили б тест червоним на коректному коді. Ціна помилки: нульова, зміни лише в тестах.

## Progress

Task 1: dispatched (sonnet), BASE f243976 — каркас Vite+React+TS+Tailwind v4+Vitest, ассети, бренд-токени
Task 1: implemented (993ddeb), 5/5 tests, build ok; review dispatched (sonnet), diff f243976..993ddeb
Task 1: minor (deferred): background-attachment: fixed на html дає скрол-джанк на iOS Safari (frontend/src/index.css) — вирішити при фінальній перевірці на телефоні
Task 1: Ruling: ⚠️ «TDD RED не перевіряється з одного сквошнутого коміту» — не дефект коду. Звіт містить точний текст помилки Vitest ("Failed to resolve import ./format"), який неможливо вгадати; гранулярність комітів — артефакт процесу, а не пропущена вимога. Ціна помилки: якщо TDD насправді не виконувався, тест міг бути написаний під готовий код — але сам тест перевірено рецензентом вручну на всіх п'яти кейсах.
Task 1: complete (commits f243976..993ddeb, review clean)
Task 2: dispatched (haiku), BASE 993ddeb — дані сайту
Task 2: implemented (0f9ad61), 14/14 tests; review dispatched (sonnet), diff 993ddeb..0f9ad61
Task 2: minor (deferred, plan-mandated): playlistId дублюється літералом усередині playlistUrl (episodes.ts)
Task 2: minor (deferred, plan-mandated): lastRule експортується, але не покритий тестом
Task 2: minor (deferred, plan-mandated): тест фото хостів перевіряє формат шляху, але не відповідність photo своєму id
Task 2: minor (deferred, plan-mandated): appInfo тест не перевіряє icon/rating/ratingCount/price/minOs
Task 2: Ruling: ⚠️ «реальність самих даних не перевіряється з дифу» — верифікація вже зроблена на етапі дослідження: 20 випусків витягнуті з HTML плейлиста PLLHZWI9bLm5mu2UvhLsH6l0CW0ejyKbCd, мапінг «номер → videoId» звірений з чотирма незалежними результатами пошуку (Даша Кубік #10, Остріков+Кравчук #13, Вова Дантес #6, Міщеряков #1); дані застосунку — з iTunes lookup API по id 6762404205; 264000 підписників — з HTML каналу @YanovychYevhenii. Ціна помилки: якщо якийсь videoId усе ж хибний, глядач потрапить на чуже відео — варте фінальної вибіркової перевірки людиною.
Task 2: complete (commits 993ddeb..0f9ad61, review clean)
Task 3: dispatched (sonnet), BASE 0f9ad61 — логіка валідації, підсвітки, буфера, лічильника
Task 3: implemented (44b3754), 42/42 tests, tsc+oxlint clean; review dispatched (sonnet), diff 0f9ad61..44b3754
Task 3: Ruling: Important (plan-mandated) — splitByWords розв'язує перекриття залежно від порядку слів у масиві: splitByWords('валідол', ['вал','валідол']) підсвічує лише 'вал'. Вирішив виправити, а не парковати: слова живуть у src/data/demo.ts, який редагуватиме команда шоу, і тиха залежність від порядку — саме той баг, якого ніхто не шукатиме після правки даних. Виправлення: сортувати за (start asc, length desc). Ціна помилки: якщо новий порядок сортування хибний, підсвітка в секції «Як грати» покаже не ті межі слів — покривається новим тестом в обидва боки.
Task 3: minor (deferred): немає тесту на межу word.length === 24 (має проходити)
Task 3: minor (deferred): /[a-z]/i позначає й змішані слова на кшталт "приvіт" — поведінка прийнятна, але не задокументована
Task 3: fix round 1/5 dispatched, FIX_BASE 44b3754
Task 3: fix round 1/5 (2 addressed, 0 open; commits 44b3754..ac52a71)
Task 3: complete (commits 0f9ad61..ac52a71, review clean)
Task 4: dispatched (sonnet), BASE ac52a71 — Mark, useReveal, useReducedMotion, CSS виділення
Task 4: implemented (d12be64), DONE_WITH_CONCERNS — додано frontend/src/vitest.d.ts поза списком брифа (типи jest-dom не діставалися до tsc); 47/47 тестів; review dispatched (sonnet), diff ac52a71..d12be64
Task 4: minor (deferred): гілка typeof IntersectionObserver !== 'function' у useReveal непокрита тестами (недосяжна під stub'ом)
Task 4: minor (deferred, plan-mandated): жоден тест Mark не проходить реальний шлях reveal через IntersectionObserver — stub є no-op; перевірено лише читанням коду
Task 4: minor (deferred): при instant=true useReveal усе одно створює observer і робить зайвий ре-рендер
Task 4: Ruling: додавання frontend/src/vitest.d.ts поза списком брифа — приймаю. Рецензент незалежно перевірив усі три tsconfig і package.json: vitest.setup.ts не входить у жоден проєкт TypeScript, тож `tsc -b` (частина npm run build) справді падав би на будь-якому jest-dom матчері. Один рядок, additive, без рантайм-ефекту. Ціна помилки: зайвий файл у src, який нічого не ламає.
Task 4: complete (commits ac52a71..d12be64, review clean)
Task 5: dispatched (sonnet), BASE d12be64 — секція героя
Task 5: implemented (4da6fa6), 51/51 тестів, візуально перевірено на 390px і 1440px; review dispatched (sonnet), diff d12be64..4da6fa6
Task 5: Ruling: Important (plan-mandated) — рецензент справедливо вказав, що в дифі є довільні значення Tailwind для розмірів (min-h-[100dvh], w-[clamp(...)], text-[clamp(...)], active:scale-[0.97]). Приймаю код як є: моє обмеження «тільки утиліти з токенів» стосувалося кольору і шрифту (щоб не обходити палітру), а не одноразових плинних розмірів — заводити токен теми під кожен clamp() було б гірше, ніж написати його на місці. Формулювання обмеження уточнено для задач 6-12, щоб наступні рецензенти не піднімали це знову. Ціна помилки: якщо команда згодом захоче єдину шкалу типографіки, ці clamp-и доведеться зібрати в токени — механічна робота.
Task 5: minor (deferred): (hover: none) перевіряється один раз при підписці — на гібридних пристроях паралакс не вмикається динамічно
Task 5: minor (deferred): формула --hero-left (index * 22 - 8) без пояснювального коментаря
Task 5: minor (deferred): жоден тест не перевіряє гейт reduced-motion і відсутність id у героя
Task 5: Ruling: ⚠️ візуальна перевірка через Playwright не видна з дифу — приймаю як заявлену, але неперевірену; фінальна ручна перевірка в Task 12 покриє це наново.
Task 5: complete (commits d12be64..4da6fa6, review clean)
Task 6: dispatched (sonnet), BASE 4da6fa6 — секція «Як грати»
Task 6: implemented (5740766), 55/55 тестів; review dispatched (haiku), diff 4da6fa6..5740766
Task 6: minor (deferred): кнопці «Показати слова» бракує aria-pressed={shown} — стан оголошується лише зміною тексту
Task 6: complete (commits 4da6fa6..5740766, review clean)
Task 7: dispatched (haiku), BASE 5740766 — секція «Хто в кадрі»
Task 7: implemented (9acffbe), 58/58 тестів; review dispatched (haiku), diff 5740766..9acffbe
Task 7: Ruling: Critical — group-focus-within у картці не спрацьовує (немає фокусованого елемента), плюс Tailwind v4 компілює group-hover: всередині @media (hover: hover), тож на тач-пристроях підпис не видно взагалі. Вирішив виправити обидві половини: підпис видимий за замовчуванням, ховається лише там, де є наведення, плюс tabIndex={0} на картці. Причина: у поточному вигляді жарт бачать тільки десктопні мишкові користувачі. Ціна помилки: чотири зайві таб-стопи на десктопі — компроміс, свідомо обраний, щоб контент не був недосяжним.
Task 7: fix round 1/5 dispatched, FIX_BASE 9acffbe
Task 7: fix round 1/5 (2 addressed, 0 open; commits 9acffbe..d60a8c1)
Task 7: complete (commits 5740766..d60a8c1, review clean)
Task 8: dispatched (sonnet), BASE d60a8c1 — стрічка гостей
Task 8: implemented (7897324), 65/65 тестів, DONE_WITH_CONCERNS — візуальну перевірку в браузері зробити не вдалося (мережа Bash і браузерного інструмента ізольовані); арифметику циклу перевірено на папері. Контролер має закрити цю прогалину сам наприкінці.
Task 8: review dispatched (sonnet), diff d60a8c1..7897324
Task 8: Ruling: Important (plan-mandated) — посилання всередині aria-hidden копії стрічки лишаються у tab-порядку (WCAG 4.1.2). Вирішив виправити: пропс duplicate у Card, tabIndex={-1} для копій. Причина: сенс паузи на :focus-within у тому, що ряд навігується з клавіатури; десять фантомних таб-стопів поза видимою областю це руйнують. Ціна помилки: нульова, зміна адитивна.
Task 8: Ruling: арифметику циклу перевірено двічі незалежно (виконавцем і рецензентом): translateX(-50%) резолвиться від власної ширини треку 2W+1.25rem, тож calc(-50% - 0.625rem) = -(W+1.25rem) — рівно ліва межа другої групи. Стрибка не буде.
Task 8: minor (deferred): тест 1 названий «показує кожного гостя», але перевіряє лише >= 1 входження — фактичну дуплікацію перевіряють тести 3 і 5
Task 8: fix round 1/5 dispatched, FIX_BASE 7897324
Task 8: fix round 1/5 (2 addressed, 0 open; commits 7897324..d7d80af)
Task 8: complete (commits d60a8c1..d7d80af, review clean)
Task 9: dispatched (haiku), BASE d7d80af — секція застосунку
Task 9: implemented (0ae6ca7), 71/71 тестів; review dispatched (haiku), diff d7d80af..0ae6ca7
Task 9: minor (deferred, plan-mandated): тест рейтингу шукає літерал /4\.8/, а не appInfo.rating — не доводить прив'язку до даних (сам код прив'язаний коректно)
Task 9: complete (commits d7d80af..0ae6ca7, review clean)
Task 10: dispatched (sonnet), BASE 0ae6ca7 — форма трьох слів
Task 10: implemented (fce12b2), 81/81 тестів, DONE_WITH_CONCERNS — два відхилення від коду брифа: guard scrollIntoView?.() (немає в jsdom) і flushSync навколо setWords у paste-хендлері (інакше синхронна перевірка в тесті випереджала оновлення React). Друге виглядає як підгонка під тест — віддано на суд рецензента.
Task 10: review dispatched (sonnet), diff 0ae6ca7..fce12b2
Task 10: Ruling: Important — flushSync у paste-хендлері прибрати, замість цього виправити тест на waitFor. Рецензент підтвердив: React 18 батчить оновлення і з нативних слухачів, тож синхронна перевірка в тесті просто не чекала; продакшн-код був зігнутий під тест. Причина: примусовий синхронний ре-рендер на кожну вставку — реальна ціна заради асерту. Ціна помилки: якщо waitFor не спрацює, тест стане флакі — але це видно одразу.
Task 10: Ruling: minor #3 (подвійний сабміт) внесено у той самий раунд, хоча рецензент оцінив як Minor. Причина: подвійний клік двічі інкрементував би лічильник спроб — єдине число, яке сайт показує про відвідувача, і весь сенс дизайну в тому, що воно чесне. Ціна помилки: зайвий стан sending — тривіальний.
Task 10: Ruling: minor key={word} (колізія при трьох однакових словах) також внесено — правка в один символ.
Task 10: minor (deferred): setWord чистить помилки всіх полів, а не лише зміненого
Task 10: minor (deferred): aria-live блок результату монтується разом із вмістом, а не заздалегідь
Task 10: minor (deferred): помилки полів не зв'язані через aria-describedby і не в live-регіоні
Task 10: fix round 1/5 dispatched, FIX_BASE fce12b2
Task 10: fix round 1/5 (3 addressed, 0 open; commits fce12b2..9c905e7)
Task 10: complete (commits 0ae6ca7..9c905e7, review clean)
Task 11: dispatched (haiku), BASE 9c905e7 — соцмережі і футер
Task 11: implemented (d723255), 86/86 тестів; review dispatched (haiku), diff 9c905e7..d723255
Task 11: minor (deferred): тест «не вигадує числа» перевіряє queryByText('0') і ('null') — не спіймав би порожній елемент чи плейсхолдер; краще рахувати плитки з блоком лічильника
Task 11: complete (commits 9c905e7..d723255, review clean)
Task 12: dispatched (sonnet), BASE d723255 — складання сторінки, мета-теги, фінальна перевірка
Task 12: implemented (2fe2b80), 89/89 тестів, tsc+build чисті, ручна перевірка в браузері пройдена повністю (Playwright проти npm run preview); review dispatched (sonnet), diff d723255..2fe2b80
Task 12: minor (deferred, plan-mandated): apple-touch-icon вказує на .ico, Apple очікує PNG 180x180
Task 12: minor (deferred): опис тесту каже «усі сім секцій», а перевіряє шість із id (герой навмисно без id)
Task 12: complete (commits d723255..2fe2b80, review clean)
ALL 12 TASKS COMPLETE. Final whole-branch review next, MERGE_BASE 4d69a1b
CONTROLLER VISUAL CHECK (закриває прогалину задач 8 і 10): npm run build + vite preview на 4173, Playwright.
 - 1440px: герой цілий, лого-виділення з маркерами, випадкове правило працює, усі 7 секцій на місці, горизонтального скролу немає
 - 390px: герой уміщається в екран разом з кнопками, горизонтального скролу немає, правило інше при перезавантаженні (рандом працює)
 - Scroll-reveal <Mark> ПІДТВЕРДЖЕНО візуально: заголовок «ХТО В КАДРІ» малюється жовтим блоком з двома маркерами по діагоналі — саме те, що жоден тест не покривав
 - Консоль: 0 помилок, 0 попереджень
 - Зауваження до полірування: на 390px чотири фото в герої дрібні й скупчені по центру, між кнопками і фото велика порожнеча; на оригінальному сайті фото більші й тримають нижній край

FINAL REVIEW (opus, diff 4d69a1b..2fe2b80): Ready to merge WITH FIXES. 1 Critical, 8 Important, 11 Minor.
Final Ruling: «таблиця лідерів» у секції застосунку — вигадана функція, якої немає ні в data/app.ts, ні в дослідженні App Store. Це мій дефект у плані, не виконавця: я сам написав цей рядок копірайту. Виправляю на «Таймер і підрахунок балів усередині». Ціна помилки, якби залишилось: сайт про реальний продукт стверджував би функцію, якої в ньому немає — рівно те, що забороняє перше обмеження проєкту.
Final Ruling: кнопка «Відправити» на формі, яка нічого не відправляє — теж моє формулювання з плану. Міняю на «Скопіювати слова». Причина: для більшості відвідувачів напис на кнопці і є моделлю того, що сталося; уся інша копія чесна, а кнопка — ні.
Final Ruling: background-attachment: fixed переробити на body::before. Причина: iOS Safari не підтримує fixed і розтягує зображення на всю висоту документа (~7 екранів) — основна аудиторія прийде саме з телефона через Threads.
Final Ruling: увімкнути strict у обох tsconfig — рецензент перевірив, що це безкоштовно на поточному дереві.
Final Ruling: три місця з жовтим текстом (text-mark) замінити на <Mark instant> — жовтий текст це не жовтий блок, а обмеження каже про єдиний механізм акценту.
Final Ruling: rel="noreferrer" -> rel="noopener" на всіх зовнішніх посиланнях. Причина: noreferrer ховає від YouTube і App Store той факт, що трафік іде з нового сайту — команда шоу не побачить, що він працює. Безпека для target=_blank ідентична.
Final Ruling: решту Minor приймаю як є (див. таблицю тріажу рецензента) — зокрема іконки соцмереж і рамку телефона зі спеки, які план тихо звузив; це свідоме рішення, не пропуск.
Final fix wave: dispatched (sonnet), FIX_BASE 2fe2b80, 10 findings
Final fix wave: applied (80dd087), 90/90 тестів, tsc -b + oxlint + build чисті; --color-cta-text #ff6b74 (7.17:1), footer white/60 (7.30:1), лічильник white/55 (6.28:1); scoped re-review dispatched
Final fix wave: re-review clean — усі 10 знахідок ADDRESSED, нового поламаного немає
Final: parked minor — опис тесту WordsForm.test.tsx:130 усе ще каже «Відправити», хоча селектор оновлено. Ruling: лишаю, це рядок опису тесту, не асерт і не видимий текст.
CONTROLLER VISUAL CHECK #2 (після виправлень): «таблиця лідерів» зникла з екрана, рейтинг 4.8 рендериться жовтим блоком з маркерами, зірка лишилась білою поза блоком, верстка рядка не поламалась. Фон через body::before рендериться коректно.
BRANCH COMPLETE.
