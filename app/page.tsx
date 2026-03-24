import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import Features from "@/app/components/Features";
import Testimonials from "@/app/components/Testimonials";
import FAQ from "@/app/components/FAQ";
import HowItWorks from "@/app/components/HowItWorks";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/30">
      <Navbar />
      <Hero />
      <div className="relative z-10 space-y-0">
        <HowItWorks />
        <Features />
        <Testimonials />
        <FAQ />
      </div>
      <Footer />
    </div>
  );
}
