import type {User} from "./user.ts";
import type {SupabaseModel} from "./supabase-model.ts";

export interface SupportMessage extends SupabaseModel<number> {
    user_id: string;
    text?: string;
    is_system: boolean;
    created_at: Date;

    user?: User | null;
}