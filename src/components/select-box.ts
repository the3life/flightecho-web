import {css, html, LitElement, nothing} from "lit";
import {customElement, property, queryAssignedElements} from "lit/decorators.js";

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

    static styles = css`
        :host {
            display: block;
            width: 100%;
        }

        select {
            width: 100%;
            padding: 12px 14px;

            border-radius: 12px;
            border: 1px solid #374151;

            background: #0b1220;
            color: #e5e7eb;

            font: inherit;
            outline: none;
            cursor: pointer;

            transition: border-color .2s ease, box-shadow .2s ease;
        }

        select:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, .18);
        }

        option {
            background: #111827;
            color: #e5e7eb;
        }
    `;
}