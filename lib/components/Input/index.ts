import { LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { LitElement } from "lit";

@customElement("input")
export default class InputElement extends LitElement {
  render() {
    html`
        <input></input>
        `;
  }
}
