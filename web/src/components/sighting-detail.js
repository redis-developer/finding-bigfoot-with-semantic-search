import { html } from 'lit'

import UnlitElement from '../util/unlit-element.js'
import SightingTitle from './sighting-title.js'
import SightingSummary from './sighting-summary.js'
import SightingAccount from './sighting-account.js'
import SightingLocation from './sighting-location.js'
import SightingWeather from './sighting-weather.js'


export default class SightingDetail extends UnlitElement {

  static properties = {
    sighting: { type: Object }
  }

  render() {
    return html`
      <div class="flex flex-row items-top pt-8 pr-64">

        <h1 class="flex-none text-3xl pl-6 pr-12 font-acme"><a href="/">👣 Bigfoot Finder</a></h1>

        <div class="flex flex-col items-left pb-96">
          <sighting-title .sighting=${this.sighting}></sighting-title>
          <sighting-summary .sighting=${this.sighting}></sighting-summary>
          <sighting-account .sighting=${this.sighting}></sighting-account>
          <sighting-location .sighting=${this.sighting}></sighting-location>
          <sighting-weather .sighting=${this.sighting}></sighting-weather>
        </div>

      </div>
    `
  }
}

customElements.define('sighting-detail', SightingDetail)
