import {html, nothing} from "lit";
import {consume} from "@lit/context";
import {type NewsService, newsServiceContext} from "../../services/news-service.ts";
import dayjs from "dayjs";
import {customElement} from "lit/decorators.js";
import {t} from "../../i18n/translation.ts";
import {Page} from "../page.ts";
import {Markdown} from "../../core/markdown.ts";
import {appStore} from "../../core/app-store.ts";
import {globalStyles} from "../../core/css.ts";

@customElement("news-page")
export class NewsPage extends Page {
    static styles = [globalStyles];

    @consume({context: newsServiceContext})
    private newsService!: NewsService;

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

        this.readStateService.addObserver(this, "news", "news", ".news-item");
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        this.readStateService.removeObserver("news");
    }

    renderPage() {
        return html`
            <div class="mx-auto p-6">
                <div class="flex flex-col gap-[18px]">
                    ${this.newsService.items.get().map((news) => html`
                        <article class="news-item
                            ${this.readStateService.has(news.id) ? "card" : "card-highlight"}"
                                 data-id=${news.id}>
                            <div class="
                                flex
                                items-center
                                gap-2.5
                                mb-1.5
                                text-xl
                                font-bold
                                before:content-['']
                                before:block
                                before:w-[5px]
                                before:h-6
                                before:rounded-full
                                before:bg-(--warning)">
                                ${Markdown.render(news.translations?.title[appStore.locale.get()])}

                                ${this.readStateService.has(news.id) ? nothing : html`<span
                                        class="
                                            px-2.5
                                            py-[3px]
                                            rounded-full
                                            bg-(--badge-bg)
                                            text-(--badge-text)
                                            text-[11px]
                                            font-bold
                                            tracking-[0.3px]">${t("news_page.badge")}</span>`}
                            </div>

                            <div class="date">
                                ${dayjs(news.created_at).fromNow()}
                            </div>

                            <div class="
                                text-(--text-secondary)
                                leading-[1.75]
                                text-[15px]">
                                ${Markdown.render(news.translations?.text[appStore.locale.get()])}
                            </div>
                        </article>
                    `)}
                </div>
            </div>
        `;
    }
}