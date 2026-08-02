import {html, LitElement, unsafeCSS} from "lit";
import {customElement, state} from "lit/decorators.js";
import styles from './news-tab.css?inline';
import shared from "./shared.css?inline";
import theme from "../admin-theme.css?inline";
import {consume} from "@lit/context";
import {type NewsService, newsServiceContext} from "../../../services/news-service.ts";
import dayjs from "dayjs";
import {SignalWatcher} from "@lit-labs/signals";
import {Markdown} from "../../../core/markdown.ts";
import {t} from "../../../i18n/translation.ts";
import type {News} from "../../../models/news.ts";
import {appStore} from "../../../core/app-store.ts";

@customElement("news-tab")
export class NewsTab extends SignalWatcher(LitElement) {
    static styles = [unsafeCSS(styles), unsafeCSS(shared), unsafeCSS(theme)];

    @state() private showModal = false;
    @state() private selectedItem?: News;

    @consume({context: newsServiceContext})
    private newsService!: NewsService;

    protected async firstUpdated() {
        await this.newsService.initialize();
        this.newsService.subscribe();
    }

    private insert() {
        this.selectedItem = undefined;
        this.showModal = true;
    }

    private edit(id: number) {
        this.selectedItem = this.newsService.items.get().find(news => news.id === id);
        this.showModal = true;
    }

    render() {
        return html`
            <div class="toolbar">
                <h3>${t("admin_page.tabs.news.title")}</h3>
                <button class="btn primary" @click=${() => this.insert()}> + ${t("admin_page.tabs.news.toolbar.add")}</button>
            </div>
            <div class="section">
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
                                        <button class="icon-button" @click=${() => this.edit(news.id)}>✏️</button>
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