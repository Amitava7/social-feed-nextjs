import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema<IComment>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

export const Comment: mongoose.Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
