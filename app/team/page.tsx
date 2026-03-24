"use client"

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { cn } from "../../lib/utils";
import { AnimatedList } from "../components/AnimatedList";

const team = [
    { name: "Elias Vance", role: "Founding Engineer", bio: "Former Principal Architect at Google and OpenAI, Elias handles the core neural logic architecture and distributed execution protocols.", img: "EV" },
    { name: "Julian Thorne", role: "Experience Lead", bio: "Specializes in cognitive-first interfaces and minimalist visual design for maximum focus. Julian ensures the interface feels like an organic extension of the mind.", img: "JT" },
    { name: "Sarah Quin", role: "Infrastructural Architect", bio: "Manages the global distributed mesh networks that power FocusFlow's zero-latency sync across 50+ data centers globally.", img: "SQ" },
    { name: "Mark Russo", role: "Security Protocol Lead", bio: "Expert in end-to-end homomorphic encryption and privacy-preserving data management systems.", img: "MR" }
];

const Notification = ({ name, description, icon, color, time }: any) => {
    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden p-6",
                "transition-all duration-300 ease-in-out hover:scale-[103%]",
                "bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 shadow-2xl",
                "flex flex-row items-center gap-6"
            )}
        >
            <div
                className="flex size-12 items-center justify-center shrink-0 border border-zinc-700 font-black text-xl"
                style={{ backgroundColor: color }}
            >
                <span>{icon}</span>
            </div>
            <div className="flex flex-col overflow-hidden">
                <figcaption className="flex flex-row items-center text-lg font-black uppercase tracking-widest text-white">
                    <span>{name}</span>
                    <span className="mx-2 opacity-30">·</span>
                    <span className="text-xs text-zinc-500">{time}</span>
                </figcaption>
                <p className="text-sm font-bold text-zinc-400 uppercase tracking-tighter">
                    {description}
                </p>
            </div>
        </figure>
    )
}

export default function TeamPage() {
    const [showNotification, setShowNotification] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newNotif = {
            name: "Transmission Success",
            description: "Data pocket received at central hub",
            time: "INSTANT",
            icon: "⚡",
            color: "#00C9A7",
        };
        setNotifications([newNotif]);
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
            setNotifications([]);
        }, 5000);
    };

    return (
        <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/40">
            <Navbar />

            {/* Top Notification Area */}
            {showNotification && (
                <div className="fixed top-32 left-1/2 -translate-x-1/2 w-full max-w-[450px] z-[200]">
                    <AnimatedList delay={100}>
                        {notifications.map((n, i) => (
                            <Notification key={i} {...n} />
                        ))}
                    </AnimatedList>
                </div>
            )}

            <main className="pt-56 pb-40 px-12 max-w-7xl mx-auto space-y-40 relative z-10">
                <section className="text-center mb-32 space-y-10">
                    <h1 className="text-7xl md:text-9xl font-black text-white leading-[1.1] uppercase tracking-tightest mb-10">The<span className="text-blue-600 ml-6 uppercase">TEAM</span></h1>
                    <div className="w-80 h-3 bg-white mx-auto shadow-2xl shadow-blue-500/50" />
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-zinc-800">
                    {team.map((member, i) => (
                        <div key={i} className="p-16 bg-zinc-950/60 backdrop-blur-3xl border border-zinc-900 group transition-all hover:bg-zinc-900/80 flex flex-col justify-between aspect-square relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 text-zinc-900 font-black text-6xl opacity-10 group-hover:opacity-30 transition-opacity uppercase tracking-widest pointer-events-none select-none">P0{i + 1}</div>
                            <div>
                                <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-3xl text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:scale-105 duration-500">{member.img}</div>
                                <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter group-hover:text-blue-500 transition-colors">{member.name}</h2>
                                <div className="text-xs text-zinc-500 uppercase tracking-widest font-black mb-10 italic border-l-2 border-blue-600 pl-4">{member.role}</div>
                                <p className="text-zinc-400 font-medium text-lg leading-relaxed group-hover:text-zinc-100 transition-colors uppercase tracking-tight">{member.bio}</p>
                            </div>
                            <div className="mt-12 h-1 w-full bg-blue-600 opacity-20 group-hover:opacity-100 transition-all duration-700" />
                        </div>
                    ))}
                </section>

                <section id="contact" className="w-full max-w-4xl mx-auto bg-zinc-950/60 backdrop-blur-3xl border border-zinc-800 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] pointer-events-none" />
                    <div className="p-24 space-y-16">
                        <h2 className="text-6xl font-black text-white uppercase tracking-tightest text-center italic">CONTACT <span className="text-blue-600">HUB.</span></h2>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-1">Full Identity</label>
                                <input required type="text" placeholder="ENTER NAME" className="w-full bg-transparent border-b border-zinc-800 p-6 text-xl font-black text-white focus:border-blue-500 transition-all outline-none rounded-none placeholder:text-zinc-900" />
                            </div>
                            <div className="space-y-6">
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-1">Communication Channel</label>
                                <input required type="email" placeholder="ACCESS@PROTO.NET" className="w-full bg-transparent border-b border-zinc-800 p-6 text-xl font-black text-white focus:border-blue-500 transition-all outline-none rounded-none placeholder:text-zinc-900" />
                            </div>
                            <div className="space-y-6">
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-1">Transmission Subject</label>
                                <input required type="text" placeholder="SUBJECT LEVEL 01" className="w-full bg-transparent border-b border-zinc-800 p-6 text-xl font-black text-white focus:border-blue-500 transition-all outline-none rounded-none placeholder:text-zinc-900" />
                            </div>
                            <div className="space-y-6">
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-1">Access Location (Country/Region)</label>
                                <input required type="text" placeholder="GLOBAL SECTOR" className="w-full bg-transparent border-b border-zinc-800 p-6 text-xl font-black text-white focus:border-blue-500 transition-all outline-none rounded-none placeholder:text-zinc-900" />
                            </div>
                            <div className="space-y-6 md:col-span-2">
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-1">Detailed Inquiry Segment</label>
                                <textarea required placeholder="BEGIN TRANSMISSION..." rows={4} className="w-full bg-transparent border-b border-zinc-800 p-6 text-xl font-black text-white focus:border-blue-500 transition-all outline-none rounded-none placeholder:text-zinc-900 resize-none"></textarea>
                            </div>
                            <button type="submit" className="md:col-span-2 w-full py-10 bg-blue-600 text-white font-black text-3xl hover:bg-indigo-700 transition-all active:scale-95 shadow-2xl shadow-blue-500/20 uppercase tracking-widest rounded-none border-none outline-none">TRANSMIT PACKET</button>
                        </form>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
