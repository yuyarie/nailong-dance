import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeCalibration, createCalibration } from '../js/calibration.js';
test('late and early hits produce absolute signed offset, rounded to slider steps',()=>{
 assert.equal(summarizeCalibration(Array(20).fill(83)).offset,80);
 assert.equal(summarizeCalibration(Array(20).fill(-47)).offset,-50);
});
test('reject insufficient or unstable samples and remove isolated outliers',()=>{
 assert.equal(summarizeCalibration(Array(9).fill(30)),null);
 assert.equal(summarizeCalibration([...Array(10).fill(-150),...Array(10).fill(150)]),null);
 const result=summarizeCalibration([...Array(18).fill(42),-200,230]);
 assert.equal(result.offset,40);assert.equal(result.count,18);
});
test('scheduled metronome ignores warmup, repeats and finishes with measured offset',()=>{
 let frame,result,stops=0;globalThis.requestAnimationFrame=fn=>{frame=fn;return 1};globalThis.cancelAnimationFrame=()=>{};
 const parameter={setValueAtTime(){},exponentialRampToValueAtTime(){}};
 const context={currentTime:0,destination:{},createOscillator:()=>({frequency:{},connect(){},disconnect(){},start(){},stop(){}}),createGain:()=>({gain:parameter,connect(){},disconnect(){}})};
 const session=createCalibration({context,keys:['KeyD','KeyF','KeyJ','KeyK'],onStatus(){},onResult:r=>result=r,onStop:()=>stops++,pulse(){}});
 context.currentTime=1.05;session.hit();
 for(let i=4;i<24;i++){context.currentTime=1+i*.5+.08;session.hit();session.hit();}
 context.currentTime=13;frame();assert.equal(result.offset,80);assert.equal(result.count,20);assert.equal(stops,1);session.stop();assert.equal(stops,1);
 assert.equal(session.accepts('KeyD'),true);assert.equal(session.accepts('Space'),true);assert.equal(session.accepts('KeyA'),false);
});
