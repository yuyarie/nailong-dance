import * as THREE from 'three';
export const Fx = {
  'ready': false,
  '_bursts': [],
  '_rings': [],
  '_strips': [],
  '_spotA': null,
  '_spotB': null,
  '_disco': null,
  '_shakeT': 0x0,
  '_shakeMag': 0x0,
  '_beatT': 0x0,
  'camBase': new THREE.Vector3(0x0, 0x2, 5.2)
};
let sceneRef = null,
  camRef = null;
function dotTexture() {
  const _0x45cbcc = document.createElement('canvas');
  _0x45cbcc.width = _0x45cbcc.height = 0x40;
  const _0x33906f = _0x45cbcc.getContext('2d'),
    _0x176e8f = _0x33906f.createRadialGradient(0x20, 0x20, 0x2, 0x20, 0x20, 0x1e);
  _0x176e8f.addColorStop(0x0, "rgba(255,255,255,1)"), _0x176e8f.addColorStop(0.4, "rgba(255,255,255,.6)"), _0x176e8f.addColorStop(0x1, 'rgba(255,255,255,0)'), _0x33906f.fillStyle = _0x176e8f, _0x33906f.fillRect(0x0, 0x0, 0x40, 0x40);
  const _0x25729a = new THREE.CanvasTexture(_0x45cbcc);
  return _0x25729a;
}
export function initFx(_0x1eb6d7, _0x1b0739) {
  sceneRef = _0x1eb6d7, camRef = _0x1b0739;
  for (let _0x2c9e81 = 0x0; _0x2c9e81 < 0x4; _0x2c9e81++) {
    const _0x6baff1 = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.6), new THREE.MeshBasicMaterial({
      'color': 0x0,
      'transparent': true,
      'opacity': 0x0,
      'side': THREE.DoubleSide
    }));
    _0x6baff1.rotation.x = -Math.PI / 0x2, _0x6baff1.position.set((_0x2c9e81 - 1.5) * 0.95, 0.02, 1.7), _0x1eb6d7.add(_0x6baff1), Fx._strips.push(_0x6baff1);
  }
  const _0x524611 = new THREE.Group(),
    _0xd30b29 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 0x1), new THREE.MeshStandardMaterial({
      'color': 0xbfd8ff,
      'metalness': 0x1,
      'roughness': 0.18,
      'flatShading': true
    }));
  _0x524611.add(_0xd30b29);
  const _0x4ebea7 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.6), new THREE.MeshBasicMaterial({
    'color': 0x333333
  }));
  _0x4ebea7.position.y = 0x1, _0x524611.add(_0x4ebea7), _0x524611.position.set(0x0, 0x4, -0.5), _0x1eb6d7.add(_0x524611), Fx._disco = _0x524611;
  const _0x352e9d = (_0x36495b, _0x5a3b45) => {
    const _0x200cac = new THREE.SpotLight(_0x36495b, 0x3c, 0x1e, 0.32, 0.5, 1.6);
    return _0x200cac.position.set(_0x5a3b45, 6.5, 2.5), _0x200cac.target.position.set(0x0, 0x0, -0x1), _0x1eb6d7.add(_0x200cac), _0x1eb6d7.add(_0x200cac.target), _0x200cac;
  };
  Fx._spotA = _0x352e9d(0xff3b6b, -4.5), Fx._spotB = _0x352e9d(0x36d1ff, 4.5), Fx.ready = true;
}
const _dotTex = {
  'v': null
};
export function burst(_0x5df2e9, _0x5b3bd2 = 0xffe17a, _0x181ec5 = 0x3c) {
  if (!Fx.ready) return;
  if (!_dotTex.v) _dotTex.v = dotTexture();
  const _0x58948a = new THREE.BufferGeometry(),
    _0x4014fd = new Float32Array(_0x181ec5 * 0x3),
    _0x1d96c1 = [];
  for (let _0xc12e1 = 0x0; _0xc12e1 < _0x181ec5; _0xc12e1++) {
    _0x4014fd[_0xc12e1 * 0x3] = _0x5df2e9.x, _0x4014fd[_0xc12e1 * 0x3 + 0x1] = _0x5df2e9.y, _0x4014fd[_0xc12e1 * 0x3 + 0x2] = _0x5df2e9.z;
    const _0x7cfd2f = Math.random() * Math.PI * 0x2,
      _0xc6532a = Math.random() * Math.PI - Math.PI / 0x2,
      _0x5f5630 = 0x2 + Math.random() * 4.5;
    _0x1d96c1.push(new THREE.Vector3(Math.cos(_0x7cfd2f) * Math.cos(_0xc6532a) * _0x5f5630, Math.abs(Math.sin(_0xc6532a)) * _0x5f5630 + 1.5, Math.sin(_0x7cfd2f) * Math.cos(_0xc6532a) * _0x5f5630));
  }
  _0x58948a.setAttribute("position", new THREE.BufferAttribute(_0x4014fd, 0x3));
  const _0xe18ed5 = new THREE.PointsMaterial({
      'size': 0.14,
      'map': _dotTex.v,
      'color': _0x5b3bd2,
      'transparent': true,
      'opacity': 0x1,
      'depthWrite': false,
      'blending': THREE.AdditiveBlending
    }),
    _0x340b70 = new THREE.Points(_0x58948a, _0xe18ed5);
  sceneRef.add(_0x340b70), Fx._bursts.push({
    'pts': _0x340b70,
    'V': _0x1d96c1,
    'life': 0x0,
    'dur': 0.75
  });
}
export function ringPulse(_0x1e3265, _0x1237b6, _0x3ef354 = 0xffe17a) {
  if (!Fx.ready) return;
  const _0x42c4c3 = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.72, 0x30), new THREE.MeshBasicMaterial({
    'color': _0x3ef354,
    'transparent': true,
    'opacity': 0.9,
    'side': THREE.DoubleSide,
    'depthWrite': false
  }));
  _0x42c4c3.rotation.x = -Math.PI / 0x2, _0x42c4c3.position.set(_0x1e3265, 0.03, _0x1237b6), sceneRef.add(_0x42c4c3), Fx._rings.push({
    'm': _0x42c4c3,
    'life': 0x0,
    'dur': 0.5
  });
}
export function laneFlash(_0x422efa, _0x1494f9 = 0xffe17a, _0x538a1f = 0x1) {
  const _0x19b918 = Fx._strips[_0x422efa];
  if (!_0x19b918) return;
  _0x19b918.material.color.setHex(_0x1494f9), _0x19b918.material.opacity = 0.95 * _0x538a1f;
}
export function shake(_0x385ad5 = 0.12) {
  Fx._shakeMag = Math.max(Fx._shakeMag, _0x385ad5), Fx._shakeT = 0.32;
}
export function updateFx(_0x1d32d6, _0x2ea63f, _0x53ea9f, _0x5667f6, _0x497c91) {
  if (!Fx.ready) return;
  for (let _0x1223ae = Fx._bursts.length - 0x1; _0x1223ae >= 0x0; _0x1223ae--) {
    const _0x1e1c7a = Fx._bursts[_0x1223ae];
    _0x1e1c7a.life += _0x1d32d6;
    const _0x121ab1 = _0x1e1c7a.life / _0x1e1c7a.dur;
    if (_0x121ab1 >= 0x1) {
      sceneRef.remove(_0x1e1c7a.pts), _0x1e1c7a.pts.geometry.dispose(), _0x1e1c7a.pts.material.dispose(), Fx._bursts.splice(_0x1223ae, 0x1);
      continue;
    }
    const _0x4dc232 = _0x1e1c7a.pts.geometry.attributes.position.array;
    for (let _0x144a6c = 0x0; _0x144a6c < _0x1e1c7a.V.length; _0x144a6c++) {
      const _0x17977f = _0x1e1c7a.V[_0x144a6c];
      _0x4dc232[_0x144a6c * 0x3] += _0x17977f.x * _0x1d32d6, _0x4dc232[_0x144a6c * 0x3 + 0x1] += _0x17977f.y * _0x1d32d6, _0x4dc232[_0x144a6c * 0x3 + 0x2] += _0x17977f.z * _0x1d32d6, _0x17977f.y -= 6.5 * _0x1d32d6;
    }
    _0x1e1c7a.pts.geometry.attributes.position.needsUpdate = true, _0x1e1c7a.pts.material.opacity = 0x1 - _0x121ab1, _0x1e1c7a.pts.material.size = 0.14 * (0x1 - _0x121ab1 * 0.5);
  }
  for (let _0x454be0 = Fx._rings.length - 0x1; _0x454be0 >= 0x0; _0x454be0--) {
    const _0x53f18c = Fx._rings[_0x454be0];
    _0x53f18c.life += _0x1d32d6;
    const _0x25af3e = _0x53f18c.life / _0x53f18c.dur;
    if (_0x25af3e >= 0x1) {
      sceneRef.remove(_0x53f18c.m), _0x53f18c.m.geometry.dispose(), _0x53f18c.m.material.dispose(), Fx._rings.splice(_0x454be0, 0x1);
      continue;
    }
    const _0x24300d = 0x1 + _0x25af3e * 3.4;
    _0x53f18c.m.scale.set(_0x24300d, _0x24300d, 0x1), _0x53f18c.m.material.opacity = 0.9 * (0x1 - _0x25af3e);
  }
  Fx._strips.forEach(_0x4c3adc => {
    if (_0x4c3adc.material.opacity > 0x0) _0x4c3adc.material.opacity = Math.max(0x0, _0x4c3adc.material.opacity - _0x1d32d6 * 2.4);
  });
  if (Fx._disco) {
    Fx._disco.rotation.y += _0x1d32d6 * (_0x5667f6 ? 2.2 : 0.6), Fx._disco.children[0x0].rotation.x += _0x1d32d6 * 0.8;
    const _0x1c74db = 0.55 + Math.sin(_0x2ea63f * (_0x5667f6 ? 0x8 : 0x3)) * 0.45;
    Fx._spotA.intensity = (_0x5667f6 ? 0x46 : 0x1e) * _0x1c74db * (_0x53ea9f.lampA ? 0x1 : 0.4), Fx._spotB.intensity = (_0x5667f6 ? 0x46 : 0x1e) * (0x1 - _0x1c74db) * (_0x53ea9f.lampB ? 0x1 : 0.4), Fx._spotA.color.setHex(_0x53ea9f.c1), Fx._spotB.color.setHex(_0x53ea9f.c2);
    const _0x22324d = 2.6,
      _0x194780 = _0x2ea63f * (_0x5667f6 ? 1.5 : 0.5);
    Fx._spotA.target.position.set(Math.cos(_0x194780) * _0x22324d, 0x0, Math.sin(_0x194780) * _0x22324d * 0.4 - 0x1), Fx._spotB.target.position.set(Math.cos(_0x194780 + Math.PI) * _0x22324d, 0x0, Math.sin(_0x194780 + Math.PI) * _0x22324d * 0.4 - 0x1);
  }
  _0x497c91 && (Fx._beatT = 0.14);
  if (Fx._beatT > 0x0) {
    Fx._beatT -= _0x1d32d6;
    const _0x2a6c98 = Math.max(0x0, Fx._beatT / 0.14);
    camRef.position.z = Fx.camBase.z - _0x2a6c98 * 0.12;
  } else camRef.position.z += (Fx.camBase.z - camRef.position.z) * _0x1d32d6 * 0x8;
  if (Fx._shakeT > 0x0) {
    Fx._shakeT -= _0x1d32d6;
    const _0x6dafc6 = Fx._shakeMag * (Fx._shakeT / 0.32);
    camRef.position.x += (Math.random() - 0.5) * _0x6dafc6, camRef.position.y += (Math.random() - 0.5) * _0x6dafc6, Fx._shakeT <= 0x0 && (Fx._shakeMag = 0x0);
  }
}
