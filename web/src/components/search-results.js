import { html } from 'lit'

import UnlitElement from '../util/unlit-element.js'
import SearchResult from '../components/search-result.js'


export default class SearchResults extends UnlitElement {

  static properties = {
    sightings: { type: Array }
  }

  render() {
    return html`
      ${this.sightings.map(sighting =>
        html`
          <search-result
            class="pb-6 block"
            .sighting=${sighting}>
          </search-result>
        `
      )}
    `
  }
}

customElements.define('search-results', SearchResults)
