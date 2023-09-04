import { TwitterApi } from "twitter-api-v2";
import {
    ACCESS_TOKEN,
    CONSUMER_KEY,
    CONSUMER_SECRET,
    TOKEN_SECRET,
} from "../config/env";

export class TwitterService {
    twitterClient: TwitterApi;

    constructor() {
        this.twitterClient = new TwitterApi({
            appKey: CONSUMER_KEY,
            appSecret: CONSUMER_SECRET,
            accessToken: ACCESS_TOKEN,
            accessSecret: TOKEN_SECRET,
        });

        this.twitterClient.appLogin();
    }

    getUserData = async () => {
        return await this.twitterClient.v2.me();
    };

    getPendingDmEvents = async () => {
        return await this.twitterClient.v2.listDmEvents();
    };

    sendDm = async (participant_id: string, message: string) => {
        return await this.twitterClient.v2.sendDmToParticipant(participant_id, {
            text: message,
        });
    };

    getUserMentions = async (userId: string) => {
        const user = await this.twitterClient.v2.userMentionTimeline(userId);

        return user;
    };

    replyToMention = async () => {};
}
