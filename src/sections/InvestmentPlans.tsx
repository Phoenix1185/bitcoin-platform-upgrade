import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Check, Star, TrendingUp, Clock, DollarSign } from 'lucide-react';

export default function InvestmentPlansSection() {
  const navigate = useNavigate();
  const { state } = useStore();
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

  const plans = state.investmentPlans;

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-crypto-dark overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] lg:w-[800px] h-[400px] md:h-[600px] lg:h-[800px] bg-crypto-yellow/5 rounded-full blur-[100px] md:blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <span 
            className={`inline-block text-crypto-yellow text-xs md:text-sm font-semibold tracking-wider uppercase mb-3 md:mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Investment Plans
          </span>
          <h2 
            className={`text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 md:mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Choose Your <span className="text-gradient">Investment Strategy</span>
          </h2>
          <p 
            className={`text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Select from our carefully designed plans tailored to match your financial 
            goals and risk appetite.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative group transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              {/* Featured badge */}
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 bg-crypto-yellow text-crypto-dark text-[10px] md:text-xs font-bold rounded-full">
                    <Star className="w-2 h-2 md:w-3 md:h-3 fill-current" />
                    BEST VALUE
                  </div>
                </div>
              )}

              <div 
                className={`relative h-full p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all duration-500 ${
                  plan.featured
                    ? 'bg-crypto-card border-crypto-yellow/50 shadow-glow-lg lg:scale-105'
                    : 'bg-crypto-card/50 border-crypto-border hover:border-crypto-yellow/30'
                } hover:-translate-y-1 md:hover:-translate-y-2`}
              >
                {/* Plan header */}
                <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl md:text-4xl font-bold text-crypto-yellow">
                      {plan.dailyReturn}%
                    </span>
                    <span className="text-xs md:text-sm text-gray-400">/day</span>
                  </div>
                </div>

                {/* Plan details */}
                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-crypto-yellow/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-crypto-yellow" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-400 text-[10px] md:text-xs">Investment</p>
                      <p className="text-white font-medium truncate">
                        ${plan.minAmount.toLocaleString()} - ${plan.maxAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-crypto-yellow/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-3 h-3 md:w-4 md:h-4 text-crypto-yellow" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] md:text-xs">Duration</p>
                      <p className="text-white font-medium">{plan.duration} Days</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-crypto-yellow/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-crypto-yellow" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] md:text-xs">Total Return</p>
                      <p className="text-white font-medium">
                        {plan.dailyReturn * plan.duration}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-1.5 md:space-y-2 mb-4 md:mb-6">
                  {['Daily payouts', 'Principal return', 'Instant withdrawal', '24/7 support'].map((feature) => (
                    <li key={feature} className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-400">
                      <Check className="w-3 h-3 md:w-4 md:h-4 text-crypto-yellow flex-shrink-0" />
                      <span className="truncate">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  onClick={() => navigate(state.isAuthenticated ? '/investment-plans' : '/register')}
                  className={`w-full text-xs md:text-sm py-2 md:py-3 h-auto ${
                    plan.featured
                      ? 'bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light'
                      : 'bg-crypto-border text-white hover:bg-crypto-yellow hover:text-crypto-dark'
                  } font-semibold transition-all duration-300`}
                >
                  {state.isAuthenticated ? 'Invest Now' : 'Get Started'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
