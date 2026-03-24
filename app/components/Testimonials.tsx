import ShineBorder from "./ShineBorder";

const testimonials = [
    { name: "Alice M.", role: "Lead Architect", text: "FocusFlow completely changed how our team collaborates. We've tripled our output and found a sense of calm we didn't think was possible in our industry." },
    { name: "Julian R.", role: "Indie Creator", text: "Finally, a productivity tool that feels human. It's like a peaceful assistant that understands exactly where I need to go and keeps me on track." },
    { name: "Sarah K.", role: "Product Manager", text: "The interface is simply gorgeous. It's a joy to use every single day, and the AI summaries are incredibly accurate." },
    { name: "David T.", role: "CTO", text: "Security meets speed. The neural search is a game changer for our documentation, and the encryption standards are solid." },
    { name: "Elena Q.", role: "Freelance Designer", text: "Best workflow tool I've used in a decade. No competition. The minimalist approach actually helps me focus more on my designs." },
    { name: "Mark S.", role: "Senior Developer", text: "Clean, fast, and does what it says. 10/10 for reliability and performance. The visual flow feature is pure magic." }
];

export default function Testimonials() {
    return (
        <section className="py-40 overflow-hidden bg-transparent relative z-20">
            <div className="text-center mb-24">
                <h2 className="text-2xl md:text-3xl font-black text-white mb-6">The Voices</h2>
                <div className="w-24 h-1 bg-white mx-auto mb-10 shadow-2xl shadow-blue-500/50" />
                <p className="max-w-xl mx-auto text-zinc-400 text-sm font-bold">Join thousands of high-performers.</p>
            </div>
            <div className="relative flex overflow-x-hidden">
                <div className="animate-marquee whitespace-nowrap flex gap-12 py-10 px-6">
                    {testimonials.concat(testimonials).map((t, i) => (
                        <ShineBorder key={i} borderRadius={0} borderWidth={1} color={["#A07CFE", "#FE8FB5", "#FFBE7B"]} duration={10} className="inline-block w-[450px] !p-0 !bg-zinc-950/40 !backdrop-blur-3xl !border-zinc-900 shadow-2xl transition-all hover:bg-zinc-900 group relative">
                            <div className="p-16 h-full flex flex-col justify-between">
                                <div className="absolute top-0 right-0 p-4 text-zinc-800 font-black text-3xl group-hover:text-blue-500/20 transition-colors select-none opacity-20 whitespace-normal">“</div>
                                <div className="mb-10 text-left">
                                    <div className="font-black text-white text-lg mb-2 whitespace-normal">{t.name}</div>
                                    <div className="text-xs text-blue-500 font-black flex items-center gap-2">
                                        <div className="w-4 h-[2px] bg-blue-500" /> {t.role}
                                    </div>
                                </div>
                                <p className="text-zinc-300 italic text-sm leading-relaxed font-medium whitespace-normal text-left">&quot;{t.text}&quot;</p>
                                <div className="mt-12 h-1 w-full bg-zinc-800 opacity-20" />
                            </div>
                        </ShineBorder>
                    ))}
                </div>
            </div>
        </section>
    );
}
