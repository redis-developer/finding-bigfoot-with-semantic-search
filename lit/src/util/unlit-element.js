import { LitElement } from 'lit'

/*
  Tailwind will not play nice with the Shadow DOM, so we need to use
  the Light DOM. This is, admittedly, a bit of a hack.
*/
export default class UnlitElement extends LitElement {
  createRenderRoot() { return this }
}
