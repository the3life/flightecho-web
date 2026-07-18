import {supabase} from "./supabase.ts";
import type {SupportMessage} from "../models/support-message.ts";
import type {RealtimeChannel} from "@supabase/supabase-js";
import {createContext} from "@lit/context";
import {signal} from "@lit-labs/signals";

export class SupportService {
    public loading = signal<boolean>(true);
    public messages = signal<SupportMessage[]>([]);

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

    send(text: string) {
        return supabase.rpc("send_support_message", {"p_text": text});
    }

    private load() {
        supabase
            .from("support_center_v4")
            .select(`
                *,
                profile:profiles_v4 (*)
            `)
            .order("id")
            .then(r => {
                if (r.success) {
                    this.messages.set(r.data);
                    this.loading.set(false);
                }
            });
    }

    private async getMessage(id: number) {
        const {data, error} = await supabase
            .from("support_center_v4")
            .select(`
                *,
                profile:profiles_v4 (*)
            `)
            .eq("id", id)
            .single();

        if (error)
            return null;

        return data as SupportMessage;
    }

    private subscribe() {
        if (this.channel)
            return;

        this.channel = supabase
            .channel("support_center_v4")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "support_center_v4"
                },
                async payload => {
                    switch (payload.eventType) {
                        case "INSERT": {
                            const message = await this.getMessage(payload.new.id);

                            if (!message)
                                return;

                            this.messages.set([...this.messages.get(), message]);

                            break;
                        }

                        case "UPDATE": {
                            const message = payload.new as SupportMessage;

                            if (!message)
                                return;

                            this.messages.set(
                                this.messages.get().map(x =>
                                    x.id === message.id
                                        ? {
                                            ...x,
                                            text: message.text
                                        }
                                        : x
                                ));

                            break;
                        }

                        case "DELETE": {
                            this.messages.set(
                                this.messages.get().filter(
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

export const supportServiceContext = createContext<SupportService>('support-service');