import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  let user = null;
  if (token) {
    user = await verifyToken(token);
  }

  // Protect Dashboard and Profile Routes
  if (
    !user &&
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/profile"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Redirect signed-in users away from auth pages
  if (
    request.method === "GET" &&
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
