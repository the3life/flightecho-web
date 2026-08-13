import {html, unsafeCSS} from "lit";
import {customElement, state} from "lit/decorators.js";
import {consume} from "@lit/context";
import {UserService, userServiceContext} from "../../../services/user-service.ts";
import {Page} from "../../page.ts";
import dayjs from "dayjs";
import {supabase} from "../../../services/supabase.ts";
import type {UserState} from "../../../models/user-state.ts";
import type {User} from "../../../models/user.ts";
import {FlightMode} from "../../../models/flight-mode.ts";
import {t} from "../../../i18n/translation.ts";
import type {RealtimeChannel} from "@supabase/supabase-js";
import {globalStyles} from "../../../core/css.ts";
import shared from "./shared.css?inline";
import styles from "./users-tab.css?inline";

@customElement("users-tab")
export class UsersTab extends Page {
    static styles = [globalStyles, unsafeCSS(shared), unsafeCSS(styles)];

    @consume({context: userServiceContext})
    private userService!: UserService;

    @state()
    private onlineUsers: Record<string, UserState> = {};

    @state()
    private presenceChannel?: RealtimeChannel;

    protected async initializePage(): Promise<boolean> {
        await this.userService.initialize();
        this.userService.subscribe();

        this.presenceChannel = supabase.channel("online-users");

        this.presenceChannel
            .on('presence', {event: 'sync'}, () => {
                if (!this.presenceChannel)
                    return;

                const states = this.presenceChannel.presenceState<UserState>();

                this.onlineUsers = Object.fromEntries(Object.keys(this.presenceChannel.presenceState())
                    .filter(key => {
                        return states[key].at(-1);
                    })
                    .map(key => {
                        return [key, states[key].at(-1)!];
                    }));
            })
            .subscribe()

        return true;
    }

    protected hasUser(user: User) {
        return Object.values(this.onlineUsers).some(state => state.user_id == user.id);
    }

    protected renderPage() {
        return html`
            <div class="stats">
                <div class="card">
                    <div class="stat">
                        <div class="icon">👥</div>
                        <div>
                            <div class="label">${t("admin_page.tabs.users.total")}</div>
                            <div class="value">${this.userService.items.get().length}</div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="stat online">
                        <div class="icon">🟢</div>
                        <div>
                            <div class="label">${t("admin_page.tabs.users.online")}</div>
                            <div class="value">
                                ${Object.values(this.onlineUsers).filter(state => state.user_id).length}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="stat online">
                        <div class="icon">🟢</div>
                        <div>
                            <div class="label">${t("admin_page.tabs.users.anonymous")}</div>
                            <div class="value">
                                ${Object.values(this.onlineUsers).filter(state => !state.user_id).length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="section-header">
                    <h3>${t("admin_page.tabs.users.title")}</h3>
                    <input class="search" placeholder=${t("admin_page.tabs.users.search.input.placeholder")}/>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>${t("admin_page.tabs.users.table.display_name")}</th>
                        <th>${t("admin_page.tabs.users.table.email")}</th>
                        <th>${t("admin_page.tabs.users.table.registration")}</th>
                        <th>${t("admin_page.tabs.users.table.mode")}</th>
                        <th>${t("admin_page.tabs.users.table.status")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${this.userService.items.get().map(user => {
                        const state = Object.values(this.onlineUsers).find(state => state.user_id == user.id);

                        return html`
                            <tr>
                                <td>${user.display_name}</td>
                                <td>${user.email}</td>
                                <td>${dayjs(user.created_at).format("DD.MM.YYYY HH:mm")}</td>
                                <td>${FlightMode[state?.mode ?? 0]}</td>
                                <td>
                                    ${this.hasUser(user) ? html`
                                        <span class="status online">● Online</span>
                                    ` : html`
                                        <span class="status offline">● Offline</span>
                                    `}
                                </td>
                            </tr>
                        `;
                    })}
                    </tbody>
                </table>
            </div> `;
    }
}