export default function FAQ() {
    const faqs = [
        {
            q: "How does FocusFlow differ from traditional task managers?",
            a: "Unlike traditional tools that add to the noise, FocusFlow is built around the concept of 'Deep Work.' It uses adaptive neural logic to highlight only what's absolutely necessary, reducing cognitive load and helping you maintain flow for longer periods."
        },
        {
            q: "Is my data truly private and secure?",
            a: "Absolutely. We employ enterprise-grade end-to-end encryption. Your thoughts, tasks, and data are yours alone. We don't have access to them, and neither does any third party."
        },
        {
            q: "Can I integrate my existing toolchain with FocusFlow?",
            a: "Yes. FocusFlow supports native integrations with Notion, Slack, Jira, GitHub, and over 100 other platforms. You can unify your entire ecosystem within our minimalist interface."
        },
        {
            q: "Does it work offline or is it cloud-dependent?",
            a: "FocusFlow is designed for local-first performance. You can work entirely offline, and your changes will sync instantly once you reconnect to the network."
        },
        {
            q: "What is your pricing structure for advanced users?",
            a: "We offer a generous free tier for individuals. For professionals who require advanced orchestration and unlimited seat counts, we have a $19/mo 'Pro' plan with specialized modules."
        },
        {
            q: "Is there an AI-powered assistant involved?",
            a: "Yes, focused AI assists in summarizing tasks, predicting deadlines, and organizing your mental maps, ensuring nothing slips through the cracks."
        }
    ];

    return (
        <section id="faq" className="py-32 px-12 max-w-7xl mx-auto bg-black/40 backdrop-blur-md border-t border-zinc-800 border-b relative z-10">
            <div className="text-center mb-24">
                <h2 className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">Inquiry Hub</h2>
                <div className="w-40 h-2 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto" />
                <p className="max-w-xl mx-auto text-zinc-400 text-xl font-medium mt-8 leading-relaxed">Everything you need to know about the future of work.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-zinc-800">
                {faqs.map((f, i) => (
                    <div key={i} className="p-10 bg-zinc-950/80 border border-zinc-900 group transition-all hover:bg-zinc-900/90 hover:border-blue-500/50 flex flex-col justify-between h-full">
                        <div>
                            <h3 className="text-2xl font-black text-white mb-6 leading-tight group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                                {f.q}
                            </h3>
                            <p className="text-zinc-400 font-medium text-lg leading-relaxed">{f.a}</p>
                        </div>
                        <div className="mt-8 pt-8 border-t border-zinc-800 text-sm text-zinc-600 font-bold uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                            Technical Detail 0{i + 1}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
