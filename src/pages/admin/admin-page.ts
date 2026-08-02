import {customElement, state} from "lit/decorators.js";
import {html, nothing, unsafeCSS} from "lit";
import styles from './admin-page.css?inline';
import theme from './admin-theme.css?inline';
import global from "../../index.css?inline";
import {Page} from "../page.ts";
import {t} from "../../i18n/translation.ts";

@customElement("admin-page")
export class AdminPage extends Page {
    @state() private activeTab: "users" | "news" = "users";

    static styles = [unsafeCSS(global), unsafeCSS(theme), unsafeCSS(styles)];

    constructor() {
        super("admin");
    }

    protected async initializePage(): Promise<boolean> {
        return true;
    }

    protected renderPage() {
        return html`
            <div class="container">
                <div class="panel">
                    <div class="topbar">
                        <div class="logo">🛡️</div>
                        <h2>${t("admin_page.title")}</h2>
                        <div class="spacer"></div>
                        <div class="admin">
                            <div class="avatar">${String(this.authService.currentSession.get()?.user.user_metadata["display_name"]).at(0)}</div>
                            <span>${this.authService.currentSession.get()?.user.user_metadata["display_name"]}</span></div>
                    </div>
                    <div class="tabs">
                        <button class="tab ${this.activeTab === "users" ? "active" : ""}"
                                @click=${() => (this.activeTab = "users")}> ${t("admin_page.tabs.users.title")}
                        </button>
                        <button class="tab ${this.activeTab === "news" ? "active" : ""}"
                                @click=${() => (this.activeTab = "news")}> ${t("admin_page.tabs.news.title")}
                        </button>
                    </div>

                    ${this.activeTab === "users" ? html`
                        <users-tab></users-tab>` : nothing}

                    ${this.activeTab === "news" ? html`
                        <news-tab></news-tab>` : nothing}
                </div>
            </div> `;
    }
}