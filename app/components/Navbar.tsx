import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-black/30 border-b border-zinc-800/50 transition-all hover:bg-black/50">
            <div className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                FocusFlow
            </div>
            <div className="flex items-center gap-8 text-sm font-medium">
                <Link href="/" className="text-zinc-300 hover:text-white transition-colors">Home</Link>
                <Link href="#" className="text-zinc-300 hover:text-white transition-colors">Login</Link>
                <Link href="#" className="px-5 py-2 rounded-full bg-white text-black font-semibold hover:bg-purple-100 transition-all active:scale-95 shadow-lg shadow-purple-500/20">Sign Up</Link>
            </div>
        </nav>
    );
}
