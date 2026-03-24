"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { useUser } from "../../lib/useUser";

export default function Navbar() {
  const router = useRouter();
  const { user } = useUser();

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-7xl px-12 md:px-16 py-6 backdrop-blur-3xl bg-black/60 border border-zinc-800/80 shadow-2xl transition-all hover:bg-black/90 group flex items-center justify-between">
      <Link
        href="/"
        className="text-base font-black text-white flex items-center gap-4 hover:opacity-80 transition-opacity"
      >
        <div className="w-6 h-6 bg-blue-600 group-hover:bg-purple-600 transition-all duration-700" />
        FocusFlow
      </Link>

      <div className="flex items-center gap-10 text-xs font-black">
        {user ? (
          <>
            <Link
              href="/dashboard"
              className="text-zinc-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1 mr-4 hidden md:inline"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/chat"
              className="text-zinc-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1 mr-4 hidden md:inline"
            >
              Assistant
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-6 py-3 rounded-none bg-blue-600 text-white font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-2xl shadow-blue-500/20"
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                {user.name || "Profile"}
              </span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-6 py-3 rounded-none bg-red-600/10 border border-red-600/50 text-red-500 font-black hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-2xl"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              href="/"
              className="text-zinc-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="text-zinc-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-8 py-3 rounded-none bg-blue-600 text-white font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-2xl shadow-blue-500/20"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
