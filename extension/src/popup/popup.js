'use strict';

// GEO_DEFAULTS from shared/defaults.js (loaded first). The popup only reads the
// subset it shows; extra keys (listMode/domainList) are harmless as get() defaults.

function applySettings(s) {
  document.getElementById('enabled').checked         = s.enabled;
  document.getElementById('rate-slider').value       = s.rate;
  document.getElementById('rate-num').value          = s.rate;
  document.getElementById('match-mode').value        = s.matchMode;
  document.getElementById('highlight').checked       = s.highlight;
  document.getElementById('observe-dynamic').checked = s.observeDynamic;
  document.getElementById('body').classList.toggle('disabled', !s.enabled);
}

function save(key, value) {
  chrome.storage.sync.set({ [key]: value });
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(GEO_DEFAULTS, applySettings);

  document.getElementById('enabled').addEventListener('change', e => {
    const on = e.target.checked;
    save('enabled', on);
    document.getElementById('body').classList.toggle('disabled', !on);
  });

  // Slider and number input stay in sync.
  document.getElementById('rate-slider').addEventListener('input', e => {
    const v = +e.target.value;
    document.getElementById('rate-num').value = v;
    save('rate', v);
  });

  document.getElementById('rate-num').addEventListener('change', e => {
    let v = Math.max(0, Math.min(1000, parseInt(e.target.value, 10) || 0));
    e.target.value = v;
    document.getElementById('rate-slider').value = v;
    save('rate', v);
  });

  document.getElementById('match-mode').addEventListener('change', e => {
    save('matchMode', e.target.value);
  });

  document.getElementById('highlight').addEventListener('change', e => {
    save('highlight', e.target.checked);
  });

  document.getElementById('observe-dynamic').addEventListener('change', e => {
    save('observeDynamic', e.target.checked);
  });

  document.getElementById('open-options').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});
