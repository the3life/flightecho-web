import type {SupabaseModel} from "./supabase-model.ts";
import type {UserRole} from "./database.ts";

export interface User extends SupabaseModel<string> {
    email: string;
    display_name?: string;
    role: UserRole;
    app_id: string;
    app_version?: string;
    region?: string;
    machine_name?: string;
    machine_user_name?: string;
    last_ping: string;
    created_at: string;
}

export const isAdmin = (profile?: User | null | undefined): boolean => {
    /*if (!profile.roles)
        return false;*/

    return profile?.role == 'admin';

    //return profile.roles.some((role) => role?.role == "admin") || false;
};

/*export const isItMe = (profile?: User): boolean => {
    if (!profile)
        return false;

    return auth.currentUser.get()?.id === profile.auth_id;
};*/