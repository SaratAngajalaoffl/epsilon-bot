import { ethers } from "ethers";
import { getRpcUrl } from "./config";

const BOT_PRIVATE_KEY = process.env["BOT_PRIVATE_KEY"] ?? "";

export const getBotWallet = (chain: "opt" | "base" | "zora" | "eth") => {
  const provider = new ethers.providers.JsonRpcProvider(getRpcUrl(chain));

  return new ethers.Wallet(BOT_PRIVATE_KEY, provider);
};
