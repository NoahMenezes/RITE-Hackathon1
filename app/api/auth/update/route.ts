import { NextRequest, NextResponse } from "next/server";
import { verifyToken, updateUser, signToken } from "../../../../lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password } = await req.json();
    await updateUser(payload.userId, { name, email, password });

    const newToken = await signToken({
      userId: payload.userId,
      email: email || payload.email,
      name: name !== undefined ? name : payload.name,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
