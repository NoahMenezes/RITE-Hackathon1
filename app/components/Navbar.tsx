"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();

        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-7xl px-12 md:px-16 py-6 backdrop-blur-3xl bg-black/60 border border-zinc-800/80 shadow-2xl transition-all hover:bg-black/90 group flex items-center justify-between">
            <Link href="/" className="text-2xl font-black tracking-tightest text-white uppercase flex items-center gap-4 hover:opacity-80 transition-opacity">
                <div className="w-6 h-6 bg-blue-600 group-hover:bg-purple-600 transition-all duration-700" />
                FocusFlow
            </Link>

            <div className="flex items-center gap-10 text-xs font-black uppercase tracking-widest">
                <Link href="/" className="text-zinc-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1">Home</Link>
                <Link href="/team" className="text-zinc-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1">Team</Link>
                {user ? (
                    <>
                        <Link href="/dashboard" className="text-blue-500 hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1 font-bold">Dashboard</Link>
                        <button onClick={handleSignOut} className="px-8 py-3 rounded-none bg-red-600/10 text-red-500 font-black hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-2xl uppercase border border-red-500/50">Log Out</button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="text-zinc-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1">Login</Link>
                        <Link href="/signup" className="px-8 py-3 rounded-none bg-blue-600 text-white font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-2xl shadow-blue-500/20">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
