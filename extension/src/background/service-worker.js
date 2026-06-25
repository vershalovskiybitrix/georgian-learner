'use strict';

importScripts('../shared/defaults.js'); // provides self.GEO_DEFAULTS

// Write defaults on first install only, so existing user settings are not clobbered.
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.storage.sync.set(GEO_DEFAULTS);
  }
});
