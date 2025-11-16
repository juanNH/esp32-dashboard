import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId: string;
  avgTemperature: number;
  createdAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deviceId: { type: String, required: true },
    avgTemperature: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Alert: Model<IAlert> =
  mongoose.models.Alert || mongoose.model<IAlert>("Alert", AlertSchema);

export default Alert;
