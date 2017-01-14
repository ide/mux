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
