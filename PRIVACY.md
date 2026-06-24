# Privacy Policy

**Georgian Learner** — Privacy Notice

Last updated: May 13, 2026

## Overview

Georgian Learner is committed to your privacy. This extension operates entirely locally on your device with zero external communication, tracking, or data collection.

## Data Collection

**We do NOT collect, store, or transmit any personal data.**

Georgian Learner:
- ❌ Does not track your browsing activity
- ❌ Does not send data to external servers
- ❌ Does not use analytics or telemetry
- ❌ Does not set cookies or identify you
- ❌ Does not read your passwords or sensitive information

## Permissions Explained

Georgian Learner requests only two permissions:

### `storage` (chrome.storage.sync + chrome.storage.local)
- **Why?** To save your preferences (replacement frequency, highlight setting, domain list, custom mappings)
- **Where?** Data stays in your browser profile and syncs only within your own Chrome/Firefox account
- **Examples:** Your settings follow you across devices if you sign into the same browser account
- **No external sharing:** This data never leaves your devices

### `<all_urls>` (Access to all websites)
- **Why?** To process text on any website you visit
- **What happens?** The extension reads text content to find letters eligible for replacement
- **Does it send anything?** No. All processing happens locally in your browser tab
- **Can it see forms/passwords?** No. The extension skips:
  - Form inputs and textareas
  - Contenteditable areas
  - Code blocks and script tags
  - Navigation menus and buttons

## Data Storage

All data is stored locally:
- **Sync settings** (enabled, frequency, highlight, etc.) → `chrome.storage.sync`
- **Custom mappings** (if you edit the tables) → `chrome.storage.local`

**Backup & Sync:** If you enable Chrome sync in Settings, your extension preferences may sync to your Google account. This is controlled by your browser settings, not by Georgian Learner.

**Deletion:** Uninstalling the extension automatically deletes all stored data.

## Third-Party Services

Georgian Learner does **not** integrate with any third-party services:
- ❌ No Google Analytics
- ❌ No advertising networks
- ❌ No CRM or email services
- ❌ No cloud synchronization services

Mapping data is bundled locally in JSON files; no external lookups.

## Security

- **Code isolation:** The extension runs in a sandboxed context with restricted API access
- **No eval/dynamic code:** The extension contains only static JavaScript (no runtime code generation)
- **Content Security Policy:** Strict CSP prevents inline scripts and external resource loading
- **HTTPS only:** Any future features will use HTTPS

## Children's Privacy

Georgian Learner is suitable for all ages and contains no age-restricted content. If you are under 13, please have a parent or guardian review this policy.

## Changes to This Policy

We may update this privacy notice occasionally. Significant changes will be noted in the extension version history (though Georgian Learner's core approach — local-only operation — is permanent).

## Contact

For privacy questions or concerns:
- **Email:** vershalovskiy.bitrix@gmail.com
- **Website:** https://vershalovsky.com

---

## Summary

**You are in control.** All your data stays on your device. Georgian Learner is a tool that respects your privacy by design.
