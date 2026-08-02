import {html, LitElement, type PropertyValues, unsafeCSS} from "lit";
import {customElement, property, query, state} from "lit/decorators.js";
import styles from './news-modal.css?inline';
import news from '../../news/news-page.css?inline';
import shared from "./shared.css?inline";
import theme from "../admin-theme.css?inline";
import {type News} from "../../../models/news.ts";
import {type Language, Languages} from "../../../models/language.ts";
import {t} from "../../../i18n/translation.ts";
import {Markdown} from "../../../core/markdown.ts";
import dayjs from "dayjs";
import {supabase} from "../../../services/supabase.ts";
import {type NewsTranslation} from "../../../models/translations.ts";
import {NewsSituations, type NewsStatus} from "../../../models/database.ts";

@customElement("news-modal")
export class NewsModal extends LitElement {
    static styles = [unsafeCSS(styles), unsafeCSS(news), unsafeCSS(shared), unsafeCSS(theme)];

    static properties = {
        open: {type: Boolean}
    };

    open = false;

    @property()
    item?: News;

    @state()
    private isPreview: boolean = false;

    @state()
    private selectedLanguage: Language = "en";

    @state()
    private selectedStatus?: NewsStatus = "draft";

    @state()
    private type: "edit" | "insert" = "edit";

    @query("#title_input")
    private titleInput!: HTMLInputElement;

    @query("#text_input")
    private textInput!: HTMLTextAreaElement;

    @state()
    private translations?: NewsTranslation;

    @state()
    private statusText: string = "";

    private statusTimer?: number;

    @state()
    private isRunning: boolean = false;

    protected onOpen() {
        this.selectedStatus = this.item?.status ?? "draft";
        this.translations = this.item?.translations;

        this.type = this.item ? "edit" : "insert";

        if (!this.item) {
            this.item = {
                translations: {
                    title: {},
                    text: {}
                }
            } as News;
        }

        console.log(this.type);
    }

    protected updated(changed: PropertyValues<this>) {
        if (changed.has("open") && this.open)
            this.onOpen();
    }

    private preview() {
        this.isPreview = !this.isPreview;
    }

    private close() {
        this.open = false;
        this.dispatchEvent(new CustomEvent("close"));
    }

    private async save() {
        if (this.type === "edit")
            await this.edit();

        if (this.type === "insert")
            await this.insert();
    }

    private async insert() {
        const translations = this.translations;

        if (!translations)
            return;

        this.isRunning = true;

        const translation = await supabase
            .schema("fe_v4")
            .rpc("create_translation_record",
                {
                    p_entity_name: "news",
                    p_translations: translations
                });

        if (translation.success) {
            const news = await supabase
                .schema("fe_v4")
                .from("news")
                .insert({
                    translation_record_id: translation.data,
                    status: this.selectedStatus
                });

            if (news.success) {
                this.status(t("admin_page.tabs.news.modal.messages.insert.success"));
                this.isRunning = false;

                return;
            }
        }

        this.status(t("admin_page.tabs.news.modal.messages.insert.error"));
        this.isRunning = false;
    }

    private async edit() {
        const id = this.item?.id;
        const recordId = this.item?.translation_record_id;
        const translations = this.translations;

        if (!id || !recordId || !translations)
            return;

        this.isRunning = true;

        const translation = await supabase
            .schema("fe_v4")
            .rpc("update_translation_record",
                {
                    p_translation_record_id: recordId,
                    p_translations: translations
                });

        if (translation.success) {
            const news = await supabase
                .schema("fe_v4")
                .from("news")
                .update({
                    status: this.selectedStatus
                })
                .eq("id", id);

            if (news.success) {
                this.status(t("admin_page.tabs.news.modal.messages.update.success"));
                this.isRunning = false;

                return;
            }
        }

        this.status(t("admin_page.tabs.news.modal.messages.update.error"));
        this.isRunning = false;
    }

    private updateTranslation() {
        const title = this.titleInput.value;
        const text = this.textInput.value;

        this.translations = {
            ...this.translations,
            title: {
                ...this.translations?.title,
                [this.selectedLanguage]: title
            },
            text: {
                ...this.translations?.text,
                [this.selectedLanguage]: text
            }
        } as NewsTranslation;
    }

    private status(text: string) {
        this.statusText = text;

        if (this.statusTimer)
            clearTimeout(this.statusTimer);

        this.statusTimer = window.setTimeout(() => {
            this.statusText = "";
        }, 3000);
    }

    render() {
        if (!this.open) return null;
        return html`
            <div class="modal-backdrop" @click=${this.close}>
                <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
                    <div class="modal-header"><h3>${t("admin_page.tabs.news.modal.title")}</h3>
                        <button class="close" @click=${this.close}>×</button>
                    </div>
                    <div class="field">
                        <label>${t("admin_page.tabs.news.modal.language")}</label>
                        <select-box
                                @change=${(e: CustomEvent) => {
                                    this.selectedLanguage = e.detail;
                                }} .selected=${this.selectedLanguage}>
                            ${Languages.map(language => html`
                                <select-option title=${t(`languages.${language}`)} .data=${language}></select-option>
                            `)}
                        </select-box>
                    </div>
                    <div class="field">
                        <label>${t("admin_page.tabs.news.modal.status")}</label>
                        <select-box
                                @change=${(e: CustomEvent) => {
                                    this.selectedStatus = e.detail;
                                }} .selected=${this.selectedStatus}>
                            ${NewsSituations.map(status => html`
                                <select-option title=${t(`news.status.${status}`)} .data=${status}></select-option>
                            `)}
                        </select-box>
                    </div>
                    ${this.isPreview ? html`
                        <div>
                            <div>
                                <div class="news">
                                    <article class="news-item" data-id=${this.item?.id}>
                                        <div class="news-title">
                                            ${Markdown.render(this.translations?.title[this.selectedLanguage])}

                                            <span class="news-badge">${t("news.badge")}</span>
                                        </div>

                                        <div class="news-date">
                                            ${dayjs(this.item?.created_at).fromNow()}
                                        </div>

                                        <div class="news-text">
                                            ${Markdown.render(this.translations?.text[this.selectedLanguage])}
                                        </div>
                                    </article>
                                </div>
                            </div>
                        </div>
                    ` : html`
                        <div class="field">
                            <label>${t("admin_page.tabs.news.modal.inputs.title.label")}</label>
                            <input id="title_input"
                                   placeholder=${t("admin_page.tabs.news.modal.inputs.title.placeholder")}
                                   .value=${this.translations?.title[this.selectedLanguage] ?? ""}
                                   @input=${this.updateTranslation}/>
                        </div>
                        <div class="field">
                            <label>${t("admin_page.tabs.news.modal.inputs.text.label")}</label>
                            <textarea id="text_input"
                                      placeholder=${t("admin_page.tabs.news.modal.inputs.text.placeholder")}
                                      .value=${this.translations?.text[this.selectedLanguage] ?? ""}
                                      @input=${this.updateTranslation}></textarea>
                        </div>
                        <!--<div class="field"><label>Kapak Görseli</label>
                            <div class="upload"> Görsel yüklemek için tıklayın veya sürükleyin <br/> PNG / JPG / GIF (Maks.
                                5MB)
                            </div>
                        </div>-->
                    `}
                    <div class="modal-actions">
                        ${this.isRunning ? html`
                            <span class="status-message">${t("admin_page.tabs.news.modal.messages.running")}</span>
                        ` : html`
                            <span class="status-message">${this.statusText}</span>
                        `}

                        <button class="btn primary" @click=${this.preview}>
                            ${t("admin_page.tabs.news.modal.actions.preview")}
                        </button>
                        <button class="btn secondary" @click=${this.close}>
                            ${t("admin_page.tabs.news.modal.actions.cancel")}
                        </button>
                        <button class="btn primary" ?disabled=${this.isRunning} @click=${this.save}>
                            ${t("admin_page.tabs.news.modal.actions.save")}
                        </button>
                    </div>
                </div>
            </div> `;
    }
}