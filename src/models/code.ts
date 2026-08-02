import type {SupabaseModel} from "./supabase-model.ts";

export interface Code extends SupabaseModel<number> {
    code: string;
    action: string;
    value: string;
    is_active: boolean;
    user_count?: number;
    max_use?: number;
    expires_at?: Date;
    created_at: Date;
}