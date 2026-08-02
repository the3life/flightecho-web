import {html, LitElement} from "lit";
import {SignalWatcher} from "@lit-labs/signals";
import {state} from "lit/decorators.js";
import {consume} from "@lit/context";
import {AuthService, authServiceContext} from "../services/auth-service.ts";
import {ReadStateService, readStateServiceContext} from "../services/read-state-service.ts";
import {t} from "../i18n/translation.ts";

export abstract class Page extends SignalWatcher(LitElement) {
    @consume({context: authServiceContext})
    authService!: AuthService;

    @consume({context: readStateServiceContext})
    readStateService!: ReadStateService;

    @state()
    private ready: boolean = false;

    @state()
    private error: boolean = false;

    constructor(protected readonly isAuthRequired?: "member" | "admin") {
        super();
    }

    protected async firstUpdated() {
        let ready: boolean;

        try {
            ready = await this.initializePage();
        } catch (e) {
            ready = false;
        }

        this.ready = ready;
        this.error = !ready;
    }

    render() {
        if (this.error)
            return html`
                <app-error title=${t("errors.page.title")} message=${t("errors.page.message")}></app-error>`;

        if (!this.ready)
            return html`
                <loading-spinner></loading-spinner>`;

        if (this.isAuthRequired === "member" && !this.authService.isLoggedIn)
            return html`
                <auth-required></auth-required>`;

        if (this.isAuthRequired === "admin" && (!this.authService.isLoggedIn || this.authService.currentSession.get()?.user.user_metadata["role"] != "admin"))
            return html`
                <admin-login></admin-login>`;

        return this.renderPage();
    }

    protected initializePage(): Promise<boolean> {
        return Promise.resolve(true);
    }

    protected abstract renderPage(): unknown;
}