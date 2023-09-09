import { MentionService } from "../mentions.service";
import { twitterClient } from "../twitter.service";
import { UserService } from "../user.service";
import { MENTION_HANDLERS } from "./handlers";

const SCHEDULER_DELAY = 30000;

export class Bot {
    interval?: NodeJS.Timeout;

    constructor() {}

    init() {
        this.interval = setInterval(this.update, SCHEDULER_DELAY);
    }

    stop() {
        if (!!this.interval) clearInterval(this.interval);
    }

    async update() {


        this.handleMentions();
        this.handleDms();
    }

    private handleDms = async () => {};

    private handleMentions = async () => {
        const botId = (await twitterClient.getUserData()).data.id;

        let mentions = await twitterClient.getUserMentions(botId);

        let shouldBreakWhile = false;

        while (!shouldBreakWhile) {

            console.log("--lengfth", mentions.data.data);

            for (let mention of mentions.data.data) {
                let mentionObj = await MentionService.getMention(mention.id);

                console.log("--mention", mentionObj?.toObject())

                if (mentionObj !== null) {
                    shouldBreakWhile = true;
                    break;
                }

                if (!mention.author_id) {
                    console.log("Mention should have an author");
                    continue;
                }

                const author = await UserService.getUserFromTwitterId(
                    mention.author_id
                );

                if (author === null) {
                    console.log(
                        `User with id ${mention.author_id} not registered`
                    );
                    continue;
                }

                mentionObj = await MentionService.createMention(
                    mention.id,
                    author,
                    mention.text
                );

                for (let { matcher, handler } of MENTION_HANDLERS) {
                    if (matcher.test(mentionObj.mentionText)) {
                        handler(mentionObj);
                    } else {
                        console.log(`No handler matches for
                                    mentionId: ${mentionObj.tweetId}
                                    author: ${mentionObj.user}
                                    text: ${mentionObj.mentionText}`)
                    }
                }

            }

            if(!mentions.meta.next_token) break;

            mentions = await mentions.fetchNext()
        }
    };
}
