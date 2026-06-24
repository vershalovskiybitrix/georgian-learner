# Screenshots for Chrome Web Store & Vivaldi Extensions

## Required Screenshots

Chrome Web Store and Vivaldi Extensions require specific screenshots. Here's what to capture:

---

## 1. **Popup Screenshot** (1280×800 px)

This is the main promotional image. It should show the extension popup clearly.

### How to capture:
1. Open any website in Chrome
2. Click the Georgian Learner icon in the toolbar
3. The popup appears on the right side
4. Open DevTools: Press `F12`
5. Go to DevTools Settings → Emulation → adjust zoom to fit entire popup in frame
6. Use `Ctrl+Shift+P` → "Capture Screenshot"
7. Name: `popup-preview.png`

### What to show in the popup:
- ✅ Toggle "Включено" (Enabled) - turned ON
- ✅ Frequency slider set to ~50 (visible adjustment)
- ✅ Match Mode dropdown visible
- ✅ Highlight checkbox checked
- ✅ Observe Dynamic checkbox checked

**Dimensions:** 1280×800 or 1400×840 (Chrome Web Store prefers landscape)

---

## 2. **Options Page Screenshot** (1280×1024 px)

Shows the customization features.

### How to capture:
1. Right-click Georgian Learner icon → "Options"
2. The options page opens in a new tab
3. Scroll to show the **Correspondence table** section
4. Use browser zoom if needed to fit in frame
5. Screenshot: `options-table.png`

Then:
6. Scroll down to the **Domain list** section
7. Screenshot: `options-domains.png`

### What should be visible:
- **First screenshot (table):**
  - Tab buttons (Latin → Georgian, Cyrillic → Georgian)
  - Sample mapping table rows
  - "Save", "Download JSON", "Upload JSON", "Reset" buttons

- **Second screenshot (domains):**
  - Toggle for Blacklist/Whitelist mode
  - Domain list textarea with sample domains
  - "Save Domains" button

---

## 3. **Active Replacement Screenshot** (1280×720 px)

Shows the extension **in action** on a real website.

### How to capture:
1. Open any text-heavy website (e.g., Wikipedia, Medium, your blog)
2. Make sure Georgian Learner is **enabled** in the popup
3. Reload the page
4. Scroll to find a paragraph with visible Georgian character replacements (blue underlined)
5. Hover over a replaced character to show the tooltip with original letter
6. Screenshot: `action-screenshot.png`

### What should be visible:
- ✅ Regular text mixed with blue underlined Georgian characters
- ✅ Original letter shown on hover (in title attribute)
- ✅ Natural reading context (paragraph of text)
- ✅ Multiple different Georgian characters visible

**Pro tip:** Set frequency to ~100–200 in popup temporarily (instead of default 3) to make replacements more visible in the screenshot.

---

## 4. **Highlight Tooltip Screenshot** (800×400 px)

Close-up of a replacement with hover tooltip showing original letter.

### How to capture:
1. Enable Georgian Learner on a text-heavy page
2. Hover over any underlined Georgian character
3. The tooltip shows the original Latin/Cyrillic letter
4. Screenshot: `highlight-tooltip.png`

### What should be visible:
- ✅ Underlined Georgian character (e.g., `თ`)
- ✅ Tooltip showing original (e.g., `t`)
- ✅ Clean, readable font

---

## 5. **Settings/Popup Full View** (480×600 px)

Shows all popup settings at once (if possible to fit).

### How to capture:
1. Open popup
2. Adjust browser/DevTools window so entire popup fits in viewport
3. Screenshot: `popup-full.png`

---

## File Organization

Place all screenshots in a folder:
```
plugin-georgian/
├── screenshots/
│   ├── popup-preview.png          (1280×800)
│   ├── options-table.png          (1280×1024)
│   ├── options-domains.png        (1280×1024)
│   ├── action-screenshot.png      (1280×720)
│   ├── highlight-tooltip.png      (800×400)
│   └── popup-full.png             (480×600)
└── README.md
```

---

## Chrome Web Store Upload

When you upload to Chrome Web Store:

1. Go to [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole)
2. Create a new item → Select `.zip` file
3. Fill in details:
   - **Title:** Georgian Learner
   - **Short description:** Passively learn Georgian alphabet. Randomly replaces Latin/Cyrillic letters with Georgian characters as you read.
   - **Full description:** (copy from README.md)
   - **Category:** Productivity or Education
   - **Language:** English
4. Upload screenshots:
   - **Promotional tile (1280×800):** popup-preview.png
   - **Screenshot 1 (1280×720):** action-screenshot.png
   - **Screenshot 2 (1280×720):** options-table.png
   - **Screenshot 3 (1280×720):** options-domains.png

5. Upload icons:
   - **128×128:** icons/icon128.png
   - **Small tile (440×280):** Create by scaling icon128.png

6. Set pricing: **Free**

7. Click **Publish** → Wait for moderation (2–4 hours typically)

---

## Vivaldi Extensions Upload

Similar process at [Vivaldi Extensions](https://vivaldi.com/extensions/):

1. Developer account → Submit extension
2. Same screenshots and details
3. Upload process is slightly different but uploads the same ZIP

---

## Quick Checklist

- [ ] Popup screenshot (toggle, slider, dropdowns visible)
- [ ] Options table screenshot (mappings table with buttons)
- [ ] Options domains screenshot (domain list, blacklist/whitelist toggle)
- [ ] Action screenshot (text with Georgian replacements on real website)
- [ ] Highlight tooltip screenshot (underlined character + tooltip on hover)
- [ ] Privacy.md reviewed and included
- [ ] manifest.json description updated
- [ ] Icons in place (16, 48, 128)
- [ ] README.md complete

---

**Next steps:** Once you have the screenshots, you can immediately upload to Chrome Web Store!
