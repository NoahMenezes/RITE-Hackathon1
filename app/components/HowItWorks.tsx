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
                <div className="space-y-12 animate-fade-in w-full max-w-4xl flex flex-col items-center">
                    <h2 className="text-7xl md:text-9xl font-black text-white leading-[1.05] uppercase tracking-tightest">THE <span className="text-blue-600 italic">PROCESS.</span></h2>
                    <div className="w-[80%] h-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-2xl shadow-blue-500/50" />
                    <p className="text-3xl text-zinc-300 font-black leading-relaxed max-w-2xl tracking-tight uppercase px-8">
                        Systematic deconstruction of workspace architecture. Top-down orchestration. Minimal resistance. Consistent output.
                    </p>
                    <div className="flex items-center gap-10 text-blue-500 font-extrabold text-2xl hover:translate-x-4 transition-transform cursor-pointer uppercase tracking-widest border-b-4 border-blue-600 pb-4 shadow-2xl">
                        ACCESS PROTOCOL MANUAL
                    </div>
                </div>

                <div className="w-full flex flex-col gap-10 mt-12">
                    {steps.map((step, i) => (
                        <div key={i} className="group p-20 bg-zinc-950/70 backdrop-blur-3xl border border-zinc-900 transition-all hover:bg-zinc-900/90 relative overflow-hidden flex flex-col md:flex-row items-center gap-20 group min-h-[400px]">
                            <div className="absolute top-0 right-0 p-8 text-zinc-900 font-black text-8xl opacity-10 group-hover:opacity-40 transition-opacity select-none tracking-tighter">{step.number}</div>
                            <div className="text-8xl md:text-[10rem] font-black text-blue-600 opacity-20 group-hover:opacity-60 transition-all uppercase tracking-tighter select-none mb-10 md:mb-0">{step.number}</div>
                            <div className="flex-1 text-center md:text-left z-10 space-y-8">
                                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest group-hover:text-blue-500 transition-colors">{step.title}</h3>
                                <div className="w-40 h-2 bg-blue-600 mb-10 group-hover:w-full transition-all duration-700" />
                                <p className="text-zinc-400 font-black text-xl md:text-2xl leading-relaxed group-hover:text-zinc-100 transition-all uppercase tracking-tight">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
