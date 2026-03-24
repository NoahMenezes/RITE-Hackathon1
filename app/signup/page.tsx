"use client";
import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ShineBorder from "../components/ShineBorder";
import { AnimatedList } from "../components/AnimatedList";
import { cn } from "../../lib/utils";
import { sendAuthNotification } from "../actions/auth-emails";

const Notification = ({ name, description, icon, color, time }: any) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden p-6",
        "transition-all duration-300 ease-in-out hover:scale-[103%]",
        "bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 shadow-2xl flex flex-row items-center gap-6",
      )}
    >
      <div
        className="flex size-12 items-center justify-center shrink-0 border border-zinc-700 font-black text-sm"
        style={{ backgroundColor: color }}
      >
        <span>{icon}</span>
      </div>
      <div className="flex flex-col overflow-hidden">
        <figcaption className="flex flex-row items-center text-sm font-black text-white">
          <span>{name}</span>
          <span className="mx-2 opacity-30">·</span>
          <span className="text-xs text-zinc-500">{time}</span>
        </figcaption>
        <p className="text-sm font-bold text-zinc-400">{description}</p>
      </div>
    </figure>
  );
};

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Initializing Signup Protocol:", email);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name: fullName }),
    });
    const data = await res.json();

    if (!res.ok) {
      console.error("Signup Denied:", data.error);
      setNotifications([
        {
          name: "Access Denied",
          description: data.error || "Identity establishment failed.",
          time: "Error",
          icon: "❌",
          color: "#ef4444",
        },
      ]);
      alert("Signup Denied: " + data.error);
    } else {
      console.log("Identity Established. Check Encrypted Uid For Access.");

      // Send secondary email via Resend
      await sendAuthNotification(email, "signup");

      setNotifications([
        {
          name: "Access Granted",
          description: "Check your email for access protocol.",
          time: "Success",
          icon: "✔️",
          color: "#10b981",
        },
      ]);
      alert(
        "Identity Established: Welcome to FocusFlow! We've sent you two emails—one to verify your account and another confirmed your identity has been established.",
      );
      window.location.href = "/dashboard";
    }
    setLoading(false);
    setTimeout(() => setNotifications([]), 5000);
  };

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/40">
      <Navbar />

      {notifications.length > 0 && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 w-full max-w-[450px] z-[200]">
          <AnimatedList delay={100}>
            {notifications.map((n, i) => (
              <Notification key={i} {...n} />
            ))}
          </AnimatedList>
        </div>
      )}

      <main className="flex items-center justify-center pt-56 pb-40 px-12 relative z-10">
        <ShineBorder
          borderRadius={0}
          borderWidth={2}
          color={["#ef4444", "#f59e0b", "#ef4444"]}
          duration={8}
          className="w-full max-w-2xl !bg-zinc-950/80 !backdrop-blur-3xl !border-zinc-900 shadow-2xl p-0"
        >
          <div className="p-24 space-y-16">
            <h1 className="text-3xl font-black text-white leading-[1.1]">
              Join The <br />
              <span className="text-red-600">Protocol.</span>
            </h1>
            <p className="text-sm text-zinc-400 font-bold max-w-sm">
              Establish your identity within the FocusFlow ecosystem.
            </p>

            <form onSubmit={handleSignup} className="space-y-12">
              <div className="space-y-6">
                <label className="text-xs font-black text-zinc-600 pl-1">
                  Full Identity Alias
                </label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter Name"
                  className="w-full bg-transparent border-b border-zinc-800 p-6 text-base font-black text-white focus:border-red-500 transition-all outline-none rounded-none placeholder:text-zinc-800"
                />
              </div>
              <div className="space-y-6">
                <label className="text-xs font-black text-zinc-600 pl-1">
                  Communication Uid
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Access@Proto.Net"
                  className="w-full bg-transparent border-b border-zinc-800 p-6 text-base font-black text-white focus:border-red-500 transition-all outline-none rounded-none placeholder:text-zinc-800"
                />
              </div>
              <div className="space-y-6">
                <label className="text-xs font-black text-zinc-600 pl-1">
                  Secret Key
                </label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Secure Key"
                  className="w-full bg-transparent border-b border-zinc-800 p-6 text-base font-black text-white focus:border-red-500 transition-all outline-none rounded-none placeholder:text-zinc-800"
                />
              </div>
              <div className="flex flex-col gap-6 pt-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-10 bg-red-600 text-white font-black text-lg hover:bg-orange-700 transition-all active:scale-95 shadow-2xl shadow-red-500/20 rounded-none border-none disabled:opacity-50"
                >
                  {loading ? "Initializing..." : "Establish Identity"}
                </button>
                <Link
                  href="/login"
                  className="text-center text-xs text-red-600 hover:text-white transition-colors font-black"
                >
                  Already Have Access? Sign In
                </Link>
              </div>
            </form>
          </div>
        </ShineBorder>
      </main>
      <Footer />
    </div>
  );
}
