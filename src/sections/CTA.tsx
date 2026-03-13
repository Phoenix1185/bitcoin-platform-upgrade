import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-crypto-dark overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-crypto-yellow/10 rounded-full blur-[120px]" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(240, 185, 11, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div 
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-crypto-yellow/10 border border-crypto-yellow/30 mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Sparkles className="w-4 h-4 text-crypto-yellow" />
          <span className="text-sm text-crypto-yellow font-medium">
            Start Your Journey Today
          </span>
        </div>

        {/* Headline */}
        <h2 
          className={`text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Ready to Start Your{' '}
          <span className="text-gradient">Crypto Journey?</span>
        </h2>

        {/* Subheadline */}
        <p 
          className={`text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Join thousands of successful investors today. Your financial freedom 
          is just one click away. Start earning daily returns now.
        </p>

        {/* CTA Buttons */}
        <div 
          className={`flex flex-wrap justify-center gap-4 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light font-semibold px-10 py-7 text-lg group animate-pulse-glow"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/investment-plans')}
            className="border-crypto-border text-white hover:bg-crypto-card hover:border-crypto-yellow/50 px-10 py-7 text-lg"
          >
            View Plans
          </Button>
        </div>

        {/* Trust indicators */}
        <div 
          className={`flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-crypto-border/50 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm">Instant Setup</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm">No Hidden Fees</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm">24/7 Support</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm">Secure Platform</span>
          </div>
        </div>
      </div>
    </section>
  );
}
