# Georgian Learner

A browser extension that helps you passively learn the Georgian alphabet (Mkhedruli) while reading web pages. As you browse, the extension randomly replaces Latin and Cyrillic letters with their Georgian equivalents, helping your brain absorb new characters without conscious effort.

## How It Works

Instead of traditional memorization, **Georgian Learner** uses spaced repetition through incidental exposure. While reading any website:

- Random Latin letters → Georgian letters (`a` → `ა`, `b` → `ბ`, etc.)
- Multi-character mappings → Longer patterns (`kh` → `ხ`, `ch` → `ჩ`, etc.)
- Cyrillic letters → Georgian letters (`а` → `ა`, `б` → `ბ`, etc.)

### Example
> Original: "The quick brown fox jumps..."  
> With Georgian Learner: "Tთე quick ბrown fox jumps..."

## Features

✨ **Adjustable frequency** — Replace 1 in 1000 letters, or up to 1 in 2 letters (default: 3 per 1000)

🎯 **Three priority modes:**
- **Equal** — all candidates chosen randomly
- **Boosted** — multi-character patterns are 3× more likely (default)
- **Longest** — always apply the longest matching pattern

🔍 **Visual highlighting** — Highlighted replacements show the original letter on hover (configurable)

🌐 **Dynamic content** — Detects and processes content added by SPAs (React, Vue, etc.) as you scroll

🚫 **Domain control** — Blacklist/whitelist specific websites (default: blacklist for Google Docs, GitHub, Gmail, etc.)

🎨 **Customizable mappings** — Edit the correspondence table, export/import as JSON

## Installation

### Chrome or Vivaldi (Developer Mode)

1. [Download](https://github.com/vershalovskiybitrix/georgian-learner/releases) the extension as a ZIP file
2. Unzip it anywhere
3. Open `chrome://extensions/` (Chrome) or `vivaldi://extensions/` (Vivaldi)
4. Enable **Developer mode** (top-right toggle)
5. Click **Load unpacked** and select the `extension/` folder
6. Done! The icon appears in your toolbar

### Chrome Web Store (Coming Soon)
Coming to the official Chrome Web Store after v1.1 release.

## Usage

### Popup (Click the extension icon)
- Toggle **Enable/Disable**
- Adjust replacement **frequency** (slider or number input)
- Change **priority mode** (equal/boosted/longest)
- Toggle **visual highlighting**
- Toggle **dynamic content detection**

### Options Page (Right-click icon → Options)
- **Correspondence tables** — Edit Latin→Georgian and Cyrillic→Georgian mappings
- **Export/Import** — Download or upload custom mapping tables as JSON
- **Domain list** — Whitelist/blacklist specific websites

## Settings

All settings are saved to your browser profile and sync across devices (Chrome sync).

| Setting | Default | Range |
|---------|---------|-------|
| Enabled | `true` | on/off |
| Frequency | 3 | 0–1000 (per 1000 letters) |
| Highlight | `true` | on/off |
| Dynamic content | `true` | on/off |
| Priority mode | `boosted` | equal / boosted / longest |
| Domain mode | `blacklist` | blacklist / whitelist |

## What It Does NOT Do (By Design)

- **No translation** — Only letter-for-letter replacement, not word translation (planned for v2)
- **No word prediction** — No machine learning or network requests
- **No UI modification** — Navigation, buttons, and form fields are never touched
- **No cookies or tracking** — All data stored locally in your browser

## Supported Sites

Works on virtually any website with readable text:
- ✅ News sites, blogs, forums
- ✅ Wikipedia, documentation
- ✅ Twitter, Reddit, and other social networks
- ✅ VK (ВКонтакте), Telegram Web
- ❌ PDF viewers (Chrome PDF reader support may vary)

**Blacklisted by default:** Google Docs, Google Sheets, Gmail, GitHub, GitLab (to protect productivity)

## Developing

### Project Structure
```
georgian-learner/
├── extension/                  # ← loadable / packable extension (Load unpacked / ZIP)
│   ├── manifest.json           # Extension configuration
│   ├── src/
│   │   ├── content.js          # Core replacement engine
│   │   ├── shared/             # shared across contexts
│   │   │   ├── defaults.js     # GEO_DEFAULTS — default settings (single source)
│   │   │   └── storage.js      # geoStore — chrome.storage promise wrappers
│   │   ├── background/
│   │   │   └── service-worker.js
│   │   ├── popup/
│   │   │   ├── popup.html
│   │   │   ├── popup.js
│   │   │   └── popup.css
│   │   └── options/
│   │       ├── options.html
│   │       ├── options.js
│   │       └── options.css
│   ├── data/
│   │   └── mappings/
│   │       ├── latin-georgian.json
│   │       └── cyrillic-georgian.json
│   └── icons/
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
├── archive/                    # planning drafts (kept for history)
└── *.md                        # README, PRIVACY, PUBLISH, ROADMAP, SCREENSHOTS
```

### Building from Source

1. Clone the repository
2. Open `chrome://extensions/` → Enable Developer mode
3. Click **Load unpacked** → Select the `extension/` folder
4. Changes to JS/CSS are auto-loaded; reload the page to see changes

### Modifying Mappings

Edit `extension/data/mappings/latin-georgian.json`:
```json
{
  "version": "1.0",
  "name": "Latin → Georgian",
  "mappings": [
    { "from": "kh", "to": "ხ" },
    { "from": "a",  "to": "ა" }
  ]
}
```

Or use the **Options page** → Import/Export JSON.

## Troubleshooting

**Text not being replaced?**
- Check if the site is blacklisted (Options → Domains)
- Check if the extension is enabled (popup toggle)
- Reload the page
- Try lowering the frequency threshold temporarily

**Performance impact?**
- Georgian Learner uses minimal CPU (TreeWalker + debounced MutationObserver)
- Should not affect page load time noticeably

**Highlighting doesn't show on hover?**
- Ensure **Visual highlighting** is enabled in popup
- Reload the page

## Privacy

- ✅ **No tracking** — No analytics, no telemetry
- ✅ **No network** — Fully offline, no external requests
- ✅ **No personal data** — Settings stored only in your browser
- ✅ **Open source** — Full source code available on GitHub

## License

MIT License — free to use, modify, and distribute.

## Support

Found a bug or have a feature request? 
- [Open an issue on GitHub](https://github.com/your-repo/issues)
- Email: vershalovskiy.bitrix@gmail.com

## Roadmap

### v1.1 (Next)
- Keyboard shortcut to toggle replacement on/off
- Stats dashboard (letters learned, time spent)

### v2.0 (Future)
- Word-level translation (not just letters)
- SRS (spaced repetition) scheduling
- Community contribution of mappings

---

**Happy learning! Enjoy your journey to mastering Georgian! 🇬🇪**
