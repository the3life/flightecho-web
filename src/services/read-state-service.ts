import {ReactiveElement} from "@lit/reactive-element";
import type {ReadState} from "../models/read-state.ts";
import {supabase} from "./supabase.ts";
import {createContext} from "@lit/context";
import {AuthService} from "./auth-service.ts";

export class ReadStateService {
    private readStates = new Map<number, ReadState>();
    private observers = new Map<string, ReadStateObserver>();

    constructor(private readonly authService: AuthService) {
    }

    has(id: number) {
        const uid = this.authService.uid;

        return Array.from(this.readStates.values()).some(x => x.user_id == uid && x.record_id == id);
    }

    addObserver(element: ReactiveElement,
                name: string,
                tableName: string,
                selectors: string) {

        this.observers.set(name, new ReadStateObserver(element, tableName, selectors));
    }

    removeObserver(name: string) {
        this.observers.delete(name);
    }

    protected update() {
    }

    async connectedCallback() {
        await this.initialize();
    }

    async initialize() {
        const response = await supabase
            .schema("fe_v4")
            .from("read_states")
            .select("*")
            .eq("user_id", this.authService.uid ?? "")
            .order("id", {ascending: false});

        if (response.success)
            this.readStates = new Map(response.data.map(item => [item.id, item] as const));

        return true;
    }
}

export class ReadStateObserver {
    private observer: IntersectionObserver;

    constructor(private readonly element: ReactiveElement,
                private readonly tableName: string,
                private readonly selectors: string) {
        this.observer = new IntersectionObserver(
            entries => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const id = Number((entry.target as HTMLElement).dataset.id);

                        this.markAsRead(id).then();
                    }
                }
            },
            {
                threshold: 0.1
            }
        );

        element.addController(this);
    }

    disconnect() {
    }

    hostConnected() {
        this.observeNewsItems();
    }

    async hostDisconnected() {
        this.observer.disconnect();
    }

    hostUpdate() {
    }

    hostUpdated() {
        this.observeNewsItems();
    }

    async markAsRead(id: number) {
        await supabase
            .schema("fe_v4")
            .from("read_states")
            .insert({record_id: id, table_name: this.tableName});
    }

    private observeNewsItems() {
        const items = this.element.renderRoot.querySelectorAll<HTMLElement>(this.selectors);

        items.forEach(item => this.observer?.observe(item));
    }
}

export const readStateServiceContext = createContext<ReadStateService>("read-state-service");