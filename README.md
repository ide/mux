# mux [![CircleCI](https://circleci.com/gh/ide/mux.svg?style=svg)](https://circleci.com/gh/ide/mux)
A simple and convenient function that resolves promises in data structures like arrays, objects, Maps, and Sets

## What is mux?

Mux is a function that multiplexes promises in nested data structures and resolves them like this:

```js
await mux({
  a: asyncFunction1(),
  b: asyncFunction2(),
});

// Result:
{
  a: result1,
  b: result2,
}
```

## Installing mux

```sh
yarn add @exponent/mux
```

And import it like this:

```js
import mux from '@exponent/mux';
```

## More examples

You can also pass in deeply nested data structures like this:

```js
await mux({
  a: {
    b: asyncFunction1(),
  },
});

// Result:
{
  a: {
    b: result1,
  },
}
```

Mux supports several standard JavaScript data structures:

```js
await mux(new Set([
  asyncFunction1(),
  asyncFunction2(),
]));

// Result:
new Set([
  result1,
  result2,
])
```

And if your promises themselves result in data structures, mux will recurse into them and resolve the nested promises.

```js
await mux([
  Promise.resolve({
    a: asyncFunction1(),
  }),
]);

// Result:
[
  {
    a: result1,
  },
]
```

Check out [the test suite](blob/master/src/__tests__/mux-tests.js) for even more examples.
