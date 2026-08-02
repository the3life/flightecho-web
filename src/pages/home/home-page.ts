import {customElement} from "lit/decorators.js";
import {html, LitElement} from "lit";

@customElement("home-page")
export class HomePage extends LitElement {
    render() {
        return html`
            <h1>Home Page</h1>
        `;
    }
}