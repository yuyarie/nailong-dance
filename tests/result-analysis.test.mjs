import test from 'node:test';
import assert from 'node:assert/strict';
import { recommendOffset } from '../js/result-analysis.js';
test('mean timing recommendation adds residual error to the offset used for that run', () => {
  assert.deepEqual(recommendOffset(Array(10).fill(40), 100), {mean:40,offset:140,count:10});
  assert.equal(recommendOffset(Array(10).fill(-40),100).offset,60);
  assert.equal(recommendOffset([10,20,30,40,50,60,70,80,90,100],0).mean,55);
  assert.equal(recommendOffset(Array(10).fill(100),990).offset,1000);
  assert.equal(recommendOffset(Array(10).fill(-100),-990).offset,-1000);
  assert.equal(recommendOffset(Array(9).fill(40),0),null);
  assert.equal(recommendOffset([NaN,...Array(10).fill(40)],0).count,10);
});
