import React, { Component } from 'react'

import Comment from './Comment.js'

class Issue extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    const { issueComments } = this.props
    // On instancie un composant <Comment /> par entrée dans la prop issueComments
    return (
      issueComments.map(comment => {
        return (
          <Comment comment={comment} />
        )
      })
    )
  }
}

export default Issue
