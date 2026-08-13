import {marked} from "marked";
import {unsafeHTML} from "lit/directives/unsafe-html.js";

export class Markdown {
    static render(content?: string | null) {
        if (!content)
            return "";

        const renderer = new marked.Renderer();

        renderer.image = ({href, text, title}) => {
            if (!href) return "";

            return `
<div class="markdown-image my-4 text-center">
    <img
        src="${href}"
        alt="${text ?? ""}"
        title="${title ?? ""}"
        loading="lazy"
        class="block max-w-full rounded-xl"
    />
    ${text ? `<div class="caption mt-2 text-[13px] text-(--news-date)">${text}</div>` : ""}
</div>`;
        };

        renderer.link = ({href, text}) => {
            if (!href)
                return text;

            const match = href.match(
                /(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
            );

            if (match) {
                return `
<div class="youtube-video w-full aspect-video my-4">
    <iframe
        src="https://www.youtube.com/embed/${match[1]}"
        class="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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