import {html, LitElement, nothing} from "lit";
import {customElement, property, queryAssignedElements} from "lit/decorators.js";
import {globalStyles} from "../core/css.ts";

@customElement("select-option")
export class SelectOption extends LitElement {
    @property() title = "";
    @property() data?: string;

    render() {
        return html`
            <slot></slot>`;
    }
}

@customElement("select-box")
export class SelectBox extends LitElement {
    static styles = [globalStyles];

    @property()
    placeholder?: string;

    @property()
    selected?: string;

    @queryAssignedElements()
    private items!: SelectOption[];

    private onSlotChange() {
        this.requestUpdate();

        queueMicrotask(() => {
            const select = this.renderRoot.querySelector("select");
            if (select)
                select.value = this.selected ?? "";
        });
    }

    private onChange(e: Event) {
        const item = (e.target as HTMLSelectElement).value;

        this.dispatchEvent(new CustomEvent("change", {
            detail: item,
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <select .value=${this.selected} @change=${this.onChange}>

                ${this.placeholder ? html`
                    <option value="-1" disabled selected>
                        ${this.placeholder}
                    </option>
                ` : nothing}

                ${this.items.map(item => html`
                    <option value=${item.data}>
                        ${item.title}
                    </option>
                `)}
            </select>

            <!-- Kullanıcının yazdığı item'lar görünmesin -->
            <slot hidden @slotchange=${this.onSlotChange}></slot>
        `;
    }
}