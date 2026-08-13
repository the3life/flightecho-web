import {html, unsafeCSS} from "lit";
import {customElement, state} from "lit/decorators.js";
import {consume} from "@lit/context";
import {type NewsService, newsServiceContext} from "../../../services/news-service.ts";
import dayjs from "dayjs";
import {Markdown} from "../../../core/markdown.ts";
import {t} from "../../../i18n/translation.ts";
import type {News} from "../../../models/news.ts";
import {appStore} from "../../../core/app-store.ts";
import {Page} from "../../page.ts";
import {globalStyles} from "../../../core/css.ts";
import shared from "./shared.css?inline";
import styles from "./news-tab.css?inline";

@customElement("news-tab")
export class NewsTab extends Page {
    static styles = [globalStyles, unsafeCSS(shared), unsafeCSS(styles)];

    @state() private showModal = false;
    @state() private selectedItem?: News;

    @consume({context: newsServiceContext})
    private newsService!: NewsService;

    protected async initializePage() {
        await this.newsService.initialize();
        this.newsService.subscribe();

        return true;
    }

    private insert() {
        this.selectedItem = undefined;
        this.showModal = true;
    }

    private edit(id: number) {
        this.selectedItem = this.newsService.items.get().find(news => news.id === id);
        this.showModal = true;
    }

    renderPage() {
        return html`
            <div class="toolbar">
                <button class="btn primary" @click=${() => this.insert()}> + ${t("admin_page.tabs.news.toolbar.add")}
                </button>
            </div>
            <div class="section">
                <div class="section-header">
                    <h3>${t("admin_page.tabs.news.title")}</h3>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>${t("admin_page.tabs.news.table.title")}</th>
                        <th>${t("admin_page.tabs.news.table.date")}</th>
                        <th>${t("admin_page.tabs.news.table.status")}</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    ${this.newsService.items.get().map(news => html`
                                <tr>
                                    <td>
                                        ${Markdown.render(news.translations?.title[appStore.locale.get()])}
                                    </td>
                                    <td>${dayjs(news.created_at).format("DD.MM.YYYY HH:mm")}</td>
                                    <td>
                                        <span class="status ${news.status == "published" ? "online" : "offline"}">${t(`news.status.${news.status}`)}</span>
                                    </td>
                                    <td>
                                        <button class="btn-icon" @click=${() => this.edit(news.id)}>✏️</button>
                                    </td>
                                </tr>
                            `
                    )}
                    </tbody>
                </table>
            </div>
            <news-modal ?open=${this.showModal} @close=${() => (this.showModal = false)} .item="${this.selectedItem}">
            </news-modal>
        `;
    }
}