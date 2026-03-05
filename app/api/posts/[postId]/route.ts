import { Post } from "@/database/post.model";
import { dbConnect } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  await dbConnect();
  const { postId } = await params;
  const post = await Post.findById(postId).populate("user", "displayName avatarUrl").lean();
  if (!post) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ post });
}
