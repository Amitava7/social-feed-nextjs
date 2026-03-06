import { Comment } from "@/database/comment.model";
import { Post } from "@/database/post.model";
import { dbConnect } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/auth";
import { isValidObjectId } from "@/lib/validate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await params;
  if (!isValidObjectId(postId)) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  await dbConnect();

  const body = await request.json();
  const content = (body.content as string | undefined)?.trim()?.slice(0, 2000);
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
