import {
  keys,
  isEqual
} from 'lodash'

export function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

export function shallowCompare(first, second) {
  let firstKeys = keys(first)
  if (!isEqual(firstKeys, keys(second))) return false
  for (let key of firstKeys) {
    if (first[key] !== second[key]) return false
  }
  return true
}