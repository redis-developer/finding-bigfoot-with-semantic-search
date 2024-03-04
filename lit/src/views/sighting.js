import { Task } from '@lit/task'
import { html, css } from 'lit'

import UnlitElement from '../util/unlit-element.js'
import SightingDetail from '../components/sighting-detail.js'


export default class SightingView extends UnlitElement {
  static styles = css`
    :host { display: block; }
  `

  static properties = {
    location: { type: Object }
  }

  #sightingTask = new Task(this, {
    task: async ([ id ]) => {
      const response = await fetch(`http://localhost:3000/api/fetch`, {
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
