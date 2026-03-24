"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../lib/useUser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ShineBorder from "../components/ShineBorder";
import { cn } from "../../lib/utils";
import { AnimatedList } from "../components/AnimatedList";

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

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [updating, setUpdating] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  React.useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center font-black text-base">
        Initializing Protocol...
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setNotifications([
          {
            name: "Update Failed",
            description: data.error || "Failed to modify identity records.",
            time: "Error",
            icon: "❌",
            color: "#ef4444",
          },
        ]);
      } else {
        setNotifications([
          {
            name: "Records Updated",
            description:
              "Your identity details have been successfully modified.",
            time: "Success",
            icon: "✔️",
            color: "#10b981",
          },
        ]);
        setPassword(""); // clear password field
      }
    } catch (err: any) {
      setNotifications([
        {
          name: "Update Failed",
          description: err.message || "Failed to modify identity records.",
          time: "Error",
          icon: "❌",
          color: "#ef4444",
        },
      ]);
    }
    setUpdating(false);
    setTimeout(() => setNotifications([]), 5000);
  };

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-purple-500/40">
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
          color={["#a855f7", "#3b82f6", "#a855f7"]}
          duration={6}
          className="w-full max-w-2xl !bg-zinc-950/80 !backdrop-blur-3xl !border-zinc-900 shadow-2xl p-0"
        >
          <div className="p-24 space-y-16">
            <h1 className="text-3xl font-black text-white leading-[1.1]">
              Identity <br />
              <span className="text-purple-600">Configuration.</span>
            </h1>
            <p className="text-sm text-zinc-400 font-bold max-w-sm">
              Modify your established protocol credentials.
            </p>

            <form onSubmit={handleUpdateProfile} className="space-y-12">
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
                  className="w-full bg-transparent border-b border-zinc-800 p-6 text-base font-black text-white focus:border-purple-500 transition-all outline-none rounded-none placeholder:text-zinc-800"
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
                  className="w-full bg-transparent border-b border-zinc-800 p-6 text-base font-black text-white focus:border-purple-500 transition-all outline-none rounded-none placeholder:text-zinc-800"
                />
              </div>
              <div className="space-y-6">
                <label className="text-xs font-black text-zinc-600 pl-1">
                  New Secret Key (Leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Secure Key"
                  className="w-full bg-transparent border-b border-zinc-800 p-6 text-base font-black text-white focus:border-purple-500 transition-all outline-none rounded-none placeholder:text-zinc-800"
                />
              </div>

              <div className="flex flex-col gap-6 pt-10">
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-10 bg-purple-600 text-white font-black text-lg hover:bg-purple-700 transition-all active:scale-95 shadow-2xl shadow-purple-500/20 rounded-none disabled:opacity-50"
                >
                  {updating ? "Committing Updates..." : "Save Configuration"}
                </button>
              </div>
            </form>
          </div>
        </ShineBorder>
      </main>
      <Footer />
    </div>
  );
}
