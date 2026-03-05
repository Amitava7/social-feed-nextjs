import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

const PROTECTED = ["/feed", "/profile", "/settings"];
const AUTH_ONLY = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY.some((p) => pathname === p);

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const payload = await verifyToken(token);
    if (!payload) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("session");
      return res;
    }
  }

  if (isAuthOnly && token) {
    const payload = await verifyToken(token);
    if (payload) {
      return NextResponse.redirect(new URL("/feed", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/feed/:path*", "/profile/:path*", "/settings/:path*", "/login", "/signup"],
};
