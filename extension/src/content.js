(() => {
  'use strict';

  // Blocklist approach: process text in ANY element EXCEPT those that are
  // inherently non-content (code, metadata, embedded, graphics).
  // Form elements (BUTTON, INPUT, etc.) are caught by isInsideInteractive.
  // This is much more robust than enumerating all possible content containers.
  const SKIP_PARENTS = new Set([
    // Code & metadata — never contain readable text
    'SCRIPT', 'STYLE', 'NOSCRIPT', 'TITLE', 'META',
    // Embedded — not readable text
    'IFRAME', 'FRAME', 'FRAMESET', 'NOFRAMES', 'EMBED', 'OBJECT',
    // Graphics — not text
    'CANVAS', 'SVG', 'MATH',
    // Templates — not rendered
    'TEMPLATE'
  ]);

  // Block-level elements for DONE_ATTR stamping (they're static, don't need
  // re-scanning on SPA re-renders). Divs, spans, and inline elements are
  // intentionally excluded to allow SPA re-render handling.
  const BLOCK_SAFE = new Set([
    'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'LI', 'TD', 'TH', 'BLOCKQUOTE', 'FIGCAPTION', 'CITE', 'DT', 'DD'
  ]);

  const DONE_ATTR = 'data-geo-done';

  // WeakSet tracks individual text node objects already processed.
  // When React/Vue removes and recreates DOM nodes, the new objects are not
  // in the set and will be processed again — exactly what we want.
  const processedNodes = new WeakSet();

  // Spans inside these tags/roles are navigation or interactive chrome, not
  // readable content — skip them.
  const INTERACTIVE_TAGS  = new Set(['A', 'BUTTON', 'NAV', 'HEADER', 'FOOTER', 'MENU']);
  const INTERACTIVE_ROLES = new Set([
    'navigation', 'button', 'menuitem', 'menubar',
    'tab', 'tablist', 'toolbar', 'banner'
  ]);

  let cfg            = null;
  let sortedMappings = [];
  let singleMappings = [];

  // ── Config & mappings ──────────────────────────────────────────────────────
  // geoStore (shared/storage.js) and GEO_DEFAULTS (shared/defaults.js) are loaded
  // before this script via the manifest content_scripts list.

  async function loadConfig() {
    return geoStore.syncGet(GEO_DEFAULTS);
  }

  async function loadMappings() {
    const stored = await geoStore.localGet(['customLatin', 'customCyrillic']);

    const fetchDefault = name =>
      fetch(chrome.runtime.getURL(`data/mappings/${name}`)).then(r => r.json());

    const [latinData, cyrData] = await Promise.all([
      stored.customLatin    ? Promise.resolve(stored.customLatin)    : fetchDefault('latin-georgian.json'),
      stored.customCyrillic ? Promise.resolve(stored.customCyrillic) : fetchDefault('cyrillic-georgian.json')
    ]);

    const all = [...latinData.mappings, ...cyrData.mappings];
    all.sort((a, b) => b.from.length - a.from.length);

    sortedMappings = all;
    singleMappings = all.filter(m => m.from.length === 1);
  }

  // ── Domain guard ───────────────────────────────────────────────────────────

  function isDomainAllowed() {
    const host   = location.hostname;
    const inList = cfg.domainList.some(d => host === d || host.endsWith('.' + d));
    return cfg.listMode === 'blacklist' ? !inList : inList;
  }

  // ── Interactive-ancestor check ─────────────────────────────────────────────

  // Walks up the DOM from el (max 8 levels) looking for navigation/button
  // containers. Used to exclude spans that are UI chrome rather than content.
  function isInsideInteractive(el) {
    let cur   = el;
    let depth = 0;
    while (cur && cur !== document.body && depth < 8) {
      if (INTERACTIVE_TAGS.has(cur.tagName)) return true;
      const role = cur.getAttribute('role');
      if (role && INTERACTIVE_ROLES.has(role)) return true;
      cur = cur.parentElement;
      depth++;
    }
    return false;
  }

  // ── Replacement logic ──────────────────────────────────────────────────────

  function buildReplacements(text) {
    const lower = text.toLowerCase();
    const rate  = cfg.rate / 1000;
    const mode  = cfg.matchMode;
    const selected = [];

    if (mode === 'equal') {
      for (let i = 0; i < lower.length; i++) {
        const m = singleMappings.find(m => lower[i] === m.from);
        if (m && Math.random() < rate) {
          selected.push({ start: i, end: i + 1, from: text[i], to: m.to });
        }
      }
    } else {
      let i = 0;
      while (i < lower.length) {
        const m = sortedMappings.find(m => lower.startsWith(m.from, i));
        if (m) {
          const p = (mode === 'boosted' && m.from.length > 1)
            ? Math.min(1, rate * 3)
            : rate;
          if (Math.random() < p) {
            selected.push({
              start: i,
              end:   i + m.from.length,
              from:  text.slice(i, i + m.from.length),
              to:    m.to
            });
          }
          i += m.from.length;
        } else {
          i++;
        }
      }
    }

    return selected;
  }

  function applyToNode(node, replacements) {
    const text = node.textContent;

    if (!cfg.highlight) {
      const rtl = [...replacements].sort((a, b) => b.start - a.start);
      let t = text;
      for (const r of rtl) t = t.slice(0, r.start) + r.to + t.slice(r.end);
      node.textContent = t;
      return;
    }

    const ltr  = [...replacements].sort((a, b) => a.start - b.start);
    const frag = document.createDocumentFragment();
    let cursor = 0;

    for (const r of ltr) {
      if (cursor < r.start) {
        frag.appendChild(document.createTextNode(text.slice(cursor, r.start)));
      }
      const span = document.createElement('span');
      span.className        = 'geo-char';
      span.dataset.original = r.from;
      span.title            = r.from;
      span.textContent      = r.to;
      frag.appendChild(span);
      cursor = r.end;
    }

    if (cursor < text.length) {
      frag.appendChild(document.createTextNode(text.slice(cursor)));
    }

    node.parentNode.replaceChild(frag, node);
  }

  // ── Per-node processing ────────────────────────────────────────────────────

  function processNode(node) {
    if (processedNodes.has(node)) return;

    const parent = node.parentElement;
    if (!parent)                                             return;
    if (SKIP_PARENTS.has(parent.tagName))                    return; // blocklist: skip known non-content tags
    if (parent.classList.contains('geo-char'))               return; // skip our own injected spans
    if (parent.getAttribute('aria-hidden') === 'true')       return;
    if (parent.isContentEditable)                            return;
    if (isInsideInteractive(parent))                         return; // skip navigation/buttons/etc (now applies to ALL parents)

    const text = node.textContent;
    if (!text || !text.trim()) return;

    // Mark before applyToNode — in highlight mode replaceChild detaches the node,
    // so we must register it while it still has its identity.
    processedNodes.add(node);

    const replacements = buildReplacements(text);
    if (replacements.length) applyToNode(node, replacements);
  }

  // ── DOM scan ───────────────────────────────────────────────────────────────

  function scanRoot(root) {
    if (!root || root.nodeType !== Node.ELEMENT_NODE) return;
    if (root.hasAttribute && root.hasAttribute(DONE_ATTR)) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const pairs  = [];
    let n;
    while ((n = walker.nextNode())) {
      const p = n.parentElement;
      if (p && !p.hasAttribute(DONE_ATTR)) pairs.push({ node: n, parent: p });
    }

    const blockParents = new Set();
    for (const { node, parent } of pairs) {
      processNode(node);
      if (BLOCK_SAFE.has(parent.tagName)) blockParents.add(parent);
    }

    // Only stamp block-level parents to avoid blocking SPA span re-renders.
    for (const p of blockParents) p.setAttribute(DONE_ATTR, '');
  }

  // ── MutationObserver ───────────────────────────────────────────────────────

  function setupObserver() {
    if (!cfg.observeDynamic) return;

    // Accumulate added nodes across callbacks; debounce the scan. Collecting into
    // a persistent queue (instead of closing over a single `mutations` batch) is
    // essential: several observer callbacks can fire within the debounce window,
    // and capturing only the last batch would silently drop the earlier ones.
    let timer = null;
    const pending = [];

    const flush = () => {
      timer = null;
      const nodes = pending.splice(0);
      for (const node of nodes) scanRoot(node);
    };

    const obs = new MutationObserver(mutations => {
      for (const mut of mutations) {
        for (const added of mut.addedNodes) {
          if (added.nodeType !== Node.ELEMENT_NODE) continue;
          if (added.classList && added.classList.contains('geo-char')) continue;
          const par = added.parentElement;
          // Only honour DONE_ATTR for block-level parents — span parents are
          // not stamped, so their children must always be re-checked.
          if (par && par.hasAttribute(DONE_ATTR) && BLOCK_SAFE.has(par.tagName)) continue;
          pending.push(added);
        }
      }
      if (pending.length && !timer) timer = setTimeout(flush, 250);
    });

    obs.observe(document.body, { childList: true, subtree: true });
  }

  // ── Highlight style ────────────────────────────────────────────────────────

  function injectStyle() {
    if (!cfg.highlight) return;
    const s = document.createElement('style');
    s.id          = 'geo-learner-style';
    s.textContent = '.geo-char{text-decoration:underline dotted #4285f4;cursor:help;}';
    (document.head || document.documentElement).appendChild(s);
  }

  // ── Boot ───────────────────────────────────────────────────────────────────

  async function init() {
    cfg = await loadConfig();
    if (!cfg.enabled || !isDomainAllowed()) return;

    await loadMappings();

    injectStyle();
    setTimeout(() => scanRoot(document.body), 1000);
    setupObserver();
  }

  init().catch(() => {});
})();
