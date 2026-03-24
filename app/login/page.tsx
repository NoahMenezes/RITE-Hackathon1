"use client"

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ShineBorder from "../components/ShineBorder";
import { createClient } from "../../lib/supabase/client";
import { AnimatedList } from "../components/AnimatedList";
import { cn } from "../../lib/utils";
import { sendAuthNotification } from "../actions/auth-emails";

const Notification = ({ name, description, icon, color, time }: any) => {
    return (
        <figure className={cn(
            "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden p-6",
            "transition-all duration-300 ease-in-out hover:scale-[103%]",
            "bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 shadow-2xl flex flex-row items-center gap-6"
        )}>
            <div className="flex size-12 items-center justify-center shrink-0 border border-zinc-700 font-black text-xl" style={{ backgroundColor: color }}>
                <span>{icon}</span>
            </div>
            <div className="flex flex-col overflow-hidden">
                <figcaption className="flex flex-row items-center text-lg font-black uppercase tracking-widest text-white">
                    <span>{name}</span>
                    <span className="mx-2 opacity-30">·</span>
                    <span className="text-xs text-zinc-500">{time}</span>
                </figcaption>
                <p className="text-sm font-bold text-zinc-400 uppercase tracking-tighter">{description}</p>
            </div>
        </figure>
    )
}

export default function LoginPage() {
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.log("IDENTIFYING ACCESS:", email);
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            console.error("ACCESS DENIED:", error.message);
            setNotifications([{ name: "Access Failed", description: error.message || "Incorrect keys provided.", time: "DENIED", icon: "🔒", color: "#ef4444" }]);
            alert("ACCESS DENIED: " + error.message);
        } else {
            console.log("ACCESS GRANTED");

            // Send secondary email via Resend
            await sendAuthNotification(email, "login");

            setNotifications([{ name: "Access Verified", description: "Identity confirmed.", time: "GRANTED", icon: "🗝️", color: "#3b82f6" }]);
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
                        {notifications.map((n, i) => <Notification key={i} {...n} />)}
                    </AnimatedList>
                </div>
            )}

            <main className="flex items-center justify-center pt-56 pb-40 px-12 relative z-10">
                <ShineBorder borderRadius={0} borderWidth={2} color={["#3b82f6", "#8b5cf6", "#3b82f6"]} duration={6} className="w-full max-w-2xl !bg-zinc-950/80 !backdrop-blur-3xl !border-zinc-900 shadow-2xl p-0">
                    <div className="p-24 space-y-16">
                        <h1 className="text-6xl font-black text-white uppercase tracking-tightest leading-[1.1]">ACCESS <br /><span className="text-blue-600">AUTHORIZED.</span></h1>
                        <p className="text-xl text-zinc-400 font-bold uppercase tracking-tight max-w-sm">Secure identity verification required.</p>

                        <form onSubmit={handleLogin} className="space-y-12">
                            <div className="space-y-6">
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-1">Identity UID</label>
                                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ACCESS@PROTO.NET" className="w-full bg-transparent border-b border-zinc-800 p-6 text-2xl font-black text-white focus:border-blue-500 transition-all outline-none rounded-none placeholder:text-zinc-800" />
                            </div>
                            <div className="space-y-6">
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-1">Secret Key</label>
                                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="ENTER SECRET" className="w-full bg-transparent border-b border-zinc-800 p-6 text-2xl font-black text-white focus:border-blue-500 transition-all outline-none rounded-none placeholder:text-zinc-800" />
                            </div>

                            <div className="flex flex-col gap-6 pt-10">
                                <button type="submit" disabled={loading} className="w-full py-10 bg-blue-600 text-white font-black text-3xl hover:bg-indigo-700 transition-all active:scale-95 shadow-2xl shadow-blue-500/20 uppercase tracking-widest rounded-none disabled:opacity-50">
                                    {loading ? "AUTHORIZING..." : "SIGN IN ACCESS"}
                                </button>
                                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                                    <Link href="/signup" className="text-zinc-600 hover:text-white transition-colors">NEW ACCOUNT ACCESS</Link>
                                    <Link href="/forgot-password" id="forgot-password" className="text-blue-600 hover:text-white transition-colors">FORGOT SECRET KEY?</Link>
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
