import { User } from "@/database/user.model";
import { dbConnect } from "@/lib/mongodb";
import { signToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { message: "Please verify your email before logging in" },
        { status: 403 }
      );
    }

    const token = await signToken({
      sub: user._id.toString(),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        _id: user._id,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
    });

    response.cookies.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
