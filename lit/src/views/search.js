import { Router } from '@vaadin/router'
import { Task } from '@lit/task'
import { html, css } from 'lit'

import UnlitElement from '../util/unlit-element.js'
import SearchBar from '../components/search-bar.js'
import SearchResults from '../components/search-results.js'


export default class SearchView extends UnlitElement {
  static styles = css`
    :host { display: block; }
  `

  static properties = {
    location: { type: Object }
  }

  #searchTask = new Task(this, {
    task: async ([ query ]) => {
      const response = await fetch(`http://localhost:3000/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, count: 5 })
      })

      if (!response.ok) throw new Error(response.status)
      return response.json()
    },
    args: () => [ this.location.params.query ]
  })

  render() {
    return html`
      <search-bar class="w-6/12" @bigfoot:querySubmitted="${this.#onQuerySubmitted}"></search-bar>
      ${this.#searchTask.render({
        pending: () => html`<p>In Search of Bigfoot...</p>`,
        complete: (results) => html`<search-results .sightings=${results}></search-results>`,
        error: (e) => html`<p>Error: ${e}</p>`
    })
    }
    `
  }

  #onQuerySubmitted(event) {
    const query = event.detail.query
    Router.go('/search/' + query)
  }
}

customElements.define('search-view', SearchView)
