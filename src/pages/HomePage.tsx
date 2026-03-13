import Header from '@/sections/Header';
import Hero from '@/sections/Hero';
import About from '@/sections/About';
import InvestmentPlansSection from '@/sections/InvestmentPlans';
import Statistics from '@/sections/Statistics';
import WhyChooseUs from '@/sections/WhyChooseUs';
import HowItWorks from '@/sections/HowItWorks';
import Testimonials from '@/sections/Testimonials';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import LivePrices from '@/components/LivePrices';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-crypto-dark">
      <Header />
      <main>
        <Hero />
        <LivePrices />
        <About />
        <InvestmentPlansSection />
        <Statistics />
        <WhyChooseUs />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
