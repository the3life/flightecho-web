import type {ReactiveControllerHost} from "lit";

type Route = [
    string,
    (context: RouteContext) => unknown
];

type RouteContext = {
    params: Record<string, string | undefined>;
    query: URLSearchParams;
};

type CompiledRoute = [
    URLPattern,
    (context: RouteContext) => unknown
];

export class Router {
    static get baseUrl() {
        return `${location.protocol}//${location.host}`;
    }

    static navigate(path: string, query?: Record<string, string>) {
        const url = new URL(path, this.baseUrl);

        if (query) {
            Object.entries(query).forEach(([k, v]) =>
                url.searchParams.set(k, v)
            );
        }

        const hash = "#" + url.pathname + url.search;

        history.pushState(null, "", hash);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
    }

    static replace(path: string, query?: Record<string, string>) {
        const url = new URL(path, this.baseUrl);

        if (query) {
            Object.entries(query).forEach(([k, v]) =>
                url.searchParams.set(k, v)
            );
        }

        const hash = "#" + url.pathname + url.search;

        history.replaceState(null, "", hash);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
    }

    static back() {
        history.back();
    }

    static forward() {
        history.forward();
    }
}

export class HashRouteController {
    //#baseURL;
    #host;
    #routes: CompiledRoute[];

    private callbacks = new Set<(url: URL) => void>();

    constructor(host: ReactiveControllerHost, routes: Route[]) {
        //this.#baseURL = `${location.protocol}//${location.host}`;
        this.#host = host;
        this.#routes = routes.map(([p, render]) => [
            new URLPattern(p, Router.baseUrl),
            render,
        ]);

        this.#host.addController(this);
    }

    onNavigate(callback: (url: URL) => void) {
        this.callbacks.add(callback);

        return () => this.callbacks.delete(callback);
    }

    #onHashChange = () => {
        const url = new URL(
            window.location.hash.substring(1) || "/",
            Router.baseUrl
        );

        for (const callback of this.callbacks) {
            callback(url);
        }

        this.#host.requestUpdate();
    }

    #onClick = (e: MouseEvent) => {
        if (e.defaultPrevented) return;
        if (e.button !== 0) return; // sadece sol tık

        const element = e.composedPath().find(
            x => x instanceof HTMLElement
        ) as HTMLElement | undefined;

        if(!element) return;

        const href = element.closest("[data-href]")?.getAttribute("data-href");

        if (!href) return;

        console.log(href);

        // Ctrl+Click, Shift+Click, orta tuş gibi davranışları bozma
        if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey) return;

        /*if (href.startsWith("action://")) {
            e.preventDefault();

            const url = new URL(href);

            // callback veya event tetikle
            console.log(url);

            return;
        }*/

        if (href.startsWith("#")) {
            e.preventDefault();

            Router.navigate(href.substring(1));

            return;
        }
    }

    hostConnected() {
        window.addEventListener('hashchange', this.#onHashChange);
        document.addEventListener("click", this.#onClick);
    }

    hostDisconnected() {
        window.removeEventListener('hashchange', this.#onHashChange);
        document.removeEventListener("click", this.#onClick);
    }

    render() {
        const path = window.location.hash.substring(1) || '/';
        const url = new URL(path, Router.baseUrl);

        for (const [pattern, render] of this.#routes) {
            const result = pattern.exec(url);

            if (result) return render({
                params: result.pathname.groups,
                query: url.searchParams
            });
        }

        return null;
    }
}