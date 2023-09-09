import { DMEventV2 } from "twitter-api-v2/dist/esm/types/v2/dm.v2.types";
import { UserService } from "../../user.service";

export const registerHandler = async (dmEvent: DMEventV2, matcher: RegExp) => {
  if (dmEvent.event_type !== "MessageCreate" || !dmEvent.sender_id) return;

  const data = dmEvent.text.match(matcher);

  if (!data || !data[1]) return;

  const safeAddress = data[1];

  const user = await UserService.getUserFromTwitterId(dmEvent.sender_id);

  if (!user || !!user.safeWalletAddress) return;

  user.safeWalletAddress = safeAddress;

  await user.save();

  // await twitterClient.sendDm(dmEvent.sender_id, "Registered Successfully!");
};
