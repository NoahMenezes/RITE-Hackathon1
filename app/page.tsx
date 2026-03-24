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
      <video
        className="fixed top-0 left-0 w-full h-full object-cover -z-50 pointer-events-none brightness-[1.0] contrast-100"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/upscaled-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
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