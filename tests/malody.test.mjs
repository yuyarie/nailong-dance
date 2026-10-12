import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { parseMalody } from '../js/malody.js';
const chart = (notes, timing = [{beat:[0,0,1],bpm:120}], offset = 0) => ({
  meta:{mode:0,mode_ext:{column:4},song:{title:'Test',artist:'Test'}},time:timing,
  note:[...notes,{beat:[0,0,1],type:1,sound:'test.ogg',offset}]
});
const close = (a,b) => assert.ok(Math.abs(a-b)<1e-8, `${a} != ${b}`);
test('provided chart preserves all columns, beat fractions, holds and 344ms audio offset', () => {
  const raw = JSON.parse(fs.readFileSync(new URL('../charts/library/_song_9160/1565787429.mc',import.meta.url),'utf8'));
  const parsed = parseMalody(raw);
  assert.equal(parsed.notes.length,773); assert.equal(parsed.notes.filter(n=>n.len).length,64);
  close(parsed.notes[0].t,3*60/174-.344); assert.equal(parsed.notes[0].lane,3);
  const source = raw.note.filter(n=>n.column!==undefined).map(n=>({t:(n.beat[0]+n.beat[1]/n.beat[2])*60/174-.344,lane:n.column,len:n.endbeat?((n.endbeat[0]+n.endbeat[1]/n.endbeat[2])-(n.beat[0]+n.beat[1]/n.beat[2]))*60/174:0})).sort((a,b)=>a.t-b.t||a.lane-b.lane);
  source.forEach((note,i)=>{close(parsed.notes[i].t,note.t); close(parsed.notes[i].len,note.len);assert.equal(parsed.notes[i].lane,note.lane);});
});
test('BPM changes are integrated for both hold endpoints; sound beat and signed offsets shift once', () => {
  const raw=chart([{beat:[1,0,1],endbeat:[3,0,1],column:0},{beat:[4,0,1],column:3}], [{beat:[0,0,1],bpm:120},{beat:[2,0,1],bpm:240}],250);
  raw.note.at(-1).beat=[1,0,1];
  let parsed=parseMalody(raw); close(parsed.notes[0].t,-.25);close(parsed.notes[0].len,.75);close(parsed.notes[1].t,.75);
  raw.note.at(-1).offset=-250; parsed=parseMalody(raw);close(parsed.notes[0].t,.25);
});
test('legacy BGM column and unnormalized fractions retain timing; preview is in milliseconds', () => {
  const raw = chart([{beat:[5,1,1],column:0},{beat:[7,3,4],endbeat:[7,4,4],column:3}], undefined, 429);
  raw.note.at(-1).column = 4;
  raw.meta.preview = 25000;
  const parsed = parseMalody(raw);
  assert.equal(parsed.notes.length, 2);
  close(parsed.notes[0].t, 3 - .429);
  close(parsed.notes[1].len, .125);
  assert.equal(parsed.previewStart, 25);
});
test('reject invalid modes, columns, BPM, malformed fractions, missing audio, backwards and overlapping holds', () => {
  const basic=()=>chart([{beat:[1,0,1],column:0}]);
  for(const mutate of [c=>c.meta.mode=1,c=>c.meta.mode_ext.column=7,c=>c.note[0].column=4,c=>c.time[0].bpm=0,c=>c.note[0].beat=[1,0,0],c=>c.note.pop(),c=>c.note[0].endbeat=[0,0,1]]){const raw=basic();mutate(raw);assert.throws(()=>parseMalody(raw));}
  assert.throws(()=>parseMalody(chart([{beat:[1,0,1],endbeat:[3,0,1],column:0},{beat:[2,0,1],column:0}])));
});
function harness(notes) {
  let now=0,time=0,plays=0;
  const node=()=>({style:{setProperty(){}},dataset:{},classList:{add(){},remove(){},toggle(){}},offsetTop:350,appendChild(){},remove(){},querySelector(){return null},querySelectorAll(){return []}});
  const noop=()=>{};
  const context=vm.createContext({console:{log:noop},performance:{now:()=>now},requestAnimationFrame:()=>1,cancelAnimationFrame:noop,setTimeout:noop,
    document:{getElementById:()=>node(),querySelector:()=>node(),querySelectorAll:()=>[],createElement:()=>node(),body:{contains:()=>true}},
    THREE:{Vector3:class{}},Music:{el:{},time:()=>time,play:()=>{plays++},pause:noop,stop:()=>{time=0}},
    sfxPerfect:noop,sfxGood:noop,sfxMiss:noop,sfxRandomVoice:noop,doAction:noop,stumble:noop,addMiss:noop,laneFlash:noop,burst:noop,ringPulse:noop,shake:noop});
  const src=fs.readFileSync(new URL('../js/game.js',import.meta.url),'utf8').replace(/^import .*;\r?\n/gm,'').replace(/export /g,'');
  vm.runInContext(src+'\nthis.api={Game,startGame,hitLane,releaseLane,pauseGame,resumeGame,gameTime,loop,finishGame};',context);
  const api=context.api; api.startGame({customNotes:notes,offset:0,speed:1,bpm:120,duration:10,songId:'test'});
  return {...api,advance:(n,t)=>{now=n;time=t;api.loop()},clock:(n,t)=>{now=n;time=t},plays:()=>plays};
}
test('hold length reaches gameplay; tail completes once and early release misses once', () => {
  let h=harness([{t:2,lane:0,len:1}]);h.advance(1,2);assert.equal(h.Game.notes[0].len,1);h.hitLane(0);assert.equal(h.Game.cnt.perfect,0);
  h.advance(2,3);assert.equal(h.Game.cnt.perfect,1);assert.equal(h.Game.cnt.miss,0);h.releaseLane(0);assert.equal(h.Game.cnt.perfect,1);
  h=harness([{t:2,lane:0,len:1}]);h.advance(1,2);h.hitLane(0);h.clock(2,2.4);h.releaseLane(0);assert.equal(h.Game.cnt.miss,1);assert.equal(h.Game.combo,0);assert.equal(h.Game.cnt.perfect,0);
});
test('negative-time notes have preroll, and preroll pause/resume does not advance or play music', () => {
  const h=harness([{t:-.2,lane:0,len:0}]);close(h.gameTime(),-1.7);h.clock(500,0);h.pauseGame();close(h.gameTime(),-1.2);
  h.clock(2500,0);close(h.gameTime(),-1.2);h.resumeGame();close(h.gameTime(),-1.2);assert.equal(h.plays(),0);
  h.advance(3701,0);assert.equal(h.plays(),1);
});
test('finish accounts for all unjudged notes and captures duration before stopping audio', () => {
  const h=harness([{t:2,lane:0,len:0},{t:3,lane:1,len:1}]);let result;h.Game.hooks.onEnd=r=>result=r;
  h.advance(1,0);h.clock(20,10);h.finishGame();assert.equal(result.cnt.miss,2);assert.equal(result.sec,10);assert.equal(result.songId,'test');
});
