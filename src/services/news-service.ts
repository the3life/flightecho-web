import {supabase} from "./supabase.ts";
import type {RealtimeChannel} from "@supabase/supabase-js";
import {createContext} from "@lit/context";
import {signal} from "@lit-labs/signals";
import type {News} from "../models/news.ts";

export class NewsService {
    public loading = signal<boolean>(true);
    public news = signal<News[]>([]);

    private channel?: RealtimeChannel;

    constructor() {
        this.load();
        this.subscribe();
    }

    async unsubscribe() {
        if (!this.channel)
            return Promise.resolve();

        await supabase.removeChannel(this.channel);
        this.channel = undefined;
    }

    private load() {
        supabase
            .from("news_md")
            .select(`
                *
            `)
            .order("id", {ascending: false})
            .then(r => {
                if (r.success) {
                    this.news.set(r.data);
                    this.loading.set(false);
                }
            });
    }

    private subscribe() {
        if (this.channel)
            return;

        this.channel = supabase
            .channel("news_v4")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "news_md"
                },
                async payload => {
                    switch (payload.eventType) {
                        case "INSERT": {
                            const news = payload.new as News;

                            if (!news)
                                return;

                            this.news.set([...this.news.get(), news]);

                            break;
                        }

                        case "UPDATE": {
                            const news = payload.new as News;

                            if (!news)
                                return;

                            this.news.set(
                                this.news.get().map(x =>
                                    x.id === news.id
                                        ? {
                                            ...x,
                                            title: news.title,
                                            text: news.text
                                        }
                                        : x
                                ));

                            break;
                        }

                        case "DELETE": {
                            this.news.set(
                                this.news.get().filter(
                                    x => x.id !== payload.old.id
                                )
                            );

                            break;
                        }
                    }
                }
            )
            .subscribe();
    }
}

export const newsServiceContext = createContext<NewsService>('news-service');