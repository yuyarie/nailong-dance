const DB_NAME = "nailong-custom-songs",
  STORE = "songs";
let _dbPromise = null;
const _remote = new Map();
function openDB() {
  if (_dbPromise) return _dbPromise;
  return _dbPromise = new Promise((_0x4fe983, _0x15956e) => {
    const _0x1e9852 = () => {
      const _0x41724d = indexedDB.open(DB_NAME, 0x1);
      _0x41724d.onupgradeneeded = () => {
        const _0x4fcc21 = _0x41724d.result;
        if (!_0x4fcc21.objectStoreNames.contains(STORE)) _0x4fcc21.createObjectStore(STORE);
      }, _0x41724d.onsuccess = () => {
        const _0x10bec7 = _0x41724d.result;
        if (!_0x10bec7.objectStoreNames.contains(STORE)) {
          _0x10bec7.close();
          const _0x4ce91a = _0x10bec7.version + 0x1,
            _0x471d16 = indexedDB.open(DB_NAME, _0x4ce91a);
          _0x471d16.onupgradeneeded = () => {
            if (!_0x471d16.result.objectStoreNames.contains(STORE)) _0x471d16.result.createObjectStore(STORE);
          }, _0x471d16.onsuccess = () => _0x4fe983(_0x471d16.result), _0x471d16.onerror = () => _0x15956e(_0x471d16.error);
        } else _0x4fe983(_0x10bec7);
      }, _0x41724d.onerror = () => _0x15956e(_0x41724d.error);
    };
    _0x1e9852();
  }), _dbPromise;
}
async function idbPut(_0x943fa7, _0x23a6b2) {
  const _0x52e5ae = await openDB();
  return new Promise((_0x202d3c, _0xea9648) => {
    const _0x1da8a7 = _0x52e5ae.transaction(STORE, "readwrite");
    _0x1da8a7.objectStore(STORE).put(_0x23a6b2, _0x943fa7), _0x1da8a7.oncomplete = () => _0x202d3c(), _0x1da8a7.onerror = () => _0xea9648(_0x1da8a7.error);
  });
}
async function idbGet(_0x2b2c83) {
  const _0x1d5579 = await openDB();
  return new Promise((_0x430fd1, _0x2e3d5d) => {
    const _0x12c18f = _0x1d5579.transaction(STORE, "readonly"),
      _0x55a329 = _0x12c18f.objectStore(STORE).get(_0x2b2c83);
    _0x55a329.onsuccess = () => _0x430fd1(_0x55a329.result || null), _0x55a329.onerror = () => _0x2e3d5d(_0x55a329.error);
  });
}
async function idbDel(_0x1de5de) {
  const _0x53b737 = await openDB();
  return new Promise((_0x4fdd53, _0x98150e) => {
    const _0x435a78 = _0x53b737.transaction(STORE, 'readwrite');
    _0x435a78.objectStore(STORE)["delete"](_0x1de5de), _0x435a78.oncomplete = () => _0x4fdd53(), _0x435a78.onerror = () => _0x98150e(_0x435a78.error);
  });
}
export const CustomStore = {
  async 'save'(_0x3ce99f, _0x405062, _0x3f33ee) {
    await idbPut(_0x3ce99f.id, {
      'v': 0x1,
      'dataUrl': _0x405062,
      'onsets': _0x3f33ee,
      'bpm': _0x3ce99f.bpm,
      'dur': _0x3ce99f.dur,
      'name': _0x3ce99f.name
    });
  },
  async 'get'(_0x167bc2) {
    if (_remote.has(_0x167bc2)) return _remote.get(_0x167bc2);
    const _0xbe5649 = await idbGet(_0x167bc2);
    return _0xbe5649 || null;
  },
  'metaList'(_0x4fbd03) {
    return _0x4fbd03.customSongs || [];
  },
  'putRemote'(_0x4345d3, _0x20ed56) {
    _remote.set(_0x4345d3, _0x20ed56);
  },
  'hasRemote'(_0x315cfe) {
    return _remote.has(_0x315cfe);
  },
  'clearRemote'() {
    _remote.clear();
  },
  async 'remove'(_0x75fdfa) {
    _remote["delete"](_0x75fdfa);
    try {
      await idbDel(_0x75fdfa);
    } catch {}
  }
};
