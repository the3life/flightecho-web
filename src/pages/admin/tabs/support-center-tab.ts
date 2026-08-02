import {html, unsafeCSS} from "lit";
import {customElement} from "lit/decorators.js";
import styles from './users-tab.css?inline';
import shared from "./shared.css?inline";
import theme from "../admin-theme.css?inline";
import {consume} from "@lit/context";
import {UserService, userServiceContext} from "../../../services/user-service.ts";
import {Page} from "../../page.ts";
import dayjs from "dayjs";

@customElement("users-tab")
export class UsersTab extends Page {
    @consume({context: userServiceContext})
    private userService!: UserService;

    static styles = [unsafeCSS(styles), unsafeCSS(shared), unsafeCSS(theme)];

    protected async initializePage(): Promise<boolean> {
        await this.userService.initialize();
        this.userService.subscribe();

        return true;
    }

    protected renderPage() {
        return html`
            <div class="stats">
                <div class="card">
                    <div class="stat">
                        <div class="icon">👥</div>
                        <div>
                            <div class="label">Toplam Üye</div>
                            <div class="value">${this.userService.items.get().length}</div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="stat online">
                        <div class="icon">🟢</div>
                        <div>
                            <div class="label">Online Üye</div>
                            <div class="value">142</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="section-header"><h3>Üyeler</h3> <input class="search" placeholder="Üye ara..."/></div>
                <table>
                    <thead>
                    <tr>
                        <th>Kullanıcı</th>
                        <th>E-posta</th>
                        <th>Katılım</th>
                        <th>Durum</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${this.userService.items.get().map(user => html`
                        <tr>
                            <td>${user.display_name}</td>
                            <td>${user.email}</td>
                            <td>${dayjs(user.created_at).format("DD.MM.YYYY HH:mm")}</td>
                            <td><span class="status online">● Online</span></td>
                        </tr>
                    `)}
                    <!--<tr>
                        <td>ahmetyilmaz</td>
                        <td>ahmet@example.com</td>
                        <td>12.05.2024 14:32</td>
                        <td><span class="status online">● Online</span></td>
                    </tr>
                    <tr>
                        <td>mustafademir</td>
                        <td>mustafa@example.com</td>
                        <td>11.05.2024 09:15</td>
                        <td><span class="status online">● Online</span></td>
                    </tr>
                    <tr>
                        <td>eminekaya</td>
                        <td>emine@example.com</td>
                        <td>10.05.2024 21:42</td>
                        <td><span class="status offline">● Çevrimdışı</span></td>
                    </tr>-->
                    </tbody>
                </table>
            </div> `;
    }
}