import {signal} from "@lit-labs/signals";
import type {PostgrestQueryBuilder, RealtimeChannel} from "@supabase/supabase-js";
import type {SupabaseModel} from "../models/supabase-model.ts";
import {supabase} from "./supabase.ts";
import {PostgrestFilterBuilder} from "@supabase/postgrest-js";
import type {Relation, Schema} from "../models/database.ts";

export type QueryBuilder = PostgrestQueryBuilder<any, any, any, string, unknown>;

export type FilterBuilder = PostgrestFilterBuilder<
    any,
    any,
    any,
    any[],
    string,
    unknown,
    'GET',
    false
>;

export abstract class SupabaseService<T extends SupabaseModel<any>> {
    public items = signal<T[]>([]);

    private channel?: RealtimeChannel;

    protected constructor(private readonly schema: Schema, private readonly relation: Relation) {
    }

    protected get db() {
        return supabase
            .schema(this.schema);
    }

    protected get table() {
        return this.db
            .from(this.relation as any);
    }

    async initialize() {
        const {data, error} = await this.query();

        if (!error)
            this.items.set(data);

        return true;
    }

    subscribe() {
        if (this.channel)
            return;

        this.channel = supabase
            .channel(this.relation)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: this.schema,
                    table: this.relation,
                    filter: this.channelFilter()
                },
                async payload => {
                    switch (payload.eventType) {
                        case "INSERT": {
                            const item = payload.new as T;

                            if (!item)
                                return;

                            this.insert(item);

                            break;
                        }

                        case "UPDATE": {
                            const item = payload.new as T;

                            if (!item)
                                return;

                            this.update(item);

                            break;
                        }

                        case "DELETE": {
                            this.delete(payload.old.id);

                            break;
                        }
                    }
                }
            )
            .subscribe();
    }

    protected abstract query(): FilterBuilder;

    protected channelFilter(): string {
        return "";
    }

    protected insert(item: T) {
        this.items.set([...this.items.get(), item]);
    }

    protected update(item: T) {
        this.items.set(
            this.items.get().map(x =>
                x.id === item.id
                    ? item : x
            ));
    }

    protected delete(id: number) {
        this.items.set(
            this.items.get().filter(
                x => x.id !== id
            )
        );
    }

    protected async unsubscribe() {
        if (!this.channel)
            return Promise.resolve();

        await supabase.removeChannel(this.channel);
        this.channel = undefined;
    }
}