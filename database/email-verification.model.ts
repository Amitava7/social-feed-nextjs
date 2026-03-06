import mongoose, { Schema, Document } from "mongoose";

export interface IEmailVerification extends Document {
  email: string;
  key: string;
  createdAt: Date;
}

const EmailVerificationSchema = new Schema<IEmailVerification>(
  {
    email: { type: String, required: true, index: true },
    key: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 * 15 },
  },
  { _id: true }
);

export const EmailVerification: mongoose.Model<IEmailVerification> =
  mongoose.models.EmailVerification ||
  mongoose.model<IEmailVerification>("EmailVerification", EmailVerificationSchema);
