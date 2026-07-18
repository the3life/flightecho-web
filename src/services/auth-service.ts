import {supabase} from "./supabase.ts";
import type {Session} from "@supabase/supabase-js";
import {signal} from "@lit-labs/signals";
import {createContext} from "@lit/context";
import type {Profile} from "../models/profile.ts";
import {Query} from "../helpers/query.ts";

export class AuthService {
    public currentSession = signal<Session | null>(null);

    constructor() {
        supabase.auth.onAuthStateChange((event, session) => {
            this.currentSession.set(session);

            switch (event) {
                case "SIGNED_OUT":
                    this.currentSession.set(null);
                    break;
            }
        });

        if (Query.has("accessToken") && Query.has("refreshToken")) {
            const accessToken = Query.get("accessToken");
            const refreshToken = Query.get("refreshToken");

            supabase.auth.setSession({
                access_token: accessToken!,
                refresh_token: refreshToken!
            }).then(r => console.log(r));
        }
    }

    get isLoggedIn() {
        return this.currentSession.get() != null;
    }

    isItMe(profile?: Profile) {
        if (!profile)
            return false;

        return this.currentSession.get()?.user.id === profile.auth_id;
    }

    async login(email: string, password: string) {
        return await supabase.auth.signInWithPassword({
            email,
            password
        });
    }

    async logout() {
        return await supabase.auth.signOut();
    }

    async register(email: string, password: string) {
        return await supabase.auth.signUp({
            email,
            password
        });
    }

    async getSession() {
        const {data} =
            await supabase.auth.getSession();

        return data.session;
    }

    async getUser() {
        const {data} =
            await supabase.auth.getUser();

        return data.user;
    }

    /*async isLoggedIn() {
        return (await this.getSession()) != null;
    }*/
}

export const authServiceContext = createContext<AuthService>('auth-service');