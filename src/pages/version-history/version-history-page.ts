import {customElement, state} from "lit/decorators.js";
import {html, unsafeCSS} from "lit";
import {Page} from "../page.ts";
import dayjs from "dayjs";
import {ApplicationApi, type ApplicationVersion} from "../../core/application-api.ts";
import {t} from "../../i18n/translation.ts";
import {appStore} from "../../core/app-store.ts";
import {Markdown} from "../../core/markdown.ts";
import styles from './version-history-page.css?inline';
import {globalStyles} from "../../core/css.ts";

@customElement("version-history-page")
export class VersionHistoryPage extends Page {
    static styles = [globalStyles, unsafeCSS(styles)];

    @state()
    versions?: ApplicationVersion[];

    protected async initializePage() {
        this.versions = await ApplicationApi.getAllVersions(appStore.edition.get());

        return true;
    }

    private restore(version: ApplicationVersion) {
        window.location.replace(`action://restore?close_dialog=true&release_id=${version.release_id}`);
    }

    private isCurrentVersion(version: ApplicationVersion) {
        return version.version === appStore.version.get();
    }

    renderPage() {
        return html`
            <div class="version-container max-w-[1000px] mx-auto p-8">
                <div class="version-header lex justify-between items-center mb-8">
                    <h1 class="m-0 text-[34px]">${t("version_history_page.title")}</h1>
                </div>

                <div class="timeline flex flex-col gap-[22px]">
                    ${this.versions?.map(version => html`
                        <section class="card">
                            <div class="card-top">
                                <div>
                                    <h2 class="m-0 text-2xl">${version.version}</h2>
                                    <div class="date mt-1.5">
                                        ${dayjs(version.date).format("MMMM D, YYYY")}
                                    </div>
                                </div>

                                <div>
                                    ${this.isCurrentVersion(version) ? html`<span
                                            class="badge green">${t("version_history_page.installed")}</span>` : html`
                                        <button class="btn restore" @click=${() => this.restore(version)}>
                                            Restore
                                        </button>
                                    `}
                                </div>
                            </div>

                            <div class="card-body">
                                <details class="rounded-xl overflow-hidden">
                                    <summary class="
                                        flex
                                        items-center
                                        gap-2.5
                                        cursor-pointer
                                        list-none
                                        py-3.5
                                        font-semibold
                                        select-none">${t("release_notes_page.title")}
                                    </summary>
                                    <div class="group mt-5">
                                        ${Markdown.render(version.releaseNotes[appStore.locale.get()])}
                                    </div>
                                </details>
                            </div>
                        </section>
                    `)}
                </div>
            </div>
        `;
    }
}