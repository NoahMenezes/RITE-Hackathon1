"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../lib/useUser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ShineBorder from "../components/ShineBorder";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center font-black text-base">
        Initializing Secure Protocol...
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/40">
      <Navbar />

      <main className="flex flex-col items-center justify-center pt-56 pb-40 px-12 relative z-10 w-full min-h-screen">
        <div className="text-center mb-24 max-w-4xl w-full">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.1]">
            Main <br />
            <span className="text-blue-600">Dashboard.</span>
          </h1>
          <div className="w-64 h-2 bg-white mx-auto my-12 shadow-2xl shadow-blue-500/50" />
          <p className="text-sm text-zinc-400 font-bold">
            Access Granted. Identity: {user.name || user.email}
          </p>
        </div>

        <ShineBorder
          borderRadius={0}
          borderWidth={2}
          color={["#10b981", "#3b82f6", "#10b981"]}
          duration={10}
          className="w-full max-w-4xl !bg-zinc-950/80 !backdrop-blur-3xl !border-zinc-900 shadow-2xl p-0"
        >
          <div className="p-24 space-y-12">
            <h2 className="text-lg font-black text-white border-l-8 border-blue-600 pl-8">
              Active Modules
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                className="p-10 border border-zinc-800 bg-zinc-900/50 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                onClick={() => router.push("/dashboard/chat")}
              >
                <h3 className="text-sm font-black text-white mb-4 tracking-wider">
                  Neural Link
                </h3>
                <p className="text-zinc-400 text-sm font-bold">
                  Status: Online / Optimal
                </p>
              </div>
              <div className="p-10 border border-zinc-800 bg-zinc-900/50">
                <h3 className="text-sm font-black text-white mb-4 tracking-wider">
                  Data Vault
                </h3>
                <p className="text-zinc-400 text-sm font-bold">
                  Status: Encrypted / Secure
                </p>
              </div>
            </div>
            <button
              className="mt-8 w-full p-6 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-xl transition-all shadow-lg shadow-blue-500/20"
              onClick={() => router.push("/dashboard/chat")}
            >
              Launch FocusFlow Chat
            </button>
          </div>
        </ShineBorder>
      </main>

      <Footer />
    </div>
  );
}
