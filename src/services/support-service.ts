import type {SupportMessage} from "../models/support-message.ts";
import {createContext} from "@lit/context";
import {type FilterBuilder, SupabaseService} from "./supabase-service.ts";
import type {User} from "../models/user.ts";

export class SupportService extends SupabaseService<SupportMessage> {
    constructor() {
        super("fe_v4", "support_center");
    }

    send(text: string) {
        return this.db
            .from("support_center")
            .insert({text: text});
    }

    protected async insert(item: SupportMessage) {
        item.user = await this.getUser(item.user_id);

        super.insert(item);
    }

    protected async update(item: SupportMessage) {
        item.user = await this.getUser(item.user_id);

        super.update(item);
    }

    protected query(): FilterBuilder {
        return this.table
            .select("*,user:users (*)")
            .order("id");
    }

    private async getUser(userId: string) {
        const {data, error} = await this.db
            .from("users")
            .select("*")
            .eq("id", userId)
            .single<User>();

        if (error)
            return null;

        return data;
    }
}

export const supportServiceContext = createContext<SupportService>("support-center-service");