import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import ContentSection from "./components/ContentSection";
import HowItWorks from "./components/HowItWorks";
import DescriptionList from "./components/DescriptionList";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Navbar />
      <Hero />
      <div className="relative z-10 space-y-0">
        <HowItWorks />
        <Features />
        <ContentSection />
        <DescriptionList />
        <Testimonials />
        <FAQ />
      </div>
      <footer className="py-24 px-12 bg-black border-t border-zinc-900 text-center relative z-10">
        <div className="text-4xl font-black text-zinc-800 uppercase tracking-tightest mb-4 hover:text-blue-500 transition-colors">FOCUS FLOW PROTOCOL</div>
        <p className="text-zinc-600 text-sm font-black uppercase tracking-widest">&copy; 2026 FocusFlow Protocol. All rights reserved. Self-hosting encouraged.</p>
      </footer>
    </div>
  );
}
