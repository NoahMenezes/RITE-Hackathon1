"use client"

import { motion } from "framer-motion";
import ShineBorder from "./ShineBorder";

export default function HowItWorks() {
    const steps = [
        {
            title: "Mental Map Sync",
            description: "FocusFlow automatically syncs with your natural working patterns, creating an adaptive mental map that highlights your most important goals for the day. Our protocol learns your peak performance hours and organizes your deep work blocks accordingly.",
            number: "01"
        },
        {
            title: "Deep Work Protocol",
            description: "When you start a session, FocusFlow eliminates all distractions and provides a refined interface that keeps your mind centered on the goal. Our adaptive suppression engine silences non-essential notifications while highlighting critical data streams.",
            number: "02"
        },
        {
            title: "Task Orchestration",
            description: "Smart automation handles all small details—emails, calendar events, and project updates—allowing you to focus entirely on creative output. Orchestration happens in the background, synchronizing with your team's global mesh network effortlessly.",
            number: "03"
        },
        {
            title: "Cognitive Insights",
            description: "FocusFlow provides a post-session breakdown of your productivity, offering insights on how to further optimize your workflow for peak efficiency. We analyze session length, goal completion rates, and focus depth to fine-tune your future sessions.",
            number: "04"
        }
    ];

    return (
        <section id="how-it-works" className="py-60 px-12 max-w-7xl mx-auto bg-transparent relative z-20 overflow-hidden mb-80 border-l border-r border-zinc-900/10">
            <div className="flex flex-col items-center gap-24 mb-32 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="space-y-12 w-full max-w-4xl flex flex-col items-center"
                >
                    <h2 className="text-7xl md:text-9xl font-black text-white leading-[1.05] uppercase tracking-tightest drop-shadow-2xl">THE <span className="text-white">PROCESS.</span></h2>
                    <div className="w-[80%] h-1 bg-white shadow-2xl shadow-blue-500/50" />
                    <p className="text-3xl text-zinc-300 font-bold leading-relaxed max-w-2xl tracking-tight uppercase px-8 opacity-80">
                        Systematic deconstruction of workspace architecture. Timeline of flow. Consistent output.
                    </p>
                </motion.div>

                <div className="relative w-full mt-60">
                    {/* Central Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-600 via-white to-transparent opacity-20 hidden md:block" />

                    {/* Vertical spacing increased within the cards area */}
                    <div className="space-y-80 relative">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1.2, delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className={`flex flex-col md:flex-row items-center justify-center gap-32 group relative w-full ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >

                                {/* Node for the line */}
                                <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-black z-30 hidden md:block shadow-[0_0_20px_white]" />

                                {/* Card Container Target for left/right */}
                                <div className={`w-full md:w-[48%] flex ${i % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                                    <ShineBorder borderRadius={0} borderWidth={1} color={["#ffffff", "#3b82f6", "#ffffff"]} duration={14} className="w-full !p-0 !bg-zinc-950/20 !backdrop-blur-3xl !border-zinc-900 group-hover:bg-zinc-900/40 min-h-[400px]">
                                        <div className="p-20 md:p-24 h-full relative overflow-hidden flex flex-col text-left shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]">
                                            <div className="absolute top-0 right-0 p-12 text-white font-black text-9xl opacity-5 select-none tracking-widest">{step.number}</div>
                                            <div className="relative z-10 space-y-10 group-hover:translate-x-4 transition-transform duration-700">
                                                <h3 className="text-5xl font-black text-white uppercase tracking-widest leading-none drop-shadow-lg">{step.title}</h3>
                                                <div className="w-40 h-1 bg-white group-hover:w-full transition-all duration-1000" />
                                                <p className="text-zinc-400 font-bold text-xl md:text-2xl leading-relaxed uppercase tracking-tighter max-w-lg mb-12">{step.description}</p>
                                            </div>
                                        </div>
                                    </ShineBorder>
                                </div>

                                {/* Empty space for the other side */}
                                <div className="hidden md:block w-[48%]" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
