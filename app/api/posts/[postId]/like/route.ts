import { Post } from "@/database/post.model";
import { dbConnect } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { postId } = await params;

  const post = await Post.findById(postId);
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  const userId = new mongoose.Types.ObjectId(session.userId);
  const alreadyLiked = post.likes.some((id) => id.equals(userId));

  if (alreadyLiked) {
    await Post.updateOne(
      { _id: postId },
      { $pull: { likes: userId }, $inc: { likesCount: -1 } }
    );
    return NextResponse.json({ liked: false, likesCount: post.likesCount - 1 });
  } else {
    await Post.updateOne(
      { _id: postId },
      { $addToSet: { likes: userId }, $inc: { likesCount: 1 } }
    );
    return NextResponse.json({ liked: true, likesCount: post.likesCount + 1 });
  }
}
