import {Page} from "../../page.ts";
import {html, unsafeCSS} from "lit";
import {customElement} from "lit/decorators.js";
import {t} from "../../../i18n/translation.ts";
import {BaseElement} from "../../../components/base-element.ts";
import styles from './admin-login.css?inline';

@customElement("admin-login")
export class AdminLogin extends Page {
    static styles = [...BaseElement.styles, unsafeCSS(styles)];

    protected renderPage() {
        return html`
            <div class="min-h-screen flex justify-center items-center p-6">
                <div class="card w-105 max-w-full">
                    <div class="
                        w-18
                        h-18
                        mx-auto
                        mb-6
                        grid
                        place-items-center
                        rounded-[18px]
                        bg-accent
                        text-[34px]">🛡️
                    </div>

                    <h1 class="m-0 text-center text-[30px]">${t("admin_page.login.title")}</h1>

                    <p class="mt-3 mb-8 text-center text-muted leading-[1.6]">
                        ${t("admin_page.login.subtitle")}
                    </p>

                    <div class="field">
                        <label>${t("admin_page.login.email")}</label>
                        <input type="email" placeholder="admin@example.com"/>
                    </div>

                    <div class="field">
                        <label>${t("admin_page.login.password")}</label>
                        <input type="password" placeholder="••••••••"/>
                    </div>

                    <button class="button w-full">
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