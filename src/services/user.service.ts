import mongoose, { HydratedDocument } from "mongoose";
import { UserSchema, userModel } from "../models/user.model";

export class UserService {
  static getUserFromTwitterId = async (userId: string) => {
    return await userModel.findOne({ "twitter.id": userId });
  };

  static getUserFromId = async (userId: mongoose.Types.ObjectId) => {
    return await userModel.findById(userId);
  };

  static createUserIfNotExist = async (user: UserSchema["twitter"]) => {
    try {
      const userObj = await userModel.create({ twitter: user });

      return userObj;
    } catch (err) {
      console.log("User already exists", user.username);

      return (await userModel.findOne({
        "twitter.id": user.id,
      })) as HydratedDocument<UserSchema>;
    }
  };
}
