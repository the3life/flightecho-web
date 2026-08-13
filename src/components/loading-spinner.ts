import {customElement} from "lit/decorators.js";
import {html} from "lit";
import {BaseElement} from "./base-element.ts";

@customElement("loading-spinner")
export class LoadingSpinner extends BaseElement {
    render() {
        return html`
            <div class="loading">
                <div class="spinner"></div>
            </div>
        `;
    }
}