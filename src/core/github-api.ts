import type {GithubContent} from "../models/github/github-content.ts";

export interface GithubRelease {
    id: number;
    tag_name: string;
    name: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
    created_at: string;
    published_at: string;
    html_url: string;
    assets: GithubAsset[];
}

export interface GithubAsset {
    id: number;
    url: string;
    name: string;
    browser_download_url: string;
    size: number;
    download_count: number;
}

export class GithubApi {
    static api(
        owner: string,
        repo: string,
        token?: string
    ) {
        return new GithubApiCore(owner, repo, token);
    }
}

export class GithubApiCore {
    constructor(private readonly owner: string, private readonly repo: string, private readonly token?: string) {
    }

    async getReleases(): Promise<GithubRelease[]> {
        const response = await fetch(
            `https://api.github.com/repos/${this.owner}/${this.repo}/releases`,
            {
                headers: {
                    Accept: "application/vnd.github+json",
                    ...(this.token
                        ? {Authorization: `Bearer ${this.token}`}
                        : {})
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();

            console.error("GitHub API error:", response.status, errorText);

            throw new Error(
                `GitHub API error: ${response.status} ${response.statusText}`
            );
        }

        return await response.json() as GithubRelease[];
    }

    async getLatestRelease(): Promise<GithubRelease | null> {
        const response = await fetch(
            `https://api.github.com/repos/${this.owner}/${this.repo}/releases/latest`,
            {
                headers: {
                    Accept: 'application/vnd.github+json',
                    ...(this.token
                        ? {Authorization: `Bearer ${this.token}`}
                        : {})
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();

            console.error('GitHub API error:', response.status, errorText);

            throw new Error(
                `GitHub API error: ${response.status} ${response.statusText}`
            );
        }

        return await response.json() as GithubRelease;
    }

    async getContent(path: string) {
        const response = await fetch(
            `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`,
            {
                headers: {
                    Accept: 'application/vnd.github+json',
                    ...(this.token
                        ? {Authorization: `Bearer ${this.token}`}
                        : {})
                }
            }
        );

        if (!response.ok) {
            /*const errorText = await response.text();

            console.error('GitHub API error:', response.status, errorText);*/

            throw new Error(
                `GitHub API error: ${response.status} ${response.statusText}`
            );
        }

        return await response.json() as GithubContent;
    }
}