# Georgian Learner — Browser Extension

## Что это

Браузерный плагин (Chrome, Vivaldi) для пассивного изучения грузинского алфавита. Идея: в процессе обычного чтения часть букв латиницы и кириллицы случайным образом заменяется на соответствующие буквы грузинского алфавита (Мхедрули). Человек привыкает к новым знакам без целенаправленного обучения — просто читая обычные страницы.

## Текущая версия: V1.0 (в разработке)

Только транслитерация (замена отдельных букв и комбинаций). Перевод целых слов — в V2.

## Платформа и стек

- **Manifest V3** (WebExtension API) — совместим с Chrome и Vivaldi
- **Vanilla JS** (ES2020, без сборщика) — нет зависимостей
- **chrome.storage.sync** — настройки пользователя
- **chrome.storage.local** — кастомные таблицы маппингов
- DOM: **TreeWalker** (blocklist тегов + interactive-guard) + **MutationObserver** (childList)

## Структура проекта

```
georgian-learner/
├── extension/                    # загружаемый/упаковываемый плагин (Load unpacked / ZIP)
│   ├── manifest.json
│   ├── src/
│   │   ├── content.js            # Единый контент-скрипт
│   │   ├── shared/              # общий код для всех контекстов
│   │   │   ├── defaults.js       # GEO_DEFAULTS — единые дефолтные настройки
│   │   │   └── storage.js        # geoStore — промис-обёртки над chrome.storage
│   │   ├── background/
│   │   │   └── service-worker.js
│   │   ├── popup/
│   │   │   ├── popup.html / .js / .css
│   │   └── options/
│   │       ├── options.html / .js / .css
│   ├── data/
│   │   └── mappings/
│   │       ├── latin-georgian.json
│   │       └── cyrillic-georgian.json
│   └── icons/
├── archive/                      # черновики планирования
└── *.md                          # README, PRIVACY, PUBLISH, ROADMAP, SCREENSHOTS
```

## Ключевые архитектурные решения

### DOM-обход: blocklist + interactive-guard
Обрабатываем текстовые узлы в любом элементе, **кроме**:
- Тегов из `SKIP_PARENTS` (не содержат читаемого текста): `SCRIPT`, `STYLE`, `NOSCRIPT`, `TITLE`, `META`, `IFRAME`, `FRAME`, `FRAMESET`, `NOFRAMES`, `EMBED`, `OBJECT`, `CANVAS`, `SVG`, `MATH`, `TEMPLATE`.
- Узлов внутри интерактивных контейнеров (`isInsideInteractive`, до 8 уровней вверх): теги `A`, `BUTTON`, `NAV`, `HEADER`, `FOOTER`, `MENU` и ARIA-роли `navigation`, `button`, `menuitem`, `menubar`, `tab`, `tablist`, `toolbar`, `banner`.

Подход blocklist надёжнее, чем перечислять все возможные контентные контейнеры — лучше пропустить лишнее, чем сломать интерфейс.

Дополнительно пропускаем:
- Родитель с `aria-hidden="true"`
- Элементы с `contenteditable` (`isContentEditable`)
- Собственные вставленные спаны `.geo-char`
- Блочные родители, уже помеченные `data-geo-done` (стампятся только блочные теги — `P`, `H1–H6`, `LI`, `TD`, `TH`, `BLOCKQUOTE`, `FIGCAPTION`, `CITE`, `DT`, `DD` — чтобы не блокировать ре-рендеры SPA в `div`/`span`)

### Таблицы маппингов (JSON)
Файл `latin-georgian.json` — поле `name` (название вкладки), массив `mappings` с полями `from` / `to`.
Нет поля `priority` — при загрузке маппинги сортируются по убыванию длины `from` (longest-match).

### Три режима приоритета
- `equal` — все кандидаты равнозначны
- `boosted` — комбинации (len>1) с весом ×3 (по умолчанию)
- `longest` — всегда применяется самое длинное совпадение

### Настройки не применяются живьём
Изменение rate/highlight/matchMode вступает в силу при следующей загрузке страницы. MutationObserver только для подгружаемого контента.

### Strategy pattern для V2
```
ReplacementEngine → ReplacementStrategy.process(textNode, settings)
├── LetterReplacementStrategy  ← V1.0
└── WordTranslationStrategy    ← V2.0
```

### Домены (blacklist/whitelist)
По умолчанию: режим чёрного списка.
Дефолтный чёрный список: `docs.google.com`, `sheets.google.com`, `mail.google.com`, `github.com`, `gitlab.com`.

### Хранилище: soft limit 10 КБ
Кастомные маппинги хранятся в `chrome.storage.local`. При превышении 10 КБ — предупреждение пользователю.

## Известные ограничения V1.0

- **Коллизии транслитерации**: `sh` в `mishap` и `sh` в `ship` — одинаково заменяются на `შ`. Лингвистический анализ не реализован. Это осознанный компромисс для V1.
- **Иконочные шрифты**: Material Icons и подобные могут частично пострадать на сайтах, не использующих `aria-hidden`. Interactive-guard и blocklist тегов снижают риск.
- **`<all_urls>`**: на некоторых защищённых страницах контент-скрипт может быть заблокирован браузером — ожидаемое поведение.

## Безопасность

- Нет `eval`, нет inline-скриптов (CSP MV3)
- Нет внешних сетевых запросов в V1
- Валидация маппингов (`options.js`): `to` — один или несколько символов из диапазона U+10D0–U+10FF (`/^[ა-ჿ]+$/`), оба поля непустые. Поле `from` на формат не проверяется (используется только для текстового сравнения, в DOM не вставляется) — известное ограничение V1.

## Разработка и тест

```
chrome://extensions → Developer mode → Load unpacked → extension/
```

Тест на Vivaldi идентичен — полная совместимость через WebExtension API.
