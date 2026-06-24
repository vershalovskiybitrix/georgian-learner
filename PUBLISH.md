# Publishing Georgian Learner to App Stores

Step-by-step guide to publish your extension to Chrome Web Store, Vivaldi Extensions, and other platforms.

---

## 📋 Pre-Publication Checklist

Before publishing anywhere:

- [ ] Version number updated in `manifest.json` (e.g., `"version": "1.0.0"`)
- [ ] All bugs tested and fixed locally
- [ ] Screenshots ready in `/screenshots/` folder (see SCREENSHOTS.md)
- [ ] Privacy policy (PRIVACY.md) prepared
- [ ] README.md with installation instructions
- [ ] Icons in place (16×16, 48×48, 128×128)
- [ ] Extension loads without errors in Developer Mode
- [ ] Tested on multiple websites (works on VK, X.com, Wikipedia, etc.)

---

## 🔷 Chrome Web Store

### Setup

1. **Create Google Developer Account**
   - Go to [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole)
   - Sign in with Google account
   - Accept terms and pay **$5 one-time registration fee**

### Publishing Steps

2. **Click "Create new item"**
   - Select the `plugin-georgian.zip` file (created by zipping the entire `plugin-georgian/` folder)
   - Upload

3. **Fill in Store Listing**
   ```
   Title:                   Georgian Learner
   
   Short description:       Passively learn Georgian alphabet. Randomly 
                            replaces Latin/Cyrillic letters with Georgian 
                            characters as you read.
   
   Full description:        [Copy-paste from README.md, Markdown → plain text]
   
   Category:                Productivity (or Education)
   
   Language:                English
   
   Content rating:          Select "No" for all items (it's safe for all ages)
   ```

4. **Upload Graphics**
   - **Promotional tile (1280×800):** `screenshots/popup-preview.png`
   - **Screenshot 1 (1280×720):** `screenshots/action-screenshot.png`
   - **Screenshot 2 (1280×720):** `screenshots/options-table.png`
   - **Screenshot 3 (1280×720):** `screenshots/options-domains.png`
   - **Small promotional tile (440×280):** Scale `icons/icon128.png` or create a branded tile

5. **Upload Icons**
   - **128×128:** `icons/icon128.png`
   - **48×48:** `icons/icon48.png`
   - **16×16:** `icons/icon16.png`

6. **Set Pricing**
   - Select **Free**
   - No payment processing needed

7. **Localization (Optional)**
   - Add descriptions in other languages if desired
   - For now, English is fine

8. **Privacy & Permissions**
   - Link to your privacy policy: paste PRIVACY.md content or link to your website
   - Explain permissions:
     - `storage` — to save your settings
     - `<all_urls>` — to process text on any website

9. **Review**
   - Double-check all details
   - Click **Publish**

### After Submission

- ⏱️ **Moderation time:** 2–4 hours typically (can be up to 24 hours)
- 📧 You'll receive email notification when published
- 🔗 Extension will be available at: `https://chrome.google.com/webstore/detail/[extension-id]`
- Share the link!

---

## 🦁 Vivaldi Extensions

### Setup

1. **Create Vivaldi Developer Account**
   - Go to [Vivaldi Extensions](https://vivaldi.com/extensions/)
   - Click "Become a Developer" → Create account
   - Verify email
   - (No registration fee for Vivaldi)

### Publishing Steps

2. **Submit Extension**
   - Dashboard → "New Extension"
   - Upload `plugin-georgian.zip`

3. **Fill Metadata**
   - Title, description, category (same as Chrome Web Store)
   - Upload screenshots (same dimensions)
   - Upload icons

4. **Select License**
   - Choose **MIT** (or your preferred open-source license)

5. **Submit for Review**
   - Vivaldi moderation is typically faster (1–2 hours)

6. **After Approval**
   - Extension appears in Vivaldi Extensions store
   - Users can install directly from Vivaldi browser

---

## 🌐 GitHub Releases (Quick Distribution)

Fastest way to share with tech-savvy users:

1. **Create GitHub Repository**
   ```
   mkdir plugin-georgian-release
   cd plugin-georgian-release
   git init
   git add .
   git commit -m "Initial release v1.0.0"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/plugin-georgian.git
   git push -u origin main
   ```

2. **Create Release**
   - Go to your GitHub repo → **Releases** → **Create new release**
   - Tag: `v1.0.0`
   - Title: `Georgian Learner v1.0.0`
   - Description:
     ```
     ### Installation
     
     1. Download `plugin-georgian.zip` below
     2. Unzip anywhere
     3. Open `chrome://extensions/` (Chrome) or `vivaldi://extensions/` (Vivaldi)
     4. Enable Developer Mode (top-right)
     5. Click "Load unpacked" → Select the unzipped folder
     6. Done!
     
     ### Features
     - Passively learn Georgian alphabet
     - Adjustable frequency and visual highlighting
     - Works on any website
     - No tracking, fully local
     ```
   - Attach `plugin-georgian.zip` as a release asset
   - Publish

3. **Share**
   - Link: `https://github.com/YOUR-USERNAME/plugin-georgian/releases/tag/v1.0.0`
   - Include in README.md and your website

---

## 💻 Your Website (vershalovsky.com)

Add to your website:

```html
<section class="extension-download">
  <h2>Georgian Learner Browser Extension</h2>
  <p>Passively learn Georgian alphabet while browsing.</p>
  
  <div class="download-options">
    <a href="https://chrome.google.com/webstore/detail/[EXTENSION-ID]" class="btn btn-chrome">
      📥 Chrome Web Store
    </a>
    
    <a href="https://vivaldi.com/extensions/[EXTENSION-ID]" class="btn btn-vivaldi">
      📥 Vivaldi Extensions
    </a>
    
    <a href="https://github.com/YOUR-USERNAME/plugin-georgian/releases/download/v1.0.0/plugin-georgian.zip" class="btn btn-github">
      📥 GitHub Release (Manual Install)
    </a>
  </div>
  
  <h3>What It Does</h3>
  <p>Randomly replaces Latin and Cyrillic letters with Georgian characters as you read web pages. Learn passively!</p>
</section>
```

---

## 📤 Version Updates

When you release v1.1, v1.2, etc.:

### Chrome Web Store
1. Developer Console → Your Extension → **Package**
2. Upload new `.zip` file
3. Update version in manifest.json
4. Update changelog in Store Listing
5. Submit for review

### GitHub
1. Bump version in manifest.json
2. Commit: `git commit -m "v1.1.0"`
3. Tag: `git tag v1.1.0`
4. Push: `git push origin main --tags`
5. Create GitHub Release with new `.zip`

---

## 🎯 Marketing

After publishing:

- **Tweet:** "Just published Georgian Learner on @ChromeWebStore! Passively learn Georgian alphabet while browsing. Free, open-source, no tracking. 🇬🇪"
- **Reddit:** Post on r/languagelearning, r/Chrome, r/extensions
- **Hacker News:** Post if it gets significant traction
- **Product Hunt:** Consider launching (optional)

---

## 📊 Tracking Downloads

- **Chrome Web Store:** Built-in analytics (Users, Install sources, etc.)
- **Vivaldi Extensions:** Check dashboard for download stats
- **GitHub:** Watch releases page for download counts

---

## ⚠️ Important Notes

### Unpublishing / Removing from Stores
If you ever need to remove the extension:
- Chrome Web Store: Developer Console → Extension → **Unpublish**
- Vivaldi Extensions: Dashboard → **Remove from store**
- GitHub: Just delete the release (or keep it archived)

### Updating Privacy Policy
If you change how the extension works:
1. Update PRIVACY.md
2. Update Store Listing with new privacy policy link
3. Publish new version with updated manifest

### Bug Fixes
Always bump version number (e.g., 1.0.0 → 1.0.1) and submit new version to stores.

---

## ✅ Checklist for Going Live

**Week 1:**
- [ ] Screenshots captured and ready
- [ ] Privacy policy written (PRIVACY.md)
- [ ] README.md finalized
- [ ] manifest.json version set to 1.0.0

**Week 2:**
- [ ] Chrome Web Store listing submitted
- [ ] Vivaldi Extensions listing submitted
- [ ] GitHub repository created with Release v1.0.0
- [ ] vershalovsky.com updated with download links

**Week 3:**
- [ ] Chrome Web Store approved ✓
- [ ] Vivaldi Extensions approved ✓
- [ ] Social media posts shared
- [ ] Monitor for first user feedback/reviews

---

## 🚀 You're Ready!

Your extension is production-ready. Time to share it with the world!

Questions? Check:
- [Chrome Web Store Help](https://support.google.com/chrome_webstore)
- [Vivaldi Extensions FAQ](https://vivaldi.com/extensions/faq/)
- [GitHub Releases Guide](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
