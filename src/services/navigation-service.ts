import {createContext} from "@lit/context";

export class NavigationService {
    navigate(url: string) {
        window.history.pushState({}, "", url);

        window.dispatchEvent(
            new PopStateEvent("popstate")
        );
    }
}

export const navigationServiceContext = createContext<NavigationService>('navigation-service');