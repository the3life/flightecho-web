import {Base64} from "js-base64";
import {GithubApi} from "./github-api.ts";
import {createLocalizedAsync, type Localized} from "../i18n/translation.ts";
import type {Edition} from "./app-store.ts";
import {decryptString} from "./encrypt.ts";

export interface ApplicationVersion {
    version: string;
    release_id: number;
    releaseNotes: Localized<string>;
    size: number;
    date: string;
}

export class ApplicationApi {
    static async getAllVersions(edition: Edition) {
        const channel = `releases.win-x64-${edition.toLowerCase()}.json`;
        const token = await decryptString(import.meta.env.VITE_GITHUB_TOKEN);
        const releases = (await GithubApi.api(import.meta.env.VITE_GITHUB_OWNER, `FlightEcho-Development`, token).getReleases());

        return await Promise.all(
            releases.filter(release => release.assets.some(asset => asset.name == channel)).map(async (release) => {
                return {
                    version: release.name.substring(1),
                    release_id: release.id,
                    releaseNotes: await this.getReleaseNotes(edition, release.name),
                    size: release.assets.find(asset => asset.name == "-win-Setup.exe")?.size || 0,
                    date: release.published_at
                } as ApplicationVersion;
            })
        );
    }

    static async getReleaseNotes(edition: Edition, version: string) {
        const token = await decryptString(import.meta.env.VITE_GITHUB_TOKEN);

        return await createLocalizedAsync(async lang => {
            const content = await GithubApi
                .api("the3life", "FlightEcho-ReleaseNotes", token)
                .getContent(`release-notes/FlightEcho-${edition}/${version.substring(1)}/${lang}.md`);

            return Base64.decode(content.content);
        });
    }
}