import { useEffect, useRef, useState } from 'react';
import { Shield, Users, Zap, Clock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Bank-level encryption and security protocols protect your investments 24/7.',
  },
  {
    icon: Users,
    title: 'Expert Guidance',
    description: 'Professional support every step of the way from our experienced team.',
  },
  {
    icon: Zap,
    title: 'Instant Transactions',
    description: 'Fast deposits and withdrawals with multiple payment options.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock customer service to assist you anytime.',
  },
];

export default function About() {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 bg-crypto-dark overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-crypto-yellow/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div 
            className={`relative transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-8 bg-crypto-yellow/10 rounded-full blur-[100px]" />
              
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden border border-crypto-border">
                <img
                  src="/about-crypto.jpg"
                  alt="Cryptocurrency Investment"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-crypto-dark/30 to-transparent" />
              </div>

              {/* Floating stat card */}
              <div 
                className="absolute -bottom-6 -right-6 glass-card rounded-xl p-6 animate-float"
                style={{ animationDelay: '0.5s' }}
              >
                <p className="text-4xl font-bold text-crypto-yellow">5+</p>
                <p className="text-sm text-gray-400">Years Experience</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Section label */}
            <div 
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="text-crypto-yellow text-sm font-semibold tracking-wider uppercase">
                About Us
              </span>
            </div>

            {/* Headline */}
            <h2 
              className={`text-4xl sm:text-5xl font-display font-bold text-white leading-tight transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Your Trusted Partner in{' '}
              <span className="text-gradient">Cryptocurrency Investment</span>
            </h2>

            {/* Description */}
            <p 
              className={`text-lg text-gray-400 leading-relaxed transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              We provide a secure, transparent, and user-friendly platform for investing 
              in digital assets. Our expert team combines cutting-edge technology with 
              years of financial experience to deliver exceptional results for our investors.
            </p>

            {/* Features grid */}
            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`group p-4 rounded-xl bg-crypto-card/50 border border-crypto-border hover:border-crypto-yellow/50 transition-all duration-500 hover:-translate-y-1 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-crypto-yellow/10 flex items-center justify-center mb-4 group-hover:bg-crypto-yellow/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-crypto-yellow" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
