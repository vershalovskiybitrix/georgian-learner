'use strict';

const DEFAULT_SETTINGS = {
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

// Write defaults on first install only, so existing user settings are not clobbered.
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.storage.sync.set(DEFAULT_SETTINGS);
  }
});
