import { Post } from "@/database/post.model";
import { dbConnect } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/auth";
import { validateImageFile } from "@/lib/validate";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  const session = await getSessionUser();
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = 10;

  const query: Record<string, unknown> = {};
  if (cursor) {
    const cursorDate = new Date(cursor);
    if (isNaN(cursorDate.getTime())) {
      return NextResponse.json({ message: "Invalid cursor" }, { status: 400 });
    }
    query.createdAt = { $lt: cursorDate };
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .populate("user", "displayName avatarUrl")
    .lean();

  const hasMore = posts.length > limit;
  if (hasMore) posts.pop();

  const userId = session?.userId;
  const mapped = posts.map((post) => ({
    ...post,
    likedByMe: userId
      ? (post.likes as mongoose.Types.ObjectId[]).some(
          (id) => id.toString() === userId
        )
      : false,
  }));

  const nextCursor =
    hasMore && posts.length > 0
      ? (posts[posts.length - 1].createdAt as Date).toISOString()
      : null;

  return NextResponse.json({ posts: mapped, hasMore, nextCursor });
}

export async function POST(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const formData = await request.formData();
  const title = (formData.get("title") as string | null)?.trim();
  const image = formData.get("image") as File | null;

  if (!title || title.length > 500) {
    return NextResponse.json(
      { message: !title ? "Caption is required" : "Caption too long (max 500 chars)" },
      { status: 400 }
    );
  }

  let mediaUrl: string | undefined;
  if (image && image.size > 0) {
    const imageError = validateImageFile(image);
    if (imageError) {
      return NextResponse.json({ message: imageError }, { status: 400 });
    }
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result: UploadApiResponse = await new Promise((res, rej) => {
      cloudinary.uploader
        .upload_stream({ folder: "posts", resource_type: "image" }, (err, r) => {
          if (err || !r) rej(err);
          else res(r);
        })
        .end(buffer);
    });
    mediaUrl = result.secure_url;
  }

  const post = await Post.create({
    user: session.userId,
    title,
    mediaUrl,
  });

  await post.populate("user", "displayName avatarUrl");

  return NextResponse.json(
    { post: { ...post.toObject(), likedByMe: false } },
    { status: 201 }
  );
}
