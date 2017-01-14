import mux from '../mux';

it(`supports arrays`, async () => {
  let result = await mux([1, 'hello', Promise.resolve('world')]);
  expect(result).toEqual([1, 'hello', 'world']);
});

it(`supports objects`, async () => {
  let result = await mux({ hello: Promise.resolve('world') });
  expect(result).toEqual({ hello: 'world' });
});

it(`supports Maps`, async () => {
  let result = await mux(new Map([['hello', Promise.resolve('world')]]));
  expect(result).toEqual(new Map([['hello', 'world']]));
});

it(`supports Sets`, async () => {
  let result = await mux(new Set(['hello', Promise.resolve('world')]));
  expect(result).toEqual(new Set(['hello', 'world']));
});

it(`supports promises`, async () => {
  let result = await mux(Promise.resolve('hello'));
  expect(result).toBe('hello');
});

it(`supports primitives`, async () => {
  let nullValue = await mux(null);
  expect(nullValue).toBe(null);

  let undefinedValue = await mux(undefined);
  expect(undefinedValue).toBe(undefined);

  let numberValue = await mux(1);
  expect(numberValue).toBe(1);

  let booleanValue = await mux(true);
  expect(booleanValue).toBe(true);
});

it(`supports nested promises that resolve to data structures`, async () => {
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

  expect(result).toEqual({
    array: [
      'map',
      new Map([
        ['set', new Set(['object', { void: undefined }])],
      ]),
    ]
  })
});

it(`doesn't traverse into class instances`, async () => {
  class Example {
    constructor() {
      this.hello = Promise.resolve('world');
    }
  }

  let example = new Example();
  let result = await mux(example);
  expect(result.hello).not.toBe('world');
  expect(result).toBe(example);
});

it(`doesn't traverse into WeakMaps`, async () => {
  let key = {};
  let result = await mux(new WeakMap([[key, Promise.resolve('hello')]]));
  expect(result.has(key)).toBe(true);
  expect(result.get(key)).not.toBe('hello');
});

it(`doesn't traverse into WeakSets`, async () => {
  let key = {};
  let result = await mux(new WeakSet([key]));
  expect(result.has(key)).toBe(true);
});
