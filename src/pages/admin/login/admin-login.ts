import {Page} from "../../page.ts";
import {html, unsafeCSS} from "lit";
import styles from './admin-login.css?inline';
import theme from '../admin-theme.css?inline';
import global from "../../../index.css?inline";
import {customElement} from "lit/decorators.js";
import {t} from "../../../i18n/translation.ts";

@customElement("admin-login")
export class AdminLogin extends Page {
    static styles = [unsafeCSS(global), unsafeCSS(theme), unsafeCSS(styles)];

    protected renderPage() {
        return html`
            <div class="container">
                <div class="login-card">
                    <div class="logo">🛡️</div>

                    <h1>${t("admin_page.login.title")}</h1>

                    <p class="subtitle">
                        ${t("admin_page.login.subtitle")}
                    </p>

                    <div class="field">
                        <label>${t("admin_page.login.email")}</label>
                        <input
                                type="email"
                                placeholder="admin@example.com"
                        />
                    </div>

                    <div class="field">
                        <label>${t("admin_page.login.password")}</label>
                        <input
                                type="password"
                                placeholder="••••••••"/>

                    </div>

                    <button class="login-btn">
                        ${t("admin_page.login.sign_in")}
                    </button>

                    <div class="footer">
                        <span>${t("admin_page.login.secure")}</span>
                    </div>
                </div>
            </div>
        `;
    }
}