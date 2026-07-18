import {signal} from "@lit-labs/signals";
import {createContext} from "@lit/context";
import {Query} from "../helpers/query.ts";

export class ThemeService {
    public darkMode = signal<boolean>(false);

    constructor() {
        if (Query.has("darkMode")) {
            const darkMode = Query.get("darkMode") === "true";

            this.darkMode.set(darkMode);

            document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
        }
    }
}

export const themeServiceContext = createContext<ThemeService>('theme-service');