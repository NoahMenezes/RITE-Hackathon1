import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import ContentSection from "./components/ContentSection";
import HowItWorks from "./components/HowItWorks";
import DescriptionList from "./components/DescriptionList";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/30">
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
      <Footer />
    </div>
  );
}
