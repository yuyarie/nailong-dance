// Malody Key .mc: beat triples are quarter-note beats, columns are zero-based.
export function beatValue(beat) {
  if (!Array.isArray(beat) || beat.length !== 3 || !beat.every(Number.isFinite) ||
      !Number.isInteger(beat[0]) || !Number.isInteger(beat[1]) ||
      !Number.isInteger(beat[2]) || beat[2] <= 0 || beat[1] < 0) {
    throw new Error('谱面包含无效的拍点');
  }
  return beat[0] + beat[1] / beat[2];
}

export function parseMalody(input) {
  const raw = typeof input === 'string' ? JSON.parse(input.replace(/^\uFEFF/, '')) : input;
  if (raw?.meta?.mode !== 0 || raw.meta.mode_ext?.column !== 4) {
    throw new Error('仅支持 Malody Key 模式的 4Key 谱面');
  }
  if (!Array.isArray(raw.time) || !raw.time.length || !Array.isArray(raw.note)) {
    throw new Error('谱面缺少 BPM 或音符数据');
  }
  const timing = raw.time.map(point => {
    if (!Number.isFinite(point.bpm) || point.bpm <= 0) throw new Error('谱面的 BPM 无效');
    return { beat: beatValue(point.beat), bpm: point.bpm };
  }).sort((a, b) => a.beat - b.beat);
  timing[0].seconds = timing[0].beat * 60 / timing[0].bpm;
  for (let i = 1; i < timing.length; i++) {
    if (timing[i].beat === timing[i - 1].beat) throw new Error('同一拍点有重复的 BPM');
    timing[i].seconds = timing[i - 1].seconds +
      (timing[i].beat - timing[i - 1].beat) * 60 / timing[i - 1].bpm;
  }
  const secondsAt = beat => {
    let point = timing[0];
    for (const next of timing) { if (next.beat > beat) break; point = next; }
    return point.seconds + (beat - point.beat) * 60 / point.bpm;
  };
  // Older Malody exports store the BGM event in the extra (fifth) column.
  const isBackground = note => note.type === 1 && note.sound &&
    (note.column === undefined || note.column === 4 || note.isBgm === true);
  const backgrounds = raw.note.filter(isBackground);
  if (backgrounds.length !== 1) throw new Error('需要包含一条背景音乐事件的谱面');
  const audio = backgrounds[0];
  const offset = audio.offset ?? 0;
  if (!Number.isFinite(offset)) throw new Error('谱面音频偏移无效');
  // Malody offset delays BGM against the chart; convert to audio playback seconds.
  const audioStart = secondsAt(beatValue(audio.beat)) + offset / 1000;
  const notes = raw.note.filter(note => note.column !== undefined && !isBackground(note)).map(note => {
    if (!Number.isInteger(note.column) || note.column < 0 || note.column > 3) {
      throw new Error('音符轨道必须为 0 至 3');
    }
    const start = beatValue(note.beat);
    const end = note.endbeat ? beatValue(note.endbeat) : start;
    if (end < start || (note.endbeat && end === start)) throw new Error('长条结束拍点必须晚于开始拍点');
    return { t: secondsAt(start) - audioStart, lane: note.column,
      len: note.endbeat ? secondsAt(end) - secondsAt(start) : 0 };
  }).sort((a, b) => a.t - b.t || a.lane - b.lane);
  if (!notes.length || notes.length > 100000) throw new Error('谱面音符数量无效');
  const laneEnds = [-Infinity, -Infinity, -Infinity, -Infinity];
  for (const note of notes) {
    if (note.t < laneEnds[note.lane] - 1e-7) throw new Error('同轨音符与长条重叠');
    laneEnds[note.lane] = note.t + note.len;
  }
  return {
    format: 'malody4k', notes, audioName: String(audio.sound), offset,
    timing: timing.map(point => ({ t: point.seconds - audioStart, bpm: point.bpm })),
    bpm: timing[0].bpm, name: String(raw.meta.song?.title || '未命名曲目'),
    artist: String(raw.meta.song?.artist || '未知歌手'),
    version: String(raw.meta.version || '4Key'), creator: String(raw.meta.creator || ''),
    previewStart: Number.isFinite(raw.meta.preview) ? Math.max(0, raw.meta.preview / 1000) : 0,
    endTime: notes.reduce((end, note) => Math.max(end, note.t + note.len), -Infinity)
  };
}

export async function importMalodyFiles(files) {
  const charts = Array.from(files).filter(file => /\.mc$/i.test(file.name));
  if (!charts.length) throw new Error('请同时选择 .mc 谱面和对应音乐文件');
  const imported = [];
  for (const file of charts) {
    if (file.size > 10 * 1024 * 1024) throw new Error('谱面文件不能超过 10MB');
    const chart = parseMalody(await file.text());
    const basename = name => name.replace(/\\/g, '/').split('/').pop().toLowerCase();
    const audio = Array.from(files).find(item => basename(item.name) === basename(chart.audioName));
    if (!audio) throw new Error('缺少音乐文件：' + chart.audioName);
    if (audio.size > 50 * 1024 * 1024) throw new Error('音乐文件不能超过 50MB');
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('读取音乐文件失败'));
      reader.readAsDataURL(audio);
    });
    // Check decoding before saving so unsupported/corrupt audio never enters the library.
    const context = new (window.AudioContext || window.webkitAudioContext)();
    let duration;
    try { duration = (await context.decodeAudioData(await audio.arrayBuffer())).duration; }
    catch { throw new Error('音乐解码失败，请使用浏览器支持的 ogg / mp3 / wav / m4a'); }
    finally { await context.close(); }
    if (!Number.isFinite(duration) || duration <= 0 || chart.endTime > duration + 0.2) {
      throw new Error('谱面的结束时间超出音乐时长，请检查配套音乐');
    }
    imported.push({ chart, dataUrl, duration });
  }
  return imported;
}
