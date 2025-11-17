import { User } from "@/database/user.model";
import { dbConnect } from "@/lib/mongodb";

import { NextRequest, NextResponse } from "next/server";
import z, { ZodError, treeifyError } from "zod";

const userSchema = z.object({
  displayName: z.string().min(3).max(30),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long"),
  avatarUrl: z.url("Invalid URL").optional(),
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const parsedData = userSchema.parse(body);
    const existingUser = await User.findOne({ email: parsedData.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }
    User.create(parsedData);
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
