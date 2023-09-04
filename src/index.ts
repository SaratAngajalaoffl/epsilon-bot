import dotenv from "dotenv";
dotenv.config();

// import { establishConnection } from "./utils/db.utils";
import { TwitterService } from "./services/twitter.service";

const main = async () => {
    // await establishConnection();

    const twitterService = new TwitterService();

    const user = await twitterService.getUserData();

    console.log(user);

    const mentions = await twitterService.getUserMentions(user.data.id)
};

main().catch((err: Error) => console.error(err));
