export default function Hero() {
    return (
        <section className="relative w-full h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-transparent">
            {/* Local video removed; handled by RootLayout */}
            <div className="relative z-10 text-center max-w-5xl px-6 flex flex-col items-center animate-fade-in-up">
                <h1 className="text-7xl md:text-9xl font-black tracking-tightest leading-[1.1] mb-8 drop-shadow-[0_20px_50px_rgba(0,0,0,1)] text-white">
                    FLOW THROUGH THE <span className="uppercase text-white">CHAOS.</span>
                </h1>
                <p className="text-2xl md:text-3xl text-zinc-100 max-w-3xl mx-auto leading-relaxed font-black mb-12 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] uppercase tracking-tighter transition-all hover:text-blue-500 duration-1000">
                    Experience the ultimate productivity suite that adapts to your mental frequency. Minimalist, powerful, and built for builders who demand perfection.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                    <button className="px-16 py-8 bg-blue-600 text-white text-2xl font-black hover:bg-indigo-700 transition-all shadow-[0_20px_50px_-15px_rgba(37,99,235,0.5)] active:translate-y-1 rounded-none uppercase tracking-widest">GET STARTED NOW</button>
                    <button className="px-16 py-8 bg-white/5 backdrop-blur-3xl border border-white/20 text-white text-2xl font-black hover:bg-white/15 transition-all outline-none rounded-none uppercase tracking-widest">READ MANIFESTO</button>
                </div>
            </div>
        </section>
    );
}
