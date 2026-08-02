import type {SupabaseModel} from "./supabase-model.ts";
import type {NewsStatus} from "./database.ts";
import type {NewsTranslation} from "./translations.ts";

export interface News extends SupabaseModel<number> {
    translation_record_id: number;
    translations?: NewsTranslation;
    status: NewsStatus;
    created_at: Date;
}