import { HydratedDocument } from "mongoose";
import { DMEventV2 } from "twitter-api-v2/dist/esm/types/v2/dm.v2.types";
import { MentionSchema } from "../../../models/mention.model";
import { registerHandler } from "./dm.handlers";
import { sendEthHandler } from "./mention.handlers";

type HandlerAggregator<T> = {
  matcher: RegExp;
  handler: (context: T, matcher: RegExp) => void;
}[];

export const MENTION_HANDLERS: HandlerAggregator<
  HydratedDocument<MentionSchema>
> = [
  {
    matcher: /@zaapbot send ([0-9.]+)ETH to @([A-Za-z_]+)/,
    handler: sendEthHandler,
  },
];

export const DM_HANDLERS: HandlerAggregator<DMEventV2> = [
  {
    matcher: /REGISTER (0x[a-zA-Z0-9]+)/,
    handler: registerHandler,
  },
];
