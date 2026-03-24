import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl flex items-center justify-between px-16 py-8 backdrop-blur-3xl bg-black/60 border border-zinc-800/80 shadow-2xl transition-all hover:bg-black/90 group">
            <div className="text-3xl font-black tracking-tightest text-white uppercase flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-600 group-hover:bg-purple-600 transition-all duration-700" />
                FocusFlow
            </div>
            <div className="flex items-center gap-12 text-sm font-black uppercase tracking-widest">
                <Link href="/" className="text-zinc-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-600 pb-2">Home</Link>
                <Link href="/team" className="text-zinc-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-600 pb-2">Team</Link>
                <Link href="/login" className="text-zinc-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-600 pb-2 font-black">Login</Link>
                <Link href="/signup" className="px-10 py-4 rounded-none bg-blue-600 text-white font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-2xl shadow-blue-500/20">Sign Up</Link>
            </div>
        </nav>
    );
}
