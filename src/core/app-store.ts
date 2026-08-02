import {signal} from "@lit-labs/signals";
import type {Locale} from "../i18n/translation.ts";

export type App = typeof apps[number];

export const apps = [
    "unknown",
    "web",
    "desktop"
] as const;

export function isApp(value: string): value is App {
    return apps.includes(value as App);
}

export function isDesktop() {
    return appStore.app.get() === "desktop";
}

export const appStore = {
    app: signal<App>("unknown"),
    appId: signal<string>(""),
    appVersion: signal<string>(""),
    locale: signal<Locale>("en"),
    darkMode: signal<boolean>(false),
}