import type {SupabaseModel} from "./supabase-model.ts";

export interface Application extends SupabaseModel<number> {
    app_id: string;
    min_version: string;
    max_version: string;
    latest_version: string;
    force_update: boolean;
    maintenance: boolean;
    web_url: string;
    github_repository_owner: string;
    github_repository_name: string;
    github_token: string;
    created_at: Date;
}