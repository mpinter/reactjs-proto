import React from 'react'
import {
  getIn,
  setIn,
  updateIn
} from './stateUtils'
import actions from './actions'

export class Test extends React.Component {

  componentWillMount() {
    this.props.dispatch(
      'blargh',
      (state) => ({...setIn(state, ['daco','neviem',8], 47, true)}),
      []
    )
  }


  render() {
    if (getIn(this.props.state, ['daco'], {any: false})) {
      console.log(`OK - ${getIn(this.props.state, ['daco','neviem'], {any: 'fail'})}`)
      console.log(`OK - ${getIn(this.props.state, ['daco'], {last: 9})}`)
      console.log(`OK - ${getIn(this.props.state, ['viem','neviem', 'devat'], {any: '999'})}`)
      console.log(`OK - ${getIn(this.props.state, [])}`)
    }
    //console.log(`NOT OK - ${getIn(this.props.state, ['daco','neviem', 'uz'])}`)
    let lessonJson = JSON.stringify(getIn(this.props.state, ['lessons'], {last: null}))
    return (
      <div>
        <span onClick={
          () => {
            console.log('clicked')
            this.props.actions.fetchLessons().then((res) => {
              this.props.dispatch(
                'lessons arrived',
                (state, data) => ({...state, lessons: data}),
                [JSON.parse(res)]
              )
            })
          }
        }>
          Get
        </span>
        <div>
          {lessonJson}
        </div>
      </div>
    )
  }
}