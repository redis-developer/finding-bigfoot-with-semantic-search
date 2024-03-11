import { html } from 'lit'

import UnlitElement from '../util/unlit-element.js'


export default class SightingSummary extends UnlitElement {

  static properties = {
    sighting: { type: Object }
  }

  render() {

    const date = this.#formatDate(this.sighting)
    const classification = this.sighting.classification
    const summary = this.sighting.summary

    return html`
      <p>
        <span class="font-bold">Date:</span>
        <span>${date}</span>
      </p>
      <p>
        <span class="font-bold ">Classification:</span>
        <span>${classification}</span>
      </p>

      <p class="pt-1">${summary}</p>
    `
  }

  #formatDate({ timestamp }) {
    if (timestamp == undefined) return '--'
    return new Intl.DateTimeFormat('en-US', {
      month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'
    }).format(new Date(timestamp * 1000))
  }
}

customElements.define('sighting-summary', SightingSummary)
