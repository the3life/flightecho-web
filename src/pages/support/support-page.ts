import {customElement, property, query} from "lit/decorators.js";
import {html, LitElement, unsafeCSS} from "lit";
import styles from './support-page.css?inline';
import globalCss from "../../index.css?inline";
import {SupportService, supportServiceContext} from "../../services/support-service.ts";
import type {SupportMessage} from "../../models/support-message.ts";
import dayjs from "dayjs";
import {consume} from "@lit/context";
import {SignalWatcher} from "@lit-labs/signals";
import {AuthService, authServiceContext} from "../../services/auth-service.ts";

@customElement("support-page")
export class SupportPage extends SignalWatcher(LitElement) {
    @property() messageText = "";

    @consume({context: authServiceContext})
    private authService!: AuthService;

    @consume({context: supportServiceContext})
    private supportService!: SupportService;

    @query(".message-item.bottom")
    private bottom!: HTMLDivElement;

    static styles = [unsafeCSS(globalCss), unsafeCSS(styles)];

    protected updated() {
        this.scrollToBottom();
    }

    private sendMessage() {
        this.supportService.send(this.messageText).then(r => {
            this.messageText = "";
            console.log(r);
        });
    }

    private getMessageClass(message: SupportMessage) {
        if (message.is_system)
            return "system";

        if (this.authService.isItMe(message.profile))
            return "user";

        if (message.profile?.is_admin)
            return "admin";

        return "other";
    }

    private getUserName(message: SupportMessage) {
        if (message.is_system)
            return html``;

        if (this.authService.isItMe(message.profile))
            return html`
                <div class="name">You</div>`;

        if (message.profile?.is_admin)
            return html`
                <div class="name">👑 Admin</div>`;

        return html`
            <div class="name">${message.profile?.display_name}</div>`;
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

    private onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            this.sendMessage();
        }
    };

    render() {
        if (this.supportService.loading.get()) {
            return html`
                <loading-spinner></loading-spinner>`;
        }

        return html`
            <div class="message-container">
                <div class="messages">
                    ${this.supportService.messages.get().map(message => html`
                        <div class="message-item ${this.getMessageClass(message)}">
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
                           @keydown=${this.onKeyDown} placeholder="Type a message...">

                    <button @click=${this.sendMessage}>
                        Send
                    </button>
                </div>
            </div>
        `;
    }
}