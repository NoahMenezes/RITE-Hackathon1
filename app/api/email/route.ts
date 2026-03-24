import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 },
      );
    }

    // Clean the email string
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Resolve the path to the Python script
    const scriptPath = path.join(process.cwd(), "scripts", "email_automation.py");

    // Execute the Python script
    // Using python3, which is standard on most Linux/Mac systems
    const { stdout, stderr } = await execPromise(
      `python3 ${scriptPath} "${cleanEmail}"`,
      { env: process.env },
    );

    console.log("Email automation output:", stdout);
    if (stderr) {
      console.warn("Email automation stderr:", stderr);
    }

    return NextResponse.json({
      success: true,
      message: "Email automation started successfully",
      output: stdout,
    });
  } catch (error: unknown) {
    console.error("Email API Error:", error);
    return NextResponse.json(
      {
        error: (error as Error).message || "Failed to run email automation",
      },
      { status: 500 },
    );
  }
}
