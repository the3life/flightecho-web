import {html, nothing, unsafeCSS} from "lit";
import {consume} from "@lit/context";
import {type NewsService, newsServiceContext} from "../../services/news-service.ts";
import styles from './news-page.css?inline';
import globalCss from "../../index.css?inline";
import dayjs from "dayjs";
import {customElement} from "lit/decorators.js";
import {t} from "../../i18n/translation.ts";
import {Page} from "../page.ts";
import {Markdown} from "../../core/markdown.ts";
import {appStore} from "../../core/app-store.ts";

@customElement("news-page")
export class NewsPage extends Page {
    @consume({context: newsServiceContext})
    private newsService!: NewsService;

    static styles = [unsafeCSS(globalCss), unsafeCSS(styles)];

    constructor() {
        super("member");
    }

    protected async initializePage() {
        await this.newsService.initialize();
        this.newsService.subscribe();

        return true;
    }

    connectedCallback() {
        super.connectedCallback();

        this.readStateService.addObserver(this, "fe_v4_news", ".news-item");
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        this.readStateService.removeObserver("fe_v4_news");
    }

    renderPage() {
        return html`
            <div class="news-container">
                <div class="news">
                    ${this.newsService.items.get().map((news) => html`
                        <article class="news-item ${this.readStateService.has(news.id) ? "read" : ""}"
                                 data-id=${news.id}>
                            <div class="news-title">
                                ${Markdown.render(news.translations?.title[appStore.locale.get()])}

                                ${this.readStateService.has(news.id) ? nothing : html`<span
                                        class="news-badge">${t("news.badge")}</span>`}
                            </div>

                            <div class="news-date">
                                ${dayjs(news.created_at).fromNow()}
                            </div>

                            <div class="news-text">
                                ${Markdown.render(news.translations?.text[appStore.locale.get()])}
                            </div>
                        </article>
                    `)}
                </div>
            </div>
        `;
    }
}