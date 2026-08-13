import {LitElement} from "lit";
import {SignalWatcher} from "@lit-labs/signals";

export abstract class BaseElement extends SignalWatcher(LitElement) {
    //static styles = [unsafeCSS(styles)];

    //static styles = importCss("main.css");
}