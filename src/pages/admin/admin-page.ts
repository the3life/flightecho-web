import {customElement, state} from "lit/decorators.js";
import {html, nothing, unsafeCSS} from "lit";
import {Page} from "../page.ts";
import {t} from "../../i18n/translation.ts";
import {cache} from "lit/directives/cache.js";
import {globalStyles} from "../../core/css.ts";
import styles from "./admin-page.css?inline";

@customElement("admin-page")
export class AdminPage extends Page {
    static styles = [globalStyles, unsafeCSS(styles)];

    @state() private activeTab: "users" | "news" | "support_center" = "users";

    constructor() {
        super("admin");
    }

    protected async initializePage() {
        return true;
    }

    private renderActiveTab() {
        switch (this.activeTab) {
            case "users":
                return html`
                    <users-tab></users-tab>`;

            case "news":
                return html`
                    <news-tab></news-tab>`;

            case "support_center":
                return html`
                    <support-center-tab></support-center-tab>`;

            default:
                return nothing;
        }
    }

    protected renderPage() {
        return html`
            <div class="max-w-350 mx-auto p-6">
                <div class="panel bg-panel border border-border rounded-3xl p-6">
                    <div class="topbar flex items-center gap-4 mb-6">
                        <div class="w-10 h-10 rounded-xl bg-[#2563eb] grid place-items-center font-bold">🛡️</div>
                        <h2>${t("admin_page.title")}</h2>
                        <div class="spacer flex-1"></div>
                        <div class="admin">
                            <div class="avatar">
                                ${String(this.authService.currentSession.get()?.user.user_metadata["display_name"]).at(0)}
                            </div>
                            <span>${this.authService.currentSession.get()?.user.user_metadata["display_name"]}</span>
                        </div>
                    </div>
                    <div class="tabs">
                        <button class="tab ${this.activeTab === "users" ? "active" : ""}"
                                @click=${() => (this.activeTab = "users")}> ${t("admin_page.tabs.users.title")}
                        </button>
                        <button class="tab ${this.activeTab === "news" ? "active" : ""}"
                                @click=${() => (this.activeTab = "news")}> ${t("admin_page.tabs.news.title")}
                        </button>
                        <button class="tab ${this.activeTab === "support_center" ? "active" : ""}"
                                @click=${() => (this.activeTab = "support_center")}>
                            ${t("admin_page.tabs.support_center.title")}
                        </button>
                    </div>

                    ${cache(this.renderActiveTab())}
                </div>
            </div> `;
    }
}