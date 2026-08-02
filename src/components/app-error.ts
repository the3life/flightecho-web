import {css, html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";

@customElement("app-error")
export class AppError extends LitElement {
    static styles = [css`
        .app-error {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 32px;
            box-sizing: border-box;

            background: var(--error-bg);
        }

        .error-card {
            width: min(480px, 100%);
            background: var(--error-card);
            border: 1px solid var(--error-border);
            border-radius: 24px;
            padding: 40px;
            text-align: center;

            box-shadow: 0 24px 64px rgba(0, 0, 0, .18);
        }

        .error-icon {
            width: 72px;
            height: 72px;
            margin: 0 auto 20px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;
            background: var(--error-icon-bg);

            font-size: 34px;
        }

        .error-card h2 {
            margin: 0 0 14px;
            color: var(--error-title);
            font-size: 28px;
        }

        .error-card p {
            margin: 0;
            color: var(--error-text);
            line-height: 1.7;
        }

        .error-card button {
            margin-top: 28px;

            border: 0;
            border-radius: 14px;

            padding: 12px 22px;

            background: var(--error-button);
            color: var(--error-button-text);

            font-size: 15px;
            font-weight: 700;

            cursor: pointer;
            transition: .2s;
        }

        .error-card button:hover {
            background: var(--error-button-hover);
        }

        :host {
            --error-bg: #f5f7fb;
            --error-card: #ffffff;
            --error-border: #e5e7eb;

            --error-title: #111827;
            --error-text: #6b7280;

            --error-button: #2563eb;
            --error-button-hover: #1d4ed8;
            --error-button-text: #ffffff;

            --error-icon-bg: rgba(37, 99, 235, .12);
        }

        :host-context([data-theme="dark"]) {
            --error-bg: #0b1220;
            --error-card: #111827;
            --error-border: #1f2937;

            --error-title: #f3f4f6;
            --error-text: #94a3b8;

            --error-button: #2563eb;
            --error-button-hover: #1d4ed8;
            --error-button-text: white;

            --error-icon-bg: rgba(37, 99, 235, .18);
        }
    `];

    @property()
    title: string = "";

    @property()
    message: string = "";

    render() {
        return html`
            <div class="app-error">
                <div class="error-card">
                    <div class="icon">⚡</div>

                    <h2>${this.title}</h2>

                    <p>${this.message}</p>
                </div>
            </div>
        `;
    }
}