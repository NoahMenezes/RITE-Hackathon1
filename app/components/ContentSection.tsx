export default function ContentSection() {
    return (
        <section className="py-40 px-16 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-24 lg:gap-40 bg-black/40 backdrop-blur-3xl border-l border-r border-zinc-900 relative z-30 overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[200px] pointer-events-none" />
            <div className="flex-1 space-y-12 animate-fade-in text-left">
                <h2 className="text-6xl md:text-8xl font-black text-white leading-[1.05] uppercase tracking-tightest">BEYOND <br /><span className="text-blue-600">STATIC.</span></h2>
                <div className="w-48 h-1 bg-white" />
                <p className="text-2xl text-zinc-400 font-bold leading-relaxed max-w-xl uppercase tracking-tighter">
                    The issue with legacy productivity tools is that they add to the noise. FocusFlow is built on the philosophy of "Deep Work" by Cal Newport, prioritizing silence over signals.
                </p>
                <p className="text-2xl text-zinc-400 font-bold leading-relaxed max-w-xl uppercase tracking-tighter shadow-2xl shadow-blue-500/10 p-8 border-l-4 border-blue-600 bg-zinc-950/50">
                    Our platform is an adaptive extension of your cognitive processes. We eliminate friction so you can focus on what actually matters—creating value and building the future.
                </p>
                <div className="flex items-center gap-10 text-white font-black text-2xl hover:translate-x-4 transition-transform cursor-pointer uppercase tracking-widest border-b-2 border-white pb-4 w-fit group">
                    EXPLORE PHILOSOPHY <span className="text-blue-500 group-hover:translate-x-4 transition-transform text-4xl leading-none">&gt;&gt;&gt;</span>
                </div>
            </div>
            <div className="flex-1 w-full max-w-2xl bg-zinc-950 border border-zinc-900 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] relative">
                <div className="w-full h-[600px] bg-black p-16 flex flex-col justify-between overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none group-hover:opacity-40 transition-opacity" />
                    <div className="p-12 border border-zinc-800 bg-zinc-950 shadow-2xl max-w-sm w-full text-left transition-transform duration-1000 group-hover:scale-105 border-l-4 border-l-blue-600">
                        <div className="w-32 h-2 bg-blue-600 mb-8" />
                        <div className="w-full h-2 bg-zinc-800 mb-2" />
                        <div className="w-4/5 h-2 bg-zinc-800 mb-10" />
                        <div className="space-y-6">
                            <div className="h-16 bg-zinc-900 border border-zinc-800 hover:border-blue-500 transition-all flex items-center px-6 text-xs text-zinc-500 font-black uppercase tracking-widest">Inference Protocol Active</div>
                            <div className="h-16 bg-zinc-900 border border-zinc-800 hover:border-blue-500 transition-all flex items-center px-6 text-xs text-zinc-500 font-black uppercase tracking-widest">Orchestration Synchronized</div>
                            <div className="h-16 bg-blue-600 text-white flex items-center px-6 font-black text-xs tracking-widest uppercase shadow-2xl shadow-blue-600/30">EXECUTING FLOW_012</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
