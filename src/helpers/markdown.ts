import {marked} from "marked";
import {unsafeHTML} from "lit/directives/unsafe-html.js";

export class Markdown {
    static render(content: string) {
        const renderer = new marked.Renderer();

        renderer.link = ({href, text}) => {
            if (!href)
                return text;

            const match = href.match(
                /(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
            );

            if (match) {
                return `
<div class="youtube-video">
    <iframe
        src="https://www.youtube.com/embed/${match[1]}"
        width="100%"
        height="400"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        frameborder="0"
        loading="lazy"
        allowfullscreen>
    </iframe>
</div>`;
            }

            return `<a href="${href}" target="_blank">${text}</a>`;
        };

        const html = marked.parse(content, {renderer});

        return unsafeHTML(html as string);
    }
}