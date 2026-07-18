import type {Profile} from "./profile.ts";

export interface SupportMessage {
    id: number;
    profile_id: number;
    profile?: Profile;
    text?: string;
    is_system: boolean;
    created_at: Date;
}