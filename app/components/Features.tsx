import ShineBorder from "./ShineBorder";

export default function Features() {
    const features = [
        {
            title: "Task Orchestration",
            description: "Smart prioritization and automation for every workflow. Our protocol analyzes your work habits and organizes your task list to minimize cognitive friction."
        },
        {
            title: "Visual Flow",
            description: "A beautiful, minimalist interface that feels like magic. No distractions, no clutter, and no unnecessary UI elements to derail your thoughts."
        },
        {
            title: "Real-time Sync",
            description: "Everything you need, everywhere you are. Instant updates across all devices with zero-latency global mesh networking for the modern nomadic professional."
        },
        {
            title: "Neural Search",
            description: "Find exactly what you're looking for with our AI-powered semantic search engine. Searches your mental maps, projects, and documents in milliseconds."
        },
        {
            title: "Zero Distractions",
            description: "Deep work mode that silences the noise and keeps you centered. Features an adaptive notification suppressor that knows when you're in a high-flow state."
        },
        {
            title: "Power Analytics",
            description: "Insightful data visualizations to track your journey toward perfection. Understand your peak productivity hours and optimize your schedule."
        }
    ];

    return (
        <section id="features" className="py-24 px-12 max-w-7xl mx-auto bg-transparent relative z-10 border-l border-r border-zinc-900/10">
            <div className="text-center mb-16 space-y-8">
                <h2 className="text-3xl md:text-5xl font-black text-white leading-none mb-10">The <span className="text-white opacity-40">Capacities.</span></h2>
                <div className="w-56 h-1 bg-white mx-auto shadow-2xl shadow-blue-500/50" />
                <p className="max-w-2xl mx-auto text-zinc-400 text-base font-bold">Engineered for those who refuse to settle for mediocre productivity tools.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
                {features.map((feature, i) => (
                    <ShineBorder key={i} borderRadius={0} borderWidth={1} color={["#3b82f6", "#8b5cf6", "#3b82f6"]} duration={6} className="w-full !p-0 !bg-zinc-950/40 !backdrop-blur-3xl !border-zinc-900 group transition-all hover:!bg-zinc-900/60 min-h-[500px]">
                        <div className="p-20 h-full flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 text-zinc-900 font-extrabold text-3xl group-hover:text-blue-500/20 transition-all select-none opacity-40">M0{i + 1}</div>
                            <div className="space-y-12">
                                <h3 className="text-xl md:text-2xl font-black text-white leading-tight group-hover:text-blue-500 transition-colors border-l-8 border-blue-600 pl-10 underline decoration-blue-600 underline-offset-8 decoration-4">{feature.title}</h3>
                                <p className="text-zinc-400 font-bold text-sm md:text-base leading-relaxed group-hover:text-zinc-100 transition-colors max-w-2xl">{feature.description}</p>
                            </div>
                        </div>
                    </ShineBorder>
                ))}
            </div>
        </section>
    );
}
