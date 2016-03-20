require('babel-polyfill')
import ReactDOM from 'react-dom'
import React from 'react'
import {
  cloneDeep,
  isEqual
} from 'lodash'
import actions from './actions'

const {Navigator} = React

let appstate = {}

const dev_mode = true
let prevstate = {}

class App extends React.Component {
  getInitialState() {
    
  }
  getDefaultProps() {
    
  }
  componentWillMount() {
    this.actions = actions('http://example.com')
  }
  
  dispatch(msg, fn, args) {
    if (args == null) {
      args = []
    }
    if (!(args instanceof Array)) {
      console.error('Expected args to be array, got:', args) // eslint-disable-line no-console
    }
    if (dev_mode) {
      // check if anybody meddled with state outside dispatch
      if (!isEqual(prevstate, appstate)) {
        // do another clone so that no further changes happen to printed-out objects
        const printPrev = cloneDeep(prevstate)
        const printCurrent = cloneDeep(appstate)
        console.error('State was changed between last two dispatches') // eslint-disable-line no-console
        console.error('Previous state:',printPrev) // eslint-disable-line no-console
        console.error('Current state:',printCurrent) // eslint-disable-line no-console
      } 
      prevstate = cloneDeep(appstate)
    }
    console.log(`dispatching: ${msg}`) // eslint-disable-line no-console
    console.log('function:', fn) // eslint-disable-line no-console
    console.log('args', args) // eslint-disable-line no-console
    appstate = fn.apply(null, [appstate].concat(args))
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
      <div>Hello!</div>
    )
  }
}


document.addEventListener('DOMContentLoaded', function() {
  const elem = document.getElementById('reactapp')
  ReactDOM.render(<App />, elem)
})