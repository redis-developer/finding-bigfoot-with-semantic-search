import { html } from 'lit'

import UnlitElement from '../util/unlit-element.js'


export default class SearchResult extends UnlitElement {

  static properties = {
    sighting: { type: Object }
  }

  render() {
    const title = this.sighting.title === undefined
      ? `Report ${this.sighting.id}`
      : `Report ${this.sighting.id}: ${this.sighting.title}`
    const url = `/sighting/${this.sighting.id}`

    return html`
      <h1 class="text-2xl pr-24">
        <a
          class="line-clamp-1 underline hover:no-underline text-red-900"
          href="${url}">${title}
        </a>
      </h1>
      <p
        class="line-clamp-3 text-ellipsis overflow-hidden">
          ${this.sighting.summary}
      </p>
    `
  }
}

customElements.define('search-result', SearchResult)
