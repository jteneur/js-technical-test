import React, { Component } from 'react'

class Comment extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render () {
    const { userAvatar_url, userLogin, id, body } = this.props.comment
    // TODO: Supprimer width & height une fois css implémenté
    return (
      <div key={id}>
        <img width="30" height="30" src={userAvatar_url} alt={userLogin} />
        <p><strong>{userLogin}</strong></p>
        <p>{body}</p>
        <hr></hr>
      </div>
    )
  }
}

export default Comment
