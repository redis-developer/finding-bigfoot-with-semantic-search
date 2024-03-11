import { html } from 'lit'

import UnlitElement from '../util/unlit-element.js'


export default class SightingAccount extends UnlitElement {

  static properties = {
    sighting: { type: Object }
  }

  render() {

    const observed = this.sighting.observed

    return html`
      <h2 class="text-xl font-semibold pt-4">Eyewitness Account</h2>
      <p class="pt-1">${observed}</p>
    `
  }
}

customElements.define('sighting-account', SightingAccount)
