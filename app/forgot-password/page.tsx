import Link from "next/link";
import Navbar from "../components/Navbar";

export default function ForgotPasswordPage() {
    return (
        <div className="relative min-h-screen bg-black text-white selection:bg-blue-500/40">
            <Navbar />

            <main className="flex items-center justify-center pt-56 pb-40 px-12">
                <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-900 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] pointer-events-none" />
                    <div className="p-24 space-y-16">
                        <h1 className="text-6xl font-black text-white uppercase tracking-tightest leading-[1.1]">RECOVER <br /><span className="text-red-600 uppercase">ACCESS.</span></h1>
                        <p className="text-xl text-zinc-400 font-bold uppercase tracking-tight max-w-md">Enter your identity UID, and we will transmit a secure recovery link.</p>

                        <form className="space-y-12">
                            <div className="space-y-6">
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-1">Identity UID (Email)</label>
                                <input type="email" placeholder="ACCESS@PROTO.NET" className="w-full bg-zinc-950 border-r-0 border-l-0 border-t-0 border-b border-zinc-900 p-6 text-2xl font-black text-white focus:border-red-500 focus:bg-zinc-900 transition-all outline-none rounded-none placeholder:text-zinc-800" />
                            </div>

                            <div className="flex flex-col gap-6 pt-10">
                                <button type="button" className="w-full py-10 bg-red-600 text-white font-black text-3xl hover:bg-indigo-700 transition-all active:scale-95 shadow-2xl shadow-red-500/20 uppercase tracking-widest rounded-none">TRANSMIT RECOVERY KEY</button>
                                <div className="flex items-center justify-center text-xs font-black uppercase tracking-widest">
                                    <Link href="/login" className="text-zinc-600 hover:text-white transition-colors">RETURN TO LOGIN ACCESS</Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <footer className="py-24 px-12 bg-black border-t border-zinc-900 text-center relative z-10">
                <div className="text-4xl font-black text-zinc-800 uppercase tracking-tightest mb-4 hover:text-red-500 transition-colors">FOCUS FLOW PROTOCOL</div>
                <p className="text-zinc-600 text-sm font-black uppercase tracking-widest">&copy; 2026 FocusFlow Protocol. All rights reserved. Self-hosting encouraged.</p>
            </footer>
        </div>
    );
}
