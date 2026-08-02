export type TranslationField = {
    id: number;
    name: string;
};

/*export type Translation = {
    id: number;
    value: string;
};*/

export type TranslationMap<T extends string> = {
    [K in T]: Record<string, string | undefined>;
};

export const TranslationFields = {
    news: [
        {
            id:0,
            name:"title"
        },
        {
            id:0,
            name:"text"
        },
    ],
} as const;

export type NewsTranslation = TranslationMap<typeof TranslationFields.news[number]["name"]>;