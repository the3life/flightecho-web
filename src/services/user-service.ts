import {createContext} from "@lit/context";
import {type FilterBuilder, SupabaseService} from "./supabase-service.ts";
import type {User} from "../models/user.ts";

export class UserService extends SupabaseService<User> {
    constructor() {
        super("fe_v4", "users");
    }

    protected query(): FilterBuilder {
        return this.table.select("*");
    }
}

export const userServiceContext = createContext<UserService>("user-service");