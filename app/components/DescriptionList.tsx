export default function DescriptionList() {
    const specs = [
        { label: "Core Architecture", value: "Distributed Neural Orchestration" },
        { label: "Data Consistency", value: "ACID Compliant Synchronic" },
        { label: "Latency Factor", value: "< 14ms Global Mesh" },
        { label: "Encryption Grade", value: "AES-256 Quantum Resistant" },
        { label: "API Integration", value: "Full GraphQL Surface" },
        { label: "Identity Protocol", value: "Self-Sovereign Auth Control" }
    ];

    return (
        <section className="py-32 px-12 max-w-5xl mx-auto bg-zinc-950/40 backdrop-blur-md border border-zinc-900 shadow-2xl relative z-20 my-40">
            <h2 className="text-4xl font-black text-white mb-16 uppercase tracking-widest border-l-8 border-blue-600 pl-10">Technical Specifications</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
                {specs.map((spec, i) => (
                    <div key={i} className="flex flex-col border-b border-zinc-900 pb-8 hover:border-blue-500/50 transition-all group">
                        <dt className="text-xs text-zinc-600 font-black uppercase tracking-widest group-hover:text-blue-500 transition-colors mb-4">{spec.label}</dt>
                        <dd className="text-2xl font-black text-zinc-300 group-hover:text-white transition-colors uppercase tracking-tightest">{spec.value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
