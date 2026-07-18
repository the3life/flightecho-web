export class Query {
    static get(name: string): string | null {
        return new URLSearchParams(window.location.search)
            .get(name);
    }

    static has(name: string): boolean {
        return new URLSearchParams(window.location.search)
            .has(name);
    }
}