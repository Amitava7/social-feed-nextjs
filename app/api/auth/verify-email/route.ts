import { User } from "@/database/user.model";
import { EmailVerification } from "@/database/email-verification.model";
import { dbConnect } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const rawToken = request.nextUrl.searchParams.get("token");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  if (!rawToken) {
    return NextResponse.redirect(new URL("/login?verified=error", appUrl));
  }

  let email: string;
  let key: string;
  try {
    const decoded = JSON.parse(Buffer.from(rawToken, "base64url").toString("utf8"));
    email = decoded.email;
    key = decoded.key;
    if (!email || !key) throw new Error();
  } catch {
    return NextResponse.redirect(new URL("/login?verified=error", appUrl));
  }

  await dbConnect();

  const record = await EmailVerification.findOne({ email, key });
  if (!record) {
    return NextResponse.redirect(new URL("/login?verified=error", appUrl));
  }

  await Promise.all([
    User.updateOne({ email }, { emailVerified: true }),
    EmailVerification.deleteOne({ _id: record._id }),
  ]);

  return NextResponse.redirect(new URL("/login?verified=true", appUrl));
}
