import { User } from "@/database/user.model";
import { dbConnect } from "@/lib/mongodb";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError, treeifyError } from "zod";

const userSchema = z.object({
  displayName: z.string().min(3).max(30),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long"),
  avatar: z.file().min(50 * 1024).max(5 * 1024 * 1024).optional(),
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const formData = await request.formData();
    const userData = Object.fromEntries(formData.entries());
    if (userData.avatar instanceof File && userData.avatar.size === 0) {
      delete userData.avatar;
    }
    const { displayName, email, password, avatar: file } = userSchema.parse(userData);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    let avatarUrl: string | undefined;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult: UploadApiResponse = await new Promise((res, rej) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "avatars",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result)
              rej(error);
            else
              res(result);
          }
        ).end(buffer);
      });
      avatarUrl = uploadResult.secure_url;
    }

    await User.create({
      displayName,
      email,
      password,
      avatarUrl,
    });
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed",
          ...treeifyError(e),
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: "User creation failed",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 }
    );
  }
}
