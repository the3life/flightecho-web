import {Base64} from "js-base64";
import {GithubApi} from "./github-api.ts";
import type {Application} from "../models/application.ts";
import {createLocalizedAsync, type Localized} from "../i18n/translation.ts";
import {supabase} from "../services/supabase.ts";

/*export class ApplicationReleaseNotes {
    public readonly added: string[] = [];
    public readonly fixed: string[] = [];
    public readonly changed: string[] = [];

    constructor(public version: string, content: string) {
        let current: keyof ApplicationReleaseNotes | null = null;

        for (const rawLine of content.split(/\r?\n/)) {
            const line = rawLine.trim();

            if (!line)
                continue;

            switch (line.toLowerCase()) {
                case "[added]":
                    current = "added";
                    continue;

                case "[fixed]":
                    current = "fixed";
                    continue;

                case "[changed]":
                    current = "changed";
                    continue;
            }

            if (current)
                this[current].push(line);
        }
    }
}*/

export interface ApplicationVersion {
    version: string;
    release_id: number;
    //releaseNotes: Localized<ApplicationReleaseNotes>;
    releaseNotes: Localized<string>;
    size: number;
    date: string;
}

export class ApplicationApi {
    static async getAllVersions(appId: string) {
        let {data, error} = await supabase
            .schema("fe_v4")
            .from("apps")
            .select("*")
            .eq("app_id", appId)
            .single<Application>();

        if (error)
            throw new Error(`Supabase error: ${error.name} ${error.message}`);

        if (!data)
            throw new Error(`Supabase error`);

        const releases = (await GithubApi.api(data.github_repository_owner, data.github_repository_name, data.github_token).getReleases());

        return await Promise.all(
            releases.map(async (release) => {
                return {
                    version: release.name.substring(1),
                    release_id: release.id,
                    releaseNotes: await this.getReleaseNotes(data, release.name),
                    size: release.assets.find(asset => asset.name == "-win-Setup.exe")?.size || 0,
                    date: release.published_at
                } as ApplicationVersion;
            })
        );
    }

    static async getReleaseNotes(app: Application, version: string) {
        return await createLocalizedAsync(async lang => {
            const content = await GithubApi
                .api("the3life", "FlightEcho-ReleaseNotes", app.github_token)
                .getContent(`release-notes/${app.github_repository_name}/${version.substring(1)}/${lang}.md`);

            //return new ApplicationReleaseNotes(version, Base64.decode(content.content));

            return Base64.decode(content.content);
        });
    }

    static async getAllReleaseNotes(app: Application) {
        const releases = (await GithubApi.api(app.github_repository_owner, app.github_repository_name, app.github_token).getReleases());

        return await Promise.all(releases.map(async (release) => {
            return await createLocalizedAsync(async lang => {
                const content = await GithubApi
                    .api("the3life", "FlightEcho-ReleaseNotes", app.github_token)
                    .getContent(`release-notes/${app.github_repository_name}/${release.name.substring(1)}/${lang}.md`);

                //return new ApplicationReleaseNotes(release.name, Base64.decode(content.content));

                return Base64.decode(content.content);
            });
        }))
    }
}