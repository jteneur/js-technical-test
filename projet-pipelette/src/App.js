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
    // Bind pour utiliser la fonction loadData depuis le composant <IssueInput />
    this.loadData = this.loadData.bind(this)
    this.state = {
      issueComments: [],
      wordCount: [],
      dataUrl: ""
    }
  }

  /**
   * Fonction pour compter le nombre de mots dans une chaîne de caractères
   * @param {[string]} texte à analyser
   * @return {[int]} nombre de mots
   */
  wordCount = (s) => {
    return s.split(" ").length
  }

  /**
   * Fonction pour référencer le nombre total de mots par user
   * @return this.state.wordCount => Array d'objets {count, userId, userLogin}
   */
  countResults = () => {
    let results = []
    this.state.issueComments.map(comment => {
      /**
       * On détermine si l'userId de l'auteur du commentaire est déjà présent
       * dans l'Array des résultats. Si oui, on récupère sa position dans
       * l'Array et on met à jour le compte de mots en y ajoutant le compte du
       * commentaire en cours. Sinon, on l'ajoute dans l'Array avec le compte de
       * mots du commentaire.
       */
      if (results.some(result => comment.userId === result.userId)) {
        const foundIndex = results.findIndex(x => x.userId === comment.userId)
        results[foundIndex].count += this.wordCount(comment.body)
      }
      else {
        results.push({
          count: this.wordCount(comment.body),
          userId: comment.userId,
          userLogin: comment.userLogin
        })
      }
      return null
    })
    this.setState({ wordCount: results })
  }

  async loadData(url) {

    this.setState({ dataUrl: url })
    const dataUrl = url.split('/')
    //3: Author, 4: Repo, 5: Issue number
    console.log(dataUrl)
    const OWNER = dataUrl[3]
    const REPO = dataUrl[4]
    const ISSUE_NUMBER = dataUrl[6]

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
    this.countResults()
  }

  inputElement = React.createRef()

  render() {
    const { wordCount, issueComments, dataUrl } = this.state
    return (
      <div>
        <IssueInput inputElement={this.inputElement} loadData={this.loadData} />
        <Filters />
        <Stats dataUrl={dataUrl} results={wordCount} />
        <Issue issueComments={issueComments} />
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
 * DONE. Déterminer qui est l'auteur
 * DONE. Analyser le flux pour définir le plus bavard
 * 4. Permettre le chargement de l'Url de l'issue par IssueInput
 * 5. Ajouter la possibilité de filtrer
 * 6. css
 */
