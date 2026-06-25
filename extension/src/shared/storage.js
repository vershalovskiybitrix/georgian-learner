'use strict';

// Promise wrappers around the callback-based chrome.storage API, shared by the
// content script and the options page. Attached to `self` so it is reachable as
// a global in both the content-script world and the options page.
self.geoStore = {
  syncGet:     q => new Promise(r => chrome.storage.sync.get(q, r)),
  syncSet:     o => new Promise(r => chrome.storage.sync.set(o, r)),
  localGet:    q => new Promise(r => chrome.storage.local.get(q, r)),
  localSet:    o => new Promise(r => chrome.storage.local.set(o, r)),
  localRemove: k => new Promise(r => chrome.storage.local.remove(k, r))
};
