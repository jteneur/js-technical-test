import React, { Component } from 'react'

class IssueInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentInput: ""
    }
  }

  handleChange = e => {
    const currentInput = e.target.value
    this.setState({ currentInput: currentInput })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.loadData(this.state.currentInput)
    this.setState({ currentInput: "" })
  }

  render () {
    return (
      <div>
        <h2>URL de l'issue</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="https://www.github.com/author/repo/issues/number"
            ref={this.props.inputElement}
            onChange={this.handleChange}
            value={this.state.currentInput}
          />
          <button>Afficher les résultats</button>
        </form>
      </div>
    )
  }
}

export default IssueInput
