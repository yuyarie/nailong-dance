import * as THREE from 'three';
import { ensureCtx, Music, startMenuBgm, stopMenuBgm, setMenuBgmVolume, sfxClick, sfxBoing, sfxEndVoice, sfxPokeVoice, sfxRandomVoice } from "./audio.js";
import { runOpening, updateOpening, begin as _0x48e1ce, Opening } from "./opening.js";
import { loadDancer, updateDancer, setSkin, celebrate, lieDown, resetBody, Dancer, clickBody, clickHead, setAccessory } from "./dancer.js";
import { initFx, updateFx, Fx, burst } from "./fx.js";
import { Game, startGame, stopGame, pauseGame, resumeGame, hitLane, releaseLane } from "./game.js";
import { SKINS, SONGS, initUI, showUIRoot, showStageUI, showScreen, showResult, checkAch, toast, renderHome, Store } from "./ui.js";

import "./customstore.js";
const $ = _0xcb6813 => document.getElementById(_0xcb6813),
  renderer = new THREE.WebGLRenderer({
    'antialias': true
  });
renderer.setPixelRatio(Math.min(devicePixelRatio, 0x2)), renderer.setSize(innerWidth, innerHeight), renderer.shadowMap.enabled = true, renderer.shadowMap.type = THREE.PCFSoftShadowMap, renderer.outputColorSpace = THREE.SRGBColorSpace, $("app").appendChild(renderer.domElement);
const scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera(0x2d, innerWidth / innerHeight, 0.1, 0x64),
  CAM_HOME = new THREE.Vector3(0x0, 2.1, 5.4),
  CAM_PLAY = new THREE.Vector3(0x0, 2.35, 6.4),
  CAM_INTRO = new THREE.Vector3(0x0, 2.6, 7.5);
camera.position.copy(CAM_HOME);
const camTarget = new THREE.Vector3(0x0, 1.05, 0x0);
let stageGroup = null,
  DEFAULT_STAGE = {
    bg: 0x1c1030,
    fog: [10, 34],
    floor: 0x2a1745,
    ring: 0xff3b6b,
    c1: 0xff3b6b,
    c2: 0x36d1ff,
    lampA: 1,
    lampB: 1
  },
  keyLight = null,
  lampL = null,
  lampR = null,
  floorMesh = null,
  ringMesh = null;
function buildStage() {
  stageGroup && (stageGroup.traverse(_0x2115ef => {
    _0x2115ef.isMesh && (_0x2115ef.geometry.dispose(), (Array.isArray(_0x2115ef.material) ? _0x2115ef.material : [_0x2115ef.material]).forEach(_0xd9284 => _0xd9284.dispose()));
  }), scene.remove(stageGroup));
  stageGroup = new THREE.Group(), scene.add(stageGroup), scene.background = new THREE.Color(DEFAULT_STAGE.bg), scene.fog = new THREE.Fog(DEFAULT_STAGE.bg, DEFAULT_STAGE.fog[0x0], DEFAULT_STAGE.fog[0x1]), floorMesh = new THREE.Mesh(new THREE.CircleGeometry(5.2, 0x48), new THREE.MeshStandardMaterial({
    'color': DEFAULT_STAGE.floor,
    'roughness': 0.55,
    'metalness': 0.35
  })), floorMesh.rotation.x = -Math.PI / 0x2, floorMesh.receiveShadow = true, stageGroup.add(floorMesh), ringMesh = new THREE.Mesh(new THREE.RingGeometry(5.06, 5.2, 0x48), new THREE.MeshBasicMaterial({
    'color': DEFAULT_STAGE.ring,
    'side': THREE.DoubleSide
  })), ringMesh.rotation.x = -Math.PI / 0x2, ringMesh.position.y = 0.012, stageGroup.add(ringMesh);
  for (let _0x481475 = 0x0; _0x481475 < 0x8; _0x481475++) {
    const _0x3a987a = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 4.6), new THREE.MeshBasicMaterial({
      'color': DEFAULT_STAGE.ring,
      'transparent': true,
      'opacity': 0.16
    }));
    _0x3a987a.rotation.x = -Math.PI / 0x2, _0x3a987a.rotation.z = _0x481475 * Math.PI / 0x8, _0x3a987a.position.y = 0.008, stageGroup.add(_0x3a987a);
  }
  for (let _0x47626d = 0x0; _0x47626d < 0xb; _0x47626d++) {
    const _0x405b0d = 0x2 + Math.random() * 4.5,
      _0x5835b0 = 0x1 + Math.random() * 1.4,
      _0x5a0c11 = new THREE.Mesh(new THREE.BoxGeometry(_0x5835b0, _0x405b0d, 0.6), new THREE.MeshStandardMaterial({
        'color': 0xe0820,
        'roughness': 0.9,
        'emissive': _0x47626d % 0x2 ? DEFAULT_STAGE.c1 : DEFAULT_STAGE.c2,
        'emissiveIntensity': 0.05
      }));
    _0x5a0c11.position.set(-0xb + _0x47626d * 2.2 + (Math.random() - 0.5), _0x405b0d / 0x2 - 0.5, -9.5 - Math.random() * 0x2), stageGroup.add(_0x5a0c11);
  }
  if (!scene.userData.ambient) {
    const _0x2c82ae = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(_0x2c82ae), scene.userData.ambient = _0x2c82ae;
  }
  keyLight = new THREE.DirectionalLight(0xffffff, 1.15), keyLight.position.set(0x4, 0x7, 0x5), keyLight.castShadow = true, keyLight.shadow.mapSize.set(0x400, 0x400), keyLight.shadow.camera.near = 0x1, keyLight.shadow.camera.far = 0x19, keyLight.shadow.camera.left = -0x6, keyLight.shadow.camera.right = 0x6, keyLight.shadow.camera.top = 0x6, keyLight.shadow.camera.bottom = -0x6, stageGroup.add(keyLight), lampL = new THREE.PointLight(DEFAULT_STAGE.c1, 2.2, 0xf, 1.8), lampL.position.set(-0x4, 2.4, 2.5), lampR = new THREE.PointLight(DEFAULT_STAGE.c2, 2.2, 0xf, 1.8), lampR.position.set(0x4, 2.4, 2.5), stageGroup.add(lampL, lampR);
  if (!Fx.ready) initFx(scene, camera);
  Fx.camBase.copy(CAM_HOME);
}
console.log("%c========== 奶娃街舞 · 启动 ==========", "color:#ffe17a;font-size:14px;font-weight:bold"), console.log("[启动] ① 后台开始下载舞者模型 rigged.glb（17MB）…");
const tBoot0 = performance.now(),
  dancerReady = new Promise(_0x153580 => {
    loadDancer('rigged.glb').then(() => {
      scene.add(Dancer.root);
      const _0x2fafa5 = SKINS.find(_0x41d7c8 => _0x41d7c8.id === Store.data.equipped) || SKINS[0x0];
      setSkin(_0x2fafa5), main.applyAccessories(), console.log('%c[启动]\x20✓\x20舞者模型就位并完成部位切分\x20(' + ((performance.now() - tBoot0) / 0x3e8).toFixed(0x2) + 's)', 'color:#7fffd4;font-weight:bold'), _0x153580(true);
    })['catch'](_0x2b0dc9 => {
      console.error("[启动] ❌ 舞者模型加载失败（不阻塞进游戏）：", _0x2b0dc9), _0x153580(false);
    });
  });
addEventListener('dancer-progress', _0x1234b6 => {
  const _0x106f0b = _0x1234b6.detail;
  $("loadBar").style.width = 0x5 + _0x106f0b * 0.55 + '%', $("loadSub").textContent = '舞者模型下载中\x20' + _0x106f0b + '%';
});
Music.el.addEventListener("canplaythrough", () => console.log("[启动] ✓ 所选歌曲 已就绪"), {
  'once': true
}), Music.el.addEventListener("error", () => console.warn('[启动]\x20⚠\x20所选歌曲\x20加载失败，游戏可照常进行'), {
  'once': true
});
const main = {
  'applySkin'(_0x30a88b) {
    setSkin(_0x30a88b);
    if (null) {}
  },
  'applyAccessories'() {
    const _0x5338ca = Store.data.accEquipped || {};
    setAccessory('head', _0x5338ca.head || null), setAccessory('body', _0x5338ca.body || null), setAccessory('cape', _0x5338ca.cape || null);
    if (null) {}
  },
  'applyQuality'(_0x2f98ce) {
    let _0x3c25dd = _0x2f98ce >= 0x3 ? Math.min(devicePixelRatio, 0x3) : _0x2f98ce >= 0x2 ? Math.min(devicePixelRatio, 0x2) : _0x2f98ce >= 0x1 ? Math.min(devicePixelRatio, 1.5) : _0x2f98ce;
    renderer.setPixelRatio(_0x3c25dd);
  },
  async startShow(song, audio, chart) {
    ensureCtx();
    Music.setSong(audio);
    const duration = await Music.awaitDuration();
    if (Music.el.error || !Number.isFinite(Music.el.duration) || chart.endTime > duration + 0.2) {
      throw new Error('音乐加载失败或谱面超出音乐时长，请检查配套文件');
    }
    stopMenuBgm();
    const settings = Store.data.set;
    showUIRoot(false); showStageUI(true); camera.position.copy(CAM_PLAY); Fx.camBase.copy(CAM_PLAY);
    resetBody(); Game.hooks.onEnd = onShowEnd; Game.hooks.onScore = null;
    Game.hooks.onJudge = null; Game.hooks.onSwap = null;
    document.getElementById('btnPause').style.display = '';
    startGame({ diff: 'chart', bpm: chart.bpm, timing: chart.timing,
      offset: settings.offset, speed: settings.speed, duration, songId: song.id,
      customNotes: chart.notes });
    startStallWatch();
  },
  'resume'() {
    resumeGame(), $("pauseOv").classList.remove('on');
  },
  'quitShow'() {
    stopStallWatch();
    return stopGame(false), resetBody(), this.applyQuality(Store.data.set.quality), showStageUI(false), showUIRoot(true), camera.position.copy(CAM_HOME), Fx.camBase.copy(CAM_HOME), startMenuBgm(), false;
  }
};
initUI(main), main.applyQuality(Store.data.set.quality);
let _stallIv = 0x0,
  _stallEl = null,
  _stallMiss = 0x0;
function showStallTip() {
  if (!_stallEl) {
    _stallEl = document.createElement("div"), _stallEl.className = "stall-tip";
    const _0xf132bc = document.getElementById("stageUI");
    if (_0xf132bc) _0xf132bc.appendChild(_stallEl);
  }
  _stallEl.textContent = "歌曲还在加载…稍等一下就好", _stallEl.classList.add('on');
}
function hideStallTip() {
  if (_stallEl) _stallEl.classList.remove('on');
}
function startStallWatch() {
  stopStallWatch(), _stallMiss = 0x0, _stallIv = setInterval(() => {
    if (!Game.playing || Game.paused) return;
    if (Music.time() > 0.5) {
      _stallMiss = 0x0, hideStallTip();
      return;
    }
    _stallMiss++;
    if (_stallMiss === 0x4 || _stallMiss > 0x4 && _stallMiss % 0x6 === 0x0) {
      showStallTip();
      try {
        Music.el.play()["catch"](() => {});
      } catch (_0x4c90b4) {}
    }
  }, 0x1f4);
}
function stopStallWatch() {
  _stallIv && (clearInterval(_stallIv), _stallIv = 0x0), hideStallTip();
}
function onShowEnd(_0x418ca4) {
  stopStallWatch(), showStageUI(false), camera.position.copy(CAM_HOME), Fx.camBase.copy(CAM_HOME);
  const _0x288f6c = Store.data.stats.bestScore,
    _0x389b98 = _0x418ca4.score > _0x288f6c;
  showResult(_0x418ca4, _0x389b98);
  const _0x3d11ed = checkAch();
  if (_0x3d11ed.length) setTimeout(() => toast("🏆 成就达成：" + _0x3d11ed.map(_0xbdb3a5 => _0xbdb3a5.name).join('、')), 0x258);
  resetBody();
  if (_0x418ca4.acc >= 0.8) celebrate();else lieDown();
  showUIRoot(true), startMenuBgm(), setTimeout(() => sfxEndVoice(), 0x1f4);
}
addEventListener('keydown', _0x2c1b43 => {
  if (Game.playing) {
    const lane = Store.data.set.keys.indexOf(_0x2c1b43.code);
    if (lane !== -1) {
      _0x2c1b43.preventDefault();
      if (!_0x2c1b43.repeat) hitLane(lane);
    } else {
      if (_0x2c1b43.code === 'Escape' || _0x2c1b43.code === "KeyP") {
        _0x2c1b43.preventDefault();
        Game.paused ? main.resume() : (pauseGame(), $('pauseOv').classList.add('on'));
      }
    }
  }
}), addEventListener("keyup", _0x3d3146 => {
  const lane = Store.data.set.keys.indexOf(_0x3d3146.code);
  if (Game.playing && lane !== -1) relLane(lane);
});
const _pressT = [0x0, 0x0, 0x0, 0x0];
function pressLane(_0x4bb0a2, _0x1f0659) {
  const _0x3f791e = performance.now();
  if (_0x3f791e - _pressT[_0x4bb0a2] < 0x3c) return;
  _pressT[_0x4bb0a2] = _0x3f791e;
  if (window.__ts) window.__ts.hit++;
  hitLane(_0x4bb0a2, _0x1f0659);
}
const relLane = _0x5a52a0 => {
  if (window.__ts) window.__ts.rel++;
  releaseLane(_0x5a52a0);
};
document.querySelectorAll("#touchPads button").forEach(_0x1a33cc => {
  const _0x529fa2 = +_0x1a33cc.dataset.l;
  _0x1a33cc.addEventListener("pointerdown", _0x1729cd => {
    _0x1729cd.preventDefault(), pressLane(_0x529fa2);
  }), _0x1a33cc.addEventListener("touchstart", _0x290273 => {
    _0x290273.preventDefault(), pressLane(_0x529fa2);
  }, {
    'passive': false
  }), _0x1a33cc.addEventListener("pointerup", () => relLane(_0x529fa2)), _0x1a33cc.addEventListener("pointercancel", () => relLane(_0x529fa2)), _0x1a33cc.addEventListener("touchend", () => relLane(_0x529fa2)), _0x1a33cc.addEventListener('touchcancel', () => relLane(_0x529fa2));
});
const swipeLayer = $("swipeLayer"),
  swipes = new Map(),
  swipeOn = () => (Store.data.set.swipe == null ? 0x1 : Store.data.set.swipe) && true,
  syncSwipeUI = () => document.body.classList.toggle('swipeOn', swipeOn()),
  laneAt = _0x24866f => {
    const _0x5ab679 = document.getElementById('noteWrap');
    if (_0x5ab679) {
      const _0x34d637 = _0x5ab679.getBoundingClientRect();
      if (_0x34d637.width > 0x1) {
        let _0x14589d = 0x0,
          _0x4c305d = Infinity;
        for (let _0x2cf83c = 0x0; _0x2cf83c < 0x4; _0x2cf83c++) {
          const _0xa96020 = Math.abs(_0x34d637.left + _0x34d637.width * (0.13 + 0.25 * _0x2cf83c) - _0x24866f);
          _0xa96020 < _0x4c305d && (_0x4c305d = _0xa96020, _0x14589d = _0x2cf83c);
        }
        return _0x14589d;
      }
    }
    return Math.min(0x3, Math.max(0x0, _0x24866f / innerWidth * 0x4 | 0x0));
  },
  swipeJudge = (_0x38bf31, _0xb53af6, _0x57bc0a, _0x450b29) => {
    const _0x4955e8 = _0xb53af6 - _0x38bf31.x,
      _0x1dfe96 = _0x57bc0a - _0x38bf31.y;
    if (_0x4955e8 * _0x4955e8 + _0x1dfe96 * _0x1dfe96 < 0x1a * 0x1a) return;
    clearTimeout(_0x38bf31.timer), swipes['delete'](_0x450b29);
    const _0x120681 = Math.abs(_0x4955e8) > Math.abs(_0x1dfe96) ? _0x4955e8 > 0x0 ? 0x3 : 0x0 : _0x1dfe96 > 0x0 ? 0x1 : 0x2;
    pressLane(_0x120681), relLane(_0x120681);
  },
  swipeTap = (_0x478aa9, _0x5a2afd) => {
    const _0xb13ef9 = swipes.get(_0x478aa9);
    swipes["delete"](_0x478aa9);
    if (!_0xb13ef9) return;
    clearTimeout(_0xb13ef9.timer);
    if (_0xb13ef9.held) {
      relLane(_0xb13ef9.lane);
      return;
    }
    if (performance.now() - _0xb13ef9.t < 0x190) {
      const _0x1db310 = laneAt(_0x5a2afd);
      pressLane(_0x1db310), relLane(_0x1db310);
    }
  },
  swipeStart = (_0x3d6761, _0x5f3be5, _0x20e636) => {
    const _0x23cc67 = {
      'x': _0x5f3be5,
      'y': _0x20e636,
      't': performance.now(),
      'held': false,
      'lane': laneAt(_0x5f3be5)
    };
    _0x23cc67.timer = setTimeout(() => {
      swipes.has(_0x3d6761) && (_0x23cc67.held = true, pressLane(_0x23cc67.lane));
    }, 0x190), swipes.set(_0x3d6761, _0x23cc67);
  };
swipeLayer.addEventListener("pointerdown", _0x1d7964 => {
  if (!Game.playing || Game.paused) return;
  if (handleClimbPoke(_0x1d7964)) return;
  if (!swipeOn()) return;
  if (_0x1d7964.pointerType !== "touch") return;
  swipeStart(_0x1d7964.pointerId, _0x1d7964.clientX, _0x1d7964.clientY);
}), swipeLayer.addEventListener("pointermove", _0x3f353f => {
  const _0x511234 = swipes.get(_0x3f353f.pointerId);
  if (_0x511234) swipeJudge(_0x511234, _0x3f353f.clientX, _0x3f353f.clientY, _0x3f353f.pointerId);
}), swipeLayer.addEventListener("pointerup", _0x4460b2 => swipeTap(_0x4460b2.pointerId, _0x4460b2.clientX)), swipeLayer.addEventListener("pointercancel", _0x2ce29a => swipes["delete"](_0x2ce29a.pointerId)), swipeLayer.addEventListener("touchstart", _0x4314e2 => {
  if (!Game.playing || Game.paused) return;
  if (_0x4314e2.touches.length === 0x1 && handleClimbPoke(_0x4314e2.touches[0x0])) {
    _0x4314e2.preventDefault();
    return;
  }
  if (!swipeOn()) return;
  _0x4314e2.preventDefault();
  for (const _0x241c16 of _0x4314e2.changedTouches) swipeStart('t' + _0x241c16.identifier, _0x241c16.clientX, _0x241c16.clientY);
}, {
  'passive': false
}), swipeLayer.addEventListener("touchmove", _0x433544 => {
  if (!swipes.size) return;
  _0x433544.preventDefault();
  for (const _0x364d28 of _0x433544.changedTouches) {
    const _0x5d382c = swipes.get('t' + _0x364d28.identifier);
    if (_0x5d382c) swipeJudge(_0x5d382c, _0x364d28.clientX, _0x364d28.clientY, 't' + _0x364d28.identifier);
  }
}, {
  'passive': false
}), swipeLayer.addEventListener("touchend", _0x52ffce => {
  for (const _0x1f39ac of _0x52ffce.changedTouches) swipeTap('t' + _0x1f39ac.identifier, _0x1f39ac.clientX);
}), swipeLayer.addEventListener('touchcancel', _0x21b455 => {
  for (const _0x51b3f5 of _0x21b455.changedTouches) swipes["delete"]('t' + _0x51b3f5.identifier);
});
if (new URLSearchParams(location.search).get("touchdebug")) {
  const stat = {
    'pd': 0x0,
    'ts': 0x0,
    'tm': 0x0
  };
  window.__ts = {
    'hit': 0x0,
    'rel': 0x0
  };
  const dbg = document.createElement("div");
  dbg.style.cssText = 'position:fixed;left:6px;top:6px;z-index:99999;background:#000000cc;color:#6f6;font:12px/1.5\x20monospace;padding:8px\x2010px;border-radius:8px;pointer-events:none;white-space:pre', document.body.appendChild(dbg), addEventListener('pointerdown', () => stat.pd++, true), addEventListener("touchstart", () => stat.ts++, true), addEventListener("touchmove", () => stat.tm++, true), setInterval(() => {
    dbg.textContent = "PointerEvent:" + !!window.PointerEvent + '\x0a' + ("pointerdown:" + stat.pd + " touchstart:" + stat.ts + " touchmove:" + stat.tm + '\x0a') + ("hitLane:" + window.__ts.hit + " release:" + window.__ts.rel + '\x0a') + ('playing:' + Game.playing + " swipeOn:" + document.body.classList.contains("swipeOn") + '\x0a') + ('layer:' + getComputedStyle(swipeLayer).display + " pads:" + getComputedStyle($("touchPads")).display + '\x0a') + navigator.userAgent.slice(0x0, 0x40);
  }, 0x190);
}
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight, camera.updateProjectionMatrix(), renderer.setSize(innerWidth, innerHeight), void 0;
});
const raycaster = new THREE.Raycaster(),
  pointerVec = new THREE.Vector2();
function handleClimbPoke(_0x3947af) {
  if (!(Game.playing && Dancer._climbing && pokeAnchors)) return false;
  const _0x5b4588 = renderer.domElement.getBoundingClientRect(),
    _0x1fdd35 = _0x135100 => {
      _0x135100.getWorldPosition(pokeV).project(camera);
      const _0x54d52d = _0x5b4588.left + (pokeV.x * 0.5 + 0.5) * _0x5b4588.width,
        _0x568813 = _0x5b4588.top + (-pokeV.y * 0.5 + 0.5) * _0x5b4588.height;
      return Math.hypot(_0x54d52d - _0x3947af.clientX, _0x568813 - _0x3947af.clientY) < 0x6e;
    };
  if (_0x1fdd35(pokeAnchors.head)) return clickHead() && (toast("👶 奶娃被安抚好了，继续跳！"), window.dispatchEvent(new CustomEvent("baby-poke"))), true;
  if (_0x1fdd35(pokeAnchors.handL) || _0x1fdd35(pokeAnchors.handR)) return clickBody() && (toast("👆 再点头部红圈，安抚住奶娃！"), flashHandRings(), window.dispatchEvent(new CustomEvent("baby-poke"))), true;
  return true;
}
renderer.domElement.addEventListener("pointerdown", _0x5c566d => {
  if (!Game.playing) {
    sfxPokeVoice();
    if (Dancer.body) {
      const _0x3a6e3d = Dancer.body;
      _0x3a6e3d.scale.setScalar(1.15), setTimeout(() => {
        if (_0x3a6e3d) _0x3a6e3d.scale.setScalar(0x1);
      }, 0x78);
    }
    return;
  }
  if (handleClimbPoke(_0x5c566d)) return;
  if (!Dancer.ready || !Dancer.root) return;
  const _0x1caf3b = renderer.domElement.getBoundingClientRect();
  pointerVec.x = (_0x5c566d.clientX - _0x1caf3b.left) / _0x1caf3b.width * 0x2 - 0x1, pointerVec.y = -((_0x5c566d.clientY - _0x1caf3b.top) / _0x1caf3b.height) * 0x2 + 0x1, raycaster.setFromCamera(pointerVec, camera);
  const _0x1961d0 = [];
  Dancer.root.traverse(_0x2b04da => {
    if (_0x2b04da.isMesh) _0x1961d0.push(_0x2b04da);
  });
  const _0xc693d8 = raycaster.intersectObjects(_0x1961d0, false);
  if (_0xc693d8.length > 0x0) {
    const _0x4cda2c = _0xc693d8[0x0].object;
    let _0x19fe9f = false;
    Dancer.root.traverse(_0x3d73a1 => {
      if (_0x3d73a1 === _0x4cda2c && Dancer.parts.head && Dancer.parts.head.mesh === _0x3d73a1) _0x19fe9f = true;
    }), _0x19fe9f ? clickHead() && (toast('👶\x20奶娃被安抚好了，继续跳！'), window.dispatchEvent(new CustomEvent("baby-poke"))) : clickBody() && (toast('👆\x20再点头部红圈，安抚住奶娃！'), flashHandRings(), window.dispatchEvent(new CustomEvent("baby-poke")));
  }
});
const climbTip = document.createElement("div");
climbTip.id = "climbTip", climbTip.style.cssText = "position:fixed;left:50%;top:7%;transform:translateX(-50%);z-index:8888;background:#ff3b6bcc;color:#fff;font:700 17px/1.4 sans-serif;padding:11px 22px;border-radius:16px;pointer-events:none;opacity:0;transition:opacity .4s;text-align:center;", climbTip.innerHTML = '👶\x20奶娃开始往上爬了！<br><small>先点手腕黄圈\x20→\x20再点头部红圈\x20安抚它</small>', document.body.appendChild(climbTip);
const pokeRings = {
  'handL': mkPokeRing("hand", '👋'),
  'handR': mkPokeRing("hand", '👋'),
  'head': mkPokeRing("head", '👶')
};
function mkPokeRing(_0x27b844, _0x130639) {
  const _0x34e4be = document.createElement('div');
  return _0x34e4be.className = "poke-ring " + _0x27b844, _0x34e4be.innerHTML = '<span>' + _0x130639 + "</span>", _0x34e4be.style.display = "none", document.body.appendChild(_0x34e4be), _0x34e4be;
}
let pokeAnchors = null;
function ensurePokeAnchors() {
  if (pokeAnchors || !Dancer.ready || !Dancer.parts.head) return;
  const _0x8337c1 = Dancer.parts,
    _0x43e85b = new THREE.Object3D();
  _0x43e85b.position.set(0x0, 0.26, 0x0), _0x8337c1.head.pivot.add(_0x43e85b);
  const _0xe532b2 = new THREE.Object3D();
  _0xe532b2.position.set(0x0, -0.47, 0.03);
  const _0x24c0cf = new THREE.Object3D();
  _0x24c0cf.position.set(0x0, -0.47, 0.03), _0x8337c1.armL && _0x8337c1.armL.pivot.add(_0xe532b2), _0x8337c1.armR && _0x8337c1.armR.pivot.add(_0x24c0cf), pokeAnchors = {
    'head': _0x43e85b,
    'handL': _0xe532b2,
    'handR': _0x24c0cf
  };
}
const pokeV = new THREE.Vector3();
function updatePokeRings() {
  window.__climbEnabled = !(Store.data.set.climb === 0x0), window.__quadOn = false;
  const _0x4f22cd = window.__quadOn ? false : Game.playing && Dancer._climbing;
  if (!_0x4f22cd && climbTip.style.opacity === '1') climbTip.style.opacity = '0';
  const _0x21fd6f = renderer.domElement.getBoundingClientRect();
  for (const _0x152525 in pokeRings) {
    const _0x1bebb7 = pokeRings[_0x152525];
    if (!_0x4f22cd || !pokeAnchors) {
      if (_0x1bebb7.style.display !== "none") _0x1bebb7.style.display = 'none';
      continue;
    }
    const _0x113e4d = pokeAnchors[_0x152525];
    if (!_0x113e4d) {
      _0x1bebb7.style.display = "none";
      continue;
    }
    _0x113e4d.getWorldPosition(pokeV).project(camera);
    if (pokeV.z > 0x1) {
      _0x1bebb7.style.display = 'none';
      continue;
    }
    const _0x27cca7 = _0x21fd6f.left + (pokeV.x * 0.5 + 0.5) * _0x21fd6f.width,
      _0x154520 = _0x21fd6f.top + (-pokeV.y * 0.5 + 0.5) * _0x21fd6f.height;
    _0x1bebb7.style.display = "flex", _0x1bebb7.style.transform = "translate(" + _0x27cca7 + "px," + _0x154520 + "px) translate(-50%,-50%)";
  }
}
window.addEventListener("baby-climb-start", () => {
  climbTip.style.opacity = '1', ensurePokeAnchors();
}), window.addEventListener('baby-climb-end', () => {
  climbTip.style.opacity = '0';
});
function flashHandRings() {
  [pokeRings.handL, pokeRings.handR].forEach(_0x2501ac => {
    _0x2501ac.classList.add("hit"), setTimeout(() => _0x2501ac.classList.remove("hit"), 0x104);
  });
}
console.log("[启动] ② 预加载背景音乐…"), Music.load(), console.log("[启动] ③ 搭建主舞台（默认灯光/地板/城市背景）…"), buildStage(), $("loadBar").style.width = '5%', console.log("[启动] ④ 初始化开场动画场景…"), runOpening(renderer, enterHome);
const btnStart = $("loadStart");
btnStart.classList.remove('hidden'), btnStart.disabled = false, $('loadTxt').textContent = '准备好了吗？', $("loadSub").textContent = "点击按钮，欣赏开场（舞者模型在后台继续加载）", console.log("%c[启动] ⑤ 初始化完成，「开跳」按钮已可点击 ✓", 'color:#7fffd4;font-weight:bold'), btnStart.addEventListener("click", () => {
  console.log('%c[启动]\x20👆\x20用户点击「开跳」→\x20解锁音频，开始开场动画', "color:#36d1ff;font-weight:bold"), ensureCtx(), sfxClick(), sfxBoing(), setMenuBgmVolume(Store.data.set.vol), $("loadOverlay").classList.add("hide"), _0x48e1ce();
}, {
  'once': true
});
function enterHome() {
  console.log('%c[启动]\x20⑥\x20开场动画播放完毕，准备进入主界面…', 'color:#36d1ff;font-weight:bold'), Promise.race([dancerReady, new Promise(_0x1a849d => setTimeout(() => {
    console.warn('[启动]\x20⚠\x20等待舞者超时，先进入主界面'), _0x1a849d(false);
  }, 0x2ee0))]).then(_0x270a6d => {
    console.log(_0x270a6d ? '[启动]\x20⑦\x20进入主界面（舞者已在舞台上）' : "[启动] ⑦ 进入主界面（舞者稍后自动出现）"), $("loadBar").style.width = "100%", showUIRoot(true), showScreen('scr-home'), renderHome(), setMenuBgmVolume(Store.data.set.vol), startMenuBgm();
    if (_0x270a6d) burst(new THREE.Vector3(0x0, 1.2, 0.5), 0xffe17a, 0x46);else toast("舞者还在换装，马上就好…");
    setTimeout(() => sfxRandomVoice(), 0x9c4 + Math.random() * 0x9c4), setTimeout(() => {
      const _0x159380 = new Date(),
        _0x19ce7e = _0x159380.getFullYear() + '-' + String(_0x159380.getMonth() + 0x1).padStart(0x2, '0') + '-' + String(_0x159380.getDate()).padStart(0x2, '0');
      try {
        if (localStorage.getItem("naiwa_fan_tip") === _0x19ce7e) return;
      } catch (_0x2a0949) {
        return;
      }
      if (!$("scr-home").classList.contains('cur')) return;
      $("fanModal").classList.add('on');
      const _0x270c91 = () => {
        $("fanModal").classList.remove('on');
        if ($('fanTipChk').checked) try {
          localStorage.setItem("naiwa_fan_tip", _0x19ce7e);
        } catch (_0x32d0ae) {}
      };
      $("fanOk").onclick = () => {
        sfxClick(), _0x270c91();
      }, $('fanClose').onclick = () => {
        sfxClick(), _0x270c91();
      };
    }, 0x578), setTimeout(() => {
      if (!$("scr-home").classList.contains("cur")) return;
      if ($("fanModal").classList.contains('on')) return;
    }, 0x1770);
  });
}
const clock = new THREE.Clock();
let lastBeat = 0x0;
function loop() {
  requestAnimationFrame(loop);
  const _0x3c824d = Math.min(clock.getDelta(), 0.05),
    _0x5aa202 = performance.now(),
    _0x3e2177 = clock.elapsedTime;
  if (Opening.active) {
    updateOpening(_0x3c824d, _0x5aa202);
    return;
  }
  const _0xdd337d = Game.playing && !Game.paused,
    _0x4ea01f = Game.playing ? (Game.cfg.timing.filter(point => point.t <= Music.time()).at(-1)?.bpm || Game.cfg.bpm) : 174;
  updateDancer(_0x3c824d, _0x4ea01f, _0xdd337d);
  let _0x124ff6 = false;
  if (Game.playing) {
    const _0x3b8794 = Math.floor(Music.time() * _0x4ea01f / 0x3c);
    _0x3b8794 !== lastBeat && (lastBeat = _0x3b8794, _0x124ff6 = true);
  }
  updateFx(_0x3c824d, _0x3e2177, DEFAULT_STAGE, _0xdd337d, _0x124ff6);
  !Game.playing ? (camera.position.x += (CAM_HOME.x + Math.sin(_0x3e2177 * 0.25) * 0.55 - camera.position.x) * _0x3c824d * 0x2, camera.position.y += (CAM_HOME.y - camera.position.y) * _0x3c824d * 0x2, camera.position.z += (CAM_HOME.z - camera.position.z) * _0x3c824d * 0x2, camera.lookAt(camTarget)) : (camera.position.x += (CAM_PLAY.x - camera.position.x) * _0x3c824d * 0x4, camera.position.y += (CAM_PLAY.y - camera.position.y) * _0x3c824d * 0x4, camera.lookAt(camTarget.x, 0.9, 0x0));
  if (ringMesh) ringMesh.material.opacity = 0.75 + Math.sin(_0x3e2177 * (_0xdd337d ? 0x6 : 0x2)) * 0.25;
  lampL && (lampL.intensity = 0x2 + Math.sin(_0x3e2177 * 0x3) * 0.6, lampR.intensity = 0x2 + Math.cos(_0x3e2177 * 0x3) * 0.6);
  renderer.render(scene, camera);
  updatePokeRings();
}
loop();
