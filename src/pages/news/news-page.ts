import {SignalWatcher} from "@lit-labs/signals";
import {html, LitElement, unsafeCSS} from "lit";
import {consume} from "@lit/context";
import {type NewsService, newsServiceContext} from "../../services/news-service.ts";
import styles from './news-page.css?inline';
import globalCss from "../../index.css?inline";
import dayjs from "dayjs";
import {customElement} from "lit/decorators.js";
import {Language} from "../../helpers/language.ts";
import {Markdown} from "../../helpers/markdown.ts";

@customElement("news-page")
export class NewsPage extends SignalWatcher(LitElement) {
    @consume({context: newsServiceContext})
    private newsService!: NewsService;

    static styles = [unsafeCSS(globalCss), unsafeCSS(styles)];

    render() {
        if (this.newsService.loading.get()) {
            return html`<loading-spinner></loading-spinner>`;
        }

        return html`
            <div class="news-container">
                <div class="news">
                    ${this.newsService.news.get().map((news) => html`
                        <article class="news-item">
                            <div class="news-title">
                                ${Markdown.render(Language.getSection(news.title))}

                                ${dayjs().diff(dayjs(news.created_at), "day") <= 7
                                        ? html`<span class="news-badge">NEW</span>`
                                        : ""}
                            </div>

                            <div class="news-date">
                                ${dayjs(news.created_at).fromNow()}
                            </div>

                            <div class="news-text">
                                ${Markdown.render(Language.getSection(news.text))}
                            </div>
                        </article>
                    `)}
                </div>
            </div>
        `;
    }
}