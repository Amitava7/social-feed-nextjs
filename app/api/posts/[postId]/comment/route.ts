import { Comment } from "@/database/comment.model";
import { Post } from "@/database/post.model";
import { dbConnect } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { postId } = await params;

  const body = await request.json();
  const content = (body.content as string | undefined)?.trim();
  if (!content) {
    return NextResponse.json({ message: "Comment cannot be empty" }, { status: 400 });
  }

  const comment = await Comment.create({
    post: postId,
    user: session.userId,
    content,
  });

  await Post.updateOne({ _id: postId }, { $inc: { commentsCount: 1 } });
  await comment.populate("user", "displayName avatarUrl");

  return NextResponse.json({ comment }, { status: 201 });
}
