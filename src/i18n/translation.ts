import en from "./en.json";
import tr from "./tr.json";
import th from "./th.json";
import dayjs from "dayjs";
import {appStore} from "../core/app-store.ts";
import {type Language, Languages} from "../models/language.ts";

export const locales = {
    en,
    tr,
    th
} as const;

export type Locale = keyof typeof locales;
export type Localized<T> = Record<Language, T | undefined | null>;

export function isLocale(value: string): value is Locale {
    return value in locales;
}

/*export function createLocalized<T>(value: T): Localized<T> {
    return Object.fromEntries(
        languages.map(lang => [lang, value])
    ) as Localized<T>;
}*/

export function createLocalized<T>(factory: (lang: Language) => T): Localized<T> {
    return Object.fromEntries(
        Languages.map(lang => [lang, factory(lang)])
    ) as Localized<T>;
}

export async function createLocalizedAsync<T>(factory: (lang: Language) => Promise<T>): Promise<Partial<Localized<T>>> {
    const entries = await Promise.allSettled(
        Languages.map(async (lang): Promise<readonly [Language, T]> => [lang, await factory(lang)] as const)
    );

    return Object.fromEntries(
        entries
            .filter(
                (result): result is PromiseFulfilledResult<readonly [Language, T]> =>
                    result.status === "fulfilled"
            )
            .map(result => result.value)
    ) as Partial<Localized<T>>;
}

export function t(path: string) {
    const locale = locales[appStore.locale.get()];

    return path
        .split(".")
        .reduce<any>((obj, key) => obj?.[key], locale) ?? path;
}

export function getLangSection(content?: string, languageCode?: string) {
    languageCode ??= dayjs.locale();
    languageCode ??= "en";

    const pattern = new RegExp(
        `\\[${languageCode}\\](.*?)\\[\\/${languageCode}\\]`,
        "is"
    );

    const match = pattern.exec(content ?? "");

    return match ? match[1].trim() : "";
}