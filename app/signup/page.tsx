import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ShineBorder from "../components/ShineBorder";

export default function SignupPage() {
    return (
        <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/40">
            <Navbar />

            <main className="flex items-center justify-center pt-56 pb-40 px-12 relative z-10">
                <ShineBorder borderRadius={0} borderWidth={2} color={["#ef4444", "#f59e0b", "#ef4444"]} duration={8} className="w-full max-w-2xl !bg-zinc-950/80 !backdrop-blur-3xl !border-zinc-900 shadow-2xl p-0">
                    <div className="p-24 space-y-16">
                        <h1 className="text-6xl font-black text-white uppercase tracking-tightest leading-[1.1]">JOIN THE <br /><span className="text-red-600">PROTOCOL.</span></h1>
                        <p className="text-xl text-zinc-400 font-bold uppercase tracking-tight max-w-sm">Establish your identity within the FocusFlow ecosystem.</p>

                        <form className="space-y-12">
                            <div className="space-y-6">
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-1">Full Legal Alias</label>
                                <input type="text" placeholder="ENTER NAME" className="w-full bg-transparent border-b border-zinc-900 p-6 text-2xl font-black text-white focus:border-red-500 transition-all outline-none rounded-none placeholder:text-zinc-800" />
                            </div>
                            <div className="space-y-6">
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-1">Communication UID</label>
                                <input type="email" placeholder="ACCESS@PROTO.NET" className="w-full bg-transparent border-b border-zinc-900 p-6 text-2xl font-black text-white focus:border-red-500 transition-all outline-none rounded-none placeholder:text-zinc-800" />
                            </div>
                            <div className="space-y-6">
                                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest pl-1">Primary Secret Key</label>
                                <input type="password" placeholder="ENTER KEY" className="w-full bg-transparent border-b border-zinc-900 p-6 text-2xl font-black text-white focus:border-red-500 transition-all outline-none rounded-none placeholder:text-zinc-800" />
                            </div>

                            <div className="flex flex-col gap-6 pt-10">
                                <button type="button" className="w-full py-10 bg-red-600 text-white font-black text-3xl hover:bg-orange-700 transition-all active:scale-95 shadow-2xl shadow-red-500/20 uppercase tracking-widest rounded-none border-none">ESTABLISH IDENTITY</button>
                                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                                    <Link href="/login" className="text-red-600 hover:text-white transition-colors">ALREADY HAVE ACCESS? SIGN IN</Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </ShineBorder>
            </main>

            <Footer />
        </div>
    );
}
