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
    console.log(`OK - ${getIn(this.props.state, ['daco','neviem'])}`)
    console.log(`OK - ${getIn(this.props.state, ['daco','neviem',9], 9)}`)
    console.log(`OK - ${getIn(this.props.state, ['viem','neviem', 'devat'], undefined, '999')}`)
    console.log(`OK - ${getIn(this.props.state, [])}`)
    //console.log(`NOT OK - ${getIn(this.props.state, ['daco','neviem', 'uz'])}`)
    this.props.dispatch(
      'second dispatch, one cycle',
      (state) => ({...setIn(state, ['second'], 'ready ')}),
      []
    )
    console.log(`NOT OK - need to wait till re-render ${getIn(this.props.state, ['second'], 'failed')}`) //but will be correct in next render
  }


  render() {
    let lessonJson = JSON.stringify(getIn(this.props.state, ['lessons'], null))
    return (
      <div>
        {getIn(this.props.state, ['second'], 'failed ')}
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