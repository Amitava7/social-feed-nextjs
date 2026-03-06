import { User } from "@/database/user.model";
import { dbConnect } from "@/lib/mongodb";
import { isValidObjectId } from "@/lib/validate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  if (!isValidObjectId(userId)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await dbConnect();
  const user = await User.findById(userId).select("-password").lean();
  if (!user) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ user });
}
