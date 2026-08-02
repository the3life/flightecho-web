import {html, LitElement} from "lit";
import {customElement, state} from "lit/decorators.js";
import {SignalWatcher} from "@lit-labs/signals";
import {provide} from "@lit/context";
import {AuthService, authServiceContext} from "../services/auth-service.ts";
import {Query} from "../core/query.ts";
import dayjs from "dayjs";
import {HashRouteController} from "../core/router.ts";
import {ReadStateService, readStateServiceContext} from "../services/read-state-service.ts";
import {SupportService, supportServiceContext} from "../services/support-service.ts";
import {NewsService, newsServiceContext} from "../services/news-service.ts";
import {type App, appStore, isApp} from "../core/app-store.ts";
import {isLocale, type Locale, t} from "../i18n/translation.ts";
import {UserService, userServiceContext} from "../services/user-service.ts";

@customElement('app-root')
export class AppRoot extends SignalWatcher(LitElement) {
    #routeController = new HashRouteController(this, [
        ['/', () => html`<h1>Home Page</h1>`],
        ['/admin', () => html`
            <admin-page></admin-page>`],
        ['/news', () => html`
            <news-page></news-page>`],
        ['/support_center', () => html`
            <support-center-page></support-center-page>`],
        ['/redeem_code', () => html`
            <redeem-code-page></redeem-code-page>`],
        ['/release_notes', () => html`
            <release-notes-page></release-notes-page>`],
        ['/version_history', () => html`
            <version-history-page></version-history-page>`]
    ]);

    @provide({context: authServiceContext})
    authService = new AuthService();

    @provide({context: userServiceContext})
    userService = new UserService();

    @provide({context: supportServiceContext})
    supportService = new SupportService();

    @provide({context: newsServiceContext})
    newsService = new NewsService();

    @provide({context: readStateServiceContext})
    readStateService = new ReadStateService(this.authService);

    @state()
    private ready = false;

    @state()
    private error = false;

    constructor() {
        super();

        this.#routeController.onNavigate(() => this.onNavigate());
    }

    private onNavigate() {
        const app = Query.get("app") as App;
        const appId = Query.get("app_id");
        const appVersion = Query.get("app_version");
        const locale = Query.get("locale") as Locale;
        const darkMode = Query.getBoolean("dark_mode");

        if (app)
            appStore.app.set(app);

        if (appId)
            appStore.appId.set(appId);

        if (appVersion)
            appStore.appVersion.set(appVersion);

        if (locale) {
            appStore.locale.set(locale);
            dayjs.locale(locale);
        }

        appStore.darkMode.set(darkMode);
        document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");

        this.error = !isApp(app) || app == "unknown" || !appId || !appVersion || !isLocale(locale);
    }

    requestUpdate() {
        super.requestUpdate();
    }

    firstUpdated() {
        this.onNavigate();
    }

    updated() {
    }

    async connectedCallback() {
        super.connectedCallback();

        await this.authService.initialize();
        await this.readStateService.initialize();
        this.ready = true;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    render() {
        if (!this.ready)
            return html`
                <loading-spinner></loading-spinner>`;

        if (this.error)
            return html`
                <app-error title=${t("errors.app.title")} message=${t("errors.app.message")}></app-error>`;

        return html`
            <page class="
            ${this.authService.isLoggedIn ? "logged-in" : "logged-out"}
            ${appStore.darkMode.get() ? "dark-mode" : "light-mode"}
" data-theme="${appStore.darkMode.get() ? "dark" : "light"}">
                ${this.#routeController.render()}
            </page>
        `;
    }
}