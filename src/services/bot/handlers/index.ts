import { HydratedDocument } from "mongoose"
import { MentionSchema } from "../../../models/mention.model"

type HandlerAggregator<T> = {matcher: RegExp, handler: (context: T) => void}[]

export const MENTION_HANDLERS: HandlerAggregator<HydratedDocument<MentionSchema>> = []
