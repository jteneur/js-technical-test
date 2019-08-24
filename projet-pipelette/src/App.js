import React, { Component } from 'react';

import IssueInput from './components/IssueInput.js'
import Filters from './components/Filters.js'
import Stats from './components/Stats.js'
import Issue from './components/Issue.js'

class App extends Component {
  constructor() {
    super()
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <IssueInput />
        <Filters />
        <Stats />
        <Issue />
      </div>
    )
  }
}

export default App;

/**
 * Architecture du projet:
 * <App>
 *  <IssueInput />
 *  <Filters />
 *  <Stats />
 *  <Issue>
 *    <Comment />
 *    <Comment />
 *    ...
 *   </Issue>
 * </App>
 *
 * IssueInput : Champ pour charger l'URL de l'issue à analyser
 * Filters : Afficher / masquer le(s) <Comment /> correspondant au(x) participant(s) sélectionné(s)
 * Stats : Afficher le participant le plus bavard
 * Issue : Flux de commentaires de l'issue donnée
 * Comment : Un commentaire du flux
 */
