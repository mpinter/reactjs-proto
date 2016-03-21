import {
  has,
  set,
  clone
} from 'lodash'

// path is an array accessed in order - i.e. for state.user.posts[8] path would be = ['user', 'posts', 8]

// in setIn/updateIn force=true creates empty objects where path does not exist

// in geIn last argument is a map of default fallbacks
// last is used when access fails at last step
// any is used when access fails at any step

export function getIn(state, path, {last, any} = {}) {
  if (!(path instanceof Array)) {
    console.error('Expected path to be array, got:', path) // eslint-disable-line no-console
  }
  let value = state
  for (let i=0; i<path.length; i++) {
    if (has(value,path[i])) {
      value = value[path[i]]
    } else {
      if (i==path.length-1 && last !== undefined ) {
        return last
      } else if (any !== undefined) {
        return any
      } else {
        throwError('getIn', state, path.slice(0,i+1), value)
      }
    }
  }
  return value
}

export function updateIn(state, path, fn, force = false) {
  if (!(path instanceof Array) || path.length<1) {
    console.error('Expected path to be non-empty array, got:', path) // eslint-disable-line no-console
  }
  return recursiveUpdate('updateIn', state, state, path, 0, fn, force)
}

export function setIn(state, path, val, force = false) {
  if (!(path instanceof Array) || path.length<1) {
    console.error('Expected path to be non-empty array, got:', path) // eslint-disable-line no-console
  }
  return recursiveUpdate('setIn', state, state, path, 0, () => val, force)
}

// taskName and whole state and path for debugging purposes
function recursiveUpdate(taskName, state, resolvedState, path, index, fn, force = false) {
  let shallowCopy = clone(resolvedState) // shallow clone from lodash, on which we edit/descend down the desired attribute
  if (path.length-1 === index) {
    shallowCopy[path[index]] = fn(has(shallowCopy, path[index]) ? shallowCopy[path[index]] : undefined)
  } else {
    if (!has(shallowCopy, path[index])) {
      if (force) {
        set(shallowCopy, path[index], {})
      } else {
        throwError(taskName, state, path.slice(0,index+1), shallowCopy)
      }
    }
    shallowCopy[path[index]] = recursiveUpdate(taskName, state, shallowCopy[path[index]], path, index+1, fn, force)
  }
  return shallowCopy
}

function throwError(taskName, state, pathSegment, value) {
  console.error(`${taskName} failed - can not find ${pathSegment[pathSegment.length-1]} in ${value}`) // eslint-disable-line no-console
  console.error('State: ', state) // eslint-disable-line no-console
  console.error('Path (until failure): ', pathSegment) // eslint-disable-line no-console
  throw `Can not find ${pathSegment[pathSegment.length-1]} in ${value}`
}
