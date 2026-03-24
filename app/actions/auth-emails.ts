"use server"

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendAuthNotification(email: string, type: "signup" | "login" | "reset") {
    try {
        let subject = "";
        let message = "";

        switch (type) {
            case "signup":
                subject = "FOCUSFLOW.PROTOCOL: Identity Established";
                message = `You have successfully established your identity within the FocusFlow ecosystem. Welcome to the protocol. Please follow the instructions in your verification email to complete access.`;
                break;
            case "login":
                subject = "FOCUSFLOW.PROTOCOL: Access Logged";
                message = `You have successfully authorized access to the FocusFlow command center. Your session is now active.`;
                break;
            case "reset":
                subject = "FOCUSFLOW.PROTOCOL: Recovery Key Transmitted";
                message = `You have requested a recovery sequence for your secret key. If you did not initiate this, please secure your access points immediately.`;
                break;
        }

        const { data, error } = await resend.emails.send({
            from: "FocusFlow <onboarding@resend.dev>",
            to: email,
            subject: subject,
            html: `
        <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 1px solid #1f2937;">
          <div style="width: 30px; h: 30px; background-color: #2563eb; margin-bottom: 20px;"></div>
          <h1 style="text-transform: uppercase; font-weight: 900; letter-spacing: -0.05em; font-size: 32px; border-left: 8px solid #2563eb; padding-left: 20px;">${subject}</h1>
          <p style="font-size: 18px; color: #9ca3af; text-transform: uppercase; font-weight: 700; margin-top: 30px; line-height: 1.6;">${message}</p>
          <div style="margin-top: 40px; pt: 20px; border-top: 1px solid #1f2937; color: #4b5563; font-size: 12px; font-weight: 900; text-transform: uppercase;">
            FOCUSFLOW.SYSTEMS | ZERO RADIUS ARCHITECTURE
          </div>
        </div>
      `,
        });

        if (error) {
            console.error("EMAIL ERROR:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (err: any) {
        console.error("SERVER ACTION ERROR:", err);
        return { success: false, error: err.message };
    }
}
