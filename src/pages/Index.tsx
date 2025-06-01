
import { Hero } from "@/components/Hero";
import { Header } from "@/components/Header";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { AuthBanner } from "@/components/home/AuthBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AuthBanner />
      <Hero />
      <Features />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
