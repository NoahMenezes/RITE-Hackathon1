export default function FAQ() {
    const faqs = [
        {
            q: "Is FocusFlow free?",
            a: "Yes, we offer a generous free tier for individuals. Premium features are available through a subscription."
        },
        {
            q: "Does it sync with my existing tools?",
            a: "Absolutely! We support integrations with Notion, Slack, Jira, and many more out of the box."
        },
        {
            q: "Is my data secure?",
            a: "Security is our top priority. We use end-to-end encryption to ensure your thoughts and tasks remain yours alone."
        },
        {
            q: "How does the AI work?",
            a: "Our AI uses advanced semantic models to understand the context of your work, helping you find anything in milliseconds."
        }
    ];

    return (
        <section id="faq" className="py-24 px-8 max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-2">Common Inquiries</h2>
                <p className="text-zinc-500">Everything you need to know about starting your flow.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {faqs.map((f, i) => (
                    <div key={i} className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 transition-all hover:bg-zinc-800 self-start">
                        <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                            {f.q}
                        </h3>
                        <p className="text-zinc-400 font-light leading-relaxed">{f.a}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
