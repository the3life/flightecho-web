import {customElement} from "lit/decorators.js";
import {css, html, LitElement} from "lit";

@customElement("loading-spinner")
export class LoadingSpinner extends LitElement {
    static styles = css`
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            min-height: 220px;
        }

        .spinner {
            width: 46px;
            height: 46px;

            border-radius: 50%;
            border: 4px solid rgba(127, 127, 127, .2);
            border-top-color: #4FC3F7;

            animation: spin .8s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    `;

    render() {
        return html`
            <div class="spinner"></div>
        `;
    }
}