import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name || "",
      },
    });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json({ user: null });
  }
}
