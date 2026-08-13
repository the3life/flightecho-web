import {html} from "lit";
import {consume} from "@lit/context";
import {AuthService, authServiceContext} from "../services/auth-service.ts";
import {ReadStateService, readStateServiceContext} from "../services/read-state-service.ts";
import {t} from "../i18n/translation.ts";
import {state} from "lit/decorators.js";
import {BaseElement} from "../components/base-element.ts";

export abstract class Page extends BaseElement {
    @consume({context: authServiceContext})
    authService!: AuthService;

    @consume({context: readStateServiceContext})
    readStateService!: ReadStateService;

    @state()
    protected initialized: boolean = false;

    @state()
    protected error: boolean = false;

    constructor(protected readonly isAuthRequired?: "member" | "admin") {
        super();
    }

    protected async firstUpdated() {
        if (this.initialized)
            return;

        try {
            this.initialized = await this.initializePage();
        } catch (e) {
            console.log(e);

            this.initialized = false;
            this.error = true;
        }
    }

    render() {
        if (this.error)
            return html`
                <app-error title=${t("errors.page.title")} message=${t("errors.page.message")}></app-error>`;

        if (!this.initialized)
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

    protected initializePage() {
        return Promise.resolve(true);
    }

    protected abstract renderPage(): unknown;
}