import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const SPLIT = {
    'HEAD_YN': 0.62,
    'LEG_YN': 0.3,
    'ARM_XN': 0.42,
    'OVERLAP': 0.08,
    'TARGET_H': 0x2,
    'YAW': 0x0
  },
  PARTS = ["head", "belly", "armL", "armR", "legL", "legR"];
function makeState() {
  return {
    'root': null,
    'body': null,
    'parts': {},
    'mats': [],
    'ready': false,
    '_tweens': [],
    '_beatPhase': 0x0,
    '_baseX': 0x0,
    '_baseY': 0x0,
    '_baseZ': 0x0,
    '_stumbleT': 0x0,
    '_missCount': 0x0,
    '_climbing': false,
    '_transformed': false,
    '_origColors': null,
    '_runPhase': 0x0,
    '_runDir': 0x0,
    '_runT': 0x0,
    '_acc': {
      'head': null,
      'body': null,
      'cape': null
    },
    '_skinFx': null
  };
}
export const Dancer = makeState();
let _cache = null;
function tw(_0xf3129, _0x57b026, _0x452302, _0x13f6c8, _0xfafbfc, _0x17a2bd = 'outQuad', _0x20ae8e = 0x0, _0x28a233 = 0x1) {
  _0xf3129._tweens.push({
    'obj': _0x57b026,
    'axis': _0x452302,
    'from': null,
    'to': _0x13f6c8 * _0x28a233,
    't0': performance.now() + _0x20ae8e,
    'dur': _0xfafbfc,
    'ease': _0x17a2bd
  });
}
const EASE = {
  'outQuad': _0x59df24 => 0x1 - (0x1 - _0x59df24) * (0x1 - _0x59df24),
  'outBack': _0x30e4d7 => {
    const _0x1560fa = 1.9;
    return _0x30e4d7--, 0x1 + _0x30e4d7 * _0x30e4d7 * ((_0x1560fa + 0x1) * _0x30e4d7 + _0x1560fa);
  },
  'outElastic': _0x2b2533 => {
    if (_0x2b2533 >= 0x1) return 0x1;
    const _0x5ecd7e = 0.42;
    return Math.pow(0x2, -0x9 * _0x2b2533) * Math.sin((_0x2b2533 - _0x5ecd7e / 0x4) * (0x2 * Math.PI) / _0x5ecd7e) + 0x1;
  },
  'inOutCubic': _0xd2b204 => _0xd2b204 < 0.5 ? 0x4 * _0xd2b204 * _0xd2b204 * _0xd2b204 : 0x1 - Math.pow(-0x2 * _0xd2b204 + 0x2, 0x3) / 0x2
};
export function loadDancer(_0x1a0f3d) {
  return new Promise((_0xcb6b4e, _0xb8439a) => {
    console.log("%c  ⏳ [加载] rigged.glb 舞者模型开始下载/解析…", "color:#c9b8e8");
    const _0x2dd37d = performance.now();
    new GLTFLoader().load(_0x1a0f3d, _0x303fce => {
      try {
        computeBuckets(_0x303fce), assemble(Dancer), console.log("%c  ✅ [加载] rigged.glb 解析+部位切分完成 (" + ((performance.now() - _0x2dd37d) / 0x3e8).toFixed(0x2) + 's)', 'color:#7fffd4'), _0xcb6b4e(Dancer);
      } catch (_0x3ac114) {
        console.error('\x20\x20❌\x20rigged.glb\x20切分失败：', _0x3ac114), _0xb8439a(_0x3ac114);
      }
    }, _0x4976c5 => {
      if (_0x4976c5.total) {
        const _0x3de8fa = Math.round(_0x4976c5.loaded / _0x4976c5.total * 0x64);
        window.dispatchEvent(new CustomEvent("dancer-progress", {
          'detail': _0x3de8fa
        }));
      }
    }, _0x1d45b1 => {
      console.error('\x20\x20❌\x20rigged.glb\x20下载失败：', _0x1d45b1), _0xb8439a(_0x1d45b1);
    });
  });
}
function computeBuckets(_0x591adf) {
  let _0x53297e = null;
  _0x591adf.scene.traverse(_0x5b2397 => {
    if (!_0x53297e && _0x5b2397.isMesh) _0x53297e = _0x5b2397;
  });
  if (!_0x53297e) throw new Error("rigged.glb 里没找到网格");
  _0x53297e.updateWorldMatrix(true, false);
  const _0x1adbcb = _0x53297e.matrixWorld,
    _0x2f8ac8 = new THREE.Matrix3().getNormalMatrix(_0x1adbcb),
    _0x4864e2 = new THREE.Box3().setFromObject(_0x591adf.scene),
    _0x2a5d0b = _0x4864e2.getSize(new THREE.Vector3()),
    _0x22ddd4 = _0x2a5d0b.y,
    _0x215a52 = _0x2a5d0b.x,
    _0x8fa62d = (_0x4864e2.min.x + _0x4864e2.max.x) / 0x2,
    _0xb9b6b6 = _0x53297e.geometry,
    _0x3b7c93 = _0xb9b6b6.attributes.position,
    _0x311541 = _0xb9b6b6.attributes.normal,
    _0x2e0224 = _0xb9b6b6.attributes.uv,
    _0x43a98b = _0xb9b6b6.index,
    _0x4449d8 = (_0x43a98b ? _0x43a98b.count : _0x3b7c93.count) / 0x3,
    _0x3c7940 = {};
  PARTS.forEach(_0x176396 => _0x3c7940[_0x176396] = []);
  const _0x5db2be = new THREE.Vector3(),
    _0x17a797 = new THREE.Vector3(),
    _0x3ea41 = new THREE.Vector3(),
    _0x3c2fe9 = new THREE.Vector3(),
    _0x98fd60 = new THREE.Vector3(),
    _0x3c1662 = new THREE.Vector3(),
    _0x3814fd = new THREE.Vector3(),
    _0x226a86 = SPLIT.OVERLAP;
  function _0x43580e(_0x330409, _0x12d3e2, _0x4726d0, _0x3d907) {
    _0x3c7940[_0x330409].push(_0x5db2be.x, _0x5db2be.y, _0x5db2be.z, _0x98fd60.x, _0x98fd60.y, _0x98fd60.z, _0x2e0224 ? _0x2e0224.getX(_0x12d3e2) : 0x0, _0x2e0224 ? _0x2e0224.getY(_0x12d3e2) : 0x0, _0x17a797.x, _0x17a797.y, _0x17a797.z, _0x3c1662.x, _0x3c1662.y, _0x3c1662.z, _0x2e0224 ? _0x2e0224.getX(_0x4726d0) : 0x0, _0x2e0224 ? _0x2e0224.getY(_0x4726d0) : 0x0, _0x3ea41.x, _0x3ea41.y, _0x3ea41.z, _0x3814fd.x, _0x3814fd.y, _0x3814fd.z, _0x2e0224 ? _0x2e0224.getX(_0x3d907) : 0x0, _0x2e0224 ? _0x2e0224.getY(_0x3d907) : 0x0);
  }
  for (let _0x531aa8 = 0x0; _0x531aa8 < _0x4449d8; _0x531aa8++) {
    const _0x3034c9 = _0x43a98b ? _0x43a98b.getX(_0x531aa8 * 0x3) : _0x531aa8 * 0x3,
      _0x2a22ea = _0x43a98b ? _0x43a98b.getX(_0x531aa8 * 0x3 + 0x1) : _0x531aa8 * 0x3 + 0x1,
      _0x5cc956 = _0x43a98b ? _0x43a98b.getX(_0x531aa8 * 0x3 + 0x2) : _0x531aa8 * 0x3 + 0x2;
    _0x5db2be.fromBufferAttribute(_0x3b7c93, _0x3034c9).applyMatrix4(_0x1adbcb), _0x17a797.fromBufferAttribute(_0x3b7c93, _0x2a22ea).applyMatrix4(_0x1adbcb), _0x3ea41.fromBufferAttribute(_0x3b7c93, _0x5cc956).applyMatrix4(_0x1adbcb), _0x3c2fe9.copy(_0x5db2be).add(_0x17a797).add(_0x3ea41).divideScalar(0x3);
    const _0x825906 = (_0x3c2fe9.y - _0x4864e2.min.y) / _0x22ddd4,
      _0x5091e0 = (_0x3c2fe9.x - _0x8fa62d) / (_0x215a52 / 0x2);
    _0x311541 && (_0x98fd60.fromBufferAttribute(_0x311541, _0x3034c9).applyMatrix3(_0x2f8ac8).normalize(), _0x3c1662.fromBufferAttribute(_0x311541, _0x2a22ea).applyMatrix3(_0x2f8ac8).normalize(), _0x3814fd.fromBufferAttribute(_0x311541, _0x5cc956).applyMatrix3(_0x2f8ac8).normalize());
    const _0x8a58e = _0x825906 > SPLIT.HEAD_YN - _0x226a86,
      _0x1f605a = _0x825906 < SPLIT.HEAD_YN + _0x226a86,
      _0x10b91c = _0x825906 < SPLIT.LEG_YN + _0x226a86,
      _0x589252 = _0x825906 > SPLIT.LEG_YN - _0x226a86,
      _0x3b11d4 = Math.abs(_0x5091e0),
      _0x3d8c2e = _0x3b11d4 > SPLIT.ARM_XN - _0x226a86,
      _0x14fe7f = _0x3b11d4 < SPLIT.ARM_XN + _0x226a86,
      _0x404630 = _0x5091e0 < 0x0 ? "legL" : 'legR',
      _0x4e6696 = _0x5091e0 < 0x0 ? "armL" : "armR";
    if (_0x8a58e) _0x43580e("head", _0x3034c9, _0x2a22ea, _0x5cc956);
    if (_0x10b91c) _0x43580e(_0x404630, _0x3034c9, _0x2a22ea, _0x5cc956);
    const _0x13e19c = _0x1f605a && _0x589252;
    if (_0x13e19c) {
      if (_0x3d8c2e) _0x43580e(_0x4e6696, _0x3034c9, _0x2a22ea, _0x5cc956);
      if (_0x14fe7f) _0x43580e('belly', _0x3034c9, _0x2a22ea, _0x5cc956);
    }
  }
  const _0xe05967 = _0x53297e.material,
    _0x29d54d = new THREE.Vector3(-_0x8fa62d, -_0x4864e2.min.y, -(_0x4864e2.min.z + _0x4864e2.max.z) / 0x2),
    _0x193e03 = {},
    _0x3515ae = {};
  for (const _0x4e00db of PARTS) {
    const _0x2ed535 = _0x3c7940[_0x4e00db];
    if (!_0x2ed535.length) continue;
    const _0x16e6ff = [],
      _0x28c422 = [],
      _0x46ca10 = [];
    for (let _0x4598a4 = 0x0; _0x4598a4 < _0x2ed535.length; _0x4598a4 += 0x8) {
      _0x16e6ff.push(_0x2ed535[_0x4598a4], _0x2ed535[_0x4598a4 + 0x1], _0x2ed535[_0x4598a4 + 0x2]), _0x28c422.push(_0x2ed535[_0x4598a4 + 0x3], _0x2ed535[_0x4598a4 + 0x4], _0x2ed535[_0x4598a4 + 0x5]), _0x46ca10.push(_0x2ed535[_0x4598a4 + 0x6], _0x2ed535[_0x4598a4 + 0x7]);
    }
    const _0x4bd83a = new THREE.BufferGeometry();
    _0x4bd83a.setAttribute("position", new THREE.Float32BufferAttribute(_0x16e6ff, 0x3)), _0x4bd83a.setAttribute("normal", new THREE.Float32BufferAttribute(_0x28c422, 0x3)), _0x4bd83a.setAttribute('uv', new THREE.Float32BufferAttribute(_0x46ca10, 0x2)), _0x4bd83a.computeBoundingBox(), _0x4bd83a.computeBoundingSphere(), _0x193e03[_0x4e00db] = _0x4bd83a;
    const _0x100539 = _0x4bd83a.boundingBox;
    let _0x33785f;
    switch (_0x4e00db) {
      case "head":
        _0x33785f = new THREE.Vector3((_0x100539.min.x + _0x100539.max.x) / 0x2, _0x100539.min.y, (_0x100539.min.z + _0x100539.max.z) / 0x2);
        break;
      case "armL":
        _0x33785f = new THREE.Vector3(_0x100539.max.x * 0.82, _0x100539.max.y * 0.92, (_0x100539.min.z + _0x100539.max.z) / 0x2);
        break;
      case "armR":
        _0x33785f = new THREE.Vector3(_0x100539.min.x * 0.82, _0x100539.max.y * 0.92, (_0x100539.min.z + _0x100539.max.z) / 0x2);
        break;
      case "legL":
        _0x33785f = new THREE.Vector3((_0x100539.min.x + _0x100539.max.x) / 0x2, _0x100539.max.y, (_0x100539.min.z + _0x100539.max.z) / 0x2);
        break;
      case "legR":
        _0x33785f = new THREE.Vector3((_0x100539.min.x + _0x100539.max.x) / 0x2, _0x100539.max.y, (_0x100539.min.z + _0x100539.max.z) / 0x2);
        break;
      default:
        _0x33785f = new THREE.Vector3(0x0, _0x100539.min.y, (_0x100539.min.z + _0x100539.max.z) / 0x2);
        break;
    }
    _0x33785f.sub(_0x29d54d), _0x3515ae[_0x4e00db] = _0x33785f;
  }
  const _0x4fd786 = SPLIT.TARGET_H / _0x4864e2.getSize(new THREE.Vector3()).y;
  _0x591adf.scene.traverse(_0x3baf43 => {
    _0x3baf43.isMesh && _0x3baf43.geometry.dispose();
  }), _cache = {
    'geos': _0x193e03,
    'pivots': _0x3515ae,
    'srcMat': _0xe05967,
    'bodyPos': _0x29d54d,
    'scale': _0x4fd786
  };
  const _0x39694 = PARTS.map(_0x490a2c => _0x490a2c + '=' + (_0x3c7940[_0x490a2c].length / 0x18 | 0x0)).join('\x20');
  console.log("%c[奶娃切分] 完成：" + _0x39694, 'color:#ffe17a');
}
function assemble(_0x40c0e3) {
  const _0x56c344 = new THREE.Group(),
    _0x5e1895 = new THREE.Group();
  _0x56c344.add(_0x5e1895), _0x5e1895.position.copy(_cache.bodyPos);
  if (SPLIT.YAW) _0x5e1895.rotation.y = SPLIT.YAW;
  const _0x1287bc = {},
    _0x3a84d3 = [];
  for (const _0x9a5669 of PARTS) {
    const _0x558eb8 = _cache.geos[_0x9a5669];
    if (!_0x558eb8) continue;
    const _0x56446f = _cache.srcMat.clone();
    _0x3a84d3.push(_0x56446f);
    const _0x20fdea = new THREE.Mesh(_0x558eb8, _0x56446f);
    _0x20fdea.castShadow = true, _0x20fdea.frustumCulled = false;
    const _0x55fcb6 = _cache.pivots[_0x9a5669],
      _0x3efe91 = new THREE.Group();
    _0x3efe91.position.copy(_0x55fcb6), _0x20fdea.position.copy(_0x55fcb6).negate(), _0x3efe91.add(_0x20fdea), _0x5e1895.add(_0x3efe91), _0x1287bc[_0x9a5669] = {
      'pivot': _0x3efe91,
      'mesh': _0x20fdea,
      'mat': _0x56446f,
      'base': {
        'x': _0x3efe91.rotation.x,
        'y': _0x3efe91.rotation.y,
        'z': _0x3efe91.rotation.z
      },
      'pose': {
        'x': 0x0,
        'y': 0x0,
        'z': 0x0
      },
      'idle': {
        'x': 0x0,
        'y': 0x0,
        'z': 0x0
      }
    };
  }
  return _0x56c344.scale.setScalar(_cache.scale), _0x40c0e3.root = _0x56c344, _0x40c0e3.body = _0x5e1895, _0x40c0e3.parts = _0x1287bc, _0x40c0e3.mats = _0x3a84d3, _0x40c0e3.ready = true, _0x40c0e3._baseX = _0x5e1895.position.x, _0x40c0e3._baseY = _0x5e1895.position.y, _0x40c0e3._baseZ = _0x5e1895.position.z, _0x40c0e3;
}
export function createPeerDancer() {
  if (!_cache) return null;
  return assemble(makeState());
}
export function _doAction(_0x4ad93d, _0x467eec, _0xaf2b43 = "good") {
  const _0x435a28 = _0xaf2b43 === 'perfect' ? 1.28 : 0x1,
    _0x1c3f85 = _0x4ad93d.parts;
  if (!_0x1c3f85.armL) return;
  if (_0x467eec === 0x0) tw(_0x4ad93d, _0x1c3f85.armL.pose, 'z', -2.6, 0x82, "outQuad", 0x0, _0x435a28), tw(_0x4ad93d, _0x1c3f85.armL.pose, 'z', 0x0, 0x208, "outElastic", 0x8c), tw(_0x4ad93d, _0x1c3f85.armL.pose, 'x', -0.7, 0x82, "outQuad", 0x0, _0x435a28), tw(_0x4ad93d, _0x1c3f85.armL.pose, 'x', 0x0, 0x1e0, 'outElastic', 0x96), tw(_0x4ad93d, _0x4ad93d.body.rotation, 'z', -0.16, 0x82, "outQuad", 0x0, _0x435a28), tw(_0x4ad93d, _0x4ad93d.body.rotation, 'z', 0x0, 0x1e0, "outElastic", 0x96), _0x1c3f85.head && (tw(_0x4ad93d, _0x1c3f85.head.pose, 'z', -0.3, 0x96, "outQuad", 0x0, _0x435a28), tw(_0x4ad93d, _0x1c3f85.head.pose, 'z', 0x0, 0x1a4, "outElastic", 0xaa));else {
    if (_0x467eec === 0x1) _0x1c3f85.legL && (tw(_0x4ad93d, _0x1c3f85.legL.pose, 'x', -1.5, 0x78, 'outQuad', 0x0, _0x435a28), tw(_0x4ad93d, _0x1c3f85.legL.pose, 'x', 0x0, 0x1cc, "outElastic", 0x82)), _0x1c3f85.legR && (tw(_0x4ad93d, _0x1c3f85.legR.pose, 'x', 1.1, 0x8c, "outQuad", 0x3c, _0x435a28), tw(_0x4ad93d, _0x1c3f85.legR.pose, 'x', 0x0, 0x1cc, "outElastic", 0xd2)), tw(_0x4ad93d, _0x4ad93d.body.position, 'y', -0.14, 0x82, "outQuad", 0x0, _0x435a28), tw(_0x4ad93d, _0x4ad93d.body.position, 'y', 0x0, 0x1ae, "outElastic", 0x8c);else {
      if (_0x467eec === 0x2) tw(_0x4ad93d, _0x1c3f85.belly.pose, 'y', 0.62, 0x8c, "outQuad", 0x0, _0x435a28), tw(_0x4ad93d, _0x1c3f85.belly.pose, 'y', -0.42, 0xf0, "inOutCubic", 0x96), tw(_0x4ad93d, _0x1c3f85.belly.pose, 'y', 0x0, 0x1a4, "outElastic", 0x190), _0x1c3f85.head && (tw(_0x4ad93d, _0x1c3f85.head.pose, 'x', -0.62, 0x96, "outBack", 0x0, _0x435a28), tw(_0x4ad93d, _0x1c3f85.head.pose, 'x', 0x0, 0x208, "outElastic", 0xb4)), tw(_0x4ad93d, _0x4ad93d.body.scale, 'x', 0.9, 0x82, "outQuad", 0x0, _0x435a28), tw(_0x4ad93d, _0x4ad93d.body.scale, 'x', 0x1, 0x1b8, "outElastic", 0x8c);else {
        if (_0x467eec === 0x3) {
          const _0x13cbbb = _0x4ad93d.body;
          tw(_0x4ad93d, _0x13cbbb.rotation, 'y', Math.PI * 0x2, 0x1a4, 'inOutCubic', 0x0, _0x435a28), setTimeout(() => {
            if (_0x4ad93d.body === _0x13cbbb) _0x13cbbb.rotation.y = 0x0;
          }, 0x1cc), tw(_0x4ad93d, _0x13cbbb.scale, 'x', 0.82, 0x96, "outQuad", 0x0, _0x435a28), tw(_0x4ad93d, _0x13cbbb.scale, 'x', 0x1, 0x1cc, "outElastic", 0xa0), _0x1c3f85.armR && (tw(_0x4ad93d, _0x1c3f85.armR.pose, 'z', 2.6, 0x8c, "outQuad", 0x0, _0x435a28), tw(_0x4ad93d, _0x1c3f85.armR.pose, 'z', 0x0, 0x1f4, 'outElastic', 0x96));
        }
      }
    }
  }
}
export function _stumble(_0x37bf8e) {
  const _0x555718 = performance.now();
  if (_0x555718 - _0x37bf8e._stumbleT < 0x140) return;
  _0x37bf8e._stumbleT = _0x555718;
  const _0x1f80b5 = _0x37bf8e.body;
  if (!_0x1f80b5) return;
  tw(_0x37bf8e, _0x1f80b5.rotation, 'z', 0.3, 0x5a, "outQuad"), tw(_0x37bf8e, _0x1f80b5.rotation, 'z', -0.22, 0xb4, "inOutCubic", 0x64), tw(_0x37bf8e, _0x1f80b5.rotation, 'z', 0x0, 0x140, "outElastic", 0x122);
  const _0x5e12d4 = _0x37bf8e.parts;
  _0x5e12d4.head && (tw(_0x37bf8e, _0x5e12d4.head.pose, 'z', 0.4, 0x78, 'outQuad'), tw(_0x37bf8e, _0x5e12d4.head.pose, 'z', 0x0, 0x190, 'outElastic', 0x8c));
  _0x37bf8e.mats.forEach(_0x41eb05 => {
    _0x41eb05.emissive = _0x41eb05.emissive || new THREE.Color(0x0, 0x0, 0x0), _0x41eb05.emissive.setHex(0xff2244), _0x41eb05.emissiveIntensity = 0.85;
  });
  const _0x5c117e = _0x37bf8e.mats;
  setTimeout(() => {
    _0x5c117e.forEach(_0x14b9af => {
      if (_0x14b9af.emissive) _0x14b9af.emissiveIntensity = 0x0;
    });
  }, 0xdc);
}
export function _celebrate(_0x4fdb8f) {
  const _0x537b11 = _0x4fdb8f.parts,
    _0x163b1c = _0x4fdb8f.body;
  if (!_0x163b1c) return;
  for (let _0x176da8 = 0x0; _0x176da8 < 0x3; _0x176da8++) {
    tw(_0x4fdb8f, _0x163b1c.position, 'y', 0.55, 0xb4, "outQuad", _0x176da8 * 0x1a4), tw(_0x4fdb8f, _0x163b1c.position, 'y', 0x0, 0xf0, "outQuad", _0x176da8 * 0x1a4 + 0xbe);
  }
  tw(_0x4fdb8f, _0x163b1c.rotation, 'y', Math.PI * 0x2, 0x2bc, 'inOutCubic', 0xc8), setTimeout(() => {
    if (_0x4fdb8f.body === _0x163b1c) _0x163b1c.rotation.y = 0x0;
  }, 0x3b6), _0x537b11.armL && (tw(_0x4fdb8f, _0x537b11.armL.pose, 'z', -2.8, 0xc8, "outBack"), tw(_0x4fdb8f, _0x537b11.armL.pose, 'z', 0x0, 0x258, "outElastic", 0x320)), _0x537b11.armR && (tw(_0x4fdb8f, _0x537b11.armR.pose, 'z', 2.8, 0xc8, "outBack"), tw(_0x4fdb8f, _0x537b11.armR.pose, 'z', 0x0, 0x258, "outElastic", 0x320));
}
export function _lieDown(_0x2dab5a) {
  const _0x4fafd4 = _0x2dab5a.body;
  if (!_0x4fafd4) return;
  const _0x31fc0f = _0x2dab5a.parts;
  tw(_0x2dab5a, _0x4fafd4.rotation, 'x', -Math.PI * 0.46, 0x208, "outQuad"), tw(_0x2dab5a, _0x4fafd4.position, 'y', (_0x2dab5a._baseY || 0x0) - 0.35, 0x208, "outQuad"), _0x31fc0f.armL && tw(_0x2dab5a, _0x31fc0f.armL.pose, 'z', -0.55, 0x1a4, "outQuad"), _0x31fc0f.armR && tw(_0x2dab5a, _0x31fc0f.armR.pose, 'z', 0.55, 0x1a4, "outQuad"), _0x31fc0f.legL && tw(_0x2dab5a, _0x31fc0f.legL.pose, 'x', 0.35, 0x1a4, "outQuad"), _0x31fc0f.legR && tw(_0x2dab5a, _0x31fc0f.legR.pose, 'x', 0.35, 0x1a4, "outQuad"), _0x31fc0f.head && tw(_0x2dab5a, _0x31fc0f.head.pose, 'x', -0.5, 0x1a4, "outQuad");
}
export function _resetBody(_0xc1e440) {
  const _0x5a5381 = _0xc1e440.body;
  if (!_0x5a5381) return;
  _0xc1e440._tweens.length = 0x0, _0xc1e440._climbing = false, _0xc1e440._missCount = 0x0, _0x5a5381.rotation.set(0x0, 0x0, 0x0), _0x5a5381.position.x = _0xc1e440._baseX || 0x0, _0x5a5381.position.y = _0xc1e440._baseY || 0x0, _0x5a5381.position.z = _0xc1e440._baseZ || 0x0, _0x5a5381.scale.set(0x1, 0x1, 0x1);
  for (const _0x17e02c in _0xc1e440.parts) {
    const _0x4272a7 = _0xc1e440.parts[_0x17e02c];
    _0x4272a7.pose.x = 0x0, _0x4272a7.pose.y = 0x0, _0x4272a7.pose.z = 0x0;
  }
}
export function _updateDancer(_0x163c27, _0x5491f6, _0x35d475, _0x40d576) {
  if (!_0x163c27.ready) return;
  const _0x187bd9 = performance.now();
  for (let _0x554d3f = _0x163c27._tweens.length - 0x1; _0x554d3f >= 0x0; _0x554d3f--) {
    const _0x4c3e40 = _0x163c27._tweens[_0x554d3f];
    if (_0x187bd9 < _0x4c3e40.t0) continue;
    if (_0x4c3e40.from === null) _0x4c3e40.from = _0x4c3e40.obj[_0x4c3e40.axis];
    let _0x5ae9d0 = (_0x187bd9 - _0x4c3e40.t0) / _0x4c3e40.dur;
    if (_0x5ae9d0 >= 0x1) {
      _0x4c3e40.obj[_0x4c3e40.axis] = _0x4c3e40.to, _0x163c27._tweens.splice(_0x554d3f, 0x1);
      continue;
    }
    _0x4c3e40.obj[_0x4c3e40.axis] = _0x4c3e40.from + (_0x4c3e40.to - _0x4c3e40.from) * EASE[_0x4c3e40.ease](_0x5ae9d0);
  }
  const _0x212593 = (_0x40d576 ? _0x35d475 : 0x64) / 0x3c;
  _0x163c27._beatPhase += _0x5491f6 * _0x212593 * Math.PI;
  const _0x42aaff = Math.sin(_0x163c27._beatPhase),
    _0x274a85 = Math.cos(_0x163c27._beatPhase * 0.5),
    _0x2c809c = Math.sin(_0x163c27._beatPhase * 0x2),
    _0x873a = _0x163c27.body,
    _0x21cad1 = _0x163c27.parts;
  if (_0x40d576) {
    const _0x2fa59d = 0x1;
    !_0x163c27._tweens.some(_0x498a1c => _0x498a1c.obj === _0x873a.position && _0x498a1c.axis === 'y') && (_0x873a.position.y = Math.abs(_0x42aaff) * 0.12 * _0x2fa59d);
    !_0x163c27._tweens.some(_0x148108 => _0x148108.obj === _0x873a.position && _0x148108.axis === 'x') && (_0x873a.position.x = (_0x163c27._baseX || 0x0) + Math.sin(_0x163c27._beatPhase * 0.5) * 0.8);
    !_0x163c27._tweens.some(_0x29a203 => _0x29a203.obj === _0x873a.scale) && (_0x873a.scale.x = 0x1 + _0x42aaff * 0.04 * _0x2fa59d, _0x873a.scale.y = 0x1 - _0x42aaff * 0.04 * _0x2fa59d);
    !_0x163c27._tweens.some(_0x2ffc6c => _0x2ffc6c.obj === _0x873a.rotation) && (_0x873a.rotation.z = _0x42aaff * 0.12 * _0x2fa59d, _0x873a.rotation.y = _0x274a85 * 0.15 * _0x2fa59d);
    _0x21cad1.armL && (_0x21cad1.armL.idle.x = _0x42aaff * 0.9 * _0x2fa59d, _0x21cad1.armL.idle.z = _0x2c809c * 0.4 * _0x2fa59d);
    _0x21cad1.armR && (_0x21cad1.armR.idle.x = -_0x42aaff * 0.9 * _0x2fa59d, _0x21cad1.armR.idle.z = -_0x2c809c * 0.4 * _0x2fa59d);
    _0x21cad1.belly && (_0x21cad1.belly.idle.y = _0x42aaff * 0.35 * _0x2fa59d, _0x21cad1.belly.idle.z = _0x274a85 * 0.12 * _0x2fa59d);
    _0x21cad1.legL && (_0x21cad1.legL.idle.x = Math.max(0x0, _0x42aaff) * 0.7 * _0x2fa59d, _0x21cad1.legL.idle.z = _0x2c809c * 0.2 * _0x2fa59d);
    _0x21cad1.legR && (_0x21cad1.legR.idle.x = Math.max(0x0, -_0x42aaff) * 0.7 * _0x2fa59d, _0x21cad1.legR.idle.z = -_0x2c809c * 0.2 * _0x2fa59d);
    _0x21cad1.head && (_0x21cad1.head.idle.x = _0x274a85 * 0.25 * _0x2fa59d, _0x21cad1.head.idle.z = _0x42aaff * 0.15 * _0x2fa59d);
    _0x163c27._runT += _0x5491f6;
    _0x163c27._runT > 0x2 + Math.sin(_0x163c27._runPhase) * 1.5 && (_0x163c27._runT = 0x0, _0x163c27._runDir = (_0x163c27._runDir + 0x1 + (Math.random() * 0x2 | 0x0)) % 0x4, _0x163c27._runPhase += 0.7);
    const _0x24438a = 1.6,
      _0x377cb1 = 2.2;
    if (!_0x163c27._tweens.some(_0x7068a7 => _0x7068a7.obj === _0x873a.position && (_0x7068a7.axis === 'x' || _0x7068a7.axis === 'z'))) {
      const _0x5a8837 = _0x163c27._beatPhase * 0.5;
      switch (_0x163c27._runDir) {
        case 0x0:
          _0x873a.position.z = -Math.abs(Math.sin(_0x5a8837)) * _0x24438a * 0.6, _0x873a.position.x = Math.sin(_0x5a8837 * 0.7) * _0x24438a * 0.4;
          break;
        case 0x1:
          _0x873a.position.x = Math.abs(Math.sin(_0x5a8837)) * _0x24438a, _0x873a.position.z = Math.sin(_0x5a8837 * 0.5) * _0x24438a * 0.3;
          break;
        case 0x2:
          _0x873a.position.z = Math.abs(Math.sin(_0x5a8837)) * _0x24438a * 0.5, _0x873a.position.x = -Math.sin(_0x5a8837 * 0.7) * _0x24438a * 0.4;
          break;
        case 0x3:
          _0x873a.position.x = -Math.abs(Math.sin(_0x5a8837)) * _0x24438a, _0x873a.position.z = -Math.sin(_0x5a8837 * 0.5) * _0x24438a * 0.3;
          break;
      }
    }
    if (_0x163c27._climbing) {
      const _0x13624a = performance.now() * 0.0008;
      _0x873a.position.x = _0x163c27._baseX || 0x0, _0x873a.position.y = (_0x163c27._baseY || 0x0) + 0.7, _0x873a.rotation.x = -0.3;
      if (_0x21cad1.armL) _0x21cad1.armL.idle.x = Math.sin(_0x13624a * 1.2) * 0.5;
      if (_0x21cad1.armR) _0x21cad1.armR.idle.x = -Math.sin(_0x13624a * 1.2) * 0.5;
      if (_0x21cad1.legL) _0x21cad1.legL.idle.x = Math.cos(_0x13624a * 0x1) * 0.3;
      if (_0x21cad1.legR) _0x21cad1.legR.idle.x = -Math.cos(_0x13624a * 0x1) * 0.3;
      if (_0x21cad1.head) _0x21cad1.head.idle.x = -0.3;
    }
  } else {
    const _0x1227a3 = 0.55;
    !_0x163c27._tweens.some(_0x5f4327 => _0x5f4327.obj === _0x873a.position && _0x5f4327.axis === 'y') && (_0x873a.position.y = Math.abs(_0x42aaff) * 0.05 * _0x1227a3);
    !_0x163c27._tweens.some(_0x20cf46 => _0x20cf46.obj === _0x873a.position && _0x20cf46.axis === 'x') && (_0x873a.position.x = _0x163c27._baseX || 0x0);
    !_0x163c27._tweens.some(_0x4a1bb5 => _0x4a1bb5.obj === _0x873a.position && _0x4a1bb5.axis === 'z') && (_0x873a.position.z = _0x163c27._baseZ || 0x0);
    !_0x163c27._tweens.some(_0x154448 => _0x154448.obj === _0x873a.scale) && (_0x873a.scale.x = 0x1 + _0x42aaff * 0.015 * _0x1227a3, _0x873a.scale.y = 0x1 - _0x42aaff * 0.015 * _0x1227a3);
    !_0x163c27._tweens.some(_0x3062e7 => _0x3062e7.obj === _0x873a.rotation) && (_0x873a.rotation.z = _0x42aaff * 0.04 * _0x1227a3, _0x873a.rotation.y = _0x274a85 * 0.06 * _0x1227a3, _0x873a.rotation.x = 0x0);
    _0x21cad1.head && (_0x21cad1.head.idle.z = _0x42aaff * 0.03 * _0x1227a3, _0x21cad1.head.idle.x = _0x274a85 * 0.02 * _0x1227a3);
    if (_0x21cad1.armL) _0x21cad1.armL.idle.x = _0x42aaff * 0.08 * _0x1227a3;
    if (_0x21cad1.armR) _0x21cad1.armR.idle.x = -_0x42aaff * 0.08 * _0x1227a3;
    _0x21cad1.belly && (_0x21cad1.belly.idle.y = 0x0, _0x21cad1.belly.idle.x = 0x0, _0x21cad1.belly.idle.z = 0x0), _0x21cad1.legL && (_0x21cad1.legL.idle.x = 0x0, _0x21cad1.legL.idle.y = 0x0, _0x21cad1.legL.idle.z = 0x0), _0x21cad1.legR && (_0x21cad1.legR.idle.x = 0x0, _0x21cad1.legR.idle.y = 0x0, _0x21cad1.legR.idle.z = 0x0);
  }
  for (const _0x494501 in _0x21cad1) {
    const _0xc09991 = _0x21cad1[_0x494501];
    _0xc09991.pivot.rotation.set(_0xc09991.base.x + _0xc09991.pose.x + _0xc09991.idle.x, _0xc09991.base.y + _0xc09991.pose.y + _0xc09991.idle.y, _0xc09991.base.z + _0xc09991.pose.z + _0xc09991.idle.z);
  }
}
export function _setSkin(_0x268c3b, _0x4883d7) {
  if (!_0x268c3b.ready) return;
  _0x268c3b.mats.forEach(_0x18a2ac => {
    _0x18a2ac.color.setHex(0xffffff);
  });
  for (const _0x32ab42 in _0x4883d7.colors) {
    const _0x784b6f = _0x268c3b.parts[_0x32ab42];
    if (_0x784b6f) _0x784b6f.mat.color.setHex(_0x4883d7.colors[_0x32ab42]);
  }
  _0x4883d7.glow ? _0x268c3b.mats.forEach(_0x56fa18 => {
    _0x56fa18.emissive = _0x56fa18.emissive || new THREE.Color(), _0x56fa18.emissive.setHex(_0x4883d7.glow), _0x56fa18.emissiveIntensity = 0.22;
  }) : _0x268c3b.mats.forEach(_0x362dac => {
    if (_0x362dac.emissive) _0x362dac.emissiveIntensity = 0x0;
  });
  _0x268c3b._skinFx && (_0x268c3b.body.remove(_0x268c3b._skinFx), _0x268c3b._skinFx.traverse(_0x55afdf => {
    _0x55afdf.isMesh && (_0x55afdf.geometry.dispose(), _0x55afdf.material.dispose());
  }), _0x268c3b._skinFx = null);
  if (_0x4883d7.fx) {
    const _0x276777 = createSkinFx(_0x4883d7.fx);
    _0x276777 && (_0x268c3b.body.add(_0x276777), _0x268c3b._skinFx = _0x276777);
  }
}
function fxMat(_0x51920a, _0x3f8121) {
  return new THREE.MeshStandardMaterial({
    'color': _0x51920a,
    'roughness': 0.55,
    ...(_0x3f8121 ? {
      'emissive': _0x3f8121,
      'emissiveIntensity': 0.9
    } : {})
  });
}
function fxMesh(_0x8802a2, _0x16bd02, _0x164c23) {
  const _0x59d9ce = new THREE.Mesh(_0x8802a2, fxMat(_0x16bd02, _0x164c23));
  return _0x59d9ce.castShadow = true, _0x59d9ce.frustumCulled = false, _0x59d9ce;
}
export function createSkinFx(_0x497157) {
  const _0x16f7bd = new THREE.Group();
  _0x16f7bd.name = 'skinFx';
  const _0x33d052 = (_0x165df1 = 1.1, _0x148d5b = 0x7a4a22, _0x2f2610 = 0x3fa34d) => {
    const _0x3fea9a = fxMesh(new THREE.CylinderGeometry(0.028, 0.04, 0.12, 0x8), _0x148d5b);
    _0x3fea9a.position.set(0x0, _0x165df1 + 0.05, 0x0);
    const _0xee099f = fxMesh(new THREE.SphereGeometry(0.09, 0xa, 0x8), _0x2f2610);
    _0xee099f.scale.set(1.5, 0.35, 0.7), _0xee099f.position.set(0.1, _0x165df1 + 0.04, 0x0), _0xee099f.rotation.z = -0.55, _0x16f7bd.add(_0x3fea9a, _0xee099f);
  };
  switch (_0x497157) {
    case "watermelon":
      {
        const _0x5381e4 = fxMat(0x227a30);
        for (let _0x4625e7 = 0x0; _0x4625e7 < 0x8; _0x4625e7++) {
          const _0x2b431f = _0x4625e7 / 0x8 * Math.PI * 0x2,
            _0x3a69d9 = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.62, 0.035), _0x5381e4);
          _0x3a69d9.castShadow = true, _0x3a69d9.frustumCulled = false, _0x3a69d9.position.set(Math.sin(_0x2b431f) * 0.29, 0.62, Math.cos(_0x2b431f) * 0.205), _0x3a69d9.rotation.y = _0x2b431f, _0x16f7bd.add(_0x3a69d9);
        }
        _0x33d052(1.07);
        break;
      }
    case "peach":
      {
        [-0x1, 0x1].forEach(_0x5c9230 => {
          const _0x5967f3 = fxMesh(new THREE.SphereGeometry(0.08, 0xc, 0xa), 0xff6f8f);
          _0x5967f3.scale.set(0x1, 0.85, 0.3), _0x5967f3.position.set(_0x5c9230 * 0.17, 0.85, 0.2), _0x16f7bd.add(_0x5967f3);
        });
        const _0x1431ed = fxMesh(new THREE.CylinderGeometry(0.024, 0.036, 0.1, 0x8), 0x7a4a22);
        _0x1431ed.position.set(0x0, 1.11, 0x0), _0x16f7bd.add(_0x1431ed), [-0x1, 0x1].forEach(_0x410aad => {
          const _0xa9c43c = fxMesh(new THREE.SphereGeometry(0.09, 0xa, 0x8), 0x59b34f);
          _0xa9c43c.scale.set(1.6, 0.32, 0.7), _0xa9c43c.position.set(_0x410aad * 0.1, 1.1, 0x0), _0xa9c43c.rotation.z = _0x410aad * 0.7, _0x16f7bd.add(_0xa9c43c);
        });
        break;
      }
    case "pineapple":
      {
        const _0xc0c33b = fxMat(0x9a6f22);
        for (let _0x12b510 = 0x0; _0x12b510 < 0x4; _0x12b510++) {
          for (let _0x5157ed = 0x0; _0x5157ed < 0x3; _0x5157ed++) {
            const _0xc11c93 = -0.12 + _0x5157ed * 0.12 + _0x12b510 % 0x2 * 0.06,
              _0x5aefe2 = 0.38 + _0x12b510 * 0.11;
            [0.8, -0.8].forEach(_0x199506 => {
              const _0x5b8c5b = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.024, 0.025), _0xc0c33b);
              _0x5b8c5b.castShadow = true, _0x5b8c5b.frustumCulled = false, _0x5b8c5b.position.set(_0xc11c93, _0x5aefe2, 0.225), _0x5b8c5b.rotation.z = _0x199506, _0x16f7bd.add(_0x5b8c5b);
            });
          }
        }
        for (let _0x1fb6f9 = 0x0; _0x1fb6f9 < 0x8; _0x1fb6f9++) {
          const _0x235133 = _0x1fb6f9 / 0x8 * Math.PI * 0x2,
            _0x5d54ae = fxMesh(new THREE.ConeGeometry(0.04, 0.3, 0x6), 0x3fa34d);
          _0x5d54ae.position.set(Math.sin(_0x235133) * 0.06, 1.16, Math.cos(_0x235133) * 0.06), _0x5d54ae.rotation.set(Math.cos(_0x235133) * 0.5, 0x0, -Math.sin(_0x235133) * 0.5), _0x16f7bd.add(_0x5d54ae);
        }
        break;
      }
    case 'strawberry':
      {
        const _0x2b0502 = new THREE.SphereGeometry(0.022, 0x8, 0x6),
          _0x44de75 = fxMat(0xfff2c0),
          _0x5141ba = [[0x0, 0.34, 0.22], [-0.11, 0.4, 0.2], [0.11, 0.4, 0.2], [-0.18, 0.52, 0.16], [0.18, 0.52, 0.16], [-0.06, 0.58, 0.22], [0.07, 0.63, 0.22], [-0.15, 0.68, 0.19], [0.15, 0.72, 0.19], [0x0, 0.78, 0.21], [-0.1, 0.86, 0.2], [0.1, 0.9, 0.2], [-0.14, 0.98, 0.17], [0.14, 0x1, 0.17], [0x0, 0.99, 0.21]];
        _0x5141ba.forEach(_0xe2aa97 => {
          const _0xc7e078 = new THREE.Mesh(_0x2b0502, _0x44de75);
          _0xc7e078.castShadow = true, _0xc7e078.frustumCulled = false, _0xc7e078.position.set(_0xe2aa97[0x0], _0xe2aa97[0x1], _0xe2aa97[0x2]), _0x16f7bd.add(_0xc7e078);
        });
        for (let _0x3e5772 = 0x0; _0x3e5772 < 0x6; _0x3e5772++) {
          const _0x44bd5c = _0x3e5772 / 0x6 * Math.PI * 0x2,
            _0x587711 = fxMesh(new THREE.ConeGeometry(0.05, 0.17, 0x5), 0x3d9a4b);
          _0x587711.position.set(Math.sin(_0x44bd5c) * 0.1, 1.08, Math.cos(_0x44bd5c) * 0.08), _0x587711.rotation.set(Math.cos(_0x44bd5c) * 1.15, 0x0, -Math.sin(_0x44bd5c) * 1.15), _0x16f7bd.add(_0x587711);
        }
        break;
      }
    case "dragonfruit":
      {
        const _0x8bc573 = [[0x0, 0.38, 0.22], [-0.12, 0.46, 0.2], [0.12, 0.48, 0.2], [-0.18, 0.6, 0.16], [0.18, 0.62, 0.16], [-0.05, 0.68, 0.22], [0.08, 0.74, 0.22], [-0.15, 0.8, 0.19], [0.15, 0.85, 0.19], [0x0, 0.9, 0.21], [-0.12, 0.96, 0.18], [0.12, 0x1, 0.18]];
        _0x8bc573.forEach((_0x4797f3, _0xef06de) => {
          const _0x21050e = fxMesh(new THREE.ConeGeometry(0.042, 0.13, 0x5), 0x2f9e47);
          _0x21050e.position.set(_0x4797f3[0x0], _0x4797f3[0x1], _0x4797f3[0x2]), _0x21050e.rotation.x = 2.5 + (_0xef06de % 0x3 - 0x1) * 0.2, _0x21050e.rotation.z = (_0xef06de % 0x5 - 0x2) * 0.25, _0x16f7bd.add(_0x21050e);
        });
        for (let _0x8aabb8 = 0x0; _0x8aabb8 < 0x5; _0x8aabb8++) {
          const _0x16faa1 = _0x8aabb8 / 0x5 * Math.PI * 0x2,
            _0x38e7cb = fxMesh(new THREE.ConeGeometry(0.04, 0.24, 0x6), 0x2f9e47);
          _0x38e7cb.position.set(Math.sin(_0x16faa1) * 0.05, 1.13, Math.cos(_0x16faa1) * 0.05), _0x38e7cb.rotation.set(Math.cos(_0x16faa1) * 0.7, 0x0, -Math.sin(_0x16faa1) * 0.7), _0x16f7bd.add(_0x38e7cb);
        }
        break;
      }
    case "lava":
      {
        [[0x0, 0.4, 0.21, 0.05], [-0.12, 0.52, 0.19, 0.04], [0.13, 0.6, 0.2, 0.06], [-0.04, 0.72, 0.22, 0.045], [0.09, 0.82, 0.2, 0.035], [0x0, 0.95, 0.2, 0.04]].forEach(_0x70eca4 => {
          const _0x4ef6ce = fxMesh(new THREE.SphereGeometry(_0x70eca4[0x3], 0xa, 0x8), 0xff6a2a, 0xff4a10);
          _0x4ef6ce.scale.set(0x1, 0x1, 0.5), _0x4ef6ce.position.set(_0x70eca4[0x0], _0x70eca4[0x1], _0x70eca4[0x2]), _0x16f7bd.add(_0x4ef6ce);
        }), [0xffd24a, 0xff7a1e, 0xff4a10].forEach((_0x670490, _0x3ff703) => {
          const _0x28f99d = fxMesh(new THREE.ConeGeometry(0.05 - _0x3ff703 * 0.01, 0.18 - _0x3ff703 * 0.02, 0x8), _0x670490, _0x670490);
          _0x28f99d.position.set((_0x3ff703 - 0x1) * 0.05, 1.12 + _0x3ff703 * 0.04, 0.01 - _0x3ff703 * 0.015), _0x16f7bd.add(_0x28f99d);
        });
        break;
      }
    case "snowman":
      {
        const _0x234114 = fxMesh(new THREE.TorusGeometry(0.26, 0.06, 0xa, 0x18), 0xe84040);
        _0x234114.rotation.x = Math.PI / 0x2, _0x234114.position.set(0x0, 0.72, 0x0);
        const _0x167d83 = fxMesh(new THREE.BoxGeometry(0.08, 0.2, 0.05), 0xe84040);
        _0x167d83.position.set(0.21, 0.62, 0.15), _0x16f7bd.add(_0x234114, _0x167d83);
        const _0x3b9cbf = fxMesh(new THREE.ConeGeometry(0.04, 0.17, 0xa), 0xff8c1a);
        _0x3b9cbf.rotation.x = Math.PI / 0x2, _0x3b9cbf.position.set(0x0, 0.88, 0.27), _0x16f7bd.add(_0x3b9cbf);
        const _0x222657 = fxMesh(new THREE.CylinderGeometry(0.15, 0.15, 0.03, 0x10), 0x222228);
        _0x222657.position.set(0x0, 1.07, 0x0);
        const _0x2a43b4 = fxMesh(new THREE.CylinderGeometry(0.11, 0.11, 0.16, 0x10), 0x222228);
        _0x2a43b4.position.set(0x0, 1.16, 0x0), _0x16f7bd.add(_0x222657, _0x2a43b4), [0.42, 0.56, 0.7].forEach(_0x36da6c => {
          const _0x40494b = fxMesh(new THREE.SphereGeometry(0.036, 0xa, 0x8), 0x222228);
          _0x40494b.position.set(0x0, _0x36da6c, 0.225), _0x16f7bd.add(_0x40494b);
        });
        break;
      }
    case "tiger":
      {
        [-0x1, 0x1].forEach(_0x151951 => {
          const _0x5cd582 = fxMesh(new THREE.SphereGeometry(0.1, 0xc, 0xa), 0xffa64d);
          _0x5cd582.scale.set(0x1, 0x1, 0.55), _0x5cd582.position.set(_0x151951 * 0.19, 1.1, 0x0);
          const _0x33f961 = fxMesh(new THREE.SphereGeometry(0.055, 0xa, 0x8), 0x2a2018);
          _0x33f961.scale.set(0x1, 0x1, 0.5), _0x33f961.position.set(_0x151951 * 0.19, 1.1, 0.04), _0x16f7bd.add(_0x5cd582, _0x33f961);
        });
        break;
      }
    default:
      return null;
  }
  return _0x16f7bd;
}
export function _addMiss(_0x10afd0) {
  if (window.__climbEnabled === false) return;
  if (window.__quadOn) return;
  _0x10afd0._missCount++, _0x10afd0._missCount >= 0x5 && !_0x10afd0._climbing && !_0x10afd0._transformed && (_0x10afd0._climbing = true, _0x10afd0._missCount = 0x0, window.dispatchEvent(new CustomEvent('baby-climb-start')));
}
export function _clickBody(_0x293954) {
  if (!_0x293954._climbing) return false;
  const _0x4a7c92 = _0x293954.body;
  if (!_0x4a7c92) return false;
  return _0x4a7c92.position.y = Math.max((_0x293954._baseY || 0x0) + 0.3, _0x4a7c92.position.y - 0.35), tw(_0x293954, _0x4a7c92.rotation, 'z', 0.15, 0x64, "outQuad"), tw(_0x293954, _0x4a7c92.rotation, 'z', 0x0, 0x12c, "outElastic", 0x6e), true;
}
export function _clickHead(_0x2bb70c) {
  if (!_0x2bb70c._climbing) return false;
  _0x2bb70c._climbing = false;
  const _0x211ed8 = _0x2bb70c.body;
  if (!_0x211ed8) return false;
  return tw(_0x2bb70c, _0x211ed8.position, 'y', _0x2bb70c._baseY || 0x0, 0x258, "outElastic"), tw(_0x2bb70c, _0x211ed8.rotation, 'x', 0x0, 0x1f4, "outElastic"), tw(_0x2bb70c, _0x211ed8.position, 'y', (_0x2bb70c._baseY || 0x0) + 0.4, 0xc8, "outQuad", 0x28a), tw(_0x2bb70c, _0x211ed8.position, 'y', _0x2bb70c._baseY || 0x0, 0x12c, "outQuad", 0x35c), window.dispatchEvent(new CustomEvent("baby-climb-end")), true;
}
export function _transform(_0x374455, _0x4952b8) {
  if (_0x374455._transformed || !_0x374455.ready) return false;
  _0x374455._transformed = true;
  !_0x374455._origColors && (_0x374455._origColors = _0x374455.mats.map(_0x3c26d1 => _0x3c26d1.color.getHex()));
  const _0x3370b8 = _0x374455.body,
    _0x3d7c91 = _0x374455.parts;
  switch (_0x4952b8) {
    case 'buff':
      tw(_0x374455, _0x3370b8.scale, 'x', 1.5, 0x1f4, "outBack"), tw(_0x374455, _0x3370b8.scale, 'y', 1.4, 0x1f4, "outBack"), tw(_0x374455, _0x3370b8.scale, 'z', 1.5, 0x1f4, "outBack"), _0x374455.mats.forEach(_0x7ceeef => {
        _0x7ceeef.color.setHex(0xff6b6b), _0x7ceeef.emissive = new THREE.Color(0xff0000), _0x7ceeef.emissiveIntensity = 0.3;
      });
      break;
    case "slim":
      tw(_0x374455, _0x3370b8.scale, 'x', 0.6, 0x1f4, "outBack"), tw(_0x374455, _0x3370b8.scale, 'y', 1.3, 0x1f4, "outBack"), _0x374455.mats.forEach(_0x2a4e24 => {
        _0x2a4e24.color.setHex(0x7fe8c9), _0x2a4e24.emissive = new THREE.Color(0xffaa), _0x2a4e24.emissiveIntensity = 0.2;
      });
      break;
    case "giant":
      tw(_0x374455, _0x3370b8.scale, 'x', 0x2, 0x258, "outBack"), tw(_0x374455, _0x3370b8.scale, 'y', 0x2, 0x258, "outBack"), tw(_0x374455, _0x3370b8.scale, 'z', 0x2, 0x258, "outBack"), _0x374455.mats.forEach(_0x3c9750 => {
        _0x3c9750.color.setHex(0xffd700), _0x3c9750.emissive = new THREE.Color(0xffaa00), _0x3c9750.emissiveIntensity = 0.4;
      });
      break;
    case 'rainbow':
      _0x374455.mats.forEach((_0x44f18c, _0xfce3c2) => {
        const _0x4c7005 = _0xfce3c2 / _0x374455.mats.length * 0x168;
        _0x44f18c.color.setHSL(_0x4c7005 / 0x168, 0.8, 0.6), _0x44f18c.emissive = new THREE.Color().setHSL(_0x4c7005 / 0x168, 0x1, 0.3), _0x44f18c.emissiveIntensity = 0.5;
      });
      break;
  }
  return tw(_0x374455, _0x3370b8.position, 'y', (_0x374455._baseY || 0x0) + 0.8, 0x12c, 'outQuad'), tw(_0x374455, _0x3370b8.position, 'y', _0x374455._baseY || 0x0, 0x190, 'outElastic', 0x140), window.dispatchEvent(new CustomEvent("baby-transform", {
    'detail': _0x4952b8
  })), true;
}
export function _untransform(_0xaf74e1) {
  if (!_0xaf74e1._transformed || !_0xaf74e1.ready) return false;
  _0xaf74e1._transformed = false;
  const _0x525209 = _0xaf74e1.body;
  return tw(_0xaf74e1, _0x525209.scale, 'x', 0x1, 0x190, "outElastic"), tw(_0xaf74e1, _0x525209.scale, 'y', 0x1, 0x190, "outElastic"), tw(_0xaf74e1, _0x525209.scale, 'z', 0x1, 0x190, "outElastic"), _0xaf74e1._origColors && _0xaf74e1.mats.forEach((_0x5cf1fb, _0x5a49b6) => {
    _0x5cf1fb.color.setHex(_0xaf74e1._origColors[_0x5a49b6]);
    if (_0x5cf1fb.emissive) _0x5cf1fb.emissiveIntensity = 0x0;
  }), window.dispatchEvent(new CustomEvent('baby-untransform')), true;
}
export function _doPose(_0x2e6e00, _0x32c243) {
  const _0x587789 = _0x2e6e00.parts,
    _0x584139 = _0x2e6e00.body;
  if (!_0x584139) return;
  switch (_0x32c243) {
    case 'dab':
      _0x587789.armL && (tw(_0x2e6e00, _0x587789.armL.pose, 'z', -1.8, 0x96, 'outQuad'), tw(_0x2e6e00, _0x587789.armL.pose, 'z', 0x0, 0x1f4, "outElastic", 0xc8));
      _0x587789.armR && (tw(_0x2e6e00, _0x587789.armR.pose, 'z', 0.9, 0x96, "outQuad"), tw(_0x2e6e00, _0x587789.armR.pose, 'z', 0x0, 0x1f4, 'outElastic', 0xc8));
      _0x587789.head && (tw(_0x2e6e00, _0x587789.head.pose, 'z', -0.5, 0x96, "outQuad"), tw(_0x2e6e00, _0x587789.head.pose, 'z', 0x0, 0x1f4, "outElastic", 0xc8));
      tw(_0x2e6e00, _0x584139.rotation, 'z', -0.2, 0x96, "outQuad"), tw(_0x2e6e00, _0x584139.rotation, 'z', 0x0, 0x1f4, "outElastic", 0xc8);
      break;
    case "wave":
      _0x587789.armL && (tw(_0x2e6e00, _0x587789.armL.pose, 'x', -1.5, 0xc8, 'outQuad'), tw(_0x2e6e00, _0x587789.armL.pose, 'x', 0x0, 0x258, "outElastic", 0xfa));
      _0x587789.armR && (tw(_0x2e6e00, _0x587789.armR.pose, 'x', -1.5, 0xc8, 'outQuad', 0x64), tw(_0x2e6e00, _0x587789.armR.pose, 'x', 0x0, 0x258, "outElastic", 0x15e));
      tw(_0x2e6e00, _0x584139.position, 'y', (_0x2e6e00._baseY || 0x0) + 0.3, 0xc8, 'outQuad'), tw(_0x2e6e00, _0x584139.position, 'y', _0x2e6e00._baseY || 0x0, 0x1f4, "outElastic", 0xfa);
      break;
    case "robot":
      _0x587789.armL && (tw(_0x2e6e00, _0x587789.armL.pose, 'z', -1.2, 0x50, "outQuad"), tw(_0x2e6e00, _0x587789.armL.pose, 'z', 0x0, 0x50, "outQuad", 0x5a), tw(_0x2e6e00, _0x587789.armL.pose, 'z', -0.8, 0x50, "outQuad", 0xb4), tw(_0x2e6e00, _0x587789.armL.pose, 'z', 0x0, 0x190, "outElastic", 0x118));
      _0x587789.head && (tw(_0x2e6e00, _0x587789.head.pose, 'y', 0.5, 0x50, 'outQuad'), tw(_0x2e6e00, _0x587789.head.pose, 'y', 0x0, 0x50, "outQuad", 0x5a), tw(_0x2e6e00, _0x587789.head.pose, 'y', -0.3, 0x50, 'outQuad', 0xb4), tw(_0x2e6e00, _0x587789.head.pose, 'y', 0x0, 0x190, "outElastic", 0x118));
      break;
    case 'spin':
      tw(_0x2e6e00, _0x584139.rotation, 'y', Math.PI * 0x4, 0x258, "inOutCubic"), setTimeout(() => {
        if (_0x2e6e00.body === _0x584139) _0x584139.rotation.y = 0x0;
      }, 0x28a), tw(_0x2e6e00, _0x584139.scale, 'x', 0.7, 0xc8, "outQuad"), tw(_0x2e6e00, _0x584139.scale, 'x', 0x1, 0x190, 'outElastic', 0xdc);
      break;
    case "split":
      _0x587789.legL && (tw(_0x2e6e00, _0x587789.legL.pose, 'z', -1.2, 0x12c, "outQuad"), tw(_0x2e6e00, _0x587789.legL.pose, 'z', 0x0, 0x1f4, "outElastic", 0x15e));
      _0x587789.legR && (tw(_0x2e6e00, _0x587789.legR.pose, 'z', 1.2, 0x12c, 'outQuad'), tw(_0x2e6e00, _0x587789.legR.pose, 'z', 0x0, 0x1f4, "outElastic", 0x15e));
      tw(_0x2e6e00, _0x584139.position, 'y', (_0x2e6e00._baseY || 0x0) - 0.3, 0x12c, "outQuad"), tw(_0x2e6e00, _0x584139.position, 'y', _0x2e6e00._baseY || 0x0, 0x1f4, "outElastic", 0x15e);
      break;
  }
}
function createAccessoryMesh(_0xc1aba7) {
  if (GIFT_DEFS[_0xc1aba7]) return createGiftMesh(_0xc1aba7);
  const _0x95a938 = new THREE.Group();
  switch (_0xc1aba7) {
    case "hat_apple":
      {
        const _0x4aa53f = new THREE.Mesh(new THREE.SphereGeometry(0.28, 0x10, 0x10), new THREE.MeshStandardMaterial({
          'color': 0xff3333,
          'roughness': 0.6
        }));
        _0x4aa53f.position.y = 0.1;
        const _0x2cb634 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.15, 0x8), new THREE.MeshStandardMaterial({
          'color': 0x8b4513
        }));
        _0x2cb634.position.y = 0.42;
        const _0x2ad304 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 0x8, 0x8, 0x0, Math.PI), new THREE.MeshStandardMaterial({
          'color': 0x44aa44,
          'side': THREE.DoubleSide
        }));
        _0x2ad304.position.set(0.12, 0.38, 0x0), _0x2ad304.rotation.z = -0.5, _0x95a938.add(_0x4aa53f, _0x2cb634, _0x2ad304);
        break;
      }
    case "hat_banana":
      {
        const _0x58bbe3 = new THREE.MeshStandardMaterial({
            'color': 0xffdd33,
            'roughness': 0.5
          }),
          _0x410342 = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.07, 0x8, 0xc, Math.PI), _0x58bbe3);
        _0x410342.position.set(-0.15, 0.15, 0x0), _0x410342.rotation.z = Math.PI / 0x2;
        const _0x4535bb = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.07, 0x8, 0xc, Math.PI), _0x58bbe3);
        _0x4535bb.position.set(0.15, 0.15, 0x0), _0x4535bb.rotation.z = Math.PI / 0x2, _0x95a938.add(_0x410342, _0x4535bb);
        break;
      }
    case "hat_donut":
      {
        const _0x5cf683 = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.14, 0xc, 0x18), new THREE.MeshStandardMaterial({
          'color': 0xd9a066,
          'roughness': 0.4
        }));
        _0x5cf683.rotation.x = Math.PI / 0x2;
        const _0x413e19 = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.06, 0xc, 0x18), new THREE.MeshStandardMaterial({
          'color': 0xff88cc,
          'roughness': 0.3
        }));
        _0x413e19.rotation.x = Math.PI / 0x2, _0x413e19.position.y = 0.08, _0x95a938.add(_0x5cf683, _0x413e19);
        break;
      }
    case "hat_icecream":
      {
        const _0x452357 = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 0x8), new THREE.MeshStandardMaterial({
          'color': 0xd9a066,
          'roughness': 0.7
        }));
        _0x452357.rotation.x = Math.PI, _0x452357.position.y = -0.1;
        const _0x19317d = new THREE.Mesh(new THREE.SphereGeometry(0.22, 0xc, 0xc), new THREE.MeshStandardMaterial({
          'color': 0xffccee,
          'roughness': 0.3
        }));
        _0x19317d.position.y = 0.22, _0x95a938.add(_0x452357, _0x19317d);
        break;
      }
    case "hat_fish":
      {
        const _0x59aa5f = new THREE.Mesh(new THREE.SphereGeometry(0.25, 0xc, 0x8), new THREE.MeshStandardMaterial({
          'color': 0x88ccff,
          'roughness': 0.6
        }));
        _0x59aa5f.scale.set(1.2, 0.6, 0.4);
        const _0x95f887 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 0x4), new THREE.MeshStandardMaterial({
          'color': 0x6699cc
        }));
        _0x95f887.rotation.z = Math.PI / 0x2, _0x95f887.position.x = 0.35, _0x95a938.add(_0x59aa5f, _0x95f887);
        break;
      }
    case "hat_cheese":
      {
        const _0x1ae567 = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.35, 0x4), new THREE.MeshStandardMaterial({
          'color': 0xffdd66,
          'roughness': 0.5
        }));
        _0x1ae567.rotation.y = Math.PI / 0x4, _0x95a938.add(_0x1ae567);
        break;
      }
    case "hat_egg":
      {
        const _0x18de8a = new THREE.Mesh(new THREE.SphereGeometry(0.28, 0xc, 0x8), new THREE.MeshStandardMaterial({
          'color': 0xffffff,
          'roughness': 0.4
        }));
        _0x18de8a.scale.set(0x1, 0.3, 0x1);
        const _0x56e874 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 0xa, 0xa), new THREE.MeshStandardMaterial({
          'color': 0xffdd44,
          'roughness': 0.3
        }));
        _0x56e874.position.y = 0.05, _0x95a938.add(_0x18de8a, _0x56e874);
        break;
      }
    case 'hat_mushroom':
      {
        const _0x45e6de = new THREE.Mesh(new THREE.SphereGeometry(0.28, 0xc, 0x8, 0x0, Math.PI * 0x2, 0x0, Math.PI / 0x2), new THREE.MeshStandardMaterial({
            'color': 0xff4466,
            'roughness': 0.5
          })),
          _0x111009 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.25, 0x8), new THREE.MeshStandardMaterial({
            'color': 0xffeecc,
            'roughness': 0.6
          }));
        _0x111009.position.y = -0.15;
        for (let _0x3b5de9 = 0x0; _0x3b5de9 < 0x5; _0x3b5de9++) {
          const _0x136d7f = new THREE.Mesh(new THREE.SphereGeometry(0.04, 0x6, 0x6), new THREE.MeshStandardMaterial({
              'color': 0xffffff
            })),
            _0x23faf2 = _0x3b5de9 / 0x5 * Math.PI * 0x2;
          _0x136d7f.position.set(Math.cos(_0x23faf2) * 0.18, 0.1, Math.sin(_0x23faf2) * 0.18), _0x45e6de.add(_0x136d7f);
        }
        _0x95a938.add(_0x45e6de, _0x111009);
        break;
      }
    case 'body_burger':
      {
        const _0x169375 = new THREE.MeshStandardMaterial({
            'color': 0xd9a066,
            'roughness': 0.6
          }),
          _0x271170 = new THREE.Mesh(new THREE.SphereGeometry(0.22, 0xc, 0x8, 0x0, Math.PI * 0x2, 0x0, Math.PI / 0x2), _0x169375);
        _0x271170.position.y = 0.12;
        const _0x5ef8da = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 0xc), _0x169375);
        _0x5ef8da.position.y = -0.12;
        const _0x566733 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 0xc), new THREE.MeshStandardMaterial({
            'color': 0x8b4513,
            'roughness': 0.7
          })),
          _0x2126a5 = new THREE.Mesh(new THREE.SphereGeometry(0.21, 0xa, 0x6, 0x0, Math.PI * 0x2, 0x0, Math.PI / 0x2), new THREE.MeshStandardMaterial({
            'color': 0x44aa44,
            'roughness': 0.5
          }));
        _0x2126a5.position.y = 0.06, _0x2126a5.scale.set(0x1, 0.4, 0x1), _0x95a938.add(_0x271170, _0x566733, _0x2126a5, _0x5ef8da);
        break;
      }
    case "body_pizza":
      {
        const _0x2527c0 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.06, 0xc), new THREE.MeshStandardMaterial({
            'color': 0xffcc88,
            'roughness': 0.6
          })),
          _0x451953 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 0xc), new THREE.MeshStandardMaterial({
            'color': 0xffdd44,
            'roughness': 0.4
          }));
        _0x451953.position.y = 0.04;
        for (let _0x3d7580 = 0x0; _0x3d7580 < 0x4; _0x3d7580++) {
          const _0x2cb970 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 0x8), new THREE.MeshStandardMaterial({
              'color': 0xcc3333
            })),
            _0x4b53f8 = _0x3d7580 / 0x4 * Math.PI * 0x2;
          _0x2cb970.position.set(Math.cos(_0x4b53f8) * 0.15, 0.06, Math.sin(_0x4b53f8) * 0.15), _0x451953.add(_0x2cb970);
        }
        _0x95a938.add(_0x2527c0, _0x451953);
        break;
      }
    case "body_taco":
      {
        const _0x13302f = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.2, 0xa, 0x1, false, 0x0, Math.PI), new THREE.MeshStandardMaterial({
          'color': 0xffcc44,
          'roughness': 0.5,
          'side': THREE.DoubleSide
        }));
        _0x13302f.rotation.z = Math.PI / 0x2;
        const _0x3fbc78 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 0x8, 0x6), new THREE.MeshStandardMaterial({
          'color': 0x8b4513,
          'roughness': 0.7
        }));
        _0x3fbc78.scale.set(0.8, 0.5, 0.5), _0x95a938.add(_0x13302f, _0x3fbc78);
        break;
      }
    case "body_sushi":
      {
        const _0x29cb0d = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.15, 0.18), new THREE.MeshStandardMaterial({
            'color': 0xffffff,
            'roughness': 0.8
          })),
          _0x9ff900 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.2), new THREE.MeshStandardMaterial({
            'color': 0xff8888,
            'roughness': 0.4
          }));
        _0x9ff900.position.y = 0.11, _0x95a938.add(_0x29cb0d, _0x9ff900);
        break;
      }
    case 'body_cookie':
      {
        const _0x320609 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 0xc), new THREE.MeshStandardMaterial({
          'color': 0xc9966a,
          'roughness': 0.7
        }));
        for (let _0x14f99c = 0x0; _0x14f99c < 0x6; _0x14f99c++) {
          const _0x35485d = new THREE.Mesh(new THREE.SphereGeometry(0.04, 0x6, 0x6), new THREE.MeshStandardMaterial({
              'color': 0x4a2c0a
            })),
            _0x13c6c3 = _0x14f99c / 0x6 * Math.PI * 0x2;
          _0x35485d.position.set(Math.cos(_0x13c6c3) * 0.15, 0.05, Math.sin(_0x13c6c3) * 0.15), _0x320609.add(_0x35485d);
        }
        _0x95a938.add(_0x320609);
        break;
      }
    case "cape_red":
    case "cape_gold":
    case "cape_dark":
    case "cape_rainbow":
      {
        const _0x3b27c4 = {
            'cape_red': 0xff3333,
            'cape_gold': 0xffd700,
            'cape_dark': 0x6644ff,
            'cape_rainbow': 0xff66cc
          },
          _0x427145 = _0x3b27c4[_0xc1aba7] || 0xff3333,
          _0x4d408e = new THREE.PlaneGeometry(0.8, 1.2, 0x4, 0x8),
          _0x1b37b4 = _0x4d408e.attributes.position;
        for (let _0x28be13 = 0x0; _0x28be13 < _0x1b37b4.count; _0x28be13++) {
          const _0x3e5b41 = _0x1b37b4.getY(_0x28be13);
          _0x3e5b41 < 0x0 && (_0x1b37b4.setX(_0x28be13, _0x1b37b4.getX(_0x28be13) + (Math.random() - 0.5) * 0.1 * Math.abs(_0x3e5b41)), _0x1b37b4.setZ(_0x28be13, _0x1b37b4.getZ(_0x28be13) + (Math.random() - 0.5) * 0.15 * Math.abs(_0x3e5b41)));
        }
        _0x4d408e.computeVertexNormals();
        const _0x561f9e = new THREE.MeshStandardMaterial({
            'color': _0x427145,
            'roughness': 0.6,
            'side': THREE.DoubleSide,
            'transparent': true,
            'opacity': 0.9
          }),
          _0x2fd400 = new THREE.Mesh(_0x4d408e, _0x561f9e);
        _0x2fd400.position.set(0x0, -0.2, -0.15), _0x95a938.add(_0x2fd400);
        break;
      }
    default:
      return null;
  }
  return _0x95a938;
}
const GIFT_DEFS = {
    'acc-bunny': {
      'file': "gifts/bunny.glb",
      'size': 0.55
    },
    'acc-chick': {
      'file': "gifts/chick.glb",
      'size': 0.5
    },
    'acc-cat': {
      'file': "gifts/cat.glb",
      'size': 0.55
    },
    'acc-bee': {
      'file': "gifts/bee.glb",
      'size': 0.42
    },
    'acc-strawberry': {
      'file': "gifts/strawberry.glb",
      'size': 0.4
    },
    'acc-watermelon': {
      'file': "gifts/watermelon.glb",
      'size': 0.5
    },
    'acc-icecream': {
      'file': 'gifts/ice-cream-cne.glb',
      'size': 0.52
    },
    'acc-lollypop': {
      'file': "gifts/lollypop.glb",
      'size': 0.48
    },
    'acc-popsicle': {
      'file': "gifts/popsicle.glb",
      'size': 0.42
    },
    'acc-muffin': {
      'file': 'gifts/muffin.glb',
      'size': 0.42
    },
    'acc-donut': {
      'file': "gifts/donut-sprinkles.glb",
      'size': 0.48
    },
    'acc-grapes': {
      'file': 'gifts/grapes.glb',
      'size': 0.46
    },
    'acc-pancakes': {
      'file': "gifts/pancakes.glb",
      'size': 0.52
    }
  },
  _giftCache = {};
function createGiftMesh(_0x26d351) {
  const _0x110d5b = GIFT_DEFS[_0x26d351];
  if (!_0x110d5b) return null;
  const _0x35aec5 = new THREE.Group();
  _0x35aec5.userData.gift = true;
  if (_giftCache[_0x26d351]) return _0x35aec5.add(_giftCache[_0x26d351].clone()), _0x35aec5;
  return new GLTFLoader().load(_0x110d5b.file, _0x5024f3 => {
    const _0x37e266 = _0x5024f3.scene,
      _0x2e6d33 = new THREE.Box3().setFromObject(_0x37e266),
      _0x288dc4 = Math.max(_0x2e6d33.max.x - _0x2e6d33.min.x, _0x2e6d33.max.y - _0x2e6d33.min.y, _0x2e6d33.max.z - _0x2e6d33.min.z) || 0x1;
    _0x37e266.scale.setScalar(_0x110d5b.size / _0x288dc4), _0x2e6d33.setFromObject(_0x37e266), _0x37e266.position.set(-(_0x2e6d33.min.x + _0x2e6d33.max.x) / 0x2, -_0x2e6d33.min.y, -(_0x2e6d33.min.z + _0x2e6d33.max.z) / 0x2), _giftCache[_0x26d351] = _0x37e266, _0x35aec5.add(_0x37e266.clone());
  }, undefined, () => {}), _0x35aec5;
}
export function _setAccessory(_0x2f2d98, _0x37a584, _0x317a6e) {
  if (!_0x2f2d98.ready || !_0x2f2d98.body) return false;
  if (_0x2f2d98._acc[_0x37a584]) {
    const _0x3b8aac = _0x2f2d98._acc[_0x37a584];
    _0x2f2d98.body.remove(_0x3b8aac);
    if (!_0x3b8aac.userData.gift) _0x3b8aac.traverse(_0x5aa420 => {
      _0x5aa420.isMesh && (_0x5aa420.geometry.dispose(), _0x5aa420.material.dispose());
    });
    _0x2f2d98._acc[_0x37a584] = null;
  }
  if (!_0x317a6e) return true;
  const _0x422e06 = _0x317a6e.startsWith("gift:"),
    _0x42b428 = _0x422e06 ? createGiftMesh(_0x317a6e.slice(0x5)) : createAccessoryMesh(_0x317a6e);
  if (!_0x42b428) return false;
  const _0x32e891 = 0x1 / _cache.scale;
  let _0x1e38e0;
  _0x422e06 ? _0x1e38e0 = _0x37a584 === "head" ? {
    'y': 1.98,
    'z': 0x0
  } : _0x37a584 === 'cape' ? {
    'y': 1.05,
    'z': -0.3
  } : {
    'y': 0.95,
    'z': 0.25
  } : _0x1e38e0 = {
    'head': {
      'y': 1.75,
      'z': 0x0
    },
    'body': {
      'y': 0.95,
      'z': 0.25
    },
    'cape': {
      'y': 0x1,
      'z': -0.2
    }
  }[_0x37a584];
  if (!_0x1e38e0) return false;
  return _0x42b428.scale.setScalar(_0x32e891), _0x42b428.position.set(0x0, _0x1e38e0.y * _0x32e891, _0x1e38e0.z * _0x32e891), _0x2f2d98.body.add(_0x42b428), _0x2f2d98._acc[_0x37a584] = _0x42b428, true;
}
export function doAction(_0x1d7cad, _0x1fd608) {
  _doAction(Dancer, _0x1d7cad, _0x1fd608);
}
export function stumble() {
  _stumble(Dancer);
}
export function celebrate() {
  _celebrate(Dancer);
}
export function lieDown() {
  _lieDown(Dancer);
}
export function resetBody() {
  _resetBody(Dancer);
}
export function updateDancer(_0x2a7809, _0x3f6bda, _0x526674) {
  _updateDancer(Dancer, _0x2a7809, _0x3f6bda, _0x526674);
}
export function setSkin(_0x3d6a3c) {
  _setSkin(Dancer, _0x3d6a3c);
}
export function addMiss() {
  _addMiss(Dancer);
}
export function clickBody() {
  return _clickBody(Dancer);
}
export function clickHead() {
  return _clickHead(Dancer);
}
export function transform(_0x315ae2) {
  return _transform(Dancer, _0x315ae2);
}
export function untransform() {
  return _untransform(Dancer);
}
export function doPose(_0x19deda) {
  _doPose(Dancer, _0x19deda);
}
export function setAccessory(_0x39c2ca, _0x15aa29) {
  return _setAccessory(Dancer, _0x39c2ca, _0x15aa29);
}
Object.defineProperty(window, "__danceParts", {
  'get': () => Dancer.parts,
  'configurable': true
});
