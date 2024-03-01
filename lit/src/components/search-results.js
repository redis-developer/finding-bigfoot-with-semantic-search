import { html, css } from 'lit'
import UnlitElement from '../util/unlit-element.js'

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
          <h1 class="text-4xl pt-6">${sighting.title}</h1>
          <p>${sighting.observed}</p>
        `
      )}
    `
  }
}

customElements.define('search-results', SearchResults)
