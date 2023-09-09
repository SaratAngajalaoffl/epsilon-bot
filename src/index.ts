import dotenv from "dotenv";
dotenv.config();

import { Bot } from "./services/bot";
import { establishConnection } from "./utils/db.utils";

const main = async () => {
  await establishConnection();

  const bot = new Bot();

  await bot.update();
};

main().catch((err: Error) => console.error(err));
