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
    this.filterResults = this.filterResults.bind(this)
    this.state = {
      issueComments: [],
      wordCount: [],
      users: [],
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
          userLogin: comment.userLogin,
          isHidden: comment.isHidden
        })
      }
      return null
    })
    this.setState({ wordCount: results })
  }

  /**
   * Find all indexes of given userId in comments array
   * @param  {[Array]} comments Array of comments objects
   * @param  {[Int]} userId   userInd to find
   * @return {[Array]}  Array of all indexes found
   */
  getAllIndexes = (comments, userId) => {
    let indexes = []
    for (let i = 0 ; i < comments.length ; i++) {
      if (comments[i].userId === userId) {
        indexes.push(i)
      }
    }
    return indexes
  }

  /**
   * Fonction pour mettre à jour les commentaires selon les users affichés/
   * masqués
   * @param  {[int]} userId id de l'user
   * @param  {[bool]} status true = à afficher, false = à masquer
   * @return {[type]} met à jour l'état issueComments et les stats
   */
  filterResults(userId, status) {
    const issueComments = this.state.issueComments
    const foundIndexes = this.getAllIndexes(issueComments, userId)
    foundIndexes.forEach(c => {
      issueComments[c].isHidden = !status
    })
    this.setState({ issueComments: issueComments })
    this.countResults()
  }

  /**
   * Charge les données d'issue Github
   * @param  {[string]}  url Adresse de l'issue
   * @return {Promise}   instancie l'état local issueComments
   */
  async loadData(url) {

    // Check if issue url from Github
    const regex = /^https:\/\/(www\.)?github\.com\/[a-z0-9\-]+\/[a-z0-9\-]+\/issues\/[0-9]+$/
    if(!url.match(regex)) {
      alert('URL incorrecte')
      return null
    }

    const dataUrl = url.split('/')
    //3: Author, 4: Repo, 5: Issue number
    const OWNER = dataUrl[3]
    const REPO = dataUrl[4]
    const ISSUE_NUMBER = dataUrl[6]

    // Fetch user.id of author of issue
    const { data: issueRequest } = await octokit.issues.get({
      owner: OWNER,
      repo: REPO,
      issue_number: ISSUE_NUMBER
    })
    this.setState({ dataUrl: url })
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
          isAuthor: isAuthor,
          isHidden: false
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
        <Filters filters={wordCount} filterResults={this.filterResults} />
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
 * DONE. Permettre le chargement de l'Url de l'issue par IssueInput
 * DONE. Ajouter la possibilité de filtrer
 * 5b. Regex url pour vérifier github issue etc.
 * 5c. Aggréger tous les messages quand plusieurs pages à l'issue
 * 6. css
 */
