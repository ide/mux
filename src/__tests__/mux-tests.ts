import assert from 'node:assert/strict';
import { test } from 'node:test';

import mux from '../mux.ts';

test(`supports arrays`, async () => {
  let result = await mux([1, 'hello', Promise.resolve('world')]);
  assert.deepEqual(result, [1, 'hello', 'world']);
});

test(`supports objects`, async () => {
  let result = await mux({ hello: Promise.resolve('world') });
  assert.deepEqual(result, { hello: 'world' });
});

test(`supports Maps`, async () => {
  let result = await mux(new Map([['hello', Promise.resolve('world')]]));
  assert.deepEqual(result, new Map([['hello', 'world']]));
});

test(`supports Sets`, async () => {
  let result = await mux(new Set(['hello', Promise.resolve('world')]));
  assert.deepEqual(result, new Set(['hello', 'world']));
});

test(`supports promises`, async () => {
  let result = await mux(Promise.resolve('hello'));
  assert.strictEqual(result, 'hello');
});

test(`supports primitives`, async () => {
  let nullValue = await mux(null);
  assert.strictEqual(nullValue, null);

  let undefinedValue = await mux(undefined);
  assert.strictEqual(undefinedValue, undefined);

  let numberValue = await mux(1);
  assert.strictEqual(numberValue, 1);

  let booleanValue = await mux(true);
  assert.strictEqual(booleanValue, true);
});

test(`supports nested promises that resolve to data structures`, async () => {
  let result = await mux({
    array: Promise.resolve([
      'map',
      new Map([
        ['set', Promise.resolve(new Set([
          'object',
          { void: Promise.resolve() },
        ]))]
      ]),
    ]),
  });

  assert.deepEqual(result, {
    array: [
      'map',
      new Map([
        ['set', new Set(['object', { void: undefined }])],
      ]),
    ]
  });
});

test(`doesn't set a prototype for prototype-less objects`, async () => {
  let object = Object.create(null);
  object.hello = Promise.resolve('world');
  let result = await mux(object);

  // Build the expected value with a null prototype because strict deepEqual also
  // compares prototypes, so this verifies the result stays prototype-less
  let expected = Object.create(null);
  expected.hello = 'world';
  assert.deepEqual(result, expected);
  assert.strictEqual(Object.getPrototypeOf(result), null);
});

test(`sets Object.prototype for plain objects with prototypes`, async () => {
  let result = await mux({ hello: Promise.resolve('world') });
  assert.deepEqual(result, { hello: 'world' });
  assert.strictEqual(Object.getPrototypeOf(result), Object.prototype);
});

test(`doesn't traverse into class instances`, async () => {
  class Example {
    hello = Promise.resolve('world');
  }

  let example = new Example();
  let result = await mux(example);
  assert.notStrictEqual(result.hello, 'world');
  assert.strictEqual(result, example);
});

test(`doesn't traverse into WeakMaps`, async () => {
  let key = {};
  let result = await mux(new WeakMap([[key, Promise.resolve('hello')]]));
  assert.strictEqual(result.has(key), true);
  assert.notStrictEqual(result.get(key), 'hello');
});

test(`doesn't traverse into WeakSets`, async () => {
  let key = {};
  let result = await mux(new WeakSet([key]));
  assert.strictEqual(result.has(key), true);
});
