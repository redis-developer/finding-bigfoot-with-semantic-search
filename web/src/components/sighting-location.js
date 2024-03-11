import { html } from 'lit'

import UnlitElement from '../util/unlit-element.js'


export default class SightingLocation extends UnlitElement {

  static properties = {
    sighting: { type: Object }
  }

  render() {

    const location = this.sighting.locationDetails
    const countyAndState = this.#formatCountyAndState(this.sighting)
    const coordinates = this.#formatCoordinates(this.sighting)
    const mapLink = this.#formatMapLink(this.sighting)

    return html`
      <h2 class="text-xl font-semibold pt-4">Location</h2>

      <p class="pt-1 pb-2">${location}</p>

      <p>
        <span class="font-bold">Location:</span>
        <span>${countyAndState}</span>
      </p>

      <p>
        <span class="font-bold">Coordinates:</span>
        <span>${coordinates}</span>
        ${ mapLink }
      </p>
    `
  }

  #formatCountyAndState({ county, state }) {
    if (county === undefined || state === undefined) return '--'
    return `${county}, ${state}`
  }

  #formatCoordinates({ latitude, longitude }) {
    if (latitude === undefined || longitude === undefined) return '--'
    return `${latitude}, ${longitude}`
  }

  #formatMapLink({ latitude, longitude }) {
    if (latitude === undefined || longitude === undefined) return html``
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    return html`<a href="${mapUrl}" target="_blank">🌎</a>`
  }
}

customElements.define('sighting-location', SightingLocation)
