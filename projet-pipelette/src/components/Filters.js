import React, { Component } from 'react'

class Filters extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  updateFilter = e => {
    const userId = parseInt(e.target.value)
    const isChecked = e.target.checked
    this.props.filterResults(userId, isChecked)
  }

  render () {
    return (
      <div>
        <h2>Filtres</h2>
        {this.props.filters.map(filter => {
          return (
            <div>
              <input
                type="checkbox"
                id={filter.userId}
                value={filter.userId}
                onChange={this.updateFilter}
                defaultChecked
              />
              <label htmlFor={filter.userId}>{filter.userLogin}</label>
            </div>
          )
        })}
      </div>
    )
  }
}

export default Filters
