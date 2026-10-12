import * as THREE from 'three';
import { Music, sfxPerfect, sfxGood, sfxMiss, sfxRandomVoice } from "./audio.js";
import { doAction, stumble, addMiss } from "./dancer.js";
import { laneFlash, burst, ringPulse, shake } from "./fx.js";
const WIN_GOOD = 0.15,
  WIN_PERFECT = 0.07,
  WIN_MISS = 0.19,
  LANE_HEX = [0xff3b6b, 0x36d1ff, 0xffe17a, 0x7a4dff];
export const Game = {
  'playing': false,
  'paused': false,
  'cfg': null,
  'notes': [],
  'dom': [],
  'score': 0x0,
  'combo': 0x0,
  'maxCombo': 0x0,
  'cnt': {
    'perfect': 0x0,
    'good': 0x0,
    'miss': 0x0
  },
  'hooks': {},
  'activeLanes': null,
  'endless': false,
  '_raf': 0x0,
  '_lastY': 0x0
};
function mulberry32(_0x4fcd92) {
  return function () {
    _0x4fcd92 |= 0x0, _0x4fcd92 = _0x4fcd92 + 0x6d2b79f5 | 0x0;
    let _0x2e8fd9 = Math.imul(_0x4fcd92 ^ _0x4fcd92 >>> 0xf, 0x1 | _0x4fcd92);
    return _0x2e8fd9 = _0x2e8fd9 + Math.imul(_0x2e8fd9 ^ _0x2e8fd9 >>> 0x7, 0x3d | _0x2e8fd9) ^ _0x2e8fd9, ((_0x2e8fd9 ^ _0x2e8fd9 >>> 0xe) >>> 0x0) / 0x100000000;
  };
}
function strSeed(_0x599794) {
  let _0x49ac68 = 0x811c9dc5;
  for (let _0x26f322 = 0x0; _0x26f322 < _0x599794.length; _0x26f322++) {
    _0x49ac68 ^= _0x599794.charCodeAt(_0x26f322), _0x49ac68 = Math.imul(_0x49ac68, 0x1000193);
  }
  return _0x49ac68 >>> 0x0;
}
export function genChart(_0x43c6d3, _0x1818a2, _0xbb09bb, _0x452e01, _0x4fa17a = '', _0x34d18d = 0x0) {
  const _0x34ef93 = mulberry32(strSeed((_0x4fa17a || 'x') + _0x43c6d3)),
    _0x479094 = 0x3c / _0x1818a2,
    _0x48e91c = Math.max(1.2, _0x452e01 + _0x479094 * 0x4),
    _0x566a10 = Math.max(_0x48e91c + 0x4, _0xbb09bb - 1.6),
    _0x442454 = [],
    _0x3008a8 = {
      'easy': {
        'div': 0x1,
        'rest': 0.25,
        'dbl': 0x0,
        'burst': 0x0
      },
      'normal': {
        'div': 0x2,
        'rest': 0.1,
        'dbl': 0.07,
        'burst': 0x0
      },
      'hard': {
        'div': 0x2,
        'rest': 0.03,
        'dbl': 0.14,
        'burst': 0.05
      },
      'endless': {
        'div': 0x2,
        'rest': 0.12,
        'dbl': 0.08,
        'burst': 0x0
      }
    }[_0x43c6d3],
    _0x21612c = _0x34d18d ? {
      'easy': 0.12,
      'normal': 0.14,
      'hard': 0.1
    }[_0x43c6d3] ?? 0.12 : 0x0;
  let _0x4f96d8 = _0x34ef93() * 0x4 | 0x0;
  for (let _0xfef3dd = _0x48e91c; _0xfef3dd < _0x566a10; _0xfef3dd += _0x479094 / _0x3008a8.div) {
    if (_0x34ef93() < _0x3008a8.rest) continue;
    const _0x4eba7e = {
      't': _0xfef3dd,
      'lane': _0x4f96d8,
      'state': 0x0
    };
    if (_0x21612c && _0x34ef93() < _0x21612c && _0xfef3dd + _0x479094 * 0x3 < _0x566a10) _0x4eba7e.len = _0x479094 * (0.6 + _0x34ef93() * 0.5);
    _0x442454.push(_0x4eba7e);
    if (_0x34ef93() < _0x3008a8.dbl) {
      const _0x5d51b5 = (_0x4f96d8 + 0x1 + (_0x34ef93() * 0x3 | 0x0)) % 0x4;
      _0x442454.push({
        't': _0xfef3dd,
        'lane': _0x5d51b5,
        'state': 0x0
      });
    }
    if (_0x34ef93() < _0x3008a8.burst) {
      const _0x14a715 = (_0x4f96d8 + 0x1) % 0x4,
        _0x34e27d = (_0x4f96d8 + 0x2) % 0x4;
      _0x442454.push({
        't': _0xfef3dd + _0x479094 / 0x4,
        'lane': _0x14a715,
        'state': 0x0
      }), _0x442454.push({
        't': _0xfef3dd + _0x479094 / 0x2,
        'lane': _0x34e27d,
        'state': 0x0
      });
    }
    _0x4f96d8 = _0x43c6d3 === "endless" || _0x34ef93() < 0.7 ? (_0x4f96d8 + 0x1 + (_0x34ef93() * 0x3 | 0x0)) % 0x4 : _0x4f96d8;
  }
  if (_0x21612c) {
    _0x442454.sort((_0x278728, _0x3be703) => _0x278728.t - _0x3be703.t);
    const _0x57a6ef = [-0x9, -0x9, -0x9, -0x9];
    return _0x442454.filter(_0x6c9fe6 => {
      if (_0x6c9fe6.t < _0x57a6ef[_0x6c9fe6.lane]) return false;
      if (_0x6c9fe6.len) _0x57a6ef[_0x6c9fe6.lane] = _0x6c9fe6.t + _0x6c9fe6.len;
      return true;
    });
  }
  return _0x442454;
}
export function genSwapWindows(_0x41b0f9, _0x343d37, _0x587ed2) {
  if (_0x343d37 < 0x2 || _0x587ed2 < 0x5a) return [];
  const _0x4d38c3 = mulberry32(strSeed(String(_0x41b0f9) + ":swap")),
    _0x5b6964 = [];
  let _0x84b921 = 0x14 + _0x4d38c3() * 0x28;
  while (_0x5b6964.length < 0x4) {
    const _0xa96aa3 = 0x8 + _0x4d38c3() * 0x4;
    if (_0x84b921 + _0xa96aa3 > _0x587ed2 - 0xc) break;
    _0x5b6964.push({
      't0': _0x84b921,
      't1': _0x84b921 + _0xa96aa3,
      'shift': 0x1 + (_0x4d38c3() * (_0x343d37 - 0x1) | 0x0)
    }), _0x84b921 += _0xa96aa3 + 0x14 + _0x4d38c3() * 0x28;
  }
  return _0x5b6964.length >= 0x2 ? _0x5b6964 : [];
}
export function startGame(_0x31baf3) {
  stopGame(true), Game.cfg = _0x31baf3, Game.endless = _0x31baf3.diff === "endless";
  const _0x400bd7 = Game.endless ? Infinity : _0x31baf3.loops | 0x0 || 0x1;
  Game.loops = _0x400bd7, Game.loopsDone = 0x0, Game._lastT = 0x0;
  let _0x357b50;
  if (_0x31baf3.customNotes) {
    const _0x3fc335 = _0x31baf3.customNotes;
    if (!Game.endless && _0x400bd7 > 0x1) {
      _0x357b50 = [];
      for (let _0xac0efd = 0x0; _0xac0efd < _0x400bd7; _0xac0efd++) for (const _0x118fff of _0x3fc335) _0x357b50.push({
        't': _0x118fff.t + _0xac0efd * _0x31baf3.duration,
        'lane': _0x118fff.lane,
        'state': 0x0
      });
    } else _0x357b50 = _0x3fc335.map(_0x4ac751 => ({
      't': _0x4ac751.t,
      'lane': _0x4ac751.lane,
      'state': 0x0
    }));
  } else _0x357b50 = genChart(_0x31baf3.diff, _0x31baf3.bpm, _0x31baf3.duration * (Game.endless ? 0x1 : _0x400bd7), _0x31baf3.offset / 0x3e8, _0x31baf3.songId || '', _0x31baf3.hold ? 0x1 : 0x0);
  Game.activeLanes = null, Game._swapOn = false;
  if (_0x31baf3.share) {
    const _0x5ce5c9 = mulberry32(strSeed((_0x31baf3.songId || 'x') + _0x31baf3.diff + ':' + _0x31baf3.share.seed)),
      _0x9bf7eb = Math.max(0x1, _0x31baf3.share.n | 0x0),
      _0xe91215 = _0x31baf3.share.idx | 0x0,
      _0x2dde25 = _0x31baf3.swapWindows || [];
    _0x357b50 = _0x357b50.filter(_0x42d843 => {
      const _0x314b93 = _0x5ce5c9() * _0x9bf7eb | 0x0;
      let _0x4d4b75 = _0x314b93;
      for (const _0x30d841 of _0x2dde25) if (_0x42d843.t >= _0x30d841.t0 && _0x42d843.t < _0x30d841.t1) {
        _0x4d4b75 = (_0x314b93 + _0x30d841.shift) % _0x9bf7eb;
        break;
      }
      return _0x4d4b75 === _0xe91215;
    });
  }
  Game.notes = _0x357b50, Game.score = 0x0, Game.combo = 0x0, Game.maxCombo = 0x0, Game.cnt = {
    'perfect': 0x0,
    'good': 0x0,
    'miss': 0x0
  }, Game.replay = [], Game._dmkIdx = 0x0, Game.maxRate = _0x31baf3.rate || 0x1, Game.playing = true, Game.paused = false;
  const _0x1625f5 = document.getElementById("noteTilt");
  _0x1625f5.querySelectorAll(".note").forEach(_0x4a5633 => _0x4a5633.remove()), Game.dom = Game.notes.map(_0x1bc707 => spawnNoteEl(_0x1bc707, _0x31baf3.speed)), updateHud(), document.querySelectorAll('.lane,.receptor').forEach(_0x2ba5d9 => {
    const _0x1dcbed = +_0x2ba5d9.dataset.l;
    _0x2ba5d9.classList.toggle("dim", !!(Game.activeLanes && !Game.activeLanes.includes(_0x1dcbed)));
  }), Music.el.playbackRate = _0x31baf3.rate || 0x1;
  const _0x349b26 = document.getElementById("hudRate");
  if (_0x349b26) _0x349b26.textContent = _0x31baf3.rate ? '×' + Number(_0x31baf3.rate).toFixed(0x1) : '';
  _0x400bd7 > 0x1 ? (Music.el.loop = true, Music.el.onended = null) : (Music.el.loop = false, Music.el.onended = () => finishGame(true)), console.log("%c[演出] 🎬 开始！难度=" + _0x31baf3.diff + " BPM=" + _0x31baf3.bpm + '\x20音符数=' + Game.notes.length + '\x20时长≈' + _0x31baf3.duration.toFixed(0x0) + 's×' + _0x400bd7 + "遍 倍速×" + (_0x31baf3.rate || 0x1), "color:#ffe17a;font-weight:bold"), Music.play(), loop();
}
function spawnNoteEl(_0x1f58f4, _0x4bde6d) {
  const _0x3f36b3 = document.createElement("div");
  _0x3f36b3.className = 'note' + (_0x1f58f4.len ? " hold" : ''), _0x3f36b3.dataset.l = _0x1f58f4.lane, _0x3f36b3.dataset.dir = _0x1f58f4.lane;
  let _0x538665 = "<span class=\"na\">➤</span>";
  _0x1f58f4.len && (_0x1f58f4.end = _0x1f58f4.t + _0x1f58f4.len, _0x538665 += "<i class=\"ntail\" style=\"height:" + Math.round(_0x1f58f4.len * 0x154 * _0x4bde6d) + 'px\x22></i>');
  _0x3f36b3.innerHTML = _0x538665;
  const _0x52f249 = '#' + LANE_HEX[_0x1f58f4.lane].toString(0x10).padStart(0x6, '0');
  return _0x3f36b3.style.borderColor = _0x52f249, _0x3f36b3.style.color = _0x52f249, _0x3f36b3.style.textShadow = "0 0 14px " + _0x52f249 + '88', _0x3f36b3.style.display = "none", document.querySelector('.lane[data-l=\x22' + _0x1f58f4.lane + '\x22]').appendChild(_0x3f36b3), _0x1f58f4.el = _0x3f36b3, _0x3f36b3;
}
export function pauseGame() {
  if (!Game.playing || Game.paused) return;
  Game.paused = true, Music.pause();
}
export function resumeGame() {
  if (!Game.playing || !Game.paused) return;
  Game.paused = false, Music.play();
}
export function stopGame(_0xa418e1) {
  Game.playing = false, Game.paused = false, Game.activeLanes = null, Game._swapOn = false, Game.loops = 0x1, Game.loopsDone = 0x0, Game.endless = false, cancelAnimationFrame(Game._raf), Music.stop(), Music.el.onended = null, Music.el.loop = false, Music.el.playbackRate = 0x1, document.querySelectorAll(".lane.dim,.receptor.dim").forEach(_0x33cbd6 => _0x33cbd6.classList.remove("dim")), !_0xa418e1 && (document.getElementById("stageUI").classList.remove('on'), document.getElementById("noteTilt").querySelectorAll(".note").forEach(_0x3d1125 => _0x3d1125.remove()));
}
export function endGame() {
  finishGame(true);
}
function loop() {
  if (!Game.playing) return;
  Game._raf = requestAnimationFrame(loop);
  if (Game.paused) return;
  const _0x218a7b = Music.time();
  if (Game.loops > 0x1) {
    if (_0x218a7b < Game._lastT - 0x2) {
      Game.loopsDone++;
      if (Game.loopsDone >= Game.loops) {
        finishGame(true);
        return;
      }
      if (Game.endless) for (const _0x468246 of Game.notes) {
        _0x468246.state = 0x0, _0x468246.holdQ = null, _0x468246.el && (_0x468246.el.remove(), _0x468246.el = null), spawnNoteEl(_0x468246, Game.cfg.speed);
      }
    }
    Game._lastT = _0x218a7b;
  }
  const _0x52a8d1 = _0x218a7b + (Game.loopsDone || 0x0) * (Game.cfg.duration || 0x0),
    _0x3c4b42 = Game.endless ? _0x218a7b : _0x52a8d1;
  if (Game.cfg.rate) {
    const _0x3d6314 = Math.min(0x2, Game.cfg.rate + Math.floor(_0x52a8d1 / 0x1e) * 0.1);
    if (_0x3d6314 !== Music.el.playbackRate) {
      Music.el.playbackRate = _0x3d6314;
      const _0x4de28f = document.getElementById("hudRate");
      if (_0x4de28f) _0x4de28f.textContent = '×' + _0x3d6314.toFixed(0x1);
    }
    Game.maxRate = Math.max(Game.maxRate || 0x1, _0x3d6314);
  }
  const _0x41b7c6 = Game.cfg.swapWindows;
  if (_0x41b7c6 && _0x41b7c6.length) {
    let _0x30feb5 = false;
    for (const _0x4b34f1 of _0x41b7c6) {
      if (_0x3c4b42 >= _0x4b34f1.t0 && _0x3c4b42 < _0x4b34f1.t1) {
        _0x30feb5 = true;
        break;
      }
    }
    if (_0x30feb5 && !Game._swapOn) Game._swapOn = true, Game.hooks.onSwap && Game.hooks.onSwap(true);else !_0x30feb5 && Game._swapOn && (Game._swapOn = false, Game.hooks.onSwap && Game.hooks.onSwap(false));
  }
  const _0x4ab6ad = 0x154 * Game.cfg.speed,
    _0x8afffa = () => document.getElementById('hitLine').offsetTop;
  for (const _0x256dea of Game.notes) {
    const _0x119014 = _0x256dea.t - _0x3c4b42;
    if (_0x256dea.state === 0x3) {
      if (_0x256dea.el) {
        _0x256dea.el.style.transform = 'translateY(' + (_0x8afffa() - 0x1a) + "px)";
        const _0x420f13 = _0x256dea.el.querySelector(".ntail");
        if (_0x420f13) _0x420f13.style.height = Math.max(0x0, (_0x256dea.end - _0x3c4b42) * _0x4ab6ad) + 'px';
      }
      if (_0x3c4b42 >= _0x256dea.end) finishHold(_0x256dea, 0x1);
      continue;
    }
    if (_0x256dea.state !== 0x0) {
      _0x256dea.el && _0x256dea.el.dataset.done !== '2' && _0x119014 < -WIN_MISS && (_0x256dea.el.remove(), _0x256dea.el.dataset.done = '2');
      continue;
    }
    if (_0x119014 > 1.4) break;
    const _0x333e2c = _0x8afffa() - _0x119014 * _0x4ab6ad - 0x1a;
    if (_0x119014 > 0.9) {
      _0x256dea.el.style.display = "none";
      continue;
    }
    if (_0x256dea.el.style.display === "none") _0x256dea.el.style.display = '';
    _0x256dea.el.style.transform = "translateY(" + _0x333e2c + "px)";
    if (_0x119014 < -WIN_MISS) judge(_0x256dea, 'miss', 0x0);
  }
}
export function hitLane(_0x50da15, _0x22fb9c) {
  if (!Game.playing || Game.paused) return;
  if (Game.activeLanes && !Game.activeLanes.includes(_0x50da15)) return;
  const _0x4741c5 = Game.endless ? Music.time() : Music.time() + (Game.loopsDone || 0x0) * (Game.cfg && Game.cfg.duration || 0x0);
  let _0x51b289 = null,
    _0x59fafa = 0x3b9aca00;
  for (const _0x120cf4 of Game.notes) {
    if (_0x120cf4.state !== 0x0 || _0x120cf4.lane !== _0x50da15) continue;
    const _0x2c0215 = Math.abs(_0x120cf4.t - _0x4741c5);
    _0x2c0215 < _0x59fafa && (_0x59fafa = _0x2c0215, _0x51b289 = _0x120cf4);
    if (_0x120cf4.t - _0x4741c5 > 0.4) break;
  }
  if (!_0x51b289 || _0x59fafa > WIN_MISS) {
    receptorPop(_0x50da15, false);
    return;
  }
  if (_0x51b289.len) {
    _0x51b289.state = 0x3, _0x51b289.holdQ = _0x59fafa <= WIN_PERFECT ? "perfect" : "good";
    if (_0x51b289.el) _0x51b289.el.classList.add("holding");
    receptorPop(_0x50da15, true);
    const _0x30d123 = '#' + LANE_HEX[_0x50da15].toString(0x10).padStart(0x6, '0');
    laneFlash(_0x50da15, _0x30d123), Game.cnt[_0x51b289.holdQ]++, Game.combo++, Game.maxCombo = Math.max(Game.maxCombo, Game.combo), Game.score += (_0x51b289.holdQ === "perfect" ? 0x3e8 : 0x1f4) + Math.min(Game.combo, 0x3c) * 0xa, doAction(_0x50da15, _0x51b289.holdQ), _0x51b289.holdQ === "perfect" ? sfxPerfect() : sfxGood(), floatText(_0x50da15, _0x51b289.holdQ === "perfect" ? "PERFECT!" : "GOOD", _0x51b289.holdQ === 'perfect' ? "#4fe3ff" : "#ffe17a", timingSub(_0x51b289.t - _0x4741c5)), Game.hooks.onJudge && Game.hooks.onJudge({
      'lane': _0x50da15,
      'q': _0x51b289.holdQ
    });
    return;
  }
  judge(_0x51b289, _0x59fafa <= WIN_PERFECT ? "perfect" : "good", _0x50da15, 0x1, _0x59fafa <= WIN_PERFECT ? 'perfect' : "good", _0x51b289.t - _0x4741c5);
}
export function releaseLane(_0x5193af) {
  if (!Game.playing || Game.paused) return;
  const _0x17644a = Game.endless ? Music.time() : Music.time() + (Game.loopsDone || 0x0) * (Game.cfg && Game.cfg.duration || 0x0);
  for (const _0x4f47e2 of Game.notes) {
    if (_0x4f47e2.state !== 0x3 || _0x4f47e2.lane !== _0x5193af) continue;
    const _0x36ade3 = Math.max(0x0, Math.min(0x1, (_0x17644a - _0x4f47e2.t) / (_0x4f47e2.end - _0x4f47e2.t)));
    finishHold(_0x4f47e2, _0x17644a - _0x4f47e2.end < -WIN_GOOD ? _0x36ade3 : 0x1);
    return;
  }
}
function finishHold(_0x40a3e6, _0x332605) {
  const _0x30c07d = Math.round((_0x40a3e6.holdQ === "perfect" ? 0x3e8 : 0x1f4) * _0x332605);
  _0x40a3e6.state = 0x1;
  const _0x2f87aa = _0x40a3e6.el;
  _0x2f87aa && (_0x40a3e6.el = null, _0x2f87aa.classList.add("gone"), setTimeout(() => _0x2f87aa.remove(), 0xc8), _0x30c07d > 0x0 && (Game.score += _0x30c07d, receptorPop(_0x40a3e6.lane, true), laneFlash(_0x40a3e6.lane, LANE_HEX[_0x40a3e6.lane]), ringPulse((_0x40a3e6.lane - 1.5) * 0.95, 1.7, LANE_HEX[_0x40a3e6.lane]), floatText(_0x40a3e6.lane, _0x332605 >= 0.9 ? 'PERFECT!' : Math.round(_0x332605 * 0x64) + '%', _0x332605 >= 0.9 ? "#4fe3ff" : "#ffe17a"), burst(new THREE.Vector3((_0x40a3e6.lane - 1.5) * 0.6, 1.1, 0.4), LANE_HEX[_0x40a3e6.lane], 0x12))), updateHud(), Game.hooks.onJudge && Game.hooks.onJudge({
    'lane': _0x40a3e6.lane,
    'q': _0x40a3e6.holdQ
  }), Game.hooks.onScore && Game.hooks.onScore({
    'score': Game.score,
    'combo': Game.combo,
    'maxCombo': Game.maxCombo,
    'perfect': Game.cnt.perfect,
    'good': Game.cnt.good,
    'miss': Game.cnt.miss
  });
}
function judge(_0x9ffea9, _0x47b2be, _0xae5322, _0x404031 = 0x1, _0x36a4a0 = _0x47b2be, _0x33f912 = null) {
  _0x9ffea9.state = _0x47b2be === 'miss' ? 0x2 : 0x1;
  const _0x1a7889 = _0x9ffea9.el;
  if (_0x47b2be === "miss") {
    Game.cnt.miss++, Game.combo = 0x0;
    _0x1a7889 && (_0x1a7889.classList.add("missed"), setTimeout(() => _0x1a7889.remove(), 0x1a4), _0x9ffea9.el = null);
    sfxMiss(), stumble(), addMiss(), sfxRandomVoice(), shake(0.16);
    const _0x1a7a8e = document.getElementById("missVig");
    _0x1a7a8e.classList.add('on'), setTimeout(() => _0x1a7a8e.classList.remove('on'), 0x82), floatText(_0xae5322, "MISS", '#ff5b7f');
  } else {
    Game.cnt[_0x47b2be === "perfect" ? "perfect" : "good"]++, Game.combo++, Game.maxCombo = Math.max(Game.maxCombo, Game.combo), Game.score += Math.round(((_0x36a4a0 === 'perfect' ? 0x3e8 : 0x1f4) + Math.min(Game.combo, 0x3c) * 0xa) * _0x404031);
    if (_0x1a7889) {
      const _0xadaf7b = LANE_HEX[_0x9ffea9.lane];
      _0x1a7889.style.setProperty("--eatT", _0x1a7889.style.transform || 'translateY(0px)'), _0x1a7889.classList.add("gone"), setTimeout(() => _0x1a7889.remove(), 0xc8), _0x9ffea9.el = null, receptorPop(_0x9ffea9.lane, true), laneFlash(_0x9ffea9.lane, _0xadaf7b), ringPulse((_0x9ffea9.lane - 1.5) * 0.95, 1.7, _0xadaf7b);
      const _0x340bf2 = new THREE.Vector3((_0x9ffea9.lane - 1.5) * 0.6, 1.1, 0.4);
      burst(_0x340bf2, _0xadaf7b, _0x47b2be === "perfect" ? 0x34 : 0x1a), _0x47b2be === 'perfect' ? sfxPerfect() : sfxGood(), floatText(_0x9ffea9.lane, _0x404031 < 0x1 ? Math.round(_0x404031 * 0x64) + '%' : _0x47b2be === "perfect" ? "PERFECT!" : "GOOD", _0x47b2be === 'perfect' ? "#4fe3ff" : "#ffe17a", timingSub(_0x33f912));
    }
    doAction(_0x9ffea9.lane, _0x47b2be);
    if ([0x32, 0x64, 0x96, 0xc8, 0x12c, 0x190, 0x1f4].includes(Game.combo)) {
      const _0x1703f3 = Game.combo >= 0xc8 ? 0xffe17a : Game.combo >= 0x64 ? 0xff6bd6 : 0x4fe3ff;
      floatText(1.5, Game.combo + " 连击!!", '#' + _0x1703f3.toString(0x10), null, true), burst(new THREE.Vector3(0x0, 1.6, 0.6), _0x1703f3, 0x50), shake(0.12);
    }
  }
  if (Game.replay) Game.replay.push({
    't': +Music.time().toFixed(0x3),
    'lane': _0x9ffea9.lane,
    'q': _0x47b2be
  });
  maybeDanmaku(), Game.hooks.onJudge && Game.hooks.onJudge({
    'lane': _0x9ffea9.lane,
    'q': _0x47b2be
  }), updateHud(), Game.hooks.onScore && Game.hooks.onScore({
    'score': Game.score,
    'combo': Game.combo,
    'maxCombo': Game.maxCombo,
    'perfect': Game.cnt.perfect,
    'good': Game.cnt.good,
    'miss': Game.cnt.miss
  });
}
function receptorPop(_0x34a463, _0x3fd26a) {
  const _0x40a7c5 = document.querySelector(".receptor[data-l=\"" + _0x34a463 + '\x22]');
  if (!_0x40a7c5) return;
  _0x40a7c5.classList.toggle("hit", _0x3fd26a);
  if (_0x3fd26a) setTimeout(() => _0x40a7c5.classList.remove("hit"), 0x6e);
}
function timingSub(_0x53780b) {
  if (_0x53780b == null || Math.abs(_0x53780b) < 0.03) return null;
  return _0x53780b > 0x0 ? '▲\x20快了' : '▼\x20慢了';
}
function floatText(_0x7988c7, _0x26dcc5, _0x290d93, _0x227f64, _0x2b8c68) {
  const _0x94c6a9 = document.getElementById("floatLayer");
  if (!_0x94c6a9) return;
  const _0x4fae23 = document.createElement("div");
  _0x4fae23.className = 'floatJudge' + (_0x2b8c68 ? '\x20big' : ''), _0x4fae23.textContent = _0x26dcc5, _0x4fae23.style.color = _0x290d93, _0x4fae23.style.left = ["13%", "38%", '63%', "88%"][Math.max(0x0, Math.min(0x3, Math.round(_0x7988c7)))];
  if (_0x227f64) {
    const _0x57eeb4 = document.createElement('i');
    _0x57eeb4.className = "ftSub", _0x57eeb4.textContent = _0x227f64, _0x4fae23.appendChild(_0x57eeb4);
  }
  _0x94c6a9.appendChild(_0x4fae23), setTimeout(() => _0x4fae23.remove(), _0x2b8c68 ? 0x384 : 0x208);
}
let DMK_LIST = ["这歌我闭着眼都能跳", "奶龙腿都要冒烟了", "手速不够，气势来凑", "我妈问我为什么跪着打歌", "全连了就直播倒立洗头", "眼睛：会了 手：不你不会", "打完这首就去写作业（假的）", '前面那个\x20PERFECT\x20是我点的', '别看了，快按！', "这节奏，太上头了", "手已麻，勿扰", "奶龙：我腿短但倒腾得快", '这波操作值三个鸡腿', "判定线：你过来啊", '又断连了，手机的问题', "谁把困难难度调这么高的", "隔壁小孩都看哭了", '这歌我能跳一宿', '按下去的那一刻，我就是舞王', "miss 不怪我，怪网速", '屏幕都要被我戳穿了', "你们玩，我先躺会儿", "这 BPM 是人打的？", '连击数比我存款还多'];
function maybeDanmaku() {
  if (!Game.playing || Game.combo === 0x0 || Game.combo % 0xf !== 0x0) return;
  const _0x37b79c = document.getElementById("floatLayer");
  if (!_0x37b79c) return;
  const _0x3816c4 = 0x2 + (Math.random() < 0.5 ? 0x1 : 0x0);
  for (let _0x441576 = 0x0; _0x441576 < _0x3816c4; _0x441576++) {
    setTimeout(() => {
      if (!document.body.contains(_0x37b79c)) return;
      if (_0x37b79c.querySelectorAll('.dmkFloat').length > 0x8) return;
      let _0x9fcb98;
      do {
        _0x9fcb98 = Math.floor(Math.random() * DMK_LIST.length);
      } while (_0x9fcb98 === Game._dmkIdx && DMK_LIST.length > 0x1);
      Game._dmkIdx = _0x9fcb98;
      const _0x141fb7 = DMK_LIST[_0x9fcb98],
        _0x8a5b9c = document.createElement("div");
      _0x8a5b9c.className = "dmkFloat", _0x8a5b9c.textContent = _0x141fb7, _0x8a5b9c.style.top = 0x6 + Math.random() * 0x22 + '%', _0x8a5b9c.style.fontSize = 0xd + Math.random() * 0x4 + 'px', _0x37b79c.appendChild(_0x8a5b9c), setTimeout(() => _0x8a5b9c.remove(), 0x1838);
    }, _0x441576 * 0x190);
  }
}
function updateHud() {
  document.getElementById('hudScore').textContent = Game.score.toLocaleString();
  const _0x1d474d = Game.cnt.perfect + Game.cnt.good + Game.cnt.miss,
    _0x3b5f2f = _0x1d474d ? Math.round((Game.cnt.perfect + Game.cnt.good * 0.5) / _0x1d474d * 0x64) : 0x64;
  document.getElementById("hudMeta").textContent = 'P\x20' + Game.cnt.perfect + " · G " + Game.cnt.good + " · M " + Game.cnt.miss + " · " + _0x3b5f2f + '%';
  const _0xc3bd88 = document.getElementById("comboBox");
  if (Game.combo >= 0x2) _0xc3bd88.classList.add('on'), document.getElementById("comboNum").textContent = '×' + Game.combo, _0xc3bd88.classList.remove("pop"), _0xc3bd88.classList.add('pop');else _0xc3bd88.classList.remove('on');
}
function finishGame(_0x130771) {
  if (!Game.playing) return;
  Game.playing = false, cancelAnimationFrame(Game._raf), Music.stop();
  const _0x531c73 = Game.cnt.perfect + Game.cnt.good + Game.cnt.miss,
    _0x57e258 = _0x531c73 ? (Game.cnt.perfect + Game.cnt.good * 0.5) / _0x531c73 : 0x0;
  let _0x44afef = 'C';
  if (_0x57e258 >= 0.98 && Game.cnt.miss === 0x0) _0x44afef = 'SS';else {
    if (_0x57e258 >= 0.92) _0x44afef = 'S';else {
      if (_0x57e258 >= 0.8) _0x44afef = 'A';else {
        if (_0x57e258 >= 0.65) _0x44afef = 'B';
      }
    }
  }
  const _0x4f09bb = Math.floor(Game.score / 0x190),
    _0x3e8119 = Math.round((Music.time() || 0x0) + (Game.loopsDone || 0x0) * (Game.cfg && Game.cfg.duration || 0x0));
  Game.hooks.onEnd && Game.hooks.onEnd({
    'score': Game.score,
    'maxCombo': Game.maxCombo,
    'cnt': {
      ...Game.cnt
    },
    'acc': _0x57e258,
    'rank': _0x44afef,
    'coin': _0x4f09bb,
    'diff': Game.cfg.diff,
    'songId': Game.cfg.songId || "default",
    'sec': _0x3e8119,
    'loops': Game.loopsDone || 0x0,
    'maxRate': Game.maxRate || 0x1,
    'replay': Game.replay || []
  });
}
export function chartDuration() {
  if (!Game.notes.length) return 0x0;
  const _0x3160ec = Game.notes[Game.notes.length - 0x1];
  return _0x3160ec.t + (_0x3160ec.len || 0x0) + 1.5;
}
