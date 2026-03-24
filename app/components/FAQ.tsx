import { BorderBeam } from "@/components/ui/border-beam";

import ShineBorder from "./ShineBorder";

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
        <section id="faq" className="py-60 px-12 max-w-7xl mx-auto bg-transparent relative z-20 mb-80 border-l border-r border-zinc-900/10">
            <div className="text-center mb-40">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-10 italic">Inquiry <span className="text-white opacity-40">Hub.</span></h2>
                <div className="w-80 h-2 bg-white mx-auto shadow-2xl" />
                <p className="mt-12 text-zinc-500 font-black text-base">Clarity Through Interrogation.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-24">
                {faqs.map((faq, i) => (
                    <ShineBorder key={i} borderRadius={0} borderWidth={1} color={["#A07CFE", "#FE8FB5", "#FFBE7B"]} duration={12} className="w-full p-0! bg-zinc-950/40! backdrop-blur-3xl! border-zinc-900! group transition-all hover:bg-zinc-900/60! min-h-125">
                        <BorderBeam size={200} duration={12} delay={9} />
                            <div className="p-20 h-full flex flex-col justify-start relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 text-white font-black text-3xl opacity-5 group-hover:opacity-10 transition-opacity select-none whitespace-nowrap">Q0{i + 1}</div>
                            <div className="space-y-12 h-full flex flex-col justify-center">
                                <h3 className="text-lg md:text-xl font-black text-white leading-none group-hover:text-white transition-colors border-l-8 border-white pl-8">{faq.question}</h3>
                                <p className="text-zinc-400 font-bold text-sm md:text-sm leading-relaxed group-hover:text-zinc-200 transition-colors">{faq.answer}</p>
                            </div>
                        </div>
                    </ShineBorder>
                ))}
            </div>
        </section>
    );
}
