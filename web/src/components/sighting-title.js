import { html } from 'lit'

import UnlitElement from '../util/unlit-element.js'


export default class SightingTitle extends UnlitElement {

  static properties = {
    sighting: { type: Object }
  }

  render() {

    const title = this.#formatTitle(this.sighting)

    return html`
      <h1 class="text-3xl pr-24 pb-2">${title}</h1>
    `
  }

  #formatTitle({ id, title }) {
    if (title === undefined) return `Report ${id}`
    return `Report ${id}: ${title}`
  }
}

customElements.define('sighting-title', SightingTitle)
