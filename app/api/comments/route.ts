import { Comment } from "@/database/comment.model";
import { dbConnect } from "@/lib/mongodb";
import { isValidObjectId } from "@/lib/validate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId || !isValidObjectId(postId)) {
    return NextResponse.json({ message: "Valid postId is required" }, { status: 400 });
  }

  await dbConnect();

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: 1 })
    .limit(50)
    .populate("user", "displayName avatarUrl")
    .lean();

  return NextResponse.json({ comments });
}
