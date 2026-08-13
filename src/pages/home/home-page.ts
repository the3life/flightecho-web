import {customElement} from "lit/decorators.js";
import {html} from "lit";
import {Page} from "../page.ts";

@customElement("home-page")
export class HomePage extends Page {

    /*
    normal   → telefon
sm       → biraz büyük telefon
md       → tablet
lg       → laptop / desktop
xl       → büyük desktop
2xl      → çok büyük ekran

sm:flex-row
md:block
     */

    renderPage() {
        return html`
            <div class="flex flex-col md:flex-row justify-center items-center">
                <div>A</div>
                <div>B</div>
                <div>C</div>
                <div>D</div>
            </div>
        `;
    }
}