import {customElement, state} from "lit/decorators.js";
import {html, unsafeCSS} from "lit";
import styles from './version-history-page.css?inline';
import globalCss from "../../index.css?inline";
import {Page} from "../page.ts";
import dayjs from "dayjs";
import {ApplicationApi, type ApplicationVersion} from "../../core/application-api.ts";
import {t} from "../../i18n/translation.ts";
import {appStore} from "../../core/app-store.ts";
import {Markdown} from "../../core/markdown.ts";

@customElement("version-history-page")
export class VersionHistoryPage extends Page {
    static styles = [unsafeCSS(globalCss), unsafeCSS(styles)];

    @state()
    versions?: ApplicationVersion[];

    protected async initializePage() {
        this.versions = await ApplicationApi.getAllVersions(appStore.appId.get());

        return true;
    }

    private restore(version: ApplicationVersion) {
        window.location.replace(`action://restore?close_dialog=true&release_id=${version.release_id}`);
    }

    private isCurrentVersion(version: ApplicationVersion) {
        return version.version === appStore.appVersion.get();
    }

    renderPage() {
        return html`
            <div class="version-container">
                <div class="version-header">
                    <h1>${t("version_history.title")}</h1>
                </div>

                <div class="timeline">
                    ${this.versions?.map(version => html`
                        <section class="version-card">
                            <div class="card-top">
                                <div>
                                    <h2>${version.version}</h2>
                                    <div class="version-date">
                                        ${dayjs(version.date).format("MMMM D, YYYY")}
                                    </div>
                                </div>

                                <div>
                                    ${this.isCurrentVersion(version) ? html`<span
                                            class="badge installed">${t("version_history.installed")}</span>` : html`
                                        <button class="restore-btn" @click=${() => this.restore(version)}>
                                            Restore
                                        </button>
                                    `}
                                </div>
                            </div>

                            <div class="card-body">
                                <details>
                                    <summary>${t("release_notes.title")}</summary>
                                    <div class="group">
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