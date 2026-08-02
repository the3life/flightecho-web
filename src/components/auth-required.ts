import {css, html, LitElement} from "lit";
import {customElement} from "lit/decorators.js";
import {t} from "../i18n/translation.ts";

@customElement("auth-required")
export class AuthRequired extends LitElement {
    static styles = [css`
        .auth-required {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 32px;
            box-sizing: border-box;

            background: var(--auth-bg);
        }

        .auth-card {
            width: min(480px, 100%);
            background: var(--auth-card);
            border: 1px solid var(--auth-border);
            border-radius: 24px;
            padding: 40px;
            text-align: center;

            box-shadow: 0 24px 64px rgba(0, 0, 0, .18);
        }

        .auth-icon {
            width: 72px;
            height: 72px;
            margin: 0 auto 20px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;
            background: var(--auth-icon-bg);

            font-size: 34px;
        }

        .auth-card h2 {
            margin: 0 0 14px;
            color: var(--auth-title);
            font-size: 28px;
        }

        .auth-card p {
            margin: 0;
            color: var(--auth-text);
            line-height: 1.7;
        }

        .auth-card button {
            margin-top: 28px;

            border: 0;
            border-radius: 14px;

            padding: 12px 22px;

            background: var(--auth-button);
            color: var(--auth-button-text);

            font-size: 15px;
            font-weight: 700;

            cursor: pointer;
            transition: .2s;
        }

        .auth-card button:hover {
            background: var(--auth-button-hover);
        }

        :host {
            --auth-bg: #f5f7fb;
            --auth-card: #ffffff;
            --auth-border: #e5e7eb;

            --auth-title: #111827;
            --auth-text: #6b7280;

            --auth-button: #2563eb;
            --auth-button-hover: #1d4ed8;
            --auth-button-text: #ffffff;

            --auth-icon-bg: rgba(37, 99, 235, .12);
        }

        :host-context([data-theme="dark"]) {
            --auth-bg: #0b1220;
            --auth-card: #111827;
            --auth-border: #1f2937;

            --auth-title: #f3f4f6;
            --auth-text: #94a3b8;

            --auth-button: #2563eb;
            --auth-button-hover: #1d4ed8;
            --auth-button-text: white;

            --auth-icon-bg: rgba(37, 99, 235, .18);
        }
    `];

    render() {
        return html`
            <div class="auth-required">
                <div class="auth-card">
                    <div class="icon">🔒</div>

                    <h2>${t("auth_required.title")}</h2>

                    <p>${t("auth_required.message")}</p>
                </div>
            </div>
        `;
    }
}