import { ethers } from "ethers";
import { HydratedDocument } from "mongoose";
import { MentionSchema } from "../../../models/mention.model";
import { SafeDelegatedContract } from "../../../utils/contracts/delegate/SafeDelegatedProxy";
import { generateKeysFromPassword } from "../../../utils/math.utils";
import { twitterClient } from "../../twitter.service";
import { UserService } from "../../user.service";

export const sendEthHandler = async (
  mention: HydratedDocument<MentionSchema>,
  matcher: RegExp,
) => {
  const data = mention.mentionText.match(matcher);

  if (!data || !data[1] || !data[2]) return;

  const [, amount, reciever] = data;

  console.log({ amount, reciever });

  const recieverId = (await twitterClient.getUserDataFromUsername(reciever))
    .data.id;

  const sender = await UserService.getUserFromId(mention.user);

  if (!sender || !sender.safeWalletAddress) return;

  const contract = new SafeDelegatedContract();

  const password = (Math.random() + 1).toString(36).substring(7);

  const keys = generateKeysFromPassword(password);

  const tx = await contract.createPeanutLink(
    sender.safeWalletAddress,
    ethers.utils.parseEther(amount),
    keys.address,
  );

  const logs = tx.logs;

  let peanutIndex: number = 0;

  for (var log of logs) {
    if (
      log.topics[0] ===
      "0x6cfb6f205ed755f233c83bfe7f03aee5e1d993139ce47aead6d4fe25f7ec3066"
    ) {
      peanutIndex = parseInt(log.topics[1], 16);

      console.log("--log", log);
    }
  }

  console.log("--peanutIndex", peanutIndex);

  const link = `https://peanut.to/claim?c=5&i=${peanutIndex}&v=v4&p=${password}`;

  try {
    await twitterClient.sendDm(recieverId, link);
  } catch (err) {
    console.log(`Cannot send Dm to ${reciever}`);

    await twitterClient.replyToTweet(
      mention.tweetId,
      `@${reciever} please follow the bot to receive peanut link`,
    );
  }
};
