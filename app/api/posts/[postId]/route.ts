import { Post } from "@/database/post.model";
import { dbConnect } from "@/lib/mongodb";
import { isValidObjectId } from "@/lib/validate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  if (!isValidObjectId(postId)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  const post = await Post.findById(postId).populate("user", "displayName avatarUrl").lean();
  if (!post) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ post });
}
