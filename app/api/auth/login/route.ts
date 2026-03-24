import { NextRequest, NextResponse } from "next/server";
import {
  findUserByEmail,
  comparePassword,
  signToken,
} from "../../../../lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    const user = await findUserByEmail(email);
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isValid = await comparePassword(password, user.password as string);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = await signToken({
      userId: user.id as number,
      email: user.email as string,
      name: user.name as string | undefined,
    });
    const response = NextResponse.json({
      user: {
        id: user.id as number,
        email: user.email as string,
        name: user.name as string,
      },
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
