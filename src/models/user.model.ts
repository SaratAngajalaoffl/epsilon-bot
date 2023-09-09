import mongoose from "mongoose";

export type UserSchema = {
  twitter: {
    id: string;
    name: string;
    username: string;
  };
  safeWalletAddress?: string;
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
  safeWalletAddress: {
    type: String,
    unique: true,
  },
});

export const userModel = mongoose.model("User", userSchema);
