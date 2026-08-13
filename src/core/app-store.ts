import {signal} from "@lit-labs/signals";
import type {Locale} from "../i18n/translation.ts";

export type App = typeof apps[number];
export type Edition = typeof editions[number];

export const apps = [
    "Unknown",
    "Web",
    "Desktop"
] as const;

export const editions = [
    "Unknown",
    "Standard",
    "Professional",
    "ExclusiveAccess"
] as const;

export function isApp(value: string): value is App {
    return apps.includes(value as App);
}

export function isEdition(value: string): value is Edition {
    return editions.includes(value as Edition);
}

export function isDesktop() {
    return appStore.app.get() === "Desktop";
}

export const appStore = {
    app: signal<App>("Unknown"),
    edition: signal<Edition>("Unknown"),
    development: signal<boolean>(false),
    version: signal<string>(""),
    locale: signal<Locale>("en"),
    darkMode: signal<boolean>(false),
}