import {signal} from "@lit-labs/signals";
import type {Code} from "../models/code.ts";

export interface Reward {
    code: Code;
    action: string;
    title: string;
    badge: string;
    descriptions: string[];
    features: string[];
}

export const rewardStore = {
    rewards: signal<Reward[]>([
        {
            action: "grant_app",
            title: "FlightEcho Private Build",
            badge: "Exclusive Access",
            descriptions: [
                "Download the latest private version of FlightEcho.",
                "Future updates will also be available through this page."
            ],
            features: [
                "Private application download",
                "Early access to new features",
                "Priority updates"
            ],
        } as Reward,
    ]),

    hasReward(code: Code) {
        return this.rewards.get().some(value => value.action === code.action);
    },

    getReward(code: Code): Reward | undefined {
        const reward = this.rewards.get().findLast(value => value.action == code.action);

        if (reward)
            reward.code = code;

        return reward;
    }
};