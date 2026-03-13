import { useEffect, useRef, useState } from 'react';
import { UserPlus, CheckCircle, Wallet, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Create Account',
    description: 'Sign up in less than 2 minutes. Just enter your email and create a secure password.',
  },
  {
    icon: CheckCircle,
    number: '02',
    title: 'Verify Identity',
    description: 'Quick and secure KYC process to ensure platform safety for all users.',
  },
  {
    icon: Wallet,
    number: '03',
    title: 'Deposit Funds',
    description: 'Add money via multiple methods including crypto, bank transfer, or card.',
  },
  {
    icon: TrendingUp,
    number: '04',
    title: 'Start Earning',
    description: 'Choose your investment plan and watch your portfolio grow daily.',
  },
];

export default function HowItWorks() {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-24 bg-crypto-dark overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-crypto-yellow/5 rounded-full blur-[120px] -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span 
            className={`inline-block text-crypto-yellow text-sm font-semibold tracking-wider uppercase mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            How It Works
          </span>
          <h2 
            className={`text-4xl sm:text-5xl font-display font-bold text-white mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Start Investing in{' '}
            <span className="text-gradient">4 Simple Steps</span>
          </h2>
          <p 
            className={`text-lg text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Getting started with BitWealth is quick and easy. Follow these simple 
            steps to begin your cryptocurrency investment journey.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - desktop only */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-crypto-border">
            <div 
              className={`h-full bg-gradient-to-r from-crypto-yellow via-crypto-yellow to-transparent transition-all duration-2000 ${
                isVisible ? 'w-full' : 'w-0'
              }`}
              style={{ transitionDelay: '500ms' }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${300 + index * 200}ms` }}
              >
                {/* Step card */}
                <div className="relative group">
                  {/* Number badge */}
                  <div className="relative z-10 w-12 h-12 rounded-xl bg-crypto-card border border-crypto-border flex items-center justify-center mb-6 group-hover:border-crypto-yellow/50 group-hover:bg-crypto-yellow/10 transition-all duration-300">
                    <span className="text-lg font-bold text-crypto-yellow">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-crypto-yellow/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-crypto-yellow/20 transition-all duration-300">
                    <step.icon className="w-8 h-8 text-crypto-yellow" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
