import {customElement, state} from "lit/decorators.js";
import {html, unsafeCSS} from "lit";
import styles from './release-notes-page.css?inline';
import globalCss from "../../index.css?inline";
import {Page} from "../page.ts";
import {t} from "../../i18n/translation.ts";
import dayjs from "dayjs";
import {ApplicationApi, type ApplicationVersion} from "../../core/application-api.ts";
import {appStore} from "../../core/app-store.ts";
import {Markdown} from "../../core/markdown.ts";

@customElement("release-notes-page")
export class ReleaseNotesPage extends Page {
    static styles = [unsafeCSS(globalCss), unsafeCSS(styles)];

    @state()
    versions?: ApplicationVersion[];

    protected async initializePage() {
        this.versions = await ApplicationApi.getAllVersions(appStore.appId.get());

        return true;
    }

    renderPage() {
        return html`
            <div class="release-container">
                <div class="release-header">
                    <h1>${t("release_notes.title")}</h1>
                    <div class="release-version">
                        ${t("release_notes.current_version")}
                        <span>${appStore.appVersion.get()}</span>
                    </div>
                </div>

                <div class="timeline">
                    ${this.versions?.map((version, index) => html`
                        <section class="release-card">
                            <div class="release-top">
                                <div>
                                    <h2>${t("release_notes.version")} ${version.version}</h2>
                                    <div class="release-date">
                                        ${dayjs(version.date).format("MMMM D, YYYY")}
                                    </div>
                                </div>

                                ${index < 1 ? html`<span
                                        class="badge latest">${t("release_notes.latest_badge")}</span>` : null}
                            </div>

                            <div class="group">
                                ${Markdown.render(version.releaseNotes[appStore.locale.get()])}
                            </div>
                        </section>
                    `)}
                </div>
            </div>
        `;
    }
}