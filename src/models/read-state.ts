import type {SupabaseModel} from "./supabase-model.ts";

export interface ReadState extends SupabaseModel<number> {
    user_id: string;
    record_id: number;
    table_name?: string;
    created_at: string;
}