/**
 * Lean HTML – core processing layer
 * Makes the cheaper path available on the existing web.
 */

const STORE_NAME = 'lean-html-store';
const DB_NAME = 'lean-html';
const DB_VERSION = 1;

// ---------- Simple IndexedDB content-addressed store ----------

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function storeGet(cid) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(cid);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function storePut(cid, data) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, cid);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[Lean HTML] storePut failed', err);
  }
}

// ---------- Integrity (basic) ----------

async function sha256Hex(buffer) {
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyIntegrity(bytes, integrityAttr) {
  if (!integrityAttr) return true;
  const [algo, expected] = integrityAttr.split('-');
  if (!algo || !expected) return false;

  // Currently only solid support for sha256 hex in this starter
  if (algo === 'sha256') {
    const hex = await sha256Hex(bytes);
    return hex === expected;
  }
  // Fallback: accept declaration for other algos in demo
  return true;
}

// ---------- Resource processing ----------

async function processResource(el) {
  const localFirst = el.hasAttribute('local-first');
  const cid = el.getAttribute('content-address');
  const integrity = el.getAttribute('integrity');

  if (!localFirst && !cid && !integrity) return;

  if (cid && localFirst) {
    const cached = await storeGet(cid);
    if (cached) {
      el.dataset.leanResolved = 'local';
      el.dataset.leanCid = cid;
      console.info('[Lean HTML] local hit', cid.slice(0, 16) + '…');
      // Future: actually swap the resource bytes into the element
      return;
    }
    el.dataset.leanResolved = 'network';
  }

  if (integrity) {
    el.dataset.leanIntegrity = 'declared';
  }
}

async function processContent(el) {
  if (el.hasAttribute('integrity')) {
    el.dataset.leanIntegrity = 'declared';
  }
  if (el.hasAttribute('provenance')) {
    el.dataset.leanProvenance = el.getAttribute('provenance');
  }
  if (el.hasAttribute('content-address') && el.hasAttribute('local-first')) {
    const cid = el.getAttribute('content-address');
    const cached = await storeGet(cid);
    el.dataset.leanResolved = cached ? 'local' : 'network';
  }
}

// ---------- Public API ----------

async function runLeanHTML(root = document) {
  const resources = root.querySelectorAll(
    'link[local-first], link[content-address], link[integrity],' +
    'script[local-first], script[content-address], script[integrity],' +
    'img[local-first], img[content-address], img[integrity],' +
    'source[local-first], source[content-address]'
  );

  const blocks = root.querySelectorAll(
    '[integrity], [provenance], [content-address]'
  );

  await Promise.all([...resources].map(processResource));
  await Promise.all([...blocks].map(processContent));

  if (document.documentElement.hasAttribute('lean')) {
    document.documentElement.dataset.lean = 'active';
  }

  console.info('[Lean HTML] ready – cheaper path enabled where attributes exist');
}

// Auto-run
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => runLeanHTML());
  } else {
    runLeanHTML();
  }
}

export {
  runLeanHTML,
  storeGet,
  storePut,
  verifyIntegrity,
  sha256Hex
};
