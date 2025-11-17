import mongoose from "mongoose";

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  mediaUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: mongoose.Schema = new mongoose.Schema<IPost>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    mediaUrl: { type: String },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

PostSchema.index({ createdAt: -1 });
PostSchema.index({ likesCount: -1 });
PostSchema.index({ user: 1, createdAt: -1 });

export const Post: mongoose.Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
