"use client"

import { motion } from "framer-motion";

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
        <section id="how-it-works" className="py-40 px-12 max-w-7xl mx-auto bg-transparent relative z-20 overflow-hidden mb-40">
            <div className="flex flex-col items-center gap-24 mb-32 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="space-y-12 w-full max-w-4xl flex flex-col items-center"
                >
                    <h2 className="text-7xl md:text-9xl font-black text-white leading-[1.05] uppercase tracking-tightest">THE <span className="text-blue-600 italic">PROCESS.</span></h2>
                    <div className="w-[80%] h-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-2xl shadow-blue-500/50" />
                    <p className="text-3xl text-zinc-300 font-black leading-relaxed max-w-2xl tracking-tight uppercase px-8">
                        Systematic deconstruction of workspace architecture. Timeline of flow. Consistent output.
                    </p>
                </motion.div>

                <div className="relative w-full mt-32">
                    {/* Central Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-600 via-purple-600 to-transparent opacity-30 hidden md:block" />

                    <div className="space-y-40 relative">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className={`flex flex-col md:flex-row items-center justify-center gap-20 group relative w-full ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >

                                {/* Node for the line */}
                                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600 border-4 border-black z-30 hidden md:block shadow-[0_0_15px_#2563eb]" />

                                {/* Card Container Target for left/right */}
                                <div className={`w-full md:w-[45%] flex ${i % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                                    <div className="p-16 bg-zinc-950/40 backdrop-blur-3xl border border-zinc-900 group-hover:border-blue-500/50 transition-all relative overflow-hidden flex flex-col min-h-[300px] w-full text-left shadow-2xl group-hover:bg-zinc-900/60">
                                        <div className="absolute top-0 right-0 p-8 text-blue-600 font-black text-8xl opacity-10 select-none tracking-tighter">{step.number}</div>
                                        <div className="relative z-10 space-y-6">
                                            <h3 className="text-4xl font-black text-white uppercase tracking-widest">{step.title}</h3>
                                            <div className="w-20 h-1 bg-blue-600 group-hover:w-full transition-all duration-700" />
                                            <p className="text-zinc-400 font-black text-xl leading-relaxed uppercase tracking-tighter">{step.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Empty space for the other side */}
                                <div className="hidden md:block w-[45%]" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
