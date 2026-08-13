import {customElement, state} from "lit/decorators.js";
import {html, unsafeCSS} from "lit";
import {Page} from "../page.ts";
import {t} from "../../i18n/translation.ts";
import dayjs from "dayjs";
import {ApplicationApi, type ApplicationVersion} from "../../core/application-api.ts";
import {appStore} from "../../core/app-store.ts";
import {Markdown} from "../../core/markdown.ts";
import styles from './release-notes-page.css?inline';
import {globalStyles} from "../../core/css.ts";

@customElement("release-notes-page")
export class ReleaseNotesPage extends Page {
    static styles = [globalStyles, unsafeCSS(styles)];

    @state()
    versions?: ApplicationVersion[];

    protected async initializePage() {
        this.versions = await ApplicationApi.getAllVersions(appStore.edition.get());

        return true;
    }

    renderPage() {
        return html`
            <div class="max-w-250 mx-auto p-8">
                <div class="
                    flex
                    justify-between
                    items-center
                    mb-8">
                    <h1 class="m-0 text-[34px]">${t("release_notes_page.title")}</h1>
                    <div class="
                        flex
                        items-center
                        gap-2.5">
                        ${t("release_notes_page.current_version")}
                        <span class="
                            px-3
                            py-1.5
                            rounded-full
                            bg-[var(--accent)]
                            text-white
                            font-bold">${appStore.version.get()}</span>
                    </div>
                </div>

                <div class="flex flex-col gap-[22px]">
                    ${this.versions?.map((version, index) => html`
                        <section class="card">
                            <div class="card-top">
                                <div>
                                    <h2 class="m-0 text-2xl">${version.version}</h2>
                                    <div class="date mt-1.5">
                                        ${dayjs(version.date).format("MMMM D, YYYY")}
                                    </div>
                                </div>

                                ${index < 1 ? html`<span
                                        class="badge green">${t("release_notes_page.latest_badge")}</span>` : null}
                            </div>

                            <div class="card-body">
                                <div>
                                    ${Markdown.render(version.releaseNotes[appStore.locale.get()])}
                                </div>
                            </div>
                        </section>
                    `)}
                </div>
            </div>
        `;
    }
}