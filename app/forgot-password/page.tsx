"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatedList } from "../components/AnimatedList";
import { cn } from "../../lib/utils";
import { sendAuthNotification } from "../actions/auth-emails";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

interface NotificationProps {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

const Notification = ({
  name,
  description,
  icon,
  color,
  time,
}: NotificationProps) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-lg p-4",
        "transition-all duration-300 ease-in-out hover:scale-[103%]",
        "bg-background border shadow-lg flex flex-row items-center gap-4"
      )}
    >
      <div
        className="flex size-10 items-center justify-center shrink-0 rounded-full font-bold text-sm text-white"
        style={{ backgroundColor: color }}
      >
        <span>{icon}</span>
      </div>
      <div className="flex flex-col overflow-hidden">
        <figcaption className="flex flex-row items-center text-sm font-medium text-foreground">
          <span>{name}</span>
          <span className="mx-2 text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{time}</span>
        </figcaption>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </figure>
  );
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Recovery Protocol Initiated For:", email);

    // For now, just send email notification
    await sendAuthNotification(email, "reset");

    setNotifications([
      {
        name: "Key Transmitted",
        description: "Recovery sequence sent to identity Uid.",
        time: "Success",
        icon: "📧",
        color: "#ef4444",
      },
    ]);
    alert("Transmit Success: Recovery link sent to your email!");
    setLoading(false);
    setTimeout(() => setNotifications([]), 5000);
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      {notifications.length > 0 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-[450px] z-[50]">
          <AnimatedList delay={100}>
            {notifications.map((n, i) => (
              <Notification key={i} {...n} />
            ))}
          </AnimatedList>
        </div>
      )}

      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
            <CardDescription>
              Enter your email address and we will send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleReset}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending link..." : "Send reset link"}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Remember your password?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Back to login
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}