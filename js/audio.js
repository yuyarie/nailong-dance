let ctx = null,
  sfxGain = null,
  sfxOn = true;
export function ensureCtx() {
  !ctx && (ctx = new (window.AudioContext || window.webkitAudioContext)(), sfxGain = ctx.createGain(), sfxGain.gain.value = 0.9, sfxGain.connect(ctx.destination));
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}
export function setSfxEnabled(_0x2eb4be) {
  sfxOn = !!_0x2eb4be;
}
function ping(_0x2ceffb, _0x44e6c0 = 0.25, _0x322be1 = "sine", _0x544191 = 0.5, _0x9c00f1 = 0x0, _0x50ecd2 = 0x0) {
  if (!ctx || !sfxOn) return;
  const _0x16d0ba = ctx.currentTime + _0x9c00f1,
    _0x37f336 = ctx.createOscillator(),
    _0x731167 = ctx.createGain();
  _0x37f336.type = _0x322be1, _0x37f336.frequency.setValueAtTime(_0x2ceffb, _0x16d0ba), _0x731167.gain.setValueAtTime(_0x544191, _0x16d0ba), _0x731167.gain.exponentialRampToValueAtTime(0.001, _0x16d0ba + _0x44e6c0), route(_0x37f336, _0x731167, _0x50ecd2, _0x16d0ba, _0x44e6c0);
}
function route(_0x5d4a31, _0x2615a1, _0x425882, _0x23f4c0, _0x592696) {
  let _0x1d5799 = _0x2615a1;
  if (_0x425882 !== 0x0 && ctx.createStereoPanner) {
    const _0x189a36 = ctx.createStereoPanner();
    _0x189a36.pan.value = _0x425882, _0x2615a1.connect(_0x189a36), _0x1d5799 = _0x189a36;
  }
  _0x5d4a31.connect(_0x2615a1), _0x1d5799.connect(sfxGain), _0x5d4a31.start(_0x23f4c0), _0x5d4a31.stop(_0x23f4c0 + _0x592696 + 0.05);
}
let noiseBuf = null;
function getNoise() {
  if (noiseBuf) return noiseBuf;
  const _0x4205ec = ctx.sampleRate * 1.2;
  noiseBuf = ctx.createBuffer(0x1, _0x4205ec, ctx.sampleRate);
  const _0x25bd99 = noiseBuf.getChannelData(0x0);
  for (let _0x3effe3 = 0x0; _0x3effe3 < _0x4205ec; _0x3effe3++) _0x25bd99[_0x3effe3] = Math.random() * 0x2 - 0x1;
  return noiseBuf;
}
export function sfxWhoosh(_0x213ebf = -0.8, _0x318a58 = 0.8, _0x5e3442 = 0.85) {
  if (!ctx || !sfxOn) return;
  const _0x5725ea = ctx.currentTime,
    _0x31b4ca = ctx.createBufferSource();
  _0x31b4ca.buffer = getNoise();
  const _0x1c3ed9 = ctx.createBiquadFilter();
  _0x1c3ed9.type = "bandpass", _0x1c3ed9.Q.value = 1.2, _0x1c3ed9.frequency.setValueAtTime(0x12c, _0x5725ea), _0x1c3ed9.frequency.exponentialRampToValueAtTime(0xa28, _0x5725ea + _0x5e3442 * 0.7), _0x1c3ed9.frequency.exponentialRampToValueAtTime(0x1f4, _0x5725ea + _0x5e3442);
  const _0x3b8a9c = ctx.createGain();
  _0x3b8a9c.gain.setValueAtTime(0.001, _0x5725ea), _0x3b8a9c.gain.exponentialRampToValueAtTime(0.5, _0x5725ea + _0x5e3442 * 0.35), _0x3b8a9c.gain.exponentialRampToValueAtTime(0.001, _0x5725ea + _0x5e3442);
  let _0x53fb25 = _0x3b8a9c;
  if (ctx.createStereoPanner) {
    const _0x24e02d = ctx.createStereoPanner();
    _0x24e02d.pan.setValueAtTime(_0x213ebf, _0x5725ea), _0x24e02d.pan.linearRampToValueAtTime(_0x318a58, _0x5725ea + _0x5e3442), _0x3b8a9c.connect(_0x24e02d), _0x53fb25 = _0x24e02d;
  }
  _0x31b4ca.connect(_0x1c3ed9), _0x1c3ed9.connect(_0x3b8a9c), _0x53fb25.connect(sfxGain), _0x31b4ca.start(_0x5725ea), _0x31b4ca.stop(_0x5725ea + _0x5e3442 + 0.1);
}
export function sfxCross() {
  ping(0x526, 0.3, "sine", 0.4), ping(0x6e0, 0.35, "sine", 0.32, 0.05);
  if (!ctx || !sfxOn) return;
  const _0x5493f2 = ctx.currentTime,
    _0x2bfb03 = ctx.createOscillator(),
    _0x11ba1b = ctx.createGain();
  _0x2bfb03.type = 'triangle', _0x2bfb03.frequency.setValueAtTime(0x384, _0x5493f2), _0x2bfb03.frequency.exponentialRampToValueAtTime(0xc80, _0x5493f2 + 0.22), _0x11ba1b.gain.setValueAtTime(0.18, _0x5493f2), _0x11ba1b.gain.exponentialRampToValueAtTime(0.001, _0x5493f2 + 0.25), route(_0x2bfb03, _0x11ba1b, 0x0, _0x5493f2, 0.25);
}
export function sfxBoop(_0x3cd814 = 0x0, _0x3a8a1a = 0x0) {
  if (!ctx || !sfxOn) return;
  const _0x1abf11 = ctx.currentTime + _0x3cd814,
    _0x43361f = ctx.createOscillator(),
    _0x29f2e8 = ctx.createGain();
  _0x43361f.type = "sine", _0x43361f.frequency.setValueAtTime(0x208, _0x1abf11), _0x43361f.frequency.exponentialRampToValueAtTime(0x96, _0x1abf11 + 0.14), _0x29f2e8.gain.setValueAtTime(0.4, _0x1abf11), _0x29f2e8.gain.exponentialRampToValueAtTime(0.001, _0x1abf11 + 0.16), route(_0x43361f, _0x29f2e8, _0x3a8a1a, _0x1abf11, 0.16);
}
export function sfxBoing() {
  if (!ctx || !sfxOn) return;
  const _0xc3796d = ctx.currentTime,
    _0x616d07 = ctx.createOscillator(),
    _0xdff5b2 = ctx.createGain();
  _0x616d07.type = 'sine', _0x616d07.frequency.setValueAtTime(0xaa, _0xc3796d), _0x616d07.frequency.exponentialRampToValueAtTime(0x21c, _0xc3796d + 0.12);
  const _0x556633 = ctx.createOscillator(),
    _0x5ec448 = ctx.createGain();
  _0x556633.frequency.setValueAtTime(0x1a, _0xc3796d), _0x556633.frequency.exponentialRampToValueAtTime(0x7, _0xc3796d + 0.5), _0x5ec448.gain.setValueAtTime(0x5a, _0xc3796d), _0x5ec448.gain.exponentialRampToValueAtTime(0x6, _0xc3796d + 0.5), _0x556633.connect(_0x5ec448), _0x5ec448.connect(_0x616d07.frequency), _0xdff5b2.gain.setValueAtTime(0.55, _0xc3796d), _0xdff5b2.gain.exponentialRampToValueAtTime(0.001, _0xc3796d + 0.6), _0x616d07.connect(_0xdff5b2), _0xdff5b2.connect(sfxGain), _0x616d07.start(_0xc3796d), _0x556633.start(_0xc3796d), _0x616d07.stop(_0xc3796d + 0.65), _0x556633.stop(_0xc3796d + 0.65), ping(0x46, 0.2, "sine", 0.6);
}
export function sfxOutro() {
  if (!ctx || !sfxOn) return;
  const _0x18514d = ctx.currentTime,
    _0x362843 = ctx.createOscillator(),
    _0x38aaf3 = ctx.createGain();
  _0x362843.type = "triangle", _0x362843.frequency.setValueAtTime(0x4e2, _0x18514d), _0x362843.frequency.exponentialRampToValueAtTime(0x140, _0x18514d + 0.8), _0x38aaf3.gain.setValueAtTime(0.16, _0x18514d), _0x38aaf3.gain.exponentialRampToValueAtTime(0.001, _0x18514d + 0.85), route(_0x362843, _0x38aaf3, 0x0, _0x18514d, 0.85);
}
export function sfxPerfect() {
  ping(0x620, 0.18, "sine", 0.35), ping(0x82d, 0.22, "sine", 0.25, 0.03);
}
export function sfxGood() {
  ping(0x370, 0.15, "triangle", 0.3);
}
export function sfxMiss() {
  if (!ctx || !sfxOn) return;
  const _0x18c12b = ctx.currentTime,
    _0x129caf = ctx.createOscillator(),
    _0x4480d1 = ctx.createGain();
  _0x129caf.type = "sawtooth", _0x129caf.frequency.setValueAtTime(0xdc, _0x18c12b), _0x129caf.frequency.exponentialRampToValueAtTime(0x5a, _0x18c12b + 0.22), _0x4480d1.gain.setValueAtTime(0.22, _0x18c12b), _0x4480d1.gain.exponentialRampToValueAtTime(0.001, _0x18c12b + 0.24), route(_0x129caf, _0x4480d1, 0x0, _0x18c12b, 0.24);
}
export function sfxCoin() {
  ping(0x7b8, 0.1, 'square', 0.16), ping(0xa4d, 0.16, "square", 0.14, 0.06);
}
export function sfxClick() {
  ping(0x294, 0.07, "sine", 0.25);
}
const VOICE_END = "sounds/voice-end.mp3",
  VOICE_FUN = ['sounds/voice-1.mp3', "sounds/voice-2.mp3", "sounds/voice-3.mp3"];
let voiceVol = 0.9,
  lastFunAt = 0x0;
export function setVoiceVolume(_0x5e5cae) {
  voiceVol = Math.min(0x1, Math.max(0x0, +_0x5e5cae || 0x0));
}
function playVoiceFile(_0x210d8c) {
  if (!sfxOn) return;
  try {
    const _0x512380 = new Audio(_0x210d8c);
    _0x512380.volume = voiceVol, _0x512380.play()['catch'](() => {});
  } catch (_0x6cb760) {}
}
function pokeFun(_0x5dc580, _0x3b50d5) {
  const _0x13d05c = performance.now();
  if (_0x13d05c - lastFunAt < _0x3b50d5) return;
  if (Math.random() > _0x5dc580) return;
  lastFunAt = _0x13d05c, playVoiceFile(VOICE_FUN[Math.random() * VOICE_FUN.length | 0x0]);
}
export function sfxPokeVoice() {
  pokeFun(0x1, 0x320);
}
export function sfxRandomVoice() {
  pokeFun(0.35, 0x1388);
}
export function sfxEndVoice() {
  playVoiceFile(VOICE_END);
}
const music = new Audio(),
  shortSrc = _0x2c58da => {
    return _0x2c58da = String(_0x2c58da || ''), /^data:/.test(_0x2c58da) ? _0x2c58da.slice(0x0, 0x20) + '…(' + _0x2c58da.length + "字符)" : _0x2c58da;
  };
music.src = "music.mp3", music.preload = "auto", music.loop = false, music.addEventListener('error', () => {
  const _0x2fd04c = music.error;
  console.log("%c[音乐] ❌ error! code=" + (_0x2fd04c ? _0x2fd04c.code : '?') + '\x20src=' + shortSrc(music.src) + " currentSrc=" + shortSrc(music.currentSrc), "color:#ff4d4d;font-weight:bold");
}), window.__music = music;
export const Music = {
  'el': music,
  'currentSong': 'music.mp3',
  'setSong'(_0x20118b) {
    this.currentSong = _0x20118b;
    try {
      music.pause();
    } catch (_0x24b6c5) {}
    music.preload = "auto", music.src = _0x20118b, music.load(), music._readyP = new Promise(_0xdab505 => {
      if (music.readyState >= 0x1 && isFinite(music.duration) && music.duration > 0x0) {
        _0xdab505(music.duration);
        return;
      }
      let _0x40b07d = false;
      const _0x5b46c2 = _0xa8b34b => {
          if (_0x40b07d) return;
          _0x40b07d = true, _0x545c28(), _0xdab505(_0xa8b34b);
        },
        _0xccbbd4 = () => {
          if (isFinite(music.duration) && music.duration > 0x0) _0x5b46c2(music.duration);
        },
        _0x3da1b8 = () => _0x5b46c2(0x78);
      let _0x22eecf = 0x0;
      const _0x464055 = () => {
          if (_0x40b07d) return;
          _0x22eecf++;
          if (isFinite(music.duration) && music.duration > 0x0) {
            _0x5b46c2(music.duration);
            return;
          }
          if (_0x22eecf >= 0x3) {
            _0x5b46c2(0x78);
            return;
          }
          setTimeout(_0x464055, 0x7d0);
        },
        _0x4bc4b7 = setTimeout(_0x464055, 0xbb8),
        _0x545c28 = () => {
          music.removeEventListener('canplay', _0xccbbd4), music.removeEventListener("loadedmetadata", _0xccbbd4), music.removeEventListener('error', _0x3da1b8), clearTimeout(_0x4bc4b7);
        };
      music.addEventListener("canplay", _0xccbbd4, {
        'once': true
      }), music.addEventListener("loadedmetadata", _0xccbbd4, {
        'once': true
      }), music.addEventListener("error", _0x3da1b8, {
        'once': true
      });
    }), console.log("%c[音乐] 🎵 切歌 → " + shortSrc(_0x20118b), 'color:#36d1ff;font-weight:bold');
  },
  'load'() {
    music.load();
  },
  async 'play'() {
    const _0x4cda05 = this.currentSong,
      _0x5207a0 = music.currentSrc || '';
    _0x4cda05 && !_0x5207a0.endsWith(_0x4cda05) && !_0x5207a0.endsWith(encodeURI(_0x4cda05)) && !_0x5207a0.endsWith(decodeURIComponent(_0x4cda05)) && (console.log("%c[音乐] ⚠ currentSrc(" + shortSrc(_0x5207a0) + ") 不匹配当前歌(" + shortSrc(_0x4cda05) + ')，重载', 'color:#ff9800;font-weight:bold'), music.src = _0x4cda05, music.load(), music.readyState < 0x3 && (await new Promise(_0x366427 => {
      const _0x871f3d = () => {
          _0x287e17(), _0x366427();
        },
        _0x4f3ef0 = () => {
          _0x287e17(), _0x366427();
        },
        _0xd80bb1 = setTimeout(() => {
          _0x287e17(), _0x366427();
        }, 0xbb8),
        _0x287e17 = () => {
          music.removeEventListener('canplay', _0x871f3d), music.removeEventListener("error", _0x4f3ef0), clearTimeout(_0xd80bb1);
        };
      music.addEventListener("canplay", _0x871f3d, {
        'once': true
      }), music.addEventListener("error", _0x4f3ef0, {
        'once': true
      });
    })));
    console.log('%c[音乐]\x20▶\x20播放\x20→\x20' + shortSrc(music.currentSrc) + " (want=" + shortSrc(_0x4cda05) + " readyState=" + music.readyState + ')', "color:#7fffd4;font-weight:bold");
    try {
      await music.play();
    } catch (_0x45bcbe) {
      console.warn('音乐播放失败', _0x45bcbe);
    }
  },
  'pause'() {
    music.pause();
  },
  'stop'() {
    music.pause();
    if (music.readyState >= 0x2) music.currentTime = 0x0;
  },
  'time'() {
    return music.currentTime;
  },
  'duration'() {
    return music.duration || 0x0;
  },
  'awaitDuration'() {
    return music._readyP || Promise.resolve(music.duration || 0x5f);
  },
  'setVolume'(_0x71384c) {
    music.volume = Math.min(0x1, Math.max(0x0, _0x71384c));
  },
  'isPlaying'() {
    return !music.paused;
  },
  'unlock'() {
    try {
      ensureCtx();
      if (music.paused) {
        const _0x40c169 = music.muted;
        music.muted = true;
        const _0x11b24d = music.play();
        _0x11b24d && typeof _0x11b24d.then === "function" ? _0x11b24d.then(() => {
          music.pause(), music.muted = _0x40c169;
        })["catch"](() => {
          music.muted = _0x40c169;
        }) : music.muted = _0x40c169;
      }
    } catch (_0x2424c0) {}
  }
};
let pvEl = null,
  pvCb = null;
export const Preview = {
  'id': null,
  async 'play'(_0x36e899, _0x1532c2, _0x3214c1, _0xbd49b6) {
    this.stop(), this.id = _0x1532c2, pvCb = _0xbd49b6 || null;
    const _0x131d75 = new Audio();
    pvEl = _0x131d75, _0x131d75.preload = 'auto', _0x131d75.src = _0x36e899, _0x131d75.volume = Math.min(0x1, Math.max(0x0, music.volume || 0.8)), _0x131d75.addEventListener("ended", () => {
      if (pvEl === _0x131d75) Preview.stop();
    });
    try {
      await _0x131d75.play();
    } catch (_0x8caf15) {
      this.stop();
      return;
    }
  },
  'stop'() {
    if (pvEl) {
      try {
        pvEl.pause();
      } catch (_0x18f268) {}
      pvEl.onended = null, pvEl.removeAttribute('src');
      try {
        pvEl.load();
      } catch (_0x2c6ce1) {}
      pvEl = null;
    }
    this.id = null;
    const _0x12e103 = pvCb;
    pvCb = null, _0x12e103 && _0x12e103();
  }
};
let menuBgm = {
  'timer': null,
  'gain': null,
  'playing': false
};
const BGM_BPM = 0x8a;
function midiFreq(_0x51a754) {
  return 0x1b8 * Math.pow(0x2, (_0x51a754 - 0x9) / 0xc);
}
const CHORDS = [[0x0, 0x4, 0x7], [-0x5, -0x1, 0x2], [-0x3, 0x0, 0x4], [-0x7, -0x3, 0x0], [0x0, 0x4, 0x7], [-0x5, -0x1, 0x2], [-0x3, 0x0, 0x4], [-0x5, -0x1, 0x2]],
  BASS_ROOT = [0x0, -0x5, -0x3, -0x7, 0x0, -0x5, -0x3, -0x5],
  MELODY_RAW = [[0xc, 0x2], [0x10, 0x2], [0x13, 0x2], [0x10, 0x2], [0x15, 0x2], [0x13, 0x2], [0x10, 0x2], [0xe, 0x2], [0xc, 0x2], [0x10, 0x2], [0x13, 0x2], [0x17, 0x2], [0x18, 0x4], [0x17, 0x2], [0x15, 0x2], [0x15, 0x2], [0x13, 0x2], [0x10, 0x2], [0xe, 0x2], [0xc, 0x2], [0xe, 0x2], [0x10, 0x2], [0x13, 0x2], [0x11, 0x2], [0x10, 0x2], [0xe, 0x2], [0xc, 0x2], [0xe, 0x4], [0xc, 0x4], [0xc, 0x2], [0x10, 0x2], [0x13, 0x2], [0x18, 0x2], [0x1a, 0x2], [0x18, 0x2], [0x13, 0x2], [0x10, 0x2], [0x18, 0x2], [0x17, 0x2], [0x15, 0x2], [0x13, 0x2], [0x10, 0x2], [0x13, 0x2], [0x15, 0x2], [0x17, 0x2], [0x15, 0x2], [0x18, 0x2], [0x17, 0x2], [0x15, 0x2], [0x13, 0x2], [0x10, 0x2], [0x13, 0x2], [0x15, 0x2], [0x11, 0x2], [0x10, 0x2], [0xe, 0x2], [0xc, 0x2], [0xe, 0x2], [0xc, 0x2], [0xb, 0x2], [0xc, 0x2]],
  LEAD = (() => {
    const _0x4f6695 = new Array(0x80).fill(null);
    let _0x44df48 = 0x0;
    for (const [_0x41cd67, _0x1fe726] of MELODY_RAW) {
      _0x4f6695[_0x44df48] = {
        'semi': _0x41cd67,
        'dur': _0x1fe726
      }, _0x44df48 += _0x1fe726;
    }
    if (_0x44df48 !== 0x80) console.warn('[BGM]\x20旋律长度异常：', _0x44df48);
    return _0x4f6695;
  })();
function bgmKick(_0x30eeae) {
  const _0x5a9434 = ctx.createOscillator(),
    _0x44a780 = ctx.createGain();
  _0x5a9434.type = "sine", _0x5a9434.frequency.setValueAtTime(0x96, _0x30eeae), _0x5a9434.frequency.exponentialRampToValueAtTime(0x30, _0x30eeae + 0.11), _0x44a780.gain.setValueAtTime(0.5, _0x30eeae), _0x44a780.gain.exponentialRampToValueAtTime(0.001, _0x30eeae + 0.17), _0x5a9434.connect(_0x44a780), _0x44a780.connect(menuBgm.gain), _0x5a9434.start(_0x30eeae), _0x5a9434.stop(_0x30eeae + 0.19);
}
function bgmNoise(_0xb7e082, {
  freq = 0x708,
  vol = 0.13,
  dur = 0.12,
  type = 'highpass'
} = {}) {
  const _0x4711f8 = ctx.createBufferSource();
  _0x4711f8.buffer = getNoise();
  const _0x29137c = ctx.createBiquadFilter();
  _0x29137c.type = type, _0x29137c.frequency.value = freq;
  const _0x54dc09 = ctx.createGain();
  _0x54dc09.gain.setValueAtTime(vol, _0xb7e082), _0x54dc09.gain.exponentialRampToValueAtTime(0.001, _0xb7e082 + dur), _0x4711f8.connect(_0x29137c), _0x29137c.connect(_0x54dc09), _0x54dc09.connect(menuBgm.gain), _0x4711f8.start(_0xb7e082), _0x4711f8.stop(_0xb7e082 + dur + 0.03);
}
function bgmBass(_0x103f20, _0x33b3ef, _0x1f3c49) {
  const _0x339f70 = ctx.createOscillator(),
    _0x4d0ae9 = ctx.createGain();
  _0x339f70.type = "triangle", _0x339f70.frequency.value = midiFreq(_0x33b3ef - 0xc), _0x4d0ae9.gain.setValueAtTime(0x0, _0x103f20), _0x4d0ae9.gain.linearRampToValueAtTime(0.26, _0x103f20 + 0.015), _0x4d0ae9.gain.setValueAtTime(0.26, _0x103f20 + _0x1f3c49 * 0.55), _0x4d0ae9.gain.exponentialRampToValueAtTime(0.001, _0x103f20 + _0x1f3c49 * 0.95), _0x339f70.connect(_0x4d0ae9), _0x4d0ae9.connect(menuBgm.gain), _0x339f70.start(_0x103f20), _0x339f70.stop(_0x103f20 + _0x1f3c49 + 0.05);
}
function bgmPad(_0x1b2b5b, _0xe78907, _0x3b1775) {
  for (const _0x531f53 of _0xe78907) {
    const _0x55b36a = ctx.createOscillator(),
      _0x32619d = ctx.createGain();
    _0x55b36a.type = "triangle", _0x55b36a.frequency.value = midiFreq(_0x531f53), _0x32619d.gain.setValueAtTime(0x0, _0x1b2b5b), _0x32619d.gain.linearRampToValueAtTime(0.045, _0x1b2b5b + 0.08), _0x32619d.gain.setValueAtTime(0.045, _0x1b2b5b + _0x3b1775 * 0.7), _0x32619d.gain.exponentialRampToValueAtTime(0.001, _0x1b2b5b + _0x3b1775), _0x55b36a.connect(_0x32619d), _0x32619d.connect(menuBgm.gain), _0x55b36a.start(_0x1b2b5b), _0x55b36a.stop(_0x1b2b5b + _0x3b1775 + 0.05);
  }
}
function bgmLead(_0x158578, _0x5341b1, _0x3420a5) {
  const _0x495c3b = ctx.createOscillator(),
    _0x112bae = ctx.createGain();
  _0x495c3b.type = "triangle", _0x495c3b.frequency.value = midiFreq(_0x5341b1 + 0xc), _0x112bae.gain.setValueAtTime(0x0, _0x158578), _0x112bae.gain.linearRampToValueAtTime(0.16, _0x158578 + 0.015), _0x112bae.gain.exponentialRampToValueAtTime(0.001, _0x158578 + _0x3420a5 * 0.92), _0x495c3b.connect(_0x112bae), _0x112bae.connect(menuBgm.gain), _0x495c3b.start(_0x158578), _0x495c3b.stop(_0x158578 + _0x3420a5 + 0.05);
  const _0x111632 = ctx.createOscillator(),
    _0x24ba7f = ctx.createGain();
  _0x111632.type = "square", _0x111632.frequency.value = midiFreq(_0x5341b1), _0x24ba7f.gain.setValueAtTime(0x0, _0x158578), _0x24ba7f.gain.linearRampToValueAtTime(0.035, _0x158578 + 0.015), _0x24ba7f.gain.exponentialRampToValueAtTime(0.001, _0x158578 + _0x3420a5 * 0.9), _0x111632.connect(_0x24ba7f), _0x24ba7f.connect(menuBgm.gain), _0x111632.start(_0x158578), _0x111632.stop(_0x158578 + _0x3420a5 + 0.05);
}
export function startMenuBgm() {
  if (!ctx) ensureCtx();
  if (menuBgm.playing) return;
  if (ctx.state === 'suspended') ctx.resume();
  menuBgm.playing = true;
  !menuBgm.gain && (menuBgm.gain = ctx.createGain(), menuBgm.gain.connect(ctx.destination));
  menuBgm.gain.gain.value = 0.12;
  const _0x3a4820 = 0x3c / BGM_BPM / 0x4;
  let _0x4ddf1f = 0x0;
  const _0x181033 = () => {
    if (!menuBgm.playing) return;
    const _0x560067 = ctx.currentTime + 0.03,
      _0x40fad6 = Math.floor(_0x4ddf1f / 0x10) % 0x8,
      _0x1a0073 = _0x4ddf1f % 0x10,
      _0x4458da = LEAD[_0x4ddf1f];
    if (_0x4458da) bgmLead(_0x560067, _0x4458da.semi, _0x4458da.dur * _0x3a4820);
    if (_0x1a0073 === 0x0) bgmPad(_0x560067, CHORDS[_0x40fad6], 0x10 * _0x3a4820);
    if (_0x1a0073 === 0x0) bgmBass(_0x560067, BASS_ROOT[_0x40fad6], 0x5 * _0x3a4820);else {
      if (_0x1a0073 === 0x6 || _0x1a0073 === 0xa || _0x1a0073 === 0xe) bgmBass(_0x560067, BASS_ROOT[_0x40fad6], 0x2 * _0x3a4820);
    }
    if (_0x1a0073 === 0x0 || _0x1a0073 === 0x4 || _0x1a0073 === 0x8 || _0x1a0073 === 0xc) bgmKick(_0x560067);
    if (_0x1a0073 === 0x4 || _0x1a0073 === 0xc) bgmNoise(_0x560067, {
      'freq': 0x6a4,
      'vol': 0.14,
      'dur': 0.13
    });
    if (_0x40fad6 === 0x7 && (_0x1a0073 === 0xd || _0x1a0073 === 0xe)) bgmNoise(_0x560067, {
      'freq': 0x6a4,
      'vol': 0.09,
      'dur': 0.08
    });
    if (_0x40fad6 === 0x7 && _0x1a0073 === 0xf) bgmKick(_0x560067), bgmNoise(_0x560067, {
      'freq': 0x6a4,
      'vol': 0.16,
      'dur': 0.14
    });
    if (_0x4ddf1f % 0x2 === 0x0) {
      const _0x405ee1 = _0x1a0073 === 0x4 || _0x1a0073 === 0xc ? 0.025 : 0.05;
      bgmNoise(_0x560067, {
        'freq': 0x1d4c,
        'vol': _0x405ee1,
        'dur': 0.045,
        'type': 'highpass'
      });
    }
    _0x4ddf1f = (_0x4ddf1f + 0x1) % 0x80, menuBgm.timer = setTimeout(_0x181033, _0x3a4820 * 0x3e8);
  };
  _0x181033(), console.log("%c[音频] 🎵 菜单 BGM 已启动（欢快芯片风 · BPM " + BGM_BPM + '）', "color:#36d1ff");
}
export function stopMenuBgm() {
  if (!menuBgm.playing) return;
  menuBgm.playing = false;
  menuBgm.timer && (clearTimeout(menuBgm.timer), menuBgm.timer = null);
  if (menuBgm.gain) menuBgm.gain.gain.value = 0x0;
}
export function setMenuBgmVolume(_0xc69e77) {
  if (menuBgm.gain) menuBgm.gain.gain.value = Math.min(0.25, Math.max(0x0, _0xc69e77 * 0.18));
}
