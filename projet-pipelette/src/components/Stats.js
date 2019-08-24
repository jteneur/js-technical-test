import React, { Component } from 'react'

class Stats extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render () {
    return (
      <div>
        <h2>Statistiques</h2>
        {this.props.results.map(u => {
          return (
            <p>User: {u.userLogin} (uid: {u.userId}), Words: {u.count}</p>
          )
        })}
        <hr></hr>
      </div>
    )
  }
}

export default Stats
