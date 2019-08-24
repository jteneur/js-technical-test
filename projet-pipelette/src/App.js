import React, { Component } from 'react';

import IssueInput from './components/IssueInput.js'
import Filters from './components/Filters.js'
import Stats from './components/Stats.js'
import Issue from './components/Issue.js'

// Instanciation octokit/rest
const Octokit = require('@octokit/rest')
const octokit = new Octokit({
  auth: '7f18a14eb72a7c25941fb630582ca58b359c380f',
  userAgent: 'ProjetPipelette v1.0.0'
})

class App extends Component {
  constructor() {
    super()
    this.state = {
      issueComments: []
    }
  }

  async componentDidMount() {

    const OWNER = 'nodejs'
    const REPO = 'node'
    const ISSUE_NUMBER = 6867

    // Fetch user.id of author of issue
    const { data: issueRequest } = await octokit.issues.get({
      owner: OWNER,
      repo: REPO,
      issue_number: ISSUE_NUMBER
    })
    const authorUserId = issueRequest.user.id

    // Fetch comments on given issue
    const { data: issueCommentsRequest } = await octokit.issues.listComments({
      owner: OWNER,
      repo: REPO,
      issue_number: ISSUE_NUMBER
    })
    const issueComments = await issueCommentsRequest.map(comment => {
      const isAuthor = comment.user.id === authorUserId ? true : false
      return (
        {
          id: comment.id,
          body: comment.body,
          userId: comment.user.id,
          userLogin: comment.user.login,
          userAvatar_url: comment.user.avatar_url,
          isAuthor: isAuthor
        }
      )
    })
    this.setState({ issueComments: issueComments })
  }

  render() {
    return (
      <div>
        <IssueInput />
        <Filters />
        <Stats />
        <Issue issueComments={this.state.issueComments} />
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
 *
 * Etapes :
 * DONE. Récupérer une issue Github définie
 *    => npm i @octokit/rest de Github
 *    => créer auth token sur Github : 7f18a14eb72a7c25941fb630582ca58b359c380f
 * DONE. Afficher le flux de discussion
 * 2b. Déterminer qui est l'auteur
 * 3. Analyser le flux pour définir le plus bavard
 * 4. Permettre le chargement de l'Url de l'issue par IssueInput
 * 5. Ajouter la possibilité de filtrer
 * 6. css
 */
