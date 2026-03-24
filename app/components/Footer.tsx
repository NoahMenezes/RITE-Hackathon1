import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-40 px-12 bg-zinc-950/80 backdrop-blur-3xl border-t border-zinc-900 relative z-40 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-24">
                <div className="space-y-10 max-w-sm">
                    <div className="text-4xl font-black text-white uppercase tracking-tightest mb-4 hover:text-blue-500 transition-colors">FOCUS FLOW PROTOCOL</div>
                    <p className="text-zinc-600 text-lg font-black uppercase tracking-widest leading-relaxed">
                        The ultimate productivity suite for modern creators and builders who demand perfection. Self-hosting and privacy-preserving by default.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-24 text-xs font-black uppercase tracking-widest text-zinc-500">
                    <div className="space-y-6">
                        <h4 className="text-white">Platform</h4>
                        <nav className="flex flex-col gap-4">
                            <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
                            <Link href="/team" className="hover:text-blue-500 transition-colors">The Team</Link>
                            <Link href="/login" className="hover:text-blue-500 transition-colors">Sign In</Link>
                            <Link href="/signup" className="hover:text-blue-500 transition-colors">Join Proto</Link>
                        </nav>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-white">Resources</h4>
                        <nav className="flex flex-col gap-4">
                            <Link href="#" className="hover:text-blue-500 transition-colors">Documentation</Link>
                            <Link href="#" className="hover:text-blue-500 transition-colors">API Keys</Link>
                            <Link href="#" className="hover:text-blue-500 transition-colors">Changelog</Link>
                            <Link href="#" className="hover:text-blue-500 transition-colors">Security Repo</Link>
                        </nav>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-white">Legal Control</h4>
                        <nav className="flex flex-col gap-4">
                            <Link href="#" className="hover:text-blue-500 transition-colors">Privacy Clause</Link>
                            <Link href="#" className="hover:text-blue-500 transition-colors">Terms of Flow</Link>
                            <Link href="#" className="hover:text-blue-500 transition-colors">Cookies</Link>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-40 pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-10 text-xs font-black uppercase tracking-widest text-zinc-700">
                <div>&copy; 2026 FOCUS FLOW PROTOCOL. ALL RIGHTS RESERVED.</div>
                <div className="flex gap-10">
                    <span className="text-blue-600">ENCRYPTED TRANSMISSION ALPHA_012</span>
                    <span>EST. COORDINATES: 37.7749° N, 122.4194° W</span>
                </div>
            </div>
        </footer>
    );
}
