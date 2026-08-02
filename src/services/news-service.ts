import {createContext} from "@lit/context";
import type {News} from "../models/news.ts";
import {type FilterBuilder, SupabaseService} from "./supabase-service.ts";

export class NewsService extends SupabaseService<News> {
    constructor() {
        super("fe_v4", "v_news");
    }

    protected query(): FilterBuilder {
        return this.table.select("*");
    }
}

export const newsServiceContext = createContext<NewsService>("news-service");