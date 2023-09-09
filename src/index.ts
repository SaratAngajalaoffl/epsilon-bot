import dotenv from "dotenv";
dotenv.config();

import { establishConnection } from "./utils/db.utils";
import { Bot } from "./services/bot";

const main = async () => {
    await establishConnection();

    const bot = new Bot()

    bot.update();
};

main().catch((err: Error) => console.error(err));
