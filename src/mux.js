// @flow
import isPlainObject from 'lodash/isPlainObject';
import zip from 'lodash/zip';

export default async function mux(promises: any): Promise<any> {
  if (promises == null) {
    return promises;
  }

  if (typeof promises.then === 'function') {
    let value = await promises;
    return mux(value);
  }

  if (Array.isArray(promises)) {
    return Promise.all(promises.map(mux));
  }

  if (promises instanceof Map) {
    let keys = [...promises.keys()];
    let values = await Promise.all([...promises.values()].map(mux));
    return new Map(zip(keys, values));
  }

  if (promises instanceof Set) {
    let values = await Promise.all([...promises.values()].map(mux));
    return new Set(values);
  }

  if (isPlainObject(promises)) {
    let keys = Object.keys(promises);
    let values = [];
    for (let key of keys) {
      values.push(promises[key]);
    }
    values = await Promise.all(values.map(mux));

    let result = Object.create(Object.getPrototypeOf(promises));
    let keyCount = keys.length;
    for (let ii = 0; ii < keyCount; ii++) {
      result[keys[ii]] = values[ii];
    }
    return result;
  }

  return promises;
}
