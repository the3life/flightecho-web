export class Query {
    static get(name: string): string | null {
        return this.searchParams.get(name);
    }

    static has(name: string): boolean {
        return this.searchParams.has(name);
    }

    static getBoolean(name: string): boolean {
        return this.get(name) === "true";
    }

    static getNumber(name: string): number | null {
        const value = this.get(name);
        return value === null ? null : Number(value);
    }

    private static get searchParams(): URLSearchParams {
        const hash = window.location.hash.substring(1);
        const url = new URL(hash || "/", window.location.origin);

        return url.searchParams;
    }
}