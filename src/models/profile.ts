export interface Profile {
    id: number;
    auth_id: string;
    email: string;
    display_name?: string;
    app_id: string;
    app_version?: string;
    region?: string;
    machine_name?: string;
    machine_user_name?: string;
    last_ping: Date;
    is_admin: boolean;
    created_at: Date;
}

/*export const isItMe = (profile?: Profile): boolean => {
    if (!profile)
        return false;

    return auth.currentUser.get()?.id === profile.auth_id;
};*/