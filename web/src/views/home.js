import { Router } from '@vaadin/router'
import { html } from 'lit'

import UnlitElement from '../util/unlit-element.js'
import SearchBar from '../components/search-bar.js'


export default class HomeView extends UnlitElement {

  render() {
    return html`
      <div class="flex flex-col items-center pt-64">
        <h1 class="text-6xl pb-6 font-acme">👣 Bigfoot Finder</h1>
        <search-bar
          class="w-6/12 block"
          @bigfoot:querySubmitted="${this.#onQuerySubmitted}">
        </search-bar>
      </div>
    `
  }

  #onQuerySubmitted(event) {
    const query = event.detail.query
    Router.go('/search/' + query)
  }
}

customElements.define('home-view', HomeView)
