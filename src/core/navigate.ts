export function navigate(path: string, query?: Record<string, string>) {
    let hash = path;

    if (query) {
        const params = new URLSearchParams(query);
        hash += `?${params.toString()}`;
    }

    window.location.hash = "/" + hash;
}