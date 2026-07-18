import {html, LitElement} from "lit";
import {customElement} from "lit/decorators.js";
import {Router} from "@lit-labs/router";
import {SignalWatcher} from "@lit-labs/signals";
import {SupportService, supportServiceContext} from "../services/support-service.ts";
import {provide} from "@lit/context";
import {AuthService, authServiceContext} from "../services/auth-service.ts";
import {ThemeService, themeServiceContext} from "../services/theme-service.ts";
import {NewsService, newsServiceContext} from "../services/news-service.ts";

@customElement('app-root')
export class AppRoot extends SignalWatcher(LitElement) {
    private router = new Router(this, [
        {
            path: "/",
            render: () => html`<h1>Home Page</h1>`
        },
        {
            path: "/news",
            render: () => html`
                <news-page></news-page>`
        },
        {
            path: "/support",
            render: () => html`
                <support-page></support-page>`
        }
    ]);

    @provide({context: authServiceContext})
    authService = new AuthService();

    @provide({context: newsServiceContext})
    newsService = new NewsService();

    @provide({context: supportServiceContext})
    supportService = new SupportService();

    @provide({context: themeServiceContext})
    themeService = new ThemeService();

    firstUpdated() {
        document.getElementById("loading")?.remove();
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        this.newsService.unsubscribe().then(r => console.log(r));
        this.supportService.unsubscribe().then(r => console.log(r));
    }

    render() {
        return html`
            <page class="
            ${this.authService.isLoggedIn ? "logged-in" : "logged-out"}
            ${this.themeService.darkMode.get() ? "dark-mode" : "light-mode"}
" data-theme="${this.themeService.darkMode.get() ? "dark" : "light"}">
                ${this.router.outlet()}
            </page>
        `;
    }
}