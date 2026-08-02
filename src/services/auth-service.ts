import {supabase} from "./supabase.ts";
import type {Session, User as SupabaseUser} from "@supabase/supabase-js";
import {signal} from "@lit-labs/signals";
import {createContext} from "@lit/context";
import {Query} from "../core/query.ts";
import {environment} from "../core/environment.ts";
import {isDesktop} from "../core/app-store.ts";
import type {User} from "../models/user.ts";

export class AuthService {
    public currentUser = signal<SupabaseUser | undefined | null>(null);
    public currentSession = signal<Session | undefined | null>(null);

    constructor() {
        supabase.auth.onAuthStateChange((event, session) => {
            this.currentUser.set(session?.user);
            this.currentSession.set(session);

            switch (event) {
                case "SIGNED_OUT":
                    this.currentUser.set(null);
                    this.currentSession.set(null);
                    break;
            }
        });
    }

    get isLoggedIn() {
        return this.currentSession.get() != null;
    }

    get uid() {
        return this.currentUser.get()?.id;
    }

    async initialize() {
        await this.logout();

        if (!isDesktop() && environment.isDev) {
            await this.login("the3life@gmail.com", "123456");
        } else if (Query.has("access_token") && Query.has("refresh_token")) {
            let accessToken = Query.get("access_token");
            let refreshToken = Query.get("refresh_token");

            await this.setSession({
                access_token: accessToken!,
                refresh_token: refreshToken!
            });
        }
    }

    isItMe(user?: User | null) {
        if (!user)
            return false;

        return this.currentUser.get()?.id === user.id;
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
        let {data} =
            await supabase.auth.getSession();

        return data.session;
    }

    async setSession(session: {
        access_token: string
        refresh_token: string
    }) {
        await supabase.auth.setSession(session);
    }

    async getUser() {
        let {data} =
            await supabase.auth.getUser();

        return data.user;
    }
}

export const authServiceContext = createContext<AuthService>("auth-service");