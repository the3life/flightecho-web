import dayjs from "dayjs";

export class Language{
    static getSection(content?: string, languageCode?: string)
    {
        languageCode ??= dayjs.locale();
        languageCode ??= "en";

        const pattern = new RegExp(
            `\\[${languageCode}\\](.*?)\\[\\/${languageCode}\\]`,
            "is"
        );

        const match = pattern.exec(content ?? "");

        return match ? match[1].trim() : "";
    }
}