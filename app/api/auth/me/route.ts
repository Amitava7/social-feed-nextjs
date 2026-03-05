import { User } from "@/database/user.model";
import { dbConnect } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findById(session.userId).select("-password");
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
