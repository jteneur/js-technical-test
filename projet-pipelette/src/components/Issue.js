import React, { Component } from 'react'

import Comment from './Comment.js'

class Issue extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render () {
    return (
      <div>
        <Comment />
      </div>
    )
  }
}

export default Issue
