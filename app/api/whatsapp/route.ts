import { NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import util from "util";

const execFilePromise = util.promisify(execFile);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { number, message } = body;

    if (!number) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    // Clean the number to ensure only digits are passed
    const cleanNumber = number.replace(/\D/g, "");

    if (!cleanNumber) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 },
      );
    }

    // Resolve the path to the Python script
    const scriptPath = path.join(process.cwd(), "scripts", "whatsapp.py");

    // Ensure we don't accidentally execute arbitrary code by passing raw user input
    // using execFile and passing arguments securely
    const args = [scriptPath, cleanNumber];
    if (message) {
      args.push(message);
    }

    // Execute the Python script
    // Using python3, which is standard on most Linux/Mac systems
    const { stdout, stderr } = await execFilePromise("python3", args, {
      env: process.env,
    });

    console.log("WhatsApp automation output:", stdout);
    if (stderr) {
      console.warn("WhatsApp automation stderr:", stderr);
    }

    return NextResponse.json({
      success: true,
      message: "WhatsApp automation started successfully",
      output: stdout,
    });
  } catch (error: unknown) {
    console.error("WhatsApp API Error:", error);
    return NextResponse.json(
      {
        error: (error as Error).message || "Failed to run WhatsApp automation",
      },
      { status: 500 },
    );
  }
}
