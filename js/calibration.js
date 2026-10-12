export function summarizeCalibration(samples) {
  const values = samples.filter(Number.isFinite).sort((a, b) => a - b);
  const median = items => items.length % 2 ? items[(items.length - 1) / 2] : (items[items.length / 2 - 1] + items[items.length / 2]) / 2;
  if (values.length < 10) return null;
  const center = median(values);
  const mad = median(values.map(value => Math.abs(value - center)).sort((a, b) => a - b));
  const kept = values.filter(value => Math.abs(value - center) <= Math.max(30, mad * 3));
  if (kept.length < 10) return null;
  const spread = Math.sqrt(kept.reduce((sum, value) => sum + (value - median(kept)) ** 2, 0) / kept.length);
  if (spread > 60) return null;
  return { offset: Math.max(-1000, Math.min(1000, Math.round(median(kept) / 10) * 10)), count: kept.length, spread: Math.round(spread) };
}

export function createCalibration({ context, keys, onStatus, onResult, onStop, pulse }) {
  const interval = 0.5, warmup = 4, total = 24;
  const start = context.currentTime + 1;
  const samples = new Map(), sources = [];
  let stopped = false, frame;
  for (let i = 0; i < total; i++) {
    const at = start + i * interval;
    const oscillator = context.createOscillator(), gain = context.createGain();
    oscillator.frequency.value = i % 4 === 0 ? 1000 : 700;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.22, at + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(at); oscillator.stop(at + 0.08);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    sources.push(oscillator);
  }
  const stop = () => {
    if (stopped) return;
    stopped = true; cancelAnimationFrame(frame);
    sources.forEach(source => { try { source.stop(); } catch {} });
    onStop();
  };
  const hit = () => {
    if (stopped) return;
    const now = context.currentTime;
    const index = Math.round((now - start) / interval);
    if (index < warmup || index >= total || samples.has(index)) return;
    const error = (now - (start + index * interval)) * 1000;
    if (Math.abs(error) > 240) return;
    samples.set(index, error);
    onStatus('已采集 ' + samples.size + '/20 次 · 跟着声音继续击打');
  };
  let lastBeat = -1;
  const update = () => {
    if (stopped) return;
    const beat = Math.floor((context.currentTime - start) / interval);
    if (beat !== lastBeat && beat >= 0 && beat < total) {
      lastBeat = beat; pulse();
      if (beat < warmup) onStatus('预备拍 ' + (beat + 1) + '/4 · 先听节奏');
      else onStatus('测量中 · 已采集 ' + samples.size + '/20 次');
    }
    if (context.currentTime >= start + (total - 1) * interval + 0.3) {
      const result = summarizeCalibration([...samples.values()]); stop(); onResult(result); return;
    }
    frame = requestAnimationFrame(update);
  };
  update();
  return { hit, stop, accepts: code => keys.includes(code) || code === 'Space' };
}
