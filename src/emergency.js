/**
 * Emergency Internet – runtime layer
 * Built on Lean HTML principles: local-first, content-addressed, verifiable.
 */

const DB_NAME = 'emergency-internet';
const DB_VERSION = 1;
const STORE = 'content';
const META = 'meta';

// ---------- Storage ----------

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      if (!db.objectStoreNames.contains(META)) db.createObjectStore(META);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function putContent(cid, record) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(record, cid);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getContent(cid) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(cid);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function listContent() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

// ---------- Mode & Priority ----------

const Mode = {
  NORMAL: 'normal',
  DEGRADED: 'degraded',
  ISOLATED: 'isolated',
  BROADCAST: 'broadcast'
};

let currentMode = Mode.NORMAL;

function setMode(mode) {
  if (!Object.values(Mode).includes(mode)) return;
  currentMode = mode;
  document.documentElement.dataset.emergencyMode = mode;
  window.dispatchEvent(new CustomEvent('emergency:mode', { detail: { mode } }));
  console.info('[Emergency] mode →', mode);
}

function getMode() {
  return currentMode;
}

function priorityOf(el) {
  const p = el.getAttribute('priority');
  if (p === null || p === '') return 3;
  const n = parseInt(p, 10);
  return Number.isFinite(n) ? Math.max(0, Math.min(3, n)) : 3;
}

// ---------- Processing ----------

async function processEmergencyDocument(root = document) {
  const blocks = root.querySelectorAll('[emergency], [priority], [content-address], [local-first]');

  for (const el of blocks) {
    const cid = el.getAttribute('content-address');
    const priority = priorityOf(el);
    const localFirst = el.hasAttribute('local-first') || currentMode !== Mode.NORMAL;

    el.dataset.priority = String(priority);

    if (cid) {
      const existing = await getContent(cid);
      if (existing) {
        el.dataset.resolved = 'local';
      } else {
        el.dataset.resolved = 'missing';
        // In a full system we would attempt peer fetch here
      }
    }

    // Under pressure, visually de-emphasize low-priority content
    if (currentMode === Mode.DEGRADED || currentMode === Mode.ISOLATED) {
      if (priority >= 3) {
        el.dataset.deferred = 'true';
      }
    }
  }

  document.documentElement.dataset.emergency = 'active';
  console.info('[Emergency] document processed – mode:', currentMode);
}

// ---------- Simple local broadcast (same device / same origin tabs) ----------

const bus = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel('emergency-internet')
  : null;

function broadcast(message) {
  if (!bus) return;
  bus.postMessage({
    ts: Date.now(),
    mode: currentMode,
    ...message
  });
}

if (bus) {
  bus.onmessage = (event) => {
    window.dispatchEvent(new CustomEvent('emergency:peer', { detail: event.data }));
  };
}

// ---------- Public API ----------

async function initEmergency(options = {}) {
  if (options.mode) setMode(options.mode);
  await processEmergencyDocument();
  return { mode: currentMode };
}

// Auto-init when marked
if (typeof document !== 'undefined') {
  const boot = () => {
    if (document.documentElement.hasAttribute('emergency') ||
        document.querySelector('[emergency]')) {
      initEmergency();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}

export {
  Mode,
  setMode,
  getMode,
  initEmergency,
  processEmergencyDocument,
  putContent,
  getContent,
  listContent,
  broadcast,
  priorityOf
};
