import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Instagram username is required" },
        { status: 400 },
      );
    }

    // Clean the username string
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      return NextResponse.json(
        { error: "Invalid Instagram username" },
        { status: 400 },
      );
    }

    // Resolve the path to the Python script
    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "instagram_automation.py"
    );

    // Execute the Python script
    // Using python3, which is standard on most Linux/Mac systems
    const { stdout, stderr } = await execPromise(
      `python3 ${scriptPath} "${cleanUsername}"`,
      { env: process.env }
    );

    console.log("Instagram automation output:", stdout);
    if (stderr) {
      console.warn("Instagram automation stderr:", stderr);
    }

    return NextResponse.json({
      success: true,
      message: "Instagram automation started successfully",
      output: stdout,
    });
  } catch (error: unknown) {
    console.error("Instagram API Error:", error);
    return NextResponse.json(
      {
        error: (error as Error).message || "Failed to run Instagram automation",
      },
      { status: 500 },
    );
  }
}
