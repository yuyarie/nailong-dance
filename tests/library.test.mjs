import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { LIBRARY_CHARTS } from '../js/library.js';
import { parseMalody } from '../js/malody.js';

test('local library contains only playable 4Key charts with audio and one cover per song', () => {
  const ids = new Set(), covers = new Map();
  assert.equal(LIBRARY_CHARTS.length, 68);
  for (const song of LIBRARY_CHARTS) {
    assert.ok(!ids.has(song.id)); ids.add(song.id);
    for (const file of [song.chartFile, song.file, song.cover]) {
      assert.ok(fs.existsSync(new URL('../' + file, import.meta.url)), file);
    }
    const raw = JSON.parse(fs.readFileSync(new URL('../' + song.chartFile, import.meta.url), 'utf8'));
    assert.equal(raw.meta.mode, 0); assert.equal(raw.meta.mode_ext.column, 4);
    const chart = parseMalody(raw);
    assert.equal(chart.notes.length, song.noteCount);
    assert.equal(chart.notes.filter(note => note.len > 0).length, song.holdCount);
    assert.equal(decodeURIComponent(song.file.split('/').at(-1)), chart.audioName);
    if (covers.has(song.groupId)) assert.equal(covers.get(song.groupId), song.cover);
    covers.set(song.groupId, song.cover);
    // Vorbis identification packet and final Ogg granule give the real duration.
    const audio = fs.readFileSync(new URL('../' + song.file, import.meta.url));
    const rate = audio.readUInt32LE(audio.indexOf(Buffer.from('vorbis')) + 11);
    let cursor = 0, granule = 0;
    while (cursor + 27 <= audio.length && audio.toString('ascii', cursor, cursor + 4) === 'OggS') {
      const value = audio.readBigUInt64LE(cursor + 6);
      if (value !== 0xffffffffffffffffn) granule = Number(value);
      const segments = audio[cursor + 26];
      let size = 0;
      for (let i = 0; i < segments; i++) size += audio[cursor + 27 + i];
      cursor += 27 + segments + size;
    }
    assert.ok(chart.endTime <= granule / rate + .2, song.name + ' chart exceeds audio');
    assert.ok(chart.previewStart <= granule / rate, song.name + ' preview exceeds audio');
  }
  assert.equal(covers.size, 44);
});
