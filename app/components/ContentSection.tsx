export default function ContentSection() {
    return (
        <section className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 space-y-8 animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">Beyond Simple Task Management.</h2>
                <p className="text-xl text-zinc-400 font-light leading-relaxed">
                    The problem with existing productivity tools is they add to the noise. At FocusFlow, we believe true efficiency comes from clarity and flow.
                </p>
                <p className="text-xl text-zinc-400 font-light leading-relaxed">
                    Our platform is built around the concept of "Deep Work." We eliminate friction points so you can focus on what actually matters—creating value and building the future.
                </p>
                <div className="flex items-center gap-4 text-purple-400 font-bold hover:translate-x-2 transition-transform cursor-pointer">
                    Read our Manifesto
                </div>
            </div>
            <div className="flex-1 w-full max-w-xl p-2 bg-gradient-to-tr from-purple-500 via-indigo-500 to-blue-500 rounded-[2.5rem] shadow-2xl shadow-purple-500/20">
                <div className="w-full h-[400px] bg-zinc-950 rounded-[2.2rem] flex items-center justify-center p-10 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent pointer-events-none" />
                    <div className="p-8 border border-zinc-800 rounded-3xl bg-zinc-900 shadow-xl max-w-[280px] w-full text-center hover:scale-105 transition-transform duration-500">
                        <div className="w-20 h-2 bg-purple-500/40 rounded-full mx-auto mb-4" />
                        <div className="w-32 h-2 bg-zinc-800 rounded-full mx-auto mb-10" />
                        <div className="space-y-3">
                            <div className="h-10 bg-zinc-800 rounded-xl" />
                            <div className="h-10 bg-zinc-800 rounded-xl" />
                            <div className="h-10 bg-purple-500/20 rounded-xl flex items-center px-4 font-mono text-[10px] text-purple-400 tracking-widest uppercase">Executing Flow...</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
