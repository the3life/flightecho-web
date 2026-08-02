import {customElement, property, query} from "lit/decorators.js";
import {html, unsafeCSS} from "lit";
import styles from './support-center-page.css?inline';
import globalCss from "../../index.css?inline";
import {SupportService, supportServiceContext} from "../../services/support-service.ts";
import type {SupportMessage} from "../../models/support-message.ts";
import dayjs from "dayjs";
import {consume} from "@lit/context";
import {t} from "../../i18n/translation.ts";
import {Page} from "../page.ts";
import {isAdmin} from "../../models/user.ts";

@customElement("support-center-page")
export class SupportCenterPage extends Page {
    @property() messageText = "";

    @consume({context: supportServiceContext})
    private supportService!: SupportService;

    @query(".message-item.bottom")
    private bottom!: HTMLDivElement;

    static styles = [unsafeCSS(globalCss), unsafeCSS(styles)];

    constructor() {
        super("member");
    }

    protected async initializePage() {
        await this.supportService.initialize();
        this.supportService.subscribe();

        return true;
    }

    connectedCallback() {
        super.connectedCallback();

        this.readStateService.addObserver(this, "support_center", ".message-item:not(.bottom)");
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        this.readStateService.removeObserver("support_center");
    }

    protected async updated() {
        this.scrollToBottom();
    }

    private async sendMessage() {
        await this.supportService.send(this.messageText);

        this.messageText = "";
    }

    private getMessageClass(message: SupportMessage) {
        if (message.is_system)
            return "system";

        if (this.authService.isItMe(message.user))
            return "user";

        if (isAdmin(message.user))
            return "admin";

        return "other";
    }

    private getUserName(message: SupportMessage) {
        if (message.is_system)
            return html``;

        if (this.authService.isItMe(message.user))
            return html`
                <div class="name">${t("support_center.you")}</div>`;

        if (isAdmin(message.user))
            return html`
                <div class="name">👑 ${message.user?.display_name} (Admin)</div>`;

        return html`
            <div class="name">${message.user?.display_name}</div>`;
    }

    private scrollToBottom() {
        if (!this.bottom)
            return;

        this.bottom.scrollIntoView({
            behavior: "smooth"
        });
    }

    private onInput = (e: InputEvent) => {
        this.messageText = (e.target as HTMLInputElement).value;
    };

    private onKeyDown = async (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            await this.sendMessage();
        }
    };

    renderPage() {
        return html`
            <div class="message-container">
                <div class="messages">
                    ${this.supportService.items.get().map(message => html`
                        <div class="message-item ${this.getMessageClass(message)}" data-id=${message.id}>
                            <div class="bubble">
                                <div class="name">${this.getUserName(message)}</div>
                                ${message.text}
                                <div class="time">${dayjs(message.created_at).fromNow()}</div>
                            </div>
                        </div>
                    `)}
                    <div class="message-item bottom"></div>
                </div>

                <div class="input-area">
                    <input .value=${this.messageText}
                           @input="${this.onInput}"
                           @keydown=${this.onKeyDown} placeholder="${t("support_center.input.placeholder")}">

                    <button @click=${this.sendMessage}>
                        ${t("support_center.send_btn")}
                    </button>
                </div>
            </div>
        `;
    }
}