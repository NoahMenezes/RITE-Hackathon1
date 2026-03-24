const testimonials = [
    { name: "Alice M.", role: "Lead Architect", text: "FocusFlow completely changed how our team collaborates. We've tripled our output." },
    { name: "Julian R.", role: "Indie Creator", text: "Finally, a productivity tool that feels human. It's like a peaceful assistant." },
    { name: "Sarah K.", role: "Product Manager", text: "The interface is simply gorgeous. It's a joy to use every single day." },
    { name: "David T.", role: "CTO", text: "Security meets speed. The neural search is a game changer for our documentation." },
    { name: "Elena Q.", role: "Freelance Designer", text: "Best workflow tool I've used in a decade. No competition." },
    { name: "Mark S.", role: "Senior Developer", text: "Clean, fast, and does what it says. 10/10." }
];

export default function Testimonials() {
    return (
        <section className="py-32 overflow-hidden bg-zinc-950/50">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-2">Loved by Builders</h2>
                <p className="text-zinc-500">Join thousands of high-performers who trust us.</p>
            </div>
            <div className="relative flex overflow-x-hidden">
                <div className="animate-marquee whitespace-nowrap flex gap-12 py-10">
                    {testimonials.concat(testimonials).map((t, i) => (
                        <div key={i} className="inline-block w-[350px] p-8 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-xl shadow-black/40">
                            <div className="mb-6">
                                <div className="font-bold text-white text-lg">{t.name}</div>
                                <div className="text-sm text-zinc-500 uppercase tracking-widest">{t.role}</div>
                            </div>
                            <p className="text-zinc-300 italic leading-relaxed font-light whitespace-normal">"{t.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
