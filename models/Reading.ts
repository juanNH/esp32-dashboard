import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReading extends Document {
  deviceId: string;
  humidity: number[];
  temperature: number[];
  createdAt: Date;
}

const ReadingSchema = new Schema<IReading>(
  {
    deviceId: { type: String, required: true },
    humidity: { type: [Number], required: true },
    temperature: { type: [Number], required: true },
  },
  { timestamps: true }
);

const Reading: Model<IReading> =
  mongoose.models.Reading || mongoose.model<IReading>("Reading", ReadingSchema);

export default Reading;
