require('babel-polyfill')
import ReactDOM from 'react-dom'
import React from 'react'
import {
  cloneDeep,
  isEqual,
  clone
} from 'lodash'
import {
  isIterable,
  shallowCompare
} from 'useful'
import actions from './actions'
import {Test} from './test'

const {Navigator} = React

let appstate = {}

let prevstate = undefined

class App extends React.Component {
  getInitialState() {

  }
  getDefaultProps() {

  }
  componentWillMount() {
    this.actions = actions('https://stage.skillandia.com/') // you'll need to allow CORS in your browser for this to work
  }

  dispatch(msg, fn, args) {
    if (args == null) {
      args = []
    }
    if (!(args instanceof Array)) {
      console.error('Expected args to be array, got:', args) // eslint-disable-line no-console
    }
    // check if anybody meddled with state outside dispatch
    if (this.prevstate !== undefined && !isEqual(this.prevstate, appstate)) {
      // do another clone so that no further changes happen to printed-out objects
      const printPrev = cloneDeep(this.prevstate)
      const printCurrent = cloneDeep(appstate)
      console.error('State was changed between last two dispatches') // eslint-disable-line no-console
      console.error('Previous state:', printPrev) // eslint-disable-line no-console
      console.error('Current state:', printCurrent) // eslint-disable-line no-console
    }
    //create map of object_ref => shallow_obj_copy which is checked after the function is dispatched
    const stateMap = new Map()
    const constructMap = (state, path) => {
      for (let key in state) {
        stateMap.set(state[key], {obj: clone(state[key]), path: path.concat(key)})
        if (isIterable(state[key])) constructMap(state[key], path.concat(key))
      }
    }
    stateMap.set(appstate, {obj: clone(appstate), path: []})
    constructMap(appstate, [])
    console.log(`dispatching: ${msg}`) // eslint-disable-line no-console
    console.log('function:', fn) // eslint-disable-line no-console
    console.log('args', args) // eslint-disable-line no-console
    appstate = fn.apply(null, [appstate].concat(args))
    //check if appstate was mutated
    for (let entry of stateMap.entries()) {
      if (!shallowCompare(entry[0], entry[1].obj)) {
        console.error('State was mutated in function dispatch') // eslint-disable-line no-console
        console.error('State: ', appstate) // eslint-disable-line no-console
        console.error('Path where mutation occured: ', entry[1].path) // eslint-disable-line no-console
        console.error('Previous value: ', entry[1].obj) // eslint-disable-line no-console
        console.error('Value after dispatch: ', entry[0]) // eslint-disable-line no-console
      }
    }
    this.prevstate = cloneDeep(appstate)
    this.setState({})
    console.log('state after dispatch', appstate) // eslint-disable-line no-console
  }

  render() {

    let props = {
      dispatch: this.dispatch.bind(this),
      state: appstate,
      actions: this.actions,
    }

    return (
      <Test {...props} />
    )
  }
}


document.addEventListener('DOMContentLoaded', function() {
  const elem = document.getElementById('reactapp')
  ReactDOM.render(<App />, elem)
})