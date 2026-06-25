'use strict';

// Single source of truth for default settings, shared across every context:
// content script (listed in manifest before content.js), the service worker
// (via importScripts), and the popup (via <script>). Attached to `self` so the
// same file works in window and worker globals alike.
self.GEO_DEFAULTS = {
  enabled:        true,
  rate:           3,
  highlight:      true,
  observeDynamic: true,
  matchMode:      'boosted',
  listMode:       'blacklist',
  domainList: [
    'docs.google.com',
    'sheets.google.com',
    'slides.google.com',
    'mail.google.com',
    'github.com',
    'gitlab.com'
  ]
};

// Single source of truth pairing each bundled mapping file with the
// chrome.storage.local key that holds the user's customised version of it.
// Both the content script and the options page derive from this list.
self.GEO_MAPPING_SOURCES = [
  { key: 'customLatin',    file: 'latin-georgian.json' },
  { key: 'customCyrillic', file: 'cyrillic-georgian.json' }
];
