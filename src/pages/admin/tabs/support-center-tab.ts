import {html} from "lit";
import {customElement} from "lit/decorators.js";
import {Page} from "../../page.ts";

@customElement("support-center-tab")
export class SupportCenterTab extends Page {
    //static styles = [unsafeCSS(styles), unsafeCSS(shared), unsafeCSS(theme)];

    protected async initializePage() {
        return true;
    }

    protected renderPage() {
        return html` `;
    }
}