import {
  has,
  set
} from 'lodash'

// path is an array accessed in order - i.e. for state.user.posts[8] path would be = ['user', 'posts', 8]

// defaultLast is used as fallback when access fails at last step
// defaultAny is used as fallback when access fails at any step
// do not use 'undefined' as defaults
export function getIn(state, path, defaultLast, defaultAny) {
  if (!(path instanceof Array)) {
    console.error('Expected path to be array, got:', path) // eslint-disable-line no-console
  }
  return deepAccess('getIn', state, path, defaultLast, defaultAny)
}

// with force == true creates the path where it doesn't exist
export function setIn(state, path, value, force = false) {
  if (!(path instanceof Array) || path.length<1) {
    console.error('Expected path to be non-empty array, got:', path) // eslint-disable-line no-console
  }
  if (force) {
    set(state, path, value)
  } else {
    if (path.length<2) {
      state[path[0]] = value
    } else {
      deepAccess('setIn', state, path.slice(0,-1))[path[path.length-1]] = value
    }
  }
  return state
}

export function updateIn(state, path, fn) {
  if (!(path instanceof Array) || path.length<1) {
    console.error('Expected path to be non-empty array, got:', path) // eslint-disable-line no-console
  }
  if (path.length<2) {
    state[path[0]] = fn(state[path[0]])
  } else {
    deepAccess('setIn', state, path.slice(0,-1))[path[path.length-1]] = fn(deepAccess('setIn', state, path.slice(0,-1))[path[path.length-1]])
  }
  return state
}

function deepAccess(funcName, state, path, defaultLast, defaultAny) {
  let value = state
  for (let i=0; i<path.length; i++) {
    if (has(value,path[i])) {
      value = value[path[i]]
    } else {
      if (i==path.length-1 && defaultLast !== undefined ) {
        return defaultLast
      } else if (defaultAny !== undefined) {
        return defaultAny
      } else {
        console.error(`${funcName} failed - can not find ${path[i]} in ${value}`) // eslint-disable-line no-console
        console.error('State: ', state) // eslint-disable-line no-console
        console.error('Path (until failure): ', path.slice(0,i+1)) // eslint-disable-line no-console
        throw `Trying to access nonexistent entity with ${funcName} - can not find ${path[i]} in ${value}`
      }
    }
  }
  return value
}