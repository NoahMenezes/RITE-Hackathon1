import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import ContentSection from "./components/ContentSection";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Navbar />
      <Hero />
      <div className="relative z-10 bg-black/80 backdrop-blur-sm">
        <Features />
        <Testimonials />
        <ContentSection />
        <FAQ />
      </div>
      <footer className="py-10 text-center text-zinc-500 border-t border-zinc-800">
        <p>&copy; 2026 FocusFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
