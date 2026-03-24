"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatedList } from "../components/AnimatedList";
import { cn } from "../../lib/utils";
import { sendAuthNotification } from "../actions/auth-emails";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";

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
        "bg-background border shadow-lg flex flex-row items-center gap-4",
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Identifying Access:", email);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      console.error("ACCESS DENIED:", data.error);

      let descriptiveMsg = data.error;
      if (data.error === "Invalid credentials") {
        descriptiveMsg = "Incorrect keys provided.";
      }

      setNotifications([
        {
          name: "Access Failed",
          description: descriptiveMsg || "Incorrect keys provided.",
          time: "DENIED",
          icon: "🔒",
          color: "#ef4444",
        },
      ]);

      alert("ACCESS DENIED: " + descriptiveMsg);
    } else {
      console.log("Access Granted");

      // Send secondary email via Resend
      await sendAuthNotification(email, "login");

      setNotifications([
        {
          name: "Access Verified",
          description: "Identity confirmed.",
          time: "Granted",
          icon: "🗝️",
          color: "#3b82f6",
        },
      ]);
      window.location.href = "/dashboard";
    }
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
            <CardTitle className="text-2xl">Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
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
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="underline underline-offset-4">
                    Sign up
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