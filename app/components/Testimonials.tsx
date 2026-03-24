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
        <section className="py-40 overflow-hidden bg-black/50 backdrop-blur-xl border-t border-b border-zinc-800 relative z-20">
            <div className="text-center mb-24">
                <h2 className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tightest">THE VOICES</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-10" />
                <p className="max-w-xl mx-auto text-zinc-400 text-xl font-bold uppercase tracking-widest">Join thousands of high-performers.</p>
            </div>
            <div className="relative flex overflow-x-hidden">
                <div className="animate-marquee whitespace-nowrap flex gap-0 py-10">
                    {testimonials.concat(testimonials).map((t, i) => (
                        <div key={i} className="inline-block w-[450px] p-16 bg-zinc-950 border border-zinc-900 shadow-2xl transition-all hover:bg-zinc-900 group relative">
                            <div className="absolute top-0 right-0 p-4 text-zinc-800 font-black text-4xl group-hover:text-blue-500/20 transition-colors select-none">“</div>
                            <div className="mb-10 text-left">
                                <div className="font-black text-white text-3xl mb-2 tracking-tighter uppercase">{t.name}</div>
                                <div className="text-xs text-blue-500 uppercase tracking-widest font-black flex items-center gap-2">
                                    <div className="w-4 h-[2px] bg-blue-500" /> {t.role}
                                </div>
                            </div>
                            <p className="text-zinc-300 italic text-xl leading-relaxed font-medium whitespace-normal text-left">&quot;{t.text}&quot;</p>
                            <div className="mt-12 h-1 w-full bg-zinc-800 opacity-20" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
