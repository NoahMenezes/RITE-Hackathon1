"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "../../lib/supabase/client"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ShineBorder from "../components/ShineBorder"

export default function DashboardPage() {
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
            } else {
                router.push("/login")
            }
            setLoading(false)
        }
        getUser()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/login")
    }

    if (loading) {
        return <div className="min-h-screen bg-transparent text-white flex items-center justify-center font-black uppercase text-2xl tracking-widest">INITIALIZING SECURE PROTOCOL...</div>
    }

    return (
        <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/40">
            <Navbar />

            <main className="flex flex-col items-center justify-center pt-56 pb-40 px-12 relative z-10 w-full min-h-screen">
                <div className="text-center mb-24 max-w-4xl w-full">
                    <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tightest leading-[1.1]">MAIN <br /><span className="text-blue-600">DASHBOARD.</span></h1>
                    <div className="w-64 h-2 bg-white mx-auto my-12 shadow-2xl shadow-blue-500/50" />
                    <p className="text-xl text-zinc-400 font-bold uppercase tracking-widest">ACCESS GRANTED. IDENTITY: {user?.user_metadata?.full_name || user?.email}</p>
                </div>

                <ShineBorder borderRadius={0} borderWidth={2} color={["#10b981", "#3b82f6", "#10b981"]} duration={10} className="w-full max-w-4xl !bg-zinc-950/80 !backdrop-blur-3xl !border-zinc-900 shadow-2xl p-0">
                    <div className="p-24 space-y-12">
                        <h2 className="text-3xl font-black text-white uppercase tracking-widest border-l-8 border-blue-600 pl-8">ACTIVE MODULES</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-10 border border-zinc-800 bg-zinc-900/50">
                                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-wider">NEURAL LINK</h3>
                                <p className="text-zinc-400 uppercase tracking-tighter text-sm font-bold">STATUS: ONLINE / OPTIMAL</p>
                            </div>
                            <div className="p-10 border border-zinc-800 bg-zinc-900/50">
                                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-wider">DATA VAULT</h3>
                                <p className="text-zinc-400 uppercase tracking-tighter text-sm font-bold">STATUS: ENCRYPTED / SECURE</p>
                            </div>
                        </div>

                        <div className="pt-16 flex justify-center">
                            <button onClick={handleSignOut} className="px-16 py-8 bg-red-600/10 border border-red-600/50 text-red-500 font-black text-xl hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-2xl uppercase tracking-widest rounded-none">TERMINATE SESSION</button>
                        </div>
                    </div>
                </ShineBorder>
            </main>

            <Footer />
        </div>
    )
}
