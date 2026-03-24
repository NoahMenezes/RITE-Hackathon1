import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { number } = body;

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

    // Execute the Python script
    // Using python3, which is standard on most Linux/Mac systems
    const { stdout, stderr } = await execPromise(
      `python3 ${scriptPath} ${cleanNumber}`,
    );

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
