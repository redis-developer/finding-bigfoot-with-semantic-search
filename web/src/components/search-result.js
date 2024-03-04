import { html, css } from 'lit'

import UnlitElement from '../util/unlit-element.js'


export default class SearchResult extends UnlitElement {

  static styles = css`
    :host { display: block; }
  `

  static properties = {
    sighting: { type: Object }
  }

  render() {
    return html`
      <h1 class="text-4xl pt-6"><a href="/sighting/${this.sighting.id}">${this.sighting.title}</a></h1>
      <p>${this.sighting.observed}</p>
    `
  }
}

customElements.define('search-result', SearchResult)
