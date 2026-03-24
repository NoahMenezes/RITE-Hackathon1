import Navbar from "../components/Navbar";

const team = [
    { name: "Elias Vance", role: "Founding Engineer", bio: "Former Principal Architect at Google and OpenAI, Elias handles the core neural logic architecture." },
    { name: "Julian Thorne", role: "Experience Lead", bio: "Specializes in cognitive-first interfaces and minimalist visual design for maximum focus." },
    { name: "Sarah Quin", role: "Infrastructural Architect", bio: "Manages the global distributed mesh networks that power FocusFlow's zero-latency sync." },
    { name: "Mark Russo", role: "Security Protocol Lead", bio: "Expert in end-to-end homomorphic encryption and privacy-preserving data management." }
];

export default function TeamPage() {
    return (
        <div className="relative min-h-screen bg-black text-white selection:bg-blue-500/40">
            <Navbar />

            <main className="pt-56 pb-40 px-12 max-w-7xl mx-auto space-y-40">
                <section className="space-y-12">
                    <h1 className="text-7xl md:text-9xl font-black text-white leading-[1.1] uppercase tracking-tightest mb-10">THE <span className="text-blue-600">ORCHESTRA.</span></h1>
                    <div className="w-60 h-2 bg-white mb-20 shadow-2xl shadow-blue-500/50 animate-pulse" />
                    <p className="text-3xl text-zinc-400 font-bold leading-relaxed max-w-4xl tracking-tight uppercase border-l-8 border-zinc-800 pl-12">
                        A collective of engineers, designers, and cognitive scientists dedicated to solving the problem of modern distraction. We build tools that help you focus.
                    </p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-zinc-800">
                    {team.map((member, i) => (
                        <div key={i} className="p-16 bg-zinc-950 border border-zinc-900 group transition-all hover:bg-zinc-900 flex flex-col justify-between aspect-square relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 text-zinc-800 font-black text-4xl group-hover:text-blue-500/20 transition-colors uppercase tracking-widest pointer-events-none">TM0{i + 1}</div>
                            <div>
                                <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter group-hover:text-blue-500 transition-colors">{member.name}</h2>
                                <div className="text-sm text-zinc-500 uppercase tracking-widest font-black mb-8 italic">{member.role}</div>
                                <p className="text-zinc-400 font-medium text-lg leading-relaxed group-hover:text-zinc-200 transition-colors">{member.bio}</p>
                            </div>
                            <div className="mt-12 h-1 w-20 bg-blue-600 opacity-20 group-hover:w-full group-hover:opacity-100 transition-all duration-700" />
                        </div>
                    ))}
                </section>

                <section id="contact" className="grid lg:grid-cols-2 bg-zinc-950 border border-zinc-800 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none" />
                    <div className="p-24 space-y-10 border-b lg:border-b-0 lg:border-r border-zinc-800">
                        <h2 className="text-6xl font-black text-white uppercase tracking-tightest">DIRECT <br /><span className="text-blue-600">INPUT.</span></h2>
                        <p className="text-xl text-zinc-400 font-bold leading-relaxed uppercase tracking-tight max-w-md">Reach out to the team for partnership, support, or inquiries regarding our protocol.</p>
                        <div className="space-y-6 pt-10">
                            <div className="text-3xl font-black text-white flex items-center gap-6 group-hover:text-blue-500 transition-colors"><div className="w-4 h-4 bg-blue-600" /> +1 (800) FLOW-GEN</div>
                            <div className="text-3xl font-black text-white flex items-center gap-6 group-hover:text-blue-500 transition-colors"><div className="w-4 h-4 bg-blue-600" /> OPS@FLOW.PROTOCOL</div>
                        </div>
                    </div>
                    <div className="p-24 bg-black">
                        <form className="space-y-12">
                            <div className="space-y-6">
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-1">Full Identity Name</label>
                                <input type="text" placeholder="ENTER NAME" className="w-full bg-zinc-950 border-r-0 border-l-0 border-t-0 border-b border-zinc-900 p-6 text-2xl font-black text-white focus:border-blue-500 focus:bg-zinc-900 transition-all outline-none rounded-none placeholder:text-zinc-800" />
                            </div>
                            <div className="space-y-6">
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-1">Communication Channel (Email)</label>
                                <input type="email" placeholder="ACCESS@PROTO.NET" className="w-full bg-zinc-950 border-r-0 border-l-0 border-t-0 border-b border-zinc-900 p-6 text-2xl font-black text-white focus:border-blue-500 focus:bg-zinc-900 transition-all outline-none rounded-none placeholder:text-zinc-800" />
                            </div>
                            <div className="space-y-6">
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-1">Transmission Message</label>
                                <textarea placeholder="BEGIN TRANSMISSION..." rows={4} className="w-full bg-zinc-950 border-r-0 border-l-0 border-t-0 border-b border-zinc-900 p-6 text-2xl font-black text-white focus:border-blue-500 focus:bg-zinc-900 transition-all outline-none rounded-none placeholder:text-zinc-800 resize-none"></textarea>
                            </div>
                            <button type="button" className="w-full py-10 bg-blue-600 text-white font-black text-3xl hover:bg-indigo-700 transition-all active:scale-95 shadow-2xl shadow-blue-500/20 uppercase tracking-widest rounded-none">SEND MESSAGE TRANSMISSION</button>
                        </form>
                    </div>
                </section>
            </main>

            <footer className="py-24 px-12 bg-black border-t border-zinc-900 text-center relative z-10">
                <div className="text-4xl font-black text-zinc-800 uppercase tracking-tightest mb-4 hover:text-blue-500 transition-colors">FOCUS FLOW PROTOCOL</div>
                <p className="text-zinc-600 text-sm font-black uppercase tracking-widest">&copy; 2026 FocusFlow Protocol. All rights reserved. Self-hosting encouraged.</p>
            </footer>
        </div>
    );
}
