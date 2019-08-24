import React, { Component } from 'react'

import Comment from './Comment.js'

class Issue extends Component {

  render () {
    const { issueComments } = this.props
    // On instancie un composant <Comment /> par entrée dans la prop issueComments
    return (
      <div>
        <h2>Flux de discussion</h2>
        {
          issueComments.map(comment => {
            return (
              <Comment comment={comment} />
            )
          })
        }
      </div>
    )
  }
}

export default Issue
