/*export const Languages = ["en", "tr", "th"] as const;
export type Language = typeof Languages[number];*/

import {Constants, type Database} from "../database.types.ts";

export type Language = Database["fe_v4"]["Enums"]["languages"];
export const Languages = Constants.fe_v4.Enums.languages;