require('babel-polyfill')
import ReactDOM from 'react-dom'
import React from 'react'
import {
  cloneDeep,
  isEqual
} from 'lodash'
import actions from './actions'
import {Test} from './test'

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
    this.actions = actions('https://stage.skillandia.com/') // you'll need to allow CORS in your browser for this to work
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
      const printPrev = cloneDeep(prevstate)
      const printCurrent = cloneDeep(appstate)
      console.log(printPrev)
      console.log(printCurrent)
      if (!isEqual(prevstate, appstate)) {
        // do another clone so that no further changes happen to printed-out objects
        console.error('State was changed between last two dispatches') // eslint-disable-line no-console
        console.error('Previous state:',printPrev) // eslint-disable-line no-console
        console.error('Current state:',printCurrent) // eslint-disable-line no-console
      } 
    }
    console.log(`dispatching: ${msg}`) // eslint-disable-line no-console
    console.log('function:', fn) // eslint-disable-line no-console
    console.log('args', args) // eslint-disable-line no-console
    appstate = fn.apply(null, [appstate].concat(args))
    this.setState({})
    console.log('state after dispatch', appstate) // eslint-disable-line no-console
    if (dev_mode) prevstate = cloneDeep(appstate)
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