import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  deviceId: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    deviceId: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
