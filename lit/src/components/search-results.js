import { html, css } from 'lit'

import UnlitElement from '../util/unlit-element.js'
import SearchResult from '../components/search-result.js'


export default class SearchResults extends UnlitElement {

  static styles = css`
    :host { display: block; }
  `

  static properties = {
    sightings: { type: Array }
  }

  render() {
    return html`
      ${this.sightings.map(sighting =>
        html`
          <search-result .sighting=${sighting}></search-result>
        `
      )}
    `
  }
}

customElements.define('search-results', SearchResults)
