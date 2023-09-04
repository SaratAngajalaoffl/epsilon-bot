import mongoose from "mongoose";

export type UserSchema = {
    twitter: {
        id: string;
        name: string;
        username: string;
    };
};

const userSchema = new mongoose.Schema<UserSchema>({
    twitter: {
        id: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
        },
        username: {
            type: String,
        },
    },
});

export const userModel = mongoose.model("User", userSchema);
