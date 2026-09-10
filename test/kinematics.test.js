import test from 'node:test';
import assert from 'node:assert/strict';
import { run, stoppingDistance, modelSpeedLimit } from '../src/engine.js';
const s = (extra = {}) => ({
  schemaVersion: 1,
  scenarioId: 'test',
  source: 'synthetic',
  speedMps: 2,
  reactionMs: 500,
  reactionUncertaintyMs: 0,
  decelerationMps2: 2,
  decelerationUncertaintyPct: 0,
  marginM: 0.25,
  availableM: 2.25,
  ...extra,
});
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);
test('analytic distance decomposes into reaction, braking and margin', () => {
  const r = run(s());
  assert.deepEqual(r.components, { reactionM: 1, brakingM: 1, marginM: 0.25 });
  assert.equal(r.metrics[0].value, 2.25);
});
test('exact available distance produces zero margin without a deficit', () => {
  const r = run(s());
  assert.equal(r.status, 'complete');
  assert.equal(r.metrics[2].value, 0);
});
test('insufficient distance preserves a negative result', () => {
  const r = run(s({ availableM: 1 }));
  assert.equal(r.metrics[2].value, -1.25);
  assert.equal(r.status, 'review-required');
});
test('zero speed still includes the explicit geometric margin', () =>
  assert.equal(run(s({ speedMps: 0 })).metrics[1].value, 0.25));
test('zero uncertainty makes both distance scenarios equal', () => {
  const r = run(s());
  assert.equal(r.metrics[0].value, r.metrics[1].value);
});
test('reaction uncertainty adds exactly speed times extra delay', () =>
  assert.equal(run(s({ reactionUncertaintyMs: 100 })).metrics[1].value, 2.45));
test('halved deceleration doubles only the braking component', () =>
  assert.equal(run(s({ decelerationUncertaintyPct: 50 })).components.brakingM, 2));
test('quadratic inversion recovers original speed across scales', () => {
  for (const speed of [0.001, 0.1, 1, 3, 10])
    for (const reaction of [0, 0.2, 10])
      for (const decel of [0.01, 1, 20])
        near(modelSpeedLimit(stoppingDistance(speed, reaction, decel), reaction, decel), speed);
});
test('no usable distance yields zero model speed bound', () => {
  assert.equal(modelSpeedLimit(0, 0.5, 1), 0);
  assert.equal(run(s({ availableM: 0.1 })).metrics[3].value, 0);
});
test('speed sweep is monotonic and upper case never below nominal', () => {
  const r = run(s({ reactionUncertaintyMs: 250, decelerationUncertaintyPct: 40 }));
  for (let i = 1; i < r.records.length; i++) {
    assert.ok(r.records[i].upperM >= r.records[i - 1].upperM);
    assert.ok(r.records[i].upperM >= r.records[i].nominalM);
  }
});
test('stopping time includes reaction and braking duration', () =>
  assert.equal(run(s()).nominalStopTimeS, 1.5));
test('zero, negative and completely uncertain deceleration are rejected', () => {
  for (const extra of [
    { decelerationMps2: 0 },
    { decelerationMps2: -1 },
    { decelerationUncertaintyPct: 100 },
  ])
    assert.throws(() => run(s(extra)));
});
test('milliseconds and seconds are not confused', () => near(stoppingDistance(1, 0.25, 1), 0.75));
test('maximum supported finite scenario serializes without infinity', () => {
  const r = run(
    s({
      speedMps: 10,
      reactionMs: 10000,
      reactionUncertaintyMs: 10000,
      decelerationMps2: 0.01,
      decelerationUncertaintyPct: 95,
    }),
  );
  assert.ok(Number.isFinite(r.metrics[1].value));
  assert.equal(r.records.length, 41);
});
