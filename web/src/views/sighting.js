import { Task } from '@lit/task'
import { html } from 'lit'

import UnlitElement from '../util/unlit-element.js'
import SightingDetail from '../components/sighting-detail.js'

import { API_BASE_URL } from '../config.js'


export default class SightingView extends UnlitElement {

  static properties = {
    location: { type: Object }
  }

  #sightingTask = new Task(this, {
    task: async ([ id ]) => {
      const response = await fetch(`${API_BASE_URL}/fetch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })

      if (!response.ok) throw new Error(response.status)
      return response.json()
    },
    args: () => [ this.location.params.id ]
  })

  render() {
    return html`
      ${this.#sightingTask.render({
        pending: () => html`<p>In Search of Bigfoot...</p>`,
        complete: (results) => html`<sighting-detail .sighting=${results}></sighting-detail>`,
        error: (e) => html`<p>Error: ${e}</p>`
    })
    }
    `
  }
}

customElements.define('sighting-view', SightingView)
