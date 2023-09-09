import { MentionService } from "../mentions.service";
import { twitterClient } from "../twitter.service";
import { UserService } from "../user.service";
import { DM_HANDLERS, MENTION_HANDLERS } from "./handlers";

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
    await Promise.all([
      this.handleMentions(),
      // this.handleDms(),
    ]);
  }

  //   @ts-ignore
  private handleDms = async () => {
    const botId = (await twitterClient.getUserData()).data.id;
    let dms = await twitterClient.getPendingDmEvents();

    for (let dm of dms.data.data) {
      if (!dm.sender_id) continue;

      if (dm.sender_id === botId) continue;

      if (dm.event_type !== "MessageCreate") continue;

      let sender = await UserService.getUserFromTwitterId(dm.sender_id);

      if (sender === null) {
        const userTwitter = await twitterClient.getUserDataFromId(dm.sender_id);

        sender = await UserService.createUserIfNotExist(userTwitter.data);
      }

      for (let { matcher, handler } of DM_HANDLERS) {
        if (matcher.test(dm.text)) {
          handler(dm, matcher);
        } else {
          console.log(
            `No handler matches for\ndmId: ${dm.id}\nsenderId: ${dm.sender_id}\nText: ${dm.text}`,
          );
        }
      }
    }
  };

  //   @ts-ignore
  private handleMentions = async () => {
    const botId = (await twitterClient.getUserData()).data.id;

    let mentions = await twitterClient.getUserMentions(botId);

    let shouldBreakWhile = false;

    while (!shouldBreakWhile) {
      for (let mention of mentions.data.data) {
        let mentionObj = await MentionService.getMention(mention.id);

        if (mentionObj !== null) {
          continue;
        }

        if (!mention.author_id) {
          console.log("Mention should have an author");
          continue;
        }

        console.log(`--handling ${mention.text}`);

        let author = await UserService.getUserFromTwitterId(mention.author_id);

        if (author === null) {
          const userTwitter = await twitterClient.getUserDataFromId(
            mention.author_id,
          );

          author = await UserService.createUserIfNotExist(userTwitter.data);

          if (!author.safeWalletAddress) {
            console.log(`User with id ${mention.author_id} not registered`);

            await twitterClient.replyToTweet(
              mention.id,
              `Please send safe wallet address in dm's following the format 'REGISTER <safe-wallet-address>' to register`,
            );

            continue;
          }
        }

        mentionObj = await MentionService.createMention(
          mention.id,
          author,
          mention.text,
        );

        for (let { matcher, handler } of MENTION_HANDLERS) {
          if (matcher.test(mentionObj.mentionText)) {
            handler(mentionObj, matcher);
          } else {
            // console.log(
            //   `No handler matches for\nmentionId: ${mentionObj.tweetId}\nauthor: ${mentionObj.user}\ntext: ${mentionObj.mentionText}`,
            // );
          }
        }
      }

      if (!mentions.meta.next_token) break;

      mentions = await mentions.fetchNext();
    }
  };
}
