import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ensureCtx, sfxWhoosh, sfxBoop, sfxBoing, sfxOutro } from "./audio.js";
export const Opening = {
  'active': false
};
let scene,
  cam,
  rendererRef,
  onDoneCb,
  flyers = [],
  started = false,
  finished = false,
  titleShown = false,
  fading = false,
  timeouts = [],
  t0 = 0x0;
const $ = _0x5244ac => document.getElementById(_0x5244ac);
function later(_0x5588d6, _0x2295d1) {
  timeouts.push(setTimeout(_0x2295d1, _0x5588d6));
}
function clearLater() {
  timeouts.forEach(clearTimeout), timeouts = [];
}
const clamp01 = _0x408298 => Math.max(0x0, Math.min(0x1, _0x408298)),
  easeInOutSine = _0x21a824 => -(Math.cos(Math.PI * _0x21a824) - 0x1) / 0x2;
function bez(_0x35574a, _0x35b53e, _0x347710, _0x4fffd7, _0x4737cb) {
  const _0x1d6f7c = (0x1 - _0x4fffd7) * (0x1 - _0x4fffd7),
    _0x371e09 = 0x2 * (0x1 - _0x4fffd7) * _0x4fffd7,
    _0x6604b6 = _0x4fffd7 * _0x4fffd7;
  return _0x4737cb.set(_0x1d6f7c * _0x35574a.x + _0x371e09 * _0x35b53e.x + _0x6604b6 * _0x347710.x, _0x1d6f7c * _0x35574a.y + _0x371e09 * _0x35b53e.y + _0x6604b6 * _0x347710.y, _0x1d6f7c * _0x35574a.z + _0x371e09 * _0x35b53e.z + _0x6604b6 * _0x347710.z), _0x4737cb;
}
function gradTexture() {
  const _0x4dfa70 = document.createElement("canvas");
  _0x4dfa70.width = _0x4dfa70.height = 0x200;
  const _0x5d7914 = _0x4dfa70.getContext('2d'),
    _0x30d510 = _0x5d7914.createLinearGradient(0x0, 0x0, 0x200, 0x200);
  _0x30d510.addColorStop(0x0, "#ff6b9d"), _0x30d510.addColorStop(0.5, "#ffa751"), _0x30d510.addColorStop(0x1, "#ffe17a"), _0x5d7914.fillStyle = _0x30d510, _0x5d7914.fillRect(0x0, 0x0, 0x200, 0x200);
  const _0x5ca13e = new THREE.CanvasTexture(_0x4dfa70);
  return _0x5ca13e.colorSpace = THREE.SRGBColorSpace, _0x5ca13e;
}
function buildSky() {
  scene.background = gradTexture();
}
function normalizeModel(_0x460139, _0x5d6a96) {
  const _0x1eed99 = new THREE.Group(),
    _0x3ac80d = new THREE.Box3().setFromObject(_0x460139.scene),
    _0x5bca44 = _0x3ac80d.getSize(new THREE.Vector3()),
    _0x1eef87 = _0x3ac80d.getCenter(new THREE.Vector3());
  return _0x460139.scene.position.sub(_0x1eef87), _0x1eed99.add(_0x460139.scene), _0x1eed99.scale.setScalar(_0x5d6a96 / _0x5bca44.y), _0x1eed99;
}
function loadBabyLog(_0x479257, _0x3788d5) {
  const _0x4cef6e = performance.now();
  return console.log('%c\x20\x20⏳\x20[加载]\x20' + _0x479257 + '\x20开始下载…', "color:#c9b8e8"), new Promise((_0x500c11, _0x328916) => {
    const _0x45d720 = setTimeout(() => _0x328916(new Error("[开场] " + _0x479257 + " 下载超时")), 0x4e20);
    new GLTFLoader().load(_0x479257, _0x371d29 => {
      clearTimeout(_0x45d720), console.log("%c  ✅ [加载] " + _0x479257 + " 完成 (" + ((performance.now() - _0x4cef6e) / 0x3e8).toFixed(0x2) + 's)', "color:#7fffd4"), _0x500c11(normalizeModel(_0x371d29, _0x3788d5));
    }, undefined, _0xed3fa4 => {
      clearTimeout(_0x45d720), console.error("  ❌ [加载] " + _0x479257 + '\x20失败', _0xed3fa4), _0x328916(_0xed3fa4);
    });
  });
}
export function runOpening(_0x41eea6, _0x1572de) {
  rendererRef = _0x41eea6, onDoneCb = _0x1572de, scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(0x2d, innerWidth / innerHeight, 0.1, 0x64), cam.position.set(0x0, 0x0, 0xa), buildSky(), Opening.active = true, console.log('%c[开场]\x20场景就绪，等待用户点击「开跳」…', "color:#36d1ff;font-weight:bold"), $("openingUI").classList.add('on'), $('openSkip').classList.remove('on'), $("openSkip").addEventListener("click", onSkip), addEventListener('resize', onResize);
}
function onResize() {
  cam && (cam.aspect = innerWidth / innerHeight, cam.updateProjectionMatrix());
}
export function begin() {
  if (started) return;
  started = true, onGateClick();
}
async function onGateClick() {
  ensureCtx(), $("openSkip").classList.add('on'), console.log("%c[开场] ▶ 开始加载 baby1.glb / baby2.glb …", 'color:#ffe17a;font-weight:bold');
  try {
    const [_0x4713a5, _0x444027] = await Promise.all([loadBabyLog('baby1.glb', 1.9), loadBabyLog("baby2.glb", 1.9)]);
    if (finished) return;
    console.log("%c[开场] ✓ 两个奶娃加载完成，开始飞行", "color:#7fffd4;font-weight:bold"), t0 = performance.now();
    const _0x5779fa = Math.tan(cam.fov * Math.PI / 0x168) * cam.position.z,
      _0x4e5169 = _0x5779fa * cam.aspect,
      _0x57b229 = 1.25;
    flyers = [{
      'model': _0x4713a5,
      'p0': new THREE.Vector3(-_0x4e5169 * _0x57b229, _0x5779fa * 0.9, 0x0),
      'p1': new THREE.Vector3(0x0, _0x5779fa * 0.42, 0x0),
      'p2': new THREE.Vector3(_0x4e5169 * 0.62, -_0x5779fa * 0.5, 0x0),
      'start': 0x0,
      'dur': 0x546,
      'spin': -0x1,
      'land': new THREE.Vector3(_0x4e5169 * 0.62, -_0x5779fa * 0.5, 0x0)
    }, {
      'model': _0x444027,
      'p0': new THREE.Vector3(_0x4e5169 * _0x57b229, _0x5779fa * 0.9, 0x0),
      'p1': new THREE.Vector3(0x0, _0x5779fa * 0.42, 0x0),
      'p2': new THREE.Vector3(-_0x4e5169 * 0.62, -_0x5779fa * 0.5, 0x0),
      'start': 0x15e,
      'dur': 0x546,
      'spin': 0x1,
      'land': new THREE.Vector3(-_0x4e5169 * 0.62, -_0x5779fa * 0.5, 0x0)
    }], flyers.forEach(_0xf40f53 => {
      _0xf40f53.model.position.copy(_0xf40f53.p0), _0xf40f53.landed = false, _0xf40f53.landT = 0x0, _0xf40f53.normScale = _0xf40f53.model.scale.x, scene.add(_0xf40f53.model);
    }), later(0x0, () => sfxWhoosh(-0.8, 0.8, 0.9)), later(0x15e, () => sfxWhoosh(0.8, -0.8, 0.9)), later(0x546 + 0x1e0, () => sfxBoop(0x0, -0.5)), later(0x6a4 + 0x1e0, () => sfxBoop(0x0, 0.5)), later(0x992, showTitle), later(0x992 + 0x834, sfxOutro), later(0x992 + 0x8fc, finish);
  } catch (_0x2b1d9c) {
    console.error("[开场] ⚠ 模型未就绪（超时/失败），直接弹出标题进主界面", _0x2b1d9c), t0 = performance.now(), clearLater(), showTitle(), later(0x834, sfxOutro), later(0x8fc, finish);
  }
}
function showTitle() {
  if (titleShown || finished) return;
  titleShown = true;
  const _0x5c3153 = $('openTitle');
  _0x5c3153.style.opacity = '1', _0x5c3153.classList.add("pop"), sfxBoing();
}
function startFade() {
  if (fading || finished) return;
  fading = true, $('openTitle').classList.add('bye'), sfxOutro();
}
function onSkip() {
  if (!started || finished) return;
  if (!t0) {
    clearLater(), finish();
    return;
  }
  !titleShown ? (clearLater(), showTitle(), later(0x834, sfxOutro), later(0x8fc, finish)) : (clearLater(), finish());
}
function finish() {
  if (finished) return;
  finished = true, clearLater(), removeEventListener("resize", onResize), $("openSkip").removeEventListener("click", onSkip), $("openingUI").classList.remove('on'), $("openTitle").className = '', $('openTitle').style.opacity = '0', scene.traverse(_0x451307 => {
    if (_0x451307.isMesh) {
      _0x451307.geometry && _0x451307.geometry.dispose();
      const _0x2e9c19 = _0x451307.material;
      if (Array.isArray(_0x2e9c19)) _0x2e9c19.forEach(_0xf4208c => {
        _0xf4208c.map && _0xf4208c.map.dispose(), _0xf4208c.dispose();
      });else _0x2e9c19 && (_0x2e9c19.map && _0x2e9c19.map.dispose(), _0x2e9c19.dispose());
    }
  }), Opening.active = false, onDoneCb && onDoneCb();
}
const _tmp = new THREE.Vector3();
export function updateOpening(_0xfaaacf, _0x56ee8f) {
  if (!scene) return;
  const _0x2b23f0 = _0x56ee8f - t0;
  for (const _0x572300 of flyers) {
    if (!started) continue;
    const _0x4ed116 = clamp01((_0x2b23f0 - _0x572300.start) / _0x572300.dur);
    if (_0x4ed116 < 0x1) bez(_0x572300.p0, _0x572300.p1, _0x572300.p2, easeInOutSine(_0x4ed116), _tmp), _0x572300.model.position.copy(_tmp), _0x572300.model.rotation.z = _0x572300.spin * (0x1 - _0x4ed116) * (0x1 - _0x4ed116) * 5.5, _0x572300.model.rotation.y = Math.sin(_0x4ed116 * 0x9) * 0.25, _0x572300.landT = 0x0;else !_0x572300.landed && (_0x572300.landed = true, _0x572300.model.position.copy(_0x572300.land), _0x572300.model.rotation.z = 0x0, _0x572300.landT = _0x56ee8f);
    if (_0x572300.landed && _0x572300.landT) {
      const _0x5498da = (_0x56ee8f - _0x572300.landT) / 0x1f4;
      if (_0x5498da < 0x1) {
        const _0x230580 = Math.exp(-4.5 * _0x5498da) * Math.cos(_0x5498da * 0xe);
        _0x572300.model.scale.setScalar(_0x572300.normScale * (0x1 + _0x230580 * 0.22)), _0x572300.model.scale.y *= 0x1 - _0x230580 * 0.3;
      } else _0x572300.model.scale.setScalar(_0x572300.normScale * (0x1 + Math.sin(_0x56ee8f / 0x12c) * 0.03));
    }
  }
  rendererRef.render(scene, cam);
}
