export default function Features() {
    const features = [
        {
            title: "Task Orchestration",
            description: "Smart prioritization and automation for every workflow."
        },
        {
            title: "Visual Flow",
            description: "A beautiful, minimalist interface that feels like magic."
        },
        {
            title: "Real-time Sync",
            description: "Everything you need, everywhere you are. Instant updates across all devices."
        },
        {
            title: "Neural Search",
            description: "Find exactly what you're looking for with our AI-powered semantic search engine."
        },
        {
            title: "Zero Distractions",
            description: "Deep work mode that silences the noise and keeps you centered."
        },
        {
            title: "Power Analytics",
            description: "Insightful data visualizations to track your journey toward perfection."
        }
    ];

    return (
        <section id="features" className="py-24 px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">Core Capabilities</h2>
                <p className="max-w-xl mx-auto text-zinc-400 text-lg">Designed for those who value every second and refuse to settle for mediocre productivity.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, i) => (
                    <div key={i} className="group p-8 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-800/80 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-purple-500/20 transition-all" />
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
