import {customElement, state} from "lit/decorators.js";
import {Page} from "../page.ts";
import {html, unsafeCSS} from "lit";
import styles from './admin-page.css?inline';
import globalCss from "../../index.css?inline";

@customElement("admin2-page")
export class AdminPage2 extends Page {
    @state() private activeTab: "members" | "news" = "members";

    static styles = [unsafeCSS(globalCss), unsafeCSS(styles)];

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    renderPage() {
        return html`
            <div class="container">
                <div class="panel">
                    <div class="topbar">
                        <div class="logo">🛡️</div>
                        <h2>Admin Panel</h2>
                        <div class="spacer"></div>
                        <div class="admin">
                            <div class="avatar">A</div>
                            <span>Admin</span></div>
                    </div>
                    <div class="tabs">
                        <button class="tab ${this.activeTab === "members" ? "active" : ""}"
                                @click=${() => (this.activeTab = "members")}> Üyeler
                        </button>
                        <button class="tab ${this.activeTab === "news" ? "active" : ""}"
                                @click=${() => (this.activeTab = "news")}> Haberler
                        </button>
                    </div>
                    ${this.activeTab === "members"
                            ? html`
                                <members-tab></members-tab>`
                            : html`
                                <news-tab></news-tab>`}
                </div>
            </div> `;
    }
}