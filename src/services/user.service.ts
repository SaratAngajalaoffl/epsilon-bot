import { UserSchema, userModel } from "../models/user.model";

export class UserService {
    static createUserIfNotExist = async (user: UserSchema["twitter"]) => {
        try {
            const userObj = await userModel.create({ twitter: user });

            return userObj;
        } catch (err) {
            console.log("User already exists", user.username);

            return await userModel.findOne({ twitter: { id: user.id } });
        }
    };
}
