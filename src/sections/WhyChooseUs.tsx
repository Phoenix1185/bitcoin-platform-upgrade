import { useEffect, useRef, useState } from 'react';
import { Shield, Zap, Clock, Eye, TrendingUp, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'High Security',
    description: 'Military-grade encryption and multi-factor authentication protect your assets.',
  },
  {
    icon: Zap,
    title: 'Instant Withdrawals',
    description: 'Get your funds in minutes, not days. Fast and reliable processing.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Our dedicated team is always here to help you with any questions.',
  },
  {
    icon: Eye,
    title: 'Transparent Fees',
    description: 'No hidden charges. What you see is what you get.',
  },
  {
    icon: TrendingUp,
    title: 'Proven Track Record',
    description: 'Consistent returns backed by years of successful trading.',
  },
  {
    icon: Smartphone,
    title: 'Easy to Use',
    description: 'Intuitive platform designed for both beginners and experts.',
  },
];

export default function WhyChooseUs() {
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
      className="relative py-24 bg-crypto-dark overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-crypto-yellow/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <span 
                className={`inline-block text-crypto-yellow text-sm font-semibold tracking-wider uppercase mb-4 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Why Choose Us
              </span>
              <h2 
                className={`text-4xl sm:text-5xl font-display font-bold text-white leading-tight transition-all duration-700 delay-100 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                The Smart Choice for{' '}
                <span className="text-gradient">Crypto Investment</span>
              </h2>
            </div>

            <p 
              className={`text-lg text-gray-400 leading-relaxed transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              We combine cutting-edge technology with industry expertise to provide 
              you with the best cryptocurrency investment experience. Our platform 
              is designed to maximize your returns while minimizing risks.
            </p>

            {/* Features grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`group p-4 rounded-xl bg-crypto-card/50 border border-crypto-border hover:border-crypto-yellow/50 transition-all duration-500 hover:-translate-y-1 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${300 + index * 80}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-crypto-yellow/10 flex items-center justify-center mb-3 group-hover:bg-crypto-yellow/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-crypto-yellow" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div 
            className={`relative transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-8 bg-crypto-yellow/10 rounded-full blur-[100px]" />
              
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden border border-crypto-border animate-float">
                <img
                  src="/why-choose-us.jpg"
                  alt="Why Choose BitWealth"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-bl from-crypto-dark/30 to-transparent" />
              </div>

              {/* Floating cards */}
              <div 
                className="absolute -left-6 top-1/3 glass-card rounded-xl p-4 animate-float"
                style={{ animationDelay: '0.3s' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">SSL Secured</p>
                    <p className="text-xs text-gray-400">256-bit encryption</p>
                  </div>
                </div>
              </div>

              <div 
                className="absolute -right-4 bottom-1/3 glass-card rounded-xl p-4 animate-float"
                style={{ animationDelay: '0.7s' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-crypto-yellow/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-crypto-yellow" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">+450%</p>
                    <p className="text-xs text-gray-400">Avg. annual return</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
