export default function FAQ() {
    const faqs = [
        {
            question: "HOW DOES FOCUSFLOW DIFFER FROM TRADITIONAL TASK MANAGERS?",
            answer: "Unlike traditional tools that add to the noise, FocusFlow is built around the concept of 'Deep Work.' It uses adaptive neural logic to highlight only what's absolutely necessary, reducing cognitive load and helping you maintain flow for longer periods."
        },
        {
            question: "IS MY DATA TRULY PRIVATE AND SECURE?",
            answer: "Absolutely. We employ enterprise-grade end-to-end encryption. Your thoughts, tasks, and data are yours alone. We don't have access to them, and neither does any third party. Your privacy is our protocol's foundation."
        },
        {
            question: "CAN I INTEGRATE MY EXISTING TOOLCHAIN WITH FOCUSFLOW?",
            answer: "Yes. FocusFlow supports native integrations with Notion, Slack, Jira, GitHub, and over 100 other platforms. You can unify your entire ecosystem within our minimalist interface effortlessly."
        },
        {
            question: "DOES IT WORK OFFLINE OR IS IT CLOUD-DEPENDENT?",
            answer: "FocusFlow is designed for local-first performance. You can work entirely offline, and your changes will sync instantly once you reconnect to the network. No downtime, no lag, just flow."
        },
        {
            question: "WHAT IS YOUR PRICING STRUCTURE FOR ADVANCED USERS?",
            answer: "We offer a generous free tier for individuals. For professionals who require advanced orchestration and unlimited seat counts, we have a $19/mo 'Pro' plan with specialized modules."
        },
        {
            question: "IS THERE AN AI-POWERED ASSISTANT INVOLVED?",
            answer: "Yes, focused AI assists in summarizing tasks, predicting deadlines, and organizing your mental maps, ensuring nothing slips through the cracks while you stay in deep work mode."
        }
    ];

    return (
        <section id="faq" className="py-60 px-12 max-w-7xl mx-auto bg-transparent relative z-20 mb-80">
            <div className="text-center mb-40">
                <h2 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tightest mb-10 italic">INQUIRY <span className="text-white opacity-40">HUB.</span></h2>
                <div className="w-80 h-2 bg-white mx-auto shadow-2xl" />
                <p className="mt-12 text-zinc-500 font-black uppercase tracking-widest text-2xl">CLARITY THROUGH INTERROGATION.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-24">
                {faqs.map((faq, i) => (
                    <div key={i} className="group p-20 bg-zinc-950/30 backdrop-blur-3xl border border-zinc-900 shadow-2xl transition-all hover:bg-zinc-900/60 relative overflow-hidden flex flex-col justify-start min-h-[450px]">
                        <div className="absolute top-0 right-0 p-8 text-white font-black text-6xl opacity-5 group-hover:opacity-10 transition-opacity select-none tracking-tighter uppercase whitespace-nowrap">Q0{i + 1}</div>
                        <div className="space-y-12 h-full flex flex-col justify-center">
                            <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-white transition-colors border-l-8 border-white pl-8">{faq.question}</h3>
                            <p className="text-zinc-400 font-bold text-lg md:text-xl leading-relaxed group-hover:text-zinc-200 transition-colors uppercase tracking-tight">{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
