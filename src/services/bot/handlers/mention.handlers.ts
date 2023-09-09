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

  const keys = generateKeysFromPassword("");

  const tx = await contract.createPeanutLink(
    sender.safeWalletAddress,
    ethers.utils.parseEther(amount),
    keys.address,
  );

  const logs = tx.logs;

  console.log("--logs", logs);

  try {
    await twitterClient.sendDm(recieverId, "https://testpeanutlink.com");
  } catch (err) {
    console.log(`Cannot send Dm to ${reciever}`);

    await twitterClient.replyToTweet(
      mention.tweetId,
      `@${reciever} please follow the bot to receive peanut link`,
    );
  }
};
