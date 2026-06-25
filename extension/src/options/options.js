'use strict';

// ── State ──────────────────────────────────────────────────────────────────

const MAPPING_FILES = ['latin-georgian.json', 'cyrillic-georgian.json'];
const STORAGE_KEYS  = ['customLatin', 'customCyrillic'];
const SOFT_LIMIT    = 10 * 1024; // 10 KB

let defaultData = [null, null]; // loaded from bundled JSON files
let activeTab   = 0;            // index into MAPPING_FILES

// ── Storage helpers ────────────────────────────────────────────────────────

function syncGet(keys)    { return new Promise(r => chrome.storage.sync.get(keys, r)); }
function syncSet(obj)     { return new Promise(r => chrome.storage.sync.set(obj, r)); }
function localGet(keys)   { return new Promise(r => chrome.storage.local.get(keys, r)); }
function localSet(obj)    { return new Promise(r => chrome.storage.local.set(obj, r)); }
function localRemove(key) { return new Promise(r => chrome.storage.local.remove(key, r)); }

// ── Default JSON fetch ─────────────────────────────────────────────────────

async function fetchDefault(filename) {
  const url = chrome.runtime.getURL(`data/mappings/${filename}`);
  return fetch(url).then(r => r.json());
}

// ── Table render ───────────────────────────────────────────────────────────

function renderTable(data) {
  const tbody = document.getElementById('map-body');
  tbody.innerHTML = '';

  for (const entry of data.mappings) {
    tbody.appendChild(makeRow(entry.from, entry.to));
  }
}

function makeRow(from, to) {
  const tr = document.createElement('tr');

  const tdFrom = document.createElement('td');
  tdFrom.contentEditable = 'true';
  tdFrom.textContent = from;

  const tdTo = document.createElement('td');
  tdTo.contentEditable = 'true';
  tdTo.textContent = to;

  const tdDel = document.createElement('td');
  const btn   = document.createElement('button');
  btn.className   = 'del-row';
  btn.textContent = '×';
  btn.title       = 'Удалить строку';
  btn.addEventListener('click', () => tr.remove());
  tdDel.appendChild(btn);

  tr.append(tdFrom, tdTo, tdDel);
  return tr;
}

function readTable() {
  const rows = document.querySelectorAll('#map-body tr');
  const mappings = [];
  for (const row of rows) {
    // content.js matches against text.toLowerCase(), so an upper-case "from"
    // would never match. Normalise here so user-entered rows actually work.
    const from = row.cells[0].textContent.trim().toLowerCase();
    const to   = row.cells[1].textContent.trim();
    if (from && to) mappings.push({ from, to });
  }
  return mappings;
}

// ── Validation ─────────────────────────────────────────────────────────────

const GEORGIAN_RANGE = /^[ა-ჿ]+$/;

function validateMappings(mappings) {
  const errors = [];
  mappings.forEach((m, i) => {
    if (!m.from) errors.push(`Строка ${i + 1}: пустое поле "From"`);
    if (!m.to)   errors.push(`Строка ${i + 1}: пустое поле "To"`);
    if (m.to && !GEORGIAN_RANGE.test(m.to))
      errors.push(`Строка ${i + 1}: "${m.to}" не является грузинским символом (U+10D0–U+10FF)`);
  });
  return errors;
}

// ── Status flash ───────────────────────────────────────────────────────────

function flash(id, msg, isError = false) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.color = isError ? '#f38ba8' : '#a6e3a1';
  setTimeout(() => { el.textContent = ''; }, 3000);
}

// ── Tab switching ──────────────────────────────────────────────────────────

async function getCurrentData() {
  const stored = await localGet([STORAGE_KEYS[activeTab]]);
  return stored[STORAGE_KEYS[activeTab]] || defaultData[activeTab];
}

async function switchTab(idx) {
  activeTab = idx;

  document.querySelectorAll('.tab-btn').forEach((b, i) =>
    b.classList.toggle('active', i === idx)
  );

  const data = await getCurrentData();
  renderTable(data);
}

// ── Save ───────────────────────────────────────────────────────────────────

async function saveCurrentTab() {
  const mappings = readTable();
  const errors   = validateMappings(mappings);

  if (errors.length) {
    flash('save-status', errors[0], true);
    return;
  }

  const current = await getCurrentData();
  const updated  = { ...current, mappings };

  // Check soft size limit
  const json = JSON.stringify(updated);
  if (json.length > SOFT_LIMIT) {
    flash('save-status', `Превышен лимит 10 КБ (${(json.length / 1024).toFixed(1)} КБ)`, true);
    return;
  }

  const obj = { [STORAGE_KEYS[activeTab]]: updated };
  await localSet(obj);
  flash('save-status', 'Сохранено ✓');
}

// ── Reset ──────────────────────────────────────────────────────────────────

function showResetDialog()  { document.getElementById('overlay').classList.remove('hidden'); }
function hideResetDialog()  { document.getElementById('overlay').classList.add('hidden'); }

async function confirmReset() {
  hideResetDialog();
  await localRemove(STORAGE_KEYS[activeTab]);
  renderTable(defaultData[activeTab]);
  flash('save-status', 'Сброшено к стандартным ✓');
}

// ── Export / Import ────────────────────────────────────────────────────────

async function exportMapping() {
  const data = await getCurrentData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = MAPPING_FILES[activeTab];
  a.click();
  URL.revokeObjectURL(url);
}

function importMapping() {
  document.getElementById('import-file').click();
}

async function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  e.target.value = '';

  const text = await file.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    flash('save-status', 'Ошибка: невалидный JSON', true);
    return;
  }

  if (!Array.isArray(parsed.mappings)) {
    flash('save-status', 'Ошибка: нет поля "mappings"', true);
    return;
  }

  const errors = validateMappings(parsed.mappings);
  if (errors.length) {
    flash('save-status', errors[0], true);
    return;
  }

  const obj = { [STORAGE_KEYS[activeTab]]: parsed };
  await localSet(obj);
  renderTable(parsed);
  flash('save-status', 'Загружено и сохранено ✓');
}

// ── Domain list ────────────────────────────────────────────────────────────

async function loadDomains() {
  const s = await syncGet({ listMode: 'blacklist', domainList: [] });
  document.getElementById('list-mode-toggle').checked = s.listMode === 'whitelist';
  document.getElementById('domain-list').value = s.domainList.join('\n');
}

async function saveDomains() {
  const raw      = document.getElementById('domain-list').value;
  const isWhite  = document.getElementById('list-mode-toggle').checked;
  const domains  = raw.split('\n')
    .map(d => d.trim().toLowerCase())
    .filter(d => d.length > 0);

  await syncSet({
    listMode:   isWhite ? 'whitelist' : 'blacklist',
    domainList: domains
  });
  flash('domain-status', 'Сохранено ✓');
}

// ── Init ───────────────────────────────────────────────────────────────────

async function init() {
  // Fetch both default mapping files
  defaultData = await Promise.all(MAPPING_FILES.map(fetchDefault));

  // Build tabs from "name" field in each JSON
  const tabsEl = document.getElementById('map-tabs');
  defaultData.forEach((data, idx) => {
    const btn = document.createElement('button');
    btn.className   = 'tab-btn' + (idx === 0 ? ' active' : '');
    btn.textContent = data.name || MAPPING_FILES[idx];
    btn.addEventListener('click', () => switchTab(idx));
    tabsEl.appendChild(btn);
  });

  // Load first tab
  await switchTab(0);

  // Wire up buttons
  document.getElementById('save-map')   .addEventListener('click', saveCurrentTab);
  document.getElementById('export-map') .addEventListener('click', exportMapping);
  document.getElementById('import-map') .addEventListener('click', importMapping);
  document.getElementById('import-file').addEventListener('change', handleImportFile);
  document.getElementById('reset-map')  .addEventListener('click', showResetDialog);
  document.getElementById('confirm-reset').addEventListener('click', confirmReset);
  document.getElementById('cancel-reset') .addEventListener('click', hideResetDialog);
  document.getElementById('add-row')    .addEventListener('click', () => {
    document.getElementById('map-body').appendChild(makeRow('', ''));
  });

  // Domain section
  await loadDomains();
  document.getElementById('save-domains')   .addEventListener('click', saveDomains);
  document.getElementById('list-mode-toggle').addEventListener('change', () => {
    const isWhite = document.getElementById('list-mode-toggle').checked;
    document.getElementById('list-mode-label').textContent =
      isWhite ? 'Белый список' : 'Чёрный список';
  });
}

document.addEventListener('DOMContentLoaded', init);
