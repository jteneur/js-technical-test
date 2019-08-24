import React, { Component } from 'react'

class Stats extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  /**
   * Tri du nombre de mots par ordre décroissant
   */
  sortResults = (a, b) => {
    return b.count - a.count
  }

  render () {
    let i = 1 // Position sur le podium
    return (
      <div>
        <h2>Statistiques</h2>
        <p>
          <strong>URL analysée :</strong>
          {this.props.dataUrl}
        </p>
        {this.props.results.sort(this.sortResults).map(u => {
          if(!u.isHidden) {
            return (
              <p>{i++}. User: {u.userLogin} (uid: {u.userId}), Words: {u.count}</p>
            )
          }
          else {
            return null
          }
        })}
        <hr></hr>
      </div>
    )
  }
}

export default Stats
