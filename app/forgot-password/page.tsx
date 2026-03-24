"use client"

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ShineBorder from "../components/ShineBorder";
import { supabase } from "../../lib/supabase";
import { AnimatedList } from "../components/AnimatedList";
import { cn } from "../../lib/utils";

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

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login`,
        });

        if (error) {
            setNotifications([{ name: "Transmission Error", description: error.message, time: "FAILED", icon: "⚠️", color: "#ef4444" }]);
        } else {
            setNotifications([{ name: "Key Transmitted", description: "Recovery sequence sent to identity UID.", time: "SUCCESS", icon: "📧", color: "#ef4444" }]);
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
                <ShineBorder borderRadius={0} borderWidth={2} color={["#ef4444", "#dc2626", "#ef4444"]} duration={6} className="w-full max-w-2xl !bg-zinc-950/80 !backdrop-blur-3xl !border-zinc-900 shadow-2xl p-0">
                    <div className="p-24 space-y-16">
                        <h1 className="text-6xl font-black text-white uppercase tracking-tightest leading-[1.1]">RECOVER <br /><span className="text-red-600 uppercase">ACCESS.</span></h1>
                        <p className="text-xl text-zinc-400 font-bold uppercase tracking-tight max-w-sm">Enter your identity UID to transmit recovery link.</p>

                        <form onSubmit={handleReset} className="space-y-12">
                            <div className="space-y-6">
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-1">Identity UID</label>
                                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ACCESS@PROTO.NET" className="w-full bg-transparent border-b border-zinc-800 p-6 text-2xl font-black text-white focus:border-red-500 transition-all outline-none rounded-none placeholder:text-zinc-800" />
                            </div>

                            <div className="flex flex-col gap-6 pt-10">
                                <button type="submit" disabled={loading} className="w-full py-10 bg-red-600 text-white font-black text-3xl hover:bg-zinc-900 transition-all active:scale-95 shadow-2xl shadow-red-500/20 uppercase tracking-widest rounded-none disabled:opacity-50 border-none outline-none">
                                    {loading ? "TRANSMITTING..." : "TRANSMIT RECOVERY KEY"}
                                </button>
                                <div className="flex items-center justify-center text-xs font-black uppercase tracking-widest">
                                    <Link href="/login" className="text-zinc-600 hover:text-white transition-colors">RETURN TO LOGIN ACCESS</Link>
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
