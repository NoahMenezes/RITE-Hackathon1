export default function Hero() {
    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none brightness-[0.6] sepia-[0.3] contrast-125"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 text-center max-w-4xl px-4 flex flex-col items-center animate-fade-in-up">
                <h1 className="text-6xl md:text-8xl font-black tracking-tightest leading-tight mb-8 drop-shadow-2xl">
                    Supercharge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500">Day.</span>
                </h1>
                <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-light mb-12 drop-shadow-lg">
                    Transform your chaos into a streamlined masterpiece. FocusFlow is the ultimate productivity suite for modern creators and builders who demand excellence.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                    <button className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_-5px_#6366f1]">Start Building Now</button>
                    <button className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-lg font-bold hover:bg-white/20 transition-all">Explore Features</button>
                </div>
            </div>
        </section>
    );
}
