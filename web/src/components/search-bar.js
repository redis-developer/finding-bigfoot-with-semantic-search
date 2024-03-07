import { html, css } from 'lit'

import UnlitElement from '../util/unlit-element.js'


export default class SearchBar extends UnlitElement {

  render() {
    return html`
      <div class="flex flex-row outline outline-1 outline-gray-800 rounded-md w-12/12 px-2 py-1 drop-shadow-md bg-white">
        <span class="text-gray-500 drop-shadow-sm">🔎</span>
        <input
          class="w-full bg-transparent outline-none px-2"
          type="text"
          name="query"
          placeholder="Search for Bigfoot..."
          @change="${this.#dispatchChangeEvent}">
      </div>`
  }

  get #input() {
    return this.querySelector('input')
  }

  #dispatchChangeEvent() {
    const query = this.#input.value
    if (query) {
      this.dispatchEvent(new CustomEvent('bigfoot:querySubmitted', { detail: { query } }))
    }
  }
}

customElements.define('search-bar', SearchBar)
