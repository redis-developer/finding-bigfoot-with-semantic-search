import { Router } from '@vaadin/router'
import { Task } from '@lit/task'
import { html } from 'lit'

import UnlitElement from '../util/unlit-element.js'
import SearchBar from '../components/search-bar.js'
import SearchResults from '../components/search-results.js'

import { API_BASE_URL, RESULT_COUNT } from '../config.js'


export default class SearchView extends UnlitElement {

  static properties = {
    location: { type: Object }
  }

  render() {
    return html`
      <div class="flex flex-row items-top pt-8 pr-64">

        <h1 class="flex-none text-3xl pl-6 pr-12 font-acme"><a href="/">👣 Bigfoot Finder</a></h1>

        <div class="flex flex-col items-left">
          <search-bar
            class="w-full pb-9 block"
            @bigfoot:querySubmitted="${this.#onQuerySubmitted}">
          </search-bar>

          <hr class="border-gray-500"/>

          ${this.#searchTask.render({

            pending: () => html`
              <p>In Search of Bigfoot...</p>`,

            complete: (results) => html`
              <search-results
                class="w-full pt-6 block"
                .sightings=${results}>
              </search-results>`,

            error: (e) => html`
              <p>Error: ${e}</p>`

          })}

        </div>
      </div>
    `
  }

  #searchTask = new Task(this, {
    task: async ([ query ]) => {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, count: RESULT_COUNT })
      })

      if (!response.ok) throw new Error(response.status)
      return response.json()
    },
    args: () => [ this.location.params.query ]
  })

  #onQuerySubmitted(event) {
    const query = event.detail.query
    Router.go('/search/' + query)
  }

}

customElements.define('search-view', SearchView)
