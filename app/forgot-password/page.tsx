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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

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
          color={["#ef4444", "#dc2626", "#ef4444"]}
          duration={6}
          className="w-full max-w-2xl !bg-zinc-950/80 !backdrop-blur-3xl !border-zinc-900 shadow-2xl p-0"
        >
          <div className="p-24 space-y-16">
            <h1 className="text-3xl font-black text-white leading-[1.1]">
              Recover <br />
              <span className="text-red-600">Access.</span>
            </h1>
            <p className="text-sm text-zinc-400 font-bold max-w-sm">
              Enter your identity Uid to transmit recovery link.
            </p>

            <form onSubmit={handleReset} className="space-y-12">
              <div className="space-y-6">
                <label className="text-xs font-black text-zinc-600 pl-1">
                  Identity Uid
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

              <div className="flex flex-col gap-6 pt-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-10 bg-red-600 text-white font-black text-lg hover:bg-zinc-900 transition-all active:scale-95 shadow-2xl shadow-red-500/20 rounded-none disabled:opacity-50 border-none outline-none"
                >
                  {loading ? "Transmitting..." : "Transmit Recovery Key"}
                </button>
                <div className="flex items-center justify-center text-xs font-black">
                  <Link
                    href="/login"
                    className="text-zinc-600 hover:text-white transition-colors"
                  >
                    Return To Login Access
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </ShineBorder>
      </main>
      <Footer />
    </div>
  );
}
