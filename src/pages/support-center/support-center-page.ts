import {customElement, property, query} from "lit/decorators.js";
import {html, unsafeCSS} from "lit";
import {SupportService, supportServiceContext} from "../../services/support-service.ts";
import type {SupportMessage} from "../../models/support-message.ts";
import dayjs from "dayjs";
import {consume} from "@lit/context";
import {t} from "../../i18n/translation.ts";
import {Page} from "../page.ts";
import {isAdmin} from "../../models/user.ts";
import styles from './support-center-page.css?inline';
import {globalStyles} from "../../core/css.ts";
import {Markdown} from "../../core/markdown.ts";

@customElement("support-center-page")
export class SupportCenterPage extends Page {
    static styles = [globalStyles, unsafeCSS(styles)];

    @property() messageText = "";

    @consume({context: supportServiceContext})
    private supportService!: SupportService;

    @query(".message-item.bottom")
    private bottom!: HTMLDivElement;

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

        this.readStateService.addObserver(this, "support_center", "support_center", ".message-item:not(.bottom)");
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        this.readStateService.removeObserver("support_center");
    }

    protected async updated() {
        this.scrollToBottom();
    }

    private async sendMessage() {
        if (!this.messageText)
            return;

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
                <div class="name">${t("support_center_page.you")}</div>`;

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
            <div class="message-container
                w-screen
                h-screen
                bg-[var(--chat-bg)]
                rounded-b-[15px]
                overflow-hidden
                flex
                flex-col">
                <div class="messages
                    flex-1
                    p-[15px]
                    overflow-y-auto
                    bg-[var(--messages-bg)]">
                    ${this.supportService.items.get().map(message => html`
                        <div class="message-item flex my-3 ${this.getMessageClass(message)}" data-id=${message.id}>
                            <div class="bubble
                                min-w-[140px]
                                max-w-[70%]
                                px-[15px]
                                py-3
                                leading-[1.4]
                                break-words
                                relative
                                bg-[var(--user-bg)]
                                text-[var(--user-text)]
                                rounded-bl-[5px]">
                                <div class="name
                                    mb-1
                                    text-xs
                                    font-bold
                                    opacity-75">${this.getUserName(message)}
                                </div>
                                ${Markdown.render(message.text)}
                                <div class="time
                                    mt-1.5
                                    text-right
                                    text-[11px]
                                    opacity-60">${dayjs(message.created_at).fromNow()}
                                </div>
                            </div>
                        </div>
                    `)}
                    <div class="message-item bottom"></div>
                </div>

                <div class="input-area
                    flex
                    gap-2.5
                    p-3
                    bg-[var(--chat-bg)]
                    border-t
                    border-[var(--message-input-border)]">
                    <input .value=${this.messageText}
                           @input="${this.onInput}"
                           @keydown=${this.onKeyDown} placeholder="${t("support_center_page.input.placeholder")}"
                           class="
                           flex-1
                               !bg-[var(--message-input-bg)]
                               !text-[var(--message-input-text)]
                               !rounded-full">
                    <button class="btn primary !rounded-[25px]" @click=${this.sendMessage}>
                        ${t("support_center_page.send_btn")}
                    </button>
                </div>
            </div>
        `;
    }
}