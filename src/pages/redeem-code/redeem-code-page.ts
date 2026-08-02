import {Page} from "../page.ts";
import {customElement, state} from "lit/decorators.js";
import {html, unsafeCSS} from "lit";
import styles from './redeem-code-page.css?inline';
import global from "../../index.css?inline";
import {supabase} from "../../services/supabase.ts";
import type {SupabaseResponse} from "../../models/supabase-response.ts";
import type {Code} from "../../models/code.ts";
import {unsafeHTML} from "lit/directives/unsafe-html.js";
import {type Reward, rewardStore} from "../../core/reward-store.ts";
import {t} from "../../i18n/translation.ts";
import type {Application} from "../../models/application.ts";
import {GithubApi} from "../../core/github-api.ts";
import {delay} from "../../core/delay.ts";

type Step = "input" | "verifying" | "result";

@customElement("redeem-code-page")
export class RedeemCodePage extends Page {
    static styles = [unsafeCSS(styles), unsafeCSS(global)];

    @state() private step: Step = "input";
    @state() private code = "AAAA-BBBB-CCCC-DDDD";
    @state() private resultMessage = "";
    @state() private success = false;
    @state() private verifyStage = "Kod kontrol ediliyor...";
    @state() private reward?: Reward;

    private codeRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i;

    constructor() {
        super("member");
    }

    private async submitCode() {
        if (!this.code.trim()) return;

        this.verifying(t("redeem_code.verifying.checking"));

        await delay(1200);

        if (!this.validateCode(this.code)) {
            await this.result(false, t("redeem_code.verifying.invalid"));

            return;
        }

        this.verifying(t("redeem_code.verifying.server"));
        await delay(1200);

        this.verifying(t("redeem_code.verifying.preparing"));
        await delay(900);

        const {data, error} = await supabase
            .schema("fe_v4")
            .rpc("redeem_code", {p_code: this.code})
            .single<SupabaseResponse<Code>>();

        if (!error) {
            if (data) {
                if (data.success)
                    await this.result(true, data.data);
                else
                    await this.result(false, t("redeem_code.verifying.codes." + data.code));
            } else {
                await this.result(false, t("redeem_code.verifying.codes.FAILED"));
            }
        } else {
            await this.result(false, t("redeem_code.verifying.codes.FAILED"));
        }
    }

    private verifying(verifyStage: string) {
        this.verifyStage = verifyStage;
        this.step = "verifying";
    }

    private async result(success: boolean, data: Code | string | undefined) {
        if (this.isCode(data)) {
            this.success = true;
            this.resultMessage = "";
            this.step = "result";
            this.reward = rewardStore.getReward(data);

            return;
        }

        this.success = success;
        this.resultMessage = data || "";
        this.step = "result";
    }

    private validateCode(code: string): boolean {
        return this.codeRegex.test(code.trim());
    }

    private isCode(value: unknown): value is Code {
        return (
            typeof value === 'object' &&
            value !== null &&
            'code' in value
        );
    }

    private reset() {
        this.code = "";
        this.step = "input";
        this.resultMessage = "";
        this.success = false;
    }

    private async downloadApp(appId: string) {
        let {data, error} = await supabase
            .schema("fe_v4")
            .from("apps")
            .select("*")
            .eq("app_id", appId)
            .single<Application>();

        if (!error && data) {
            let name = `${appId}-win-Setup.exe`;
            let release = await GithubApi
                .api(data.github_repository_owner, data.github_repository_name, data.github_token)
                .getLatestRelease();

            if (!release)
                return;

            let asset = release.assets.findLast(value => value.name == name);

            if (!asset)
                return;

            let downloadUrl = asset.browser_download_url;

            window.location.replace(`action://download?close_dialog=true&url=${downloadUrl}`);
        } else {
            window.location.replace(`error://?title=${t("grant_app.errors.download.title")}&content=${t("grant_app.errors.download.message")}`);
        }
    }

    renderPage() {
        return html`
            <div class="container">
                <div class="card">
                    <div class="logo">🔐</div>

                    ${this.step === "input" ? html`
                        <h1>${t("redeem_code.input.title")}</h1>
                        <p class="subtitle">
                            ${t("redeem_code.input.subtitle")}
                        </p>

                        <div class="field">
                            <label>${t("redeem_code.input.input.label")}</label>

                            <input
                                    .value=${this.code}
                                    placeholder=${t("redeem_code.input.input.placeholder")}
                                    maxlength="24"
                                    @input=${(e: Event) => {
                                        this.code = (e.target as HTMLInputElement).value;
                                    }}
                                    @keydown=${(e: KeyboardEvent) => {
                                        if (e.key === "Enter") {
                                            this.submitCode();
                                        }
                                    }}
                            />
                        </div>

                        <div class="actions">
                            <button @click=${this.submitCode}>${t("redeem_code.input.redeem_btn")}</button>
                        </div>
                    ` : null}

                    ${this.step === "verifying" ? html`
                        <div class="verify">
                            <div class="spinner"></div>

                            <h1>${t("redeem_code.verifying.title")}</h1>

                            <div class="stage">${this.verifyStage}</div>

                            <div class="progress">
                                <div></div>
                            </div>

                            <p class="subtitle">
                                ${t("redeem_code.verifying.subtitle")}
                            </p>
                        </div>
                    ` : null}

                    ${this.step === "result" ? html`
                        ${this.success ? html`
                            <div class="result">
                                <div class="result-icon success">
                                    🎁
                                </div>

                                <h2>${t("redeem_code.result.title")}</h2>

                                <p>
                                    ${t("redeem_code.result.subtitle")}
                                </p>

                                <div class="reward-card">
                                    <div class="reward-header">
                                        <div class="reward-title">
                                            ${this.reward?.title}
                                        </div>

                                        <span class="reward-badge">
                        ${this.reward?.badge}
                    </span>
                                    </div>

                                    <div class="reward-description">
                                        ${this.reward?.descriptions.map(description => html`
                                            ${description}
                                        `)}
                                    </div>

                                    <ul class="reward-features">
                                        ${this.reward?.features.map(feature => html`
                                            <li>${feature}</li>
                                        `)}
                                    </ul>

                                    ${this.reward?.action === "grant_app" ? html`
                                        <button @click=${() => this.downloadApp(this.reward?.code.value || "")}>
                                            Download Application
                                        </button>
                                    ` : null}
                                </div>
                            </div>
                        ` : html`
                            <div class="result">
                                <div class="result-icon error">
                                    ⛔
                                </div>

                                <h2>
                                    ${t("redeem_code.verifying.failed")}
                                </h2>

                                <p>${this.resultMessage}</p>

                                <div class="actions">
                                    <button class="secondary" @click=${this.reset}>
                                        ${t("redeem_code.verifying.retry_btn")}
                                    </button>
                                </div>
                            </div>
                        `}
                    ` : null}

                        <!--${this.step === "result" ? html`
                        <div class="result">
                            <div class="result-icon ${this.success ? "success" : "error"}">
                                ${this.success ? "✓" : "!"}
                            </div>

                            <h2>
                                ${this.success ? "Onay Başarılı" : "Onay Başarısız"}
                            </h2>

                            <p>${unsafeHTML(this.resultMessage)}</p>

                            <div class="actions">
                                <button class="secondary" @click=${this.reset}>
                                    Yeni Kod Gir
                                </button>
                            </div>
                        </div>
                    ` : null}-->
                </div>
            </div>
        `;
    }
}