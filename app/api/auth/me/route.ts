import { NextRequest, NextResponse } from "next/server";
import { verifyToken, findUserByEmail } from "../../../../lib/auth";

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

    const user = await findUserByEmail(payload.email);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json({ user: null });
  }
}
